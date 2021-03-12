import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannersList: [], // 轮播图数据
    recommendList: [],// 推荐歌曲数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this === 页面的实例
    this.getInitData();
  },

  // 封装获取初始化数据的方法
  async getInitData(){
    let bannersListResult = await request('/banner', {type: 2});
    this.setData({
      bannersList: bannersListResult.banners
    })

    // 获取推荐歌曲数据
    let recommendListResult = await request('/personalized', {limit: 10});
    this.setData({
      recommendList: recommendListResult.result
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