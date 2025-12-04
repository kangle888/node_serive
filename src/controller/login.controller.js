import { PRIVATE_KEY } from '../config/screct.js';
import { jwtConfig } from '../config/index.js';
import jwt from 'jsonwebtoken';

class LoginController {
  // 传统登录
  sign(ctx, next) {
    // 1.接收用户信息
    const { id, name } = ctx.user;
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
        token
      }
    };
  }

  // 微信小程序登录
  wechatSign(ctx, next) {
    // 1.接收用户信息
    const user = ctx.user;
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
    // 3.返回数据
    ctx.body = {
      code: 200,
      message: '登录成功',
      data: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        phone: user.phone,
        token
      }
    };
  }

  // 测试接口
  test(ctx, next) {
    console.log('到这里了吗--login.controller.js');
    ctx.body = {
      message: '测试成功'
    };
  }
}

export default new LoginController();
