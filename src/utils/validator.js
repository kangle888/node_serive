import Joi from 'joi';

// 通用校验中间件：对 ctx[property] 进行 Joi 校验
export const validate = (schema, property = 'body') => {
  return async (ctx, next) => {
    const data = ctx.request[property] || ctx[property];
    const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
    if (error) {
      ctx.status = 400;
      ctx.body = {
        code: -1000,
        message: '参数校验失败',
        data: error.details.map((d) => d.message)
      };
      return;
    }
    if (property === 'body') {
      ctx.request.body = value;
    } else {
      ctx[property] = value;
    }
    await next();
  };
};


