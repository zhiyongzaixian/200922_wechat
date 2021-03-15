import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], // 导航标签数据
    navId: '', // 导航标签的id
    videoList: [], // 视频列表数据
    videoId: '', // 视频id标识
    videoUpdateTime: [], // 存放视频播放时长的数据
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if(wx.getStorageSync('userInfo')){
      this.getVideoGroupData();
    }else {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
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

    // 关闭正在加载提示
    wx.hideLoading();
    this.setData({
      videoList
    })
  },

  // 点击导航的回调
  changeNav(event){
    // let navId = event.currentTarget.id; // 通过id获取标识数据会自动将number转换成string
    let navId = event.currentTarget.dataset.id;
    this.setData({
      navId: navId>>>0,
      videoList: []
    })
    // 显示正在加载
    wx.showLoading({
      title: '正在加载',
    })
    // 获取当前导航下的最新视频数据
    this.getVideoList(this.data.navId);
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
    this.setData({
      videoId
    })
    // this.videoContext = undefined || 上一个播放的视频的上下文对象
    // 解决多个视频同时播放问题
    // this.videoId !== videoId && this.videoContext && this.videoContext.stop();
    // this.videoId = videoId;
    this.videoContext = wx.createVideoContext(videoId);
    // 判断当前视频之前是否被播放过
    let {videoUpdateTime} = this.data;
    let videoObj = videoUpdateTime.find(item => item.videoId === videoId);
    if(videoObj){
      // 跳转至指定的位置
      this.videoContext.seek(videoObj.currentTime);
    }
    this.videoContext.play();
    // videoContext.stop();
  },

  // 视频播放进度的回调
  handleTimeUpdate(event){
    console.log(event);
    let {videoUpdateTime, videoId} = this.data;
    let obj = {currentTime: event.detail.currentTime, videoId};
    /*
    思路： 判断videoUpdateTime中是否有当前视频相关对象
      1. 如果没有，直接push
      2. 如果已有，在原有基础上修改currentTime
    */ 
    let videoObj = videoUpdateTime.find(item => item.videoId === videoId);
    if(!videoObj){
      // 之前没有
      videoUpdateTime.push(obj);
    }else {
      // 已有该对象
      videoObj.currentTime = event.detail.currentTime;
    }

    this.setData({
      videoUpdateTime
    })
    
  },

  // 视频播放结束的回调
  handleEnded(){
    // 清除 videoUpdateTime 中记录当前视频播放时长的对象
    let {videoUpdateTime, videoId} = this.data;
    // videoUpdateTime.splice(index, number);
    // let index = videoUpdateTime.findIndex(item => item.videoId === videoId)
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.videoId === videoId), 1);
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