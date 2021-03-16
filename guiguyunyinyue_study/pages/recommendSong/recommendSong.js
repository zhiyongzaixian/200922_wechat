import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [], // 推荐歌曲列表数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })

    this.getRecommendList();
  },
  // 获取推荐列表数据
  async getRecommendList(){
    let result = await request('/recommend/songs');
    this.setData({
      recommendList: result.recommend
    })
  },

  // 跳转至songDetail
  toSongDetail(event){
    let song = event.currentTarget.dataset.song;
    // Vue路由跳转传参： query， params，props(布尔值，对象，函数)，meta
    // 小程序路由传参： query
    wx.navigateTo({
      // 原生小程序对query参数有长度限制，如果长度过长会自动截取
      // url: '/pages/songDetail/songDetail?song=' + JSON.stringify(song),
      url: '/pages/songDetail/songDetail?musicId=' + song.id,

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