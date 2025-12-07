import axios from 'axios';
import { wechatConfig } from '../config/index.js';

/**
 * 微信服务
 * 用于获取 access_token 和生成小程序码
 */
class WechatService {
  // 缓存 access_token
  accessTokenCache = {
    token: null,
    expiresAt: 0
  };

  /**
   * 获取微信 access_token
   * access_token 有效期为 7200 秒，这里实现简单的缓存机制
   */
  async getAccessToken() {
    const now = Date.now();

    // 如果缓存有效，直接返回
    if (this.accessTokenCache.token && now < this.accessTokenCache.expiresAt) {
      return this.accessTokenCache.token;
    }

    try {
      const response = await axios.get(
        'https://api.weixin.qq.com/cgi-bin/token',
        {
          params: {
            grant_type: 'client_credential',
            appid: wechatConfig.appid,
            secret: wechatConfig.secret
          }
        }
      );

      const { access_token, expires_in, errcode, errmsg } = response.data;

      if (errcode) {
        throw new Error(`获取 access_token 失败: ${errmsg || '未知错误'}`);
      }

      if (!access_token) {
        throw new Error('获取 access_token 失败: token 为空');
      }

      // 缓存 token，提前 5 分钟过期，确保安全
      this.accessTokenCache.token = access_token;
      this.accessTokenCache.expiresAt = now + (expires_in - 300) * 1000;

      return access_token;
    } catch (error) {
      console.error('获取微信 access_token 失败:', error);
      throw error;
    }
  }

  /**
   * 生成小程序码（不限制数量）
   * @param {string} scene - 场景值，最大32个字符，这里使用邀请码
   * @param {string} page - 小程序页面路径，可选
   * @param {number} width - 二维码宽度，默认 430
   * @param {boolean} autoColor - 自动配置线条颜色，默认 false
   * @param {object} lineColor - 线条颜色，autoColor 为 false 时生效
   * @param {boolean} isHyaline - 是否需要透明底色，默认 false
   */
  async getUnlimitedQRCode({
    scene,
    page,
    width = 430,
    autoColor = false,
    lineColor = { r: 0, g: 0, b: 0 },
    isHyaline = false
  }) {
    try {
      const accessToken = await this.getAccessToken();

      // 构建请求体
      // 注意：微信小程序码生成接口要求：
      // 1. scene 参数必需，最大32字符
      // 2. page 参数可选，但如果传了必须是已发布的页面路径
      // 3. 如果小程序未发布，即使不传 page 也可能报错
      const requestBody = {
        scene: String(scene).substring(0, 32), // 确保不超过32字符
        width,
        auto_color: autoColor,
        line_color: lineColor,
        is_hyaline: isHyaline
      };

      // 明确传递 page 参数为首页（tabBar 页面，应该存在）
      // 如果小程序未发布，这里会报错，但至少能明确问题
      requestBody.page = page || 'pages/index/index';

      // 调试日志：打印实际发送的请求参数
      console.log(
        '生成小程序码请求参数:',
        JSON.stringify(requestBody, null, 2)
      );
      console.log('scene 参数详情:', {
        value: scene,
        length: String(scene).length,
        type: typeof scene
      });

      const response = await axios.post(
        `https://api.weixin.qq.com/wxa/getunlimited?access_token=${accessToken}`,
        requestBody,
        {
          responseType: 'arraybuffer', // 重要：返回二进制数据
          validateStatus: () => true // 不自动抛出状态码错误，手动处理
        }
      );

      // 检查响应状态码
      if (response.status !== 200) {
        const errorText = Buffer.from(response.data).toString('utf8');
        console.error(
          '微信 API 返回非 200 状态码:',
          response.status,
          errorText
        );
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(
            `生成小程序码失败: ${errorData.errmsg || `错误码 ${errorData.errcode}` || '未知错误'}`
          );
        } catch (parseError) {
          throw new Error(
            `生成小程序码失败: HTTP ${response.status} - ${errorText || '服务器返回错误'}`
          );
        }
      }

      // 检查是否是错误响应（微信 API 错误时可能返回 JSON，即使状态码是 200）
      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        try {
          const errorText = Buffer.from(response.data).toString('utf8');
          console.error('微信 API 返回 JSON 错误:', errorText);
          const errorData = JSON.parse(errorText);
          const errorMsg =
            errorData.errmsg || `错误码: ${errorData.errcode}` || '未知错误';
          throw new Error(`生成小程序码失败: ${errorMsg}`);
        } catch (parseError) {
          console.error('解析错误响应失败:', parseError);
          const errorText = Buffer.from(response.data).toString('utf8');
          throw new Error(`生成小程序码失败: ${errorText || '服务器返回错误'}`);
        }
      }

      // 检查响应数据是否为空
      if (!response.data || response.data.length === 0) {
        throw new Error('生成小程序码失败: 服务器返回空数据');
      }

      // 将二进制数据转换为 base64
      const base64 = Buffer.from(response.data).toString('base64');
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.error('生成小程序码失败:', error);
      console.error('错误详情:', {
        message: error.message,
        response: error.response
          ? {
              status: error.response.status,
              statusText: error.response.statusText,
              data: Buffer.isBuffer(error.response.data)
                ? error.response.data.toString('utf8')
                : error.response.data,
              headers: error.response.headers
            }
          : null
      });

      // 如果是 axios 错误，尝试提取更详细的错误信息
      if (error.response) {
        const errorData = error.response.data;
        if (Buffer.isBuffer(errorData)) {
          // 如果是 Buffer，尝试解析为 JSON
          try {
            const errorText = errorData.toString('utf8');
            console.error('微信 API 错误响应 (Buffer):', errorText);
            const parsed = JSON.parse(errorText);
            throw new Error(
              `生成小程序码失败: ${parsed.errmsg || `错误码: ${parsed.errcode}` || '未知错误'}`
            );
          } catch (parseErr) {
            const errorText = errorData.toString('utf8');
            throw new Error(
              `生成小程序码失败: ${errorText || '服务器返回错误'}`
            );
          }
        } else if (typeof errorData === 'object' && errorData.errmsg) {
          throw new Error(`生成小程序码失败: ${errorData.errmsg}`);
        } else if (typeof errorData === 'string') {
          throw new Error(`生成小程序码失败: ${errorData}`);
        }
      }

      // 如果错误已经有 message，直接抛出（避免重复包装）
      if (error.message && !error.message.includes('生成小程序码失败')) {
        throw new Error(`生成小程序码失败: ${error.message}`);
      }
      throw error;
    }
  }
}

export default new WechatService();
