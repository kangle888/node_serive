import Joi from 'joi';

// 通用校验中间件：对 ctx[property] 进行 Joi 校验
export const validate = (schema, property = 'body') => {
  return async (ctx, next) => {
    // 根据 property 类型获取数据
    let data;
    if (property === 'body') {
      data = ctx.request.body;
    } else if (property === 'query') {
      data = ctx.query;
    } else if (property === 'params') {
      data = ctx.params;
    } else {
      data = ctx.request[property] || ctx[property];
    }
    const { error, value } = schema.validate(data || {}, { abortEarly: false, stripUnknown: true });
    if (error) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '参数校验失败',
        data: error.details.map((d) => d.message)
      };
      return;
    }
    
    // 将校验后的值写回
    if (property === 'body') {
      ctx.request.body = value;
    } else if (property === 'query') {
      ctx.query = value;
    } else if (property === 'params') {
      ctx.params = value;
    } else {
      ctx[property] = value;
    }
    
    await next();
  };
};


