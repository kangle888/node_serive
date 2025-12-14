import UserService from '../service/user.service.js';
import multiparty from 'multiparty';
import SparkMD5 from 'spark-md5';
import { join } from 'path';
import fs from 'fs';
import uploadFileService from '../service/uploadFile.service.js';
import { uploadConfig } from '../config/index.js';

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

class UserController {
  async create(ctx, next) {
    // 1.接收用户请求传递的参数
    const user = ctx.request.body;
    // 2.调用service层的方法:  这里【】是解构赋值
    const [result] = await UserService.create(user);
    // 3.返回响应
    ctx.body = {
      code: 200,
      message: '注册成功',
      data: result
    };
  }

  // 根据用户id获取用户信息
  async getUserInfo(ctx, next) {
    // 1.获取用户id
    const { userId } = ctx.query;
   
    // 2.调用service层的方法

    const [result] = await UserService.getUserInfo(userId);
    // 3.返回响应
    ctx.body = {
      code: 200,
      message: '查询成功',
      data: result
    };
  }

  // 根据roleId获取用户菜单信息
  async getUserMenu(ctx, next) {
    // 1.获取用户id
    const { roleId } = ctx.query;
    console.log('roleId', roleId);
    // 2.调用service层的方法
    const res = await UserService.getUserMenu(roleId);
    // console.log('resultkk*************', res);
    // 3.返回响应
    ctx.body = {
      code: 200,
      message: '查询成功',
      data: res
    };
  }

  // 更新用户昵称/头像等基础资料（支持文件上传）
  async updateProfile(ctx) {
    const userId = ctx.user?.id;
    const contentType = ctx.headers['content-type'] || '';
    
    // 判断是否是文件上传请求
    const isMultipart = contentType.includes('multipart/form-data');
    
    let nickname, avatar_url, username, phone;
    
    if (isMultipart) {
      // 处理文件上传
      const form = new multiparty.Form();
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
        const result = await parseForm();
        
        // 获取表单字段
        nickname = result.fields.nickname?.[0] || null;
        username = result.fields.username?.[0] || null;
        phone = result.fields.phone?.[0] || null;
        
        // 处理文件上传（如果有文件）
        const fileArray = result.files.file || result.files.avatar || result.files.avatar_url;
        if (fileArray && fileArray.length > 0) {
          const uploadedFile = fileArray[0];
          const tempPath = uploadedFile.path;
          const originalFilename = uploadedFile.originalFilename || 'avatar.jpg';
          
          // 读取文件内容
          const fileBuffer = fs.readFileSync(tempPath);
          
          // 根据文件内容获取hash（SparkMD5）
          const spark = new SparkMD5.ArrayBuffer();
          spark.append(fileBuffer);
          const filehash = spark.end();
          
          // 获取文件的后缀
          const suffix = originalFilename.slice(originalFilename.lastIndexOf('.'));
          
          // 写入的文件路径
          const uploadDir = uploadConfig.baseDir;
          ensureDir(uploadDir);
          const filenameWithHash = `${filehash}${suffix}`;
          const filePath = join(uploadDir, filenameWithHash);
          const fileUrl = `/upload/${filenameWithHash}`;
          const origin =
            uploadConfig.publicBase && uploadConfig.publicBase.trim()
              ? uploadConfig.publicBase.trim().replace(/\/$/, '')
              : `${ctx.protocol}://${ctx.host}`;
          const fileUrlAbsolute = `${origin}${fileUrl}`;
          
          // 检查文件是否已存在
          const res = await uploadFileService.saveFileInfoToDatabase(
            filehash,
            originalFilename,
            filePath
          );
          
          if (res === '文件已存在') {
            // 删除临时文件
            fs.unlinkSync(tempPath);
            avatar_url = fileUrlAbsolute;
          } else {
            // 将临时文件移动到目标位置
            fs.copyFileSync(tempPath, filePath);
            // 删除临时文件
            fs.unlinkSync(tempPath);
            avatar_url = fileUrlAbsolute;
          }
        }
      } catch (error) {
        ctx.status = 500;
        ctx.body = {
          code: 500,
          message: '文件上传失败',
          error: error.message
        };
        return;
      }
    } else {
      // JSON 请求，直接获取 body
      const body = ctx.request.body || {};
      nickname = body.nickname;
      avatar_url = body.avatar_url;
      username = body.username;
      phone = body.phone;
    }
    
    // 更新用户资料
    const updated = await UserService.updateProfile(userId, {
      nickname,
      avatar_url,
      username,
      phone
    });
    
    ctx.status = 200;
    ctx.type = 'application/json';
    ctx.body = {
      code: 200,
      message: '更新成功',
      data: updated
    };
  }
}

export default new UserController();
