// pages/index/index.js

// 创建当前页面的实例， 注册当前的页面
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: '测试数据',
    msg2: '断点测试数据'
  },
  
  handleParent(){
    console.log('parent')
  },
  handleChild(){
    console.log('child')

  },

  // 跳转至logs页面
  toLogs(){
    wx.navigateTo({
      url: '/pages/logs/logs'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('----- onLoad 监听页面加载 -----')
    // debugger;

  //  setTimeout(() => {
  //     // 小程序修改数据
  //   this.setData({
  //     message: '修改之后的数据'
  //   })

  //   console.log(this.data.message) // 同步
  //  }, 2000)

  // 发请求获取数据
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('----- onReady 监听页面初次渲染完成 -----')
    // 发请求获取数据

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('----- onShow 监听页面显示 -----')
    // 会执行多次。
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('----- onHide 监听页面隐藏 -----')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('----- onUnload 监听页面卸载 -----')

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