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
  async getAccessToken () {
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
  async getUnlimitedQRCode ({
    scene,
    page,
    width = 430,
    autoColor = false,
    lineColor = { r: 0, g: 0, b: 0 },
    isHyaline = false,
    useWxacodeUnlimit = true
  }) {
    if (!scene) throw new Error('scene 参数必填');

    // 按字节截取 scene，防止中文超 32 字节
    const truncateScene = (sceneStr) => {
      let bytes = 0, result = '';
      for (let char of sceneStr) {
        bytes += char.charCodeAt(0) > 127 ? 3 : 1;
        if (bytes > 32) break;
        result += char;
      }
      return result;
    };

    const requestBody = {
      scene: truncateScene(String(scene)),
      width,
      auto_color: autoColor,
      line_color: lineColor,
      is_hyaline: isHyaline
    };

    if (page) requestBody.page = page;

    const accessToken = await this.getAccessToken();
    if (!accessToken) throw new Error('access_token 获取失败');

    const url = useWxacodeUnlimit
      ? `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`
      : `https://api.weixin.qq.com/wxa/getunlimited?access_token=${accessToken}`;

    try {
      const response = await axios.post(url, requestBody, {
        responseType: 'arraybuffer',
        validateStatus: () => true,
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      });

      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        // 返回 JSON，说明接口报错
        const errorText = Buffer.from(response.data).toString('utf8');
        const errorData = JSON.parse(errorText);

        // 自动回退 page
        if (errorData.errcode === 40066 && page) {
          console.warn('指定 page 无效，自动回退默认首页:', page);
          return await this.getUnlimitedQRCode({
            scene,
            width,
            autoColor,
            lineColor,
            isHyaline,
            useWxacodeUnlimit
          });
        }

        throw new Error(`生成小程序码失败: ${errorData.errmsg || '未知错误'}, 错误码: ${errorData.errcode}`);
      }

      if (!response.data || response.data.length === 0) {
        throw new Error('生成小程序码失败: 服务器返回空数据');
      }

      return `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
    } catch (err) {
      console.error('生成小程序码异常:', err);
      throw err;
    }
  }
}

export default new WechatService();
