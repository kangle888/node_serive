import SparkMD5 from 'spark-md5';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import uploadFileService from '../service/uploadFile.service.js';
import multiparty from 'multiparty';



// 获取当前模块目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class UploadFileController {
  async uploadFile(ctx, next) {
    
    // 获取传入的base64、文件名称
    let { base64, filename } = ctx.request.body

    // 截取文件base64
    
    const file = decodeURIComponent(base64).replace(/data:image\/\w+;base64,/, "")
    
    const fileBuffer = Buffer.from(file, "base64");

    // 根据文件内容获取hash（SparkMD5）
    const spark = new SparkMD5.ArrayBuffer()
    spark.append(fileBuffer)
    const filehash = spark.end()
    // 获取文件的后缀
    const suffix = filename.slice(filename.lastIndexOf(".")) 
  // 写入的文件路径
  const filePath = join(__dirname, `../public/upload/${filehash}${suffix}`);
  const uploadDir = join(__dirname, '../public/upload');
  // 确保文件夹存在  
  
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 获取文件夹下的文件列表
    const files = fs.readdirSync(uploadDir);
    // 都命中才是同名文件 显示文件已存在 否则 显示上传成功
    const res = await uploadFileService.saveFileInfoToDatabase(filehash, filename, filePath);
    if (res === '文件已存在') {
      ctx.body = {
        code: 200,
        message: '文件已存在',
        data: {
          filePath
        }
      };
    }else{
      fs.writeFileSync(filePath, fileBuffer);
      ctx.body = {
        code: 200,
        message: '文件上传成功',
        data: {
          filePath
        }
      };
    }
  
   
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      msg: '文件上传失败',
      error: error.message
    };
  }
}

// 大文件上传
async uploadChunk(ctx, next) {
  const form = new multiparty.Form();
  
   // 将 form.parse 包装为 Promise 以处理异步操作
   const parseForm = () => {
    return new Promise((resolve, reject) => {
      form.parse(ctx.req, (err, fields, files) => {
        if (err) {
          return reject(err);
        }
        resolve({ fields, files });

      });
    });
  };

  try {
    // 调用 parseForm 解析请求
    const result = await parseForm();
    // console.log('result:', result);
    // 获取文件hash
    const fileHash = result.fields.fileHash[0];
    const chunkHash = result.fields.chunkHash[0];
  //   // 写入的文件路径 ， 临时存放的目录
  const chunkPath = join(__dirname, `../public/uploadBigFile/${fileHash}`);
  // const uploadDir = join(__dirname, '../public/uploadBigFile');
  if (!fs.existsSync(chunkPath)) {
    fs.mkdirSync(chunkPath, { recursive: true });
  }
  // 写入的文件
   const oldPath = result.files.chunk[0].path;
   const newPath = join(chunkPath, chunkHash);
   console.log('oldPath:', oldPath, 'newPath:', newPath);
  // 将切片文件从临时目录移动到指定目录
   // 检查源文件是否存在
   if (!fs.existsSync(oldPath)) {
    console.error('源文件不存在:', oldPath);
    ctx.body = { code: 500, message: '源文件不存在', data: {} };
      return;
    }

    // 将文件从临时目录复制到目标目录
    await fs.promises.copyFile(oldPath, newPath);
    // 删除原来的临时文件
    await fs.promises.unlink(oldPath);

    // 返回上传成功的响应
    ctx.body = { code: 200, message: '文件块上传成功', data: result };
  } catch (error) {
    // 捕获并处理解析错误
    console.error('文件上传失败:', error);
    ctx.body = { code: 500, message: '文件上传失败', data: {} };
  }
 
 }

 async mergeFile(ctx, next) {

  const { fileHash, filename, size } = ctx.request.body;
  console.log('fileHash:', fileHash, 'filename:', filename, 'size:', size);
  // 获取文件的后缀
  const suffix = getSuffix(filename);
  // 写入的文件路径
  const fileDir = join(__dirname, '../public/uploadBigFile');
  const filePath = join(fileDir, `${fileHash}${suffix}`);

  if (fs.existsSync(filePath)) {
    ctx.body = { code: 200, message: '文件已存在', data: {} };
    return;
  }

  // 如果不存在，则合并文件
  const chunkDir = join(__dirname, `../public/uploadBigFile/${fileHash}`);
  // 判断临时文件夹是否存在
  if (!fs.existsSync(chunkDir)) {
    ctx.body = { code: 500, message: '合并失败，请重新上传', data: {} };
    return;
  }

  // 临时文件夹存在则合并文件
  const chunkPaths = await fs.promises.readdir(chunkDir);
  console.log('chunkPaths:', chunkPaths);
  // 按照文件名排序
  chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
  
  // 变量文件夹下的文件，创建可读流，返回promise
  const chunks = chunkPaths.map((chunkName, index) => {
    return new Promise((resolve) => {
      const chunkPath = join(chunkDir, chunkName);
      const readStream = fs.createReadStream(chunkPath);
      // 创建可写流
      const writeStream = fs.createWriteStream(filePath, {
        start: index * size,
        end: (index + 1) * size
      });
      readStream.pipe(writeStream);
      readStream.on('end', () => {
        fs.unlinkSync(chunkPath);
        resolve();
      });
  })
  });

  // 等待所有文件合并完成
  await Promise.all(chunks);
  // 删除临时文件夹
  fs.rmdirSync(chunkDir);
  ctx.body = { code: 200, message: '合并文件成功', data: {} };
}


async verifyFile(ctx, next) {
  const { fileHash, filename } = ctx.request.body;
  // 获取文件的后缀
  const suffix = getSuffix(filename);
  // 写入的文件路径
  const filePath = join(__dirname, `../public/uploadBigFile/${fileHash}${suffix}`);

  // 返回服务器已经上传成功的切片
  const chunkDir = join(__dirname, `../public/uploadBigFile/${fileHash}`);
  let chunkPaths;
  if (fs.existsSync(chunkDir)) {
    chunkPaths = await fs.promises.readdir(chunkDir);
  }

  if (fs.existsSync(filePath)) {
    ctx.body = { 
      code: 200, message: '文件上传成功', 
      data: {
      shouleUploadChunks: true,
    } 
    };
    return;
  }else {
      ctx.body = { 
        code: 200, 
        message: '文件上传失败，请重新上传', 
        data: {
        shouleUploadChunks: false,
        existChunks: chunkPaths || []
      } 
    };
      return;
  }
 

}
}

// 获取文件的后缀
function getSuffix(filename) {
  return filename.slice(filename.lastIndexOf("."));
}






export default new UploadFileController();