import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], // 导航标签数据
    navId: '', // 导航标签的id
    videoList: [], // 视频列表数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupData();
  },

  // 获取导航标签数据的功能函数
  async getVideoGroupData(){
    let result = await request('/video/group/list');
    this.setData({
      videoGroupList: result.data.slice(0, 14),
      navId: result.data[0].id
    })

    this.getVideoList(this.data.navId);
  },

  // 获取视频列表数据
  async getVideoList(navId){
    let result = await request('/video/group', {id: navId});
    let index = 0;
    let videoList = result.datas.map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      videoList
    })
  },

  // 点击导航的回调
  changeNav(event){
    let navId = event.currentTarget.id; // 通过id获取标识数据会自动将number转换成string
    // let navId = event.currentTarget.dataset.id;
    this.setData({
      navId: navId>>>0
    })
  },

  // 点击视频播放/继续播放的回调
  handlePlay(event){
    /*
    需求： 点击新的视频播放的时候先关闭之前播放的视频
    思路： 
      1. 如果关闭视频： let videoContext = wx.createVideoContext(videoId) ---> videoContext.stop()
      2. 如何找到上一个播放的视频的上下文对象
      3. 单例模式： 批量生产同类型对象的时候始终赋值给一个变量, 节省内存
      4. 如何确保点击播放的视频和上一个播放的视频不是同一个，才停止播放 ---> videoId
    
    */ 

    let videoId = event.currentTarget.id;
    // this.videoContext = undefined || 上一个播放的视频的上下文对象
    this.videoId !== videoId && this.videoContext && this.videoContext.stop();
    // if(this.videoId !== videoId){
    //   if(this.videoContext){
    //     this.videoContext.stop();
    //   }
    // }
    this.videoId = videoId;
    this.videoContext = wx.createVideoContext(videoId);
    // videoContext.stop();
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