import { PRIVATE_KEY } from '../config/screct.js';
import jwt from 'jsonwebtoken';

class LoginController {
  sign(ctx, next) {
    // 1.接收用户信息
    const { id, name } = ctx.user;
    // 2.颁发token
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24,
      algorithm: 'RS256'
    });
    // 3.返回数据
    ctx.body = {
      code: 0,
      message: '登录成功',
      data: {
        id,
        name,
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
