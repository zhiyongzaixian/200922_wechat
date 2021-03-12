
/*
  1. 封装功能函数
    1）功能点要明确，单一。
    2）函数内部保留的是静态不变的代码
    3) 将动态的数据提取出来，作为函数的形参
    4) 由使用者根据实际情况注入实参
    5) 要保证功能函数的安全性，应该设置形参的默认值
  2. 封装组件
    1) 功能点要明确，单一
    2) 组件内部保留的静态数据
    3) 将动态数据提取出来作为props数据
    4) 由使用者根据实际情况以标签属性的形式传入动态数据
    5) 一个良好的组件应该设置props数据的必要性和数据类型
    props： {
      msg: {
        required: true,
        ....
      }
    }
*/
import config from './config.js'
export default (url, data={}, method='GET') => {
  return new Promise((resolve, reject) => {
    // 1. 初始化promise的状态为pending 初始化
    // 2. 执行异步任务
    wx.request({
      url: config.host + url,
      data,
      method,
      success: (res) => {
        // console.log(res.data);
        // 异步任务成功， 调用resolve, 修改promise实例的状态为成功状态resolved
        resolve(res.data);
      },
      fail: (err) => {
        console.log('请求失败', err)
        // 异步任务失败， 调用 reject, 修改promise实例的状态为成功状态rejected
        reject(err);
      }
    })
  })
}