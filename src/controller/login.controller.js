import { PRIVATE_KEY } from '../config/screct.js';
import { jwtConfig } from '../config/index.js';
import jwt from 'jsonwebtoken';
import UserService from '../service/user.service.js';

class LoginController {
  // 传统登录
  async sign (ctx, next) {
    // 1.接收用户信息
    const { id, name } = ctx.user;
    // 额外查询头像/昵称等资料，方便前端持久化
    const userInfo = await UserService.getUserById(id);
    // 2.颁发token
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      expiresIn: jwtConfig.expiresIn,
      algorithm: jwtConfig.algorithm
    });
    // 3.返回数据
    ctx.body = {
      code: 200,
      message: '登录成功',
      data: {
        id,
        name,
        nickname: userInfo?.nickname,
        avatar_url: userInfo?.avatar_url,
        phone: userInfo?.phone,
        token
      }
    };
  }

  // 微信小程序登录
  async wechatSign (ctx, next) {
    // 1.接收用户信息（中间件已校验/查库）
    const user = ctx.user;
    // 额外查询最新资料，避免使用旧缓存
    const freshUser = await UserService.getUserById(user.id);
    console.log('freshUser', freshUser);
    // 2.颁发token
    const token = jwt.sign(
      {
        id: user.id,
        openid: user.openid
      },
      PRIVATE_KEY,
      {
        expiresIn: jwtConfig.expiresIn,
        algorithm: jwtConfig.algorithm
      }
    );
    // 3.返回数据（带最新昵称/头像）
    ctx.body = {
      code: 200,
      message: '登录成功',
      data: {
        id: user.id,
        openid: user.openid,
        nickname: freshUser?.nickname ?? user.nickname,
        avatar_url: freshUser?.avatar_url ?? user.avatar_url,
        phone: freshUser?.phone ?? user.phone,
        token
      }
    };
  }

  // 测试接口
  test (ctx, next) {
    console.log('到这里了吗--login.controller.js');
    ctx.body = {
      message: '测试成功'
    };
  }
}

export default new LoginController();
