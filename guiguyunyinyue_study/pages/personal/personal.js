/*

  实现cover-container移动的动效
    1. 手指事件
    2. 手指移动的距离
    3. 控制cover实时位移
    4. 实现cover回弹，过渡
*/
import request from '../../utils/request';
let startY = 0; // 起始坐标
let moveY = 0; // 实时坐标
let moveDistance = 0; // 移动距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: '',
    coverTransition: '',
    userInfo: {}, // 用户信息
    recentPlayList: [], // 用户最近播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取本地用户信息
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
    if(userInfo){
      // 获取用户播放记录
      this.getRecentPlay(this.data.userInfo.userId);
    }
  },
  // 获取用户播放记录的功能函数
  async getRecentPlay(userId){
    let result = await request('/user/record', {uid: userId, type: 0});
    let index = 0;
    let recentPlayList = result.allData.slice(0, 10).map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      recentPlayList
    })
  },

  handleTouchStart(event){
    // 更新coverTransform状态
    this.setData({
      coverTransition: ''
    })
    // 获取手指的起始坐标
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event){
    // 获取实时坐标
    moveY = event.touches[0].clientY;

    moveDistance = moveY - startY;
    if(moveDistance < 0){
      return;
    }

    if(moveDistance >= 80){
      moveDistance = 80
    }

    // 更新coverTransform状态
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd(){
    // 更新coverTransform状态
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: 'transform 1s linear'
    })
  },

  // 跳转至登录页login
  toLogin(){
    // 判断用户是否已经登录
    if(this.data.userInfo.nickname){
      return;
    }
    wx.navigateTo({
      url: '/pages/login/login',
    })
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