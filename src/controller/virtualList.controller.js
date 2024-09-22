import mock from 'mockjs'


class VirtualListController {
   async VirtualList(ctx) {
    const { page, size } = ctx.request.body;
    console.log('page', ctx.request.body);
    // 模拟根据页码和每页条数返回数据
    const data = mock.mock({
      [`list|${size}`]: [
        {
          'id|+1': (page - 1) * size + 1,
          name: '@cname',
          'age|+1': (page-1)*size + 1,
          address: '@county(true)',
          hobby: '@cword(20, 40)',
          img: '@image(100x100, @color, @cname)'
        }
      ]
    });



    ctx.body = {
      code: 200,
      message: '查询成功',
      data
    };
  }
}

export default new VirtualListController();