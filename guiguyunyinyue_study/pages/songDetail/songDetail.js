import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 标识音乐是否播放
    songDetail: {}, // 歌曲详情对象
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options: 接收路由跳转参数 query参数
    console.log(options)
    // let a = "{}"
    // json字符串： json对象 || json数组
    // 原生小程序对query参数有长度限制，如果长度过长会自动截取
    // let song = JSON.parse(options.song);

    let musicId = options.musicId;
    this.getSongDetail(musicId);
  },

  // 获取歌曲详情的功能函数
  async getSongDetail(musicId){
    let result = await request('/song/detail', {ids: musicId});
    // 更新songDetail的状态
    this.setData({
      songDetail: result.songs[0]
    })

    // 动态设置窗口标题
    wx.setNavigationBarTitle({
      title: result.songs[0].name
    })
  },

  // 点击切换播放的回调
  handleMusicPlay(){
    let isPlay =  !this.data.isPlay;
    this.setData({
      isPlay
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