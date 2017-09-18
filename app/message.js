'use strict';

const errDict = {

  /* web default error */

  'OK': {
    code: 200,
    message: '操作成功！'
  },
  'Created': {
    code: 201,
    message: '创建成功！'
  },

  'BadRequest': {
    status: 400,
    errMsg: '错误的请求'
  },
  'Unauthorized': {
    status: 401,
    errMsg: '请先登录'
  },
  'Forbidden': {
    status: 403,
    errMsg: '您没有权限浏览或编辑该内容'
  },
  'NotFound': {
    status: 404,
    errMsg: '页面建设中...'
  },
  'InternalServerError': {
    status: 500,
    errMsg: '服务器错误，请联系管理员'
  },
  'NotImplemented': {
    status: 501,
    errMsg: '功能尚未完成...'
  },

  'UsernameConflicted': {
    status: 500001,
    errMsg: '用户名已被占用'
  },
}

let errList =
module.exports = errDict;