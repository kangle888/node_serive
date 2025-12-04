import axios from 'axios';
import { wechatConfig } from '../config/index.js';
import UserService from '../service/user.service.js';
import UserLoginLogDAO from '../dao/userLoginLog.dao.js';

/**
 * 微信登录中间件
 * 通过 code 获取 openid，然后查找或创建用户
 */
export const verifyWechatLogin = async (ctx, next) => {
  try {
    // 1. 获取前端传来的 code
    const { code, userInfo } = ctx.request.body;
    
    if (!code) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: 'code 参数不能为空'
      };
      return;
    }
    console.log('微信登录中间件收到 wechatConfig:', wechatConfig);
    // 2. 调用微信接口获取 openid
    const wechatResponse = await axios.get(wechatConfig.loginUrl, {
      params: {
        appid: wechatConfig.appid,
        secret: wechatConfig.secret,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid, unionid, session_key, errcode, errmsg } = wechatResponse.data;

    // 3. 检查微信接口返回
    if (errcode) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: `微信登录失败: ${errmsg || '未知错误'}`,
        errcode
      };
      return;
    }

    if (!openid) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '获取 openid 失败'
      };
      return;
    }

    // 4. 查找或创建用户
    const user = await UserService.findOrCreateWechatUser(openid, {
      unionid,
      nickname: userInfo?.nickName,
      avatar_url: userInfo?.avatarUrl
    });

    // 5. 检查用户状态
    if (user.status !== 1) {
      ctx.status = 403;
      ctx.body = {
        code: 403,
        message: '账户已被禁用'
      };
      return;
    }

    // 6. 记录登录日志
    const clientIP = ctx.request.ip || ctx.ip || 'unknown';
    try {
      await UserLoginLogDAO.create({
        user_id: user.id,
        login_ip: clientIP,
        login_method: 'wechat',
        success: 1
      });
    } catch (logError) {
      // 登录日志记录失败不影响登录流程，只记录错误
      console.error('记录登录日志失败:', logError);
    }

    // 7. 将用户信息挂载到 ctx 上
    ctx.user = user;
    ctx.wechatSession = {
      openid,
      unionid,
      session_key
    };

    await next();
  } catch (error) {
    console.error('微信登录中间件错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '登录处理失败',
      error: error.message
    };
  }
};

