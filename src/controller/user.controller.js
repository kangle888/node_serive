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

  // 根据用户id获取用户信息
  async getUserInfo(ctx, next) {
    // 1.获取用户id
    const { userId } = ctx.query;
    console.log(userId, 'userId');
    // 2.调用service层的方法

    const [result] = await UserService.getUserInfo(userId);
    // 3.返回响应
    ctx.body = {
      code: '200',
      message: '查询成功',
      data: result
    };
  }

  // 根据角色id获取菜单信息
  async getMenuInfo(ctx, next) {
    // 1.获取用户id
    const { roleId } = ctx.query;
    // 2.调用service层的方法
    const result = await UserService.getMenuInfo(roleId);
    // 3.返回响应
    ctx.body = {
      code: '200',
      message: '查询成功',
      data: result
    };
  }
  // 获取用户列表 根据query参数 offset 和 size
  // 获取用户列表 根据query参数 offset 和 size
  async getUserList(ctx, next) {
    // 1.获取用户id
    const { offset, size } = ctx.query;
    console.log(offset, size, 'offset, size');

    // 2.调用service层的方法
    const result = await UserService.getUserList(parseInt(offset), parseInt(size));

    // 3.返回响应
    ctx.body = {
      code: '200',
      message: '查询成功',
      data: result.list,
      total: result.total
    };
  }




  //查询用户列表
  async searchUserList(ctx, next) {
    // 1.获取用户id
    const userReq = ctx.request.body;
    console.log(userReq, 'userReq');
    // 2.调用service层的方法
    const result = await UserService.searchUserList(userReq);
    // 3.返回响应
    ctx.body = {
      code: '200',
      message: '查询成功',
      data: result
    };
  }
  // 新增用户
  async addUser(ctx, next) {
    // 1.获取用户id
    const userReq = ctx.request.body;
    console.log(userReq, 'userReq');
    // 2.调用service层的方法
    const result = await UserService.addUser(userReq);
    // 3.返回响应
    ctx.body = {
      code: '200',
      message: '新增成功',
      data: result
    };
  }
  // 删除用户
  async deleteUser(ctx, next) {
    // 1.获取用户id
    const userReq = ctx.request.body;
    console.log(userReq, 'userReq');
    // 2.调用service层的方法
    const result = await UserService.deleteUser(userReq);
    // 3.返回响应
    ctx.body = {
      code: '200',
      message: '删除成功',
      data: result
    };
  }

}

export default new UserController();
