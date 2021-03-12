import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannersList: [], // 轮播图数据
    recommendList: [],// 推荐歌曲数据
    topList: [], // 排行榜数据
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

    // 获取排行榜数据
    /*
      idx: 0-20
      需求： 0-4

    */
    let index = 0;
    let topListArr = [];
    while(index < 5){
      let topListResult = await request('/top/list', {idx: index++});
      // slice 截取不会影响原数组 splice可以对数组进行增删改，会影响原数组 
      let obj = {name: topListResult.playlist.name, tracks: topListResult.playlist.tracks.slice(0, 3)};
      topListArr.push(obj);
      // 用户等待时间较短，体验较好，会渲染多次，会导致项目性能变差
      this.setData({
        topList: topListArr
      })
    }

    // 更新状态数据, 等待时间比较久，用户体验较差， 只需要渲染一次
    // this.setData({
    //   topList: topListArr
    // })

  
    
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