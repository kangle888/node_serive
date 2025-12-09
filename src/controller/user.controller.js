import UserService from '../service/user.service.js';
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

  // 更新用户昵称/头像等基础资料
  async updateProfile(ctx) {
    const userId = ctx.user?.id;
    const { nickname, avatar_url, username, phone } = ctx.request.body || {};
    const updated = await UserService.updateProfile(userId, {
      nickname,
      avatar_url,
      username,
      phone
    });
    ctx.body = {
      code: 200,
      message: '更新成功',
      data: updated
    };
  }
}

export default new UserController();
