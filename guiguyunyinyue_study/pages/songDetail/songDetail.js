import PubSub from 'pubsub-js';
import request from '../../utils/request'
const appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 标识音乐是否播放
    songDetail: {}, // 歌曲详情对象
    musicId: '', // 音乐的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options: 接收路由跳转参数 query参数
    // console.log(options)
    // let a = "{}"
    // json字符串： json对象 || json数组
    // 原生小程序对query参数有长度限制，如果长度过长会自动截取
    // let song = JSON.parse(options.song);

    let musicId = options.musicId;
    this.setData({
      musicId
    })
    this.getSongDetail(musicId);

    // 判断当前页面音乐是否在播放；
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      // 当前音乐在播放
      this.setData({
        isPlay: true
      })
    }

    // 创建控制音频播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // 监听音乐播放
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true);
      appInstance.globalData.musicId = musicId;
    });

    // 监听音乐暂停
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false);
    });

    // 监听音乐停止
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false);
    });
  },

  // 封装修改状态的功能函数
  changePlayState(isPlay){
    this.setData({
      isPlay
    })

    // 修改全局播放状态
    appInstance.globalData.isMusicPlay = isPlay;
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
    let musicId = this.data.musicId;
    this.musicControl(isPlay, musicId);
  },

  // 封装控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId){
    
    if(isPlay){ // 音乐播放

      // 获取音频播放地址
      let musicLinkData = await request('/song/url', {id: musicId});
      let musicLink = musicLinkData.data[0].url;
     
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.songDetail.name;

      // 修改全局音乐播放的记录
      appInstance.globalData.isMusicPlay = true;
      appInstance.globalData.musicId = musicId;
    }else { // 音乐暂停
      this.backgroundAudioManager.pause();
      appInstance.globalData.isMusicPlay = false;
      
    }
  },


  // 点击切歌的回调
  handleSwitch(event){
    let type = event.currentTarget.id;
    console.log(type);
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