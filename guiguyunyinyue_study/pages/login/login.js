/*
  1. 登录流程
    1) 收集表单项数据
    2) 前端验证
      - 1 验证表单项内容是否合法， 如： 手机号是否符合规定
      - 2 如果前端验证不通过： 提示用户
      - 3 如果前端通过：发请求，进行后端验证
    3) 后端验证
      - 1 验证账号是否存在
      - 2 用户不存在，直接返回用户不存在的数据，登录失败
      - 3 用户存在，验证密码是否正确
      - 4 如果密码不正确，返回密码不正确的数据
      - 5 如果密码正确，返回登录成功信息，通常包含用户的token
  2. 扩展
    v-model干了哪些事情: v-model='msg'
      1) :value=msg
      2) @input=''


*/

import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '', 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 表单项数据发生的改变的回调
  handleInput(event){
    // let obj = {};
    // let a = 'username';
    // obj[a] = 'curry'

    // 操作对象属性的时候，如果该属性是变量需要使用[]
    let type = event.currentTarget.id;
    this.setData({
      [type]: event.detail.value
    })
  },

  // 登录的回调
  async login(){
    let {phone, password} = this.data;

    // 验证手机号
    if(!phone){
      // 提示用户不能为空
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }

    // 手机号格式 ---  正则
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return;
    }

    // 密码验证
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }

    // 发请求，进行后端验证
    let result = await request('/login/cellphone', {phone, password});
    if(result.code === 200){
      // 登录成功
      // 将用户的数据缓存至本地
      wx.setStorageSync('userInfo', result.profile)

      // 跳转至个人中心页
      wx.switchTab({
        url: '/pages/personal/personal',
      })

    }else if(result.code === 400){
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })

      return;
    }else if(result.code === 502){
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })

      return;
    }else {
      wx.showToast({
        title: '登录失败，请重新登录',
        icon: 'none'
      })
      return;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})