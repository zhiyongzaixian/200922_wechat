import PubSub from 'pubsub-js';
import MyPubSub from '../../utils/myPubSub';

import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [], // 推荐歌曲列表数据
    index: 0, // 点击播放音乐的下标
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

    // 订阅 来自songDetail发布的消息 
    MyPubSub.subscribe('switchType', (switchType) => {
      // console.log('来自songDetail发布的消息: ');
      // console.log(msg, switchType);

      /*
        需求： 
          1. 知道当前音乐是哪一首
          2. 已知了切歌类型，需要计算上一下或者下一首
      
      */ 
      let {index, recommendList} = this.data;
      if(switchType === 'pre'){ // 上一首
        index -= 1;
      }else { // 下一首
        index += 1;
      }
      // 计算最新的音乐musicId
      let musicId = recommendList[index].id;
      // 将最新的 musicId 发布给 songDetail详情页
      MyPubSub.publish('musicId', musicId)

    });
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
    let {song, index} = event.currentTarget.dataset;
    this.setData({
      index
    })
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