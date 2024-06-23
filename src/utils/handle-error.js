import app from '../app/index.js';
import {
  NAME_ALREADY_EXISTS,
  NAME_OR_PASSWORD_IS_REQUIRED,
  USER_DOES_NOT_EXISTS,
  PASSWORD_IS_INCORRENT,
  UNAUTHORIZATION,
  UNPERMISSION
} from '../config/error.js';

app.on('error', (err, ctx) => {
  let code = 0;
  let message = '';
  switch (err.message) {
    case NAME_OR_PASSWORD_IS_REQUIRED:
      code = -1001;
      message = '用户名或密码不能为空';
      break;
    case NAME_ALREADY_EXISTS:
      code = -1002;
      message = '用户名已经存在';
      break;
    case USER_DOES_NOT_EXISTS:
      code = -1003;
      message = '登陆的用户名不存在，请检查用户名，重新登陆';
      break;
    case PASSWORD_IS_INCORRENT:
      code = -1004;
      message = '密码错误，请重新输入';
      break;
    case UNAUTHORIZATION:
      code = -1005;
      message = '无效的token';
      break;
    case UNPERMISSION:
      code = -1006;
      message = '没有操作资源的授权';
      break;
    default:
      code = -1;
      message = '未知错误';
  }
  ctx.body = {
    code,
    message
  };
});
