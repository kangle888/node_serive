import UserService from '../service/user.service.js';
class UserController {
  async create(ctx, next) {
    // 1.接收用户请求传递的参数
    const user = ctx.request.body;
    // 2.调用service层的方法:  这里【】是解构赋值
    const [result] = await UserService.create(user);
    // 3.返回响应
    ctx.body = {
      code: '200',
      message: '注册成功',
      data: result
    };
  }
}

export default new UserController();
