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
    triggered: false, // 下拉刷新是否被触发
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
      videoList,
      triggered: false
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
    this.setData({
      videoUpdateTime
    })
  },

  // scroll-view的下拉刷新回调
  handleRefresher(){
    // 发请求获取最新的数据
    this.getVideoList(this.data.navId);
  },

  // scroll-view上拉触底事件的回调
  handleScrollLower(){
    console.log('上拉触底。。。')
    /*
      数据分页功能： 100条为例， 一次显示10条
        1. 前端分页
          -1 后端会一次性把所有的数据100条返回给客户端交给前端人员处理
          -2 前端人员对数组进行截取，每次取10条，渲染
        2. 后端分页
          -1 后端提前处理数据，一次只返回10条数据给客户端
          -2 需要前端发请求携带参数： page=页数&&size=个数
    */ 
    // 模拟数据
    let newVideoList = [
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_97948753784121CAE152DB5516D406FB",
              "coverUrl": "https://p2.music.126.net/XFsyv-5v7N6WvLhApqMi9Q==/109951163800528917.jpg",
              "height": 720,
              "width": 1280,
              "title": "杨丞琳出现潘玮柏演唱会现场引泪崩！ 小猪像在台下看戏的...",
              "description": "杨丞琳出现潘玮柏演唱会现场引泪崩！ 小猪像在台下看戏的...哈哈哈哈哈哈你帮我唱两首歌,我去哭一下先。论有一个歌手朋友的好处！",
              "commentCount": 192,
              "shareCount": 154,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 75143837
                  },
                  {
                      "resolution": 480,
                      "size": 129100511
                  },
                  {
                      "resolution": 720,
                      "size": 189780906
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 330000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/ygWgsfyGGQD8TDDrZzwG5g==/109951163650262938.jpg",
                  "accountStatus": 0,
                  "gender": 1,
                  "city": 330100,
                  "birthday": 844272000000,
                  "userId": 1664436531,
                  "userType": 0,
                  "nickname": "音乐点",
                  "signature": "投诉建议微博@音乐点",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 109951163650262940,
                  "backgroundImgId": 109951162868126480,
                  "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": {
                      "1": "视频达人(欧美、华语、音乐现场)"
                  },
                  "djStatus": 0,
                  "vipType": 0,
                  "remarkName": null,
                  "backgroundImgIdStr": "109951162868126486",
                  "avatarImgIdStr": "109951163650262938",
                  "avatarImgId_str": "109951163650262938"
              },
              "urlInfo": {
                  "id": "97948753784121CAE152DB5516D406FB",
                  "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/85nSvC4x_2260369135_shd.mp4?ts=1615791905&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=ZKxviSnPAKKqOfALMDTaTufzgqaiypif&sign=cd06df8fadf8db1f1ece4214c9145907&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Sa0j3qVDqFFz1htftC8htI2Gw8COIJSzHpoMZPf/N9qRC9BUFvXIcmXphtAMk13t+gcQ72Bb/ElrwO/qnzFrjd3IWHu5akxN2q/o1Np5jhoC1",
                  "size": 189780906,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 720
              },
              "videoGroup": [
                  {
                      "id": 94113,
                      "name": "杨丞琳",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 59101,
                      "name": "华语现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 59108,
                      "name": "巡演现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 57108,
                      "name": "流行现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": "groupTagRank"
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "97948753784121CAE152DB5516D406FB",
              "durationms": 836970,
              "playTime": 538227,
              "praisedCount": 2598,
              "praised": false,
              "subscribed": false
          }
      },
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_32768492F390E6FCAF3D415D8A939535",
              "coverUrl": "https://p2.music.126.net/Capzzj9TiNoTiiQCYquRng==/109951163906936057.jpg",
              "height": 1080,
              "width": 1920,
              "title": "Nadezhda Aleksandrova - Wicked Game(The Voice Bulgaria)",
              "description": "Nadezhda Aleksandrova - Wicked Game(The Voice Bulgaria)",
              "commentCount": 28,
              "shareCount": 105,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 13405578
                  },
                  {
                      "resolution": 480,
                      "size": 26891681
                  },
                  {
                      "resolution": 720,
                      "size": 40718101
                  },
                  {
                      "resolution": 1080,
                      "size": 60143471
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 320000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/fzQHvzcuOyJX41PCfN8OCQ==/109951164426031658.jpg",
                  "accountStatus": 0,
                  "gender": 1,
                  "city": 320500,
                  "birthday": -2209017600000,
                  "userId": 134733911,
                  "userType": 204,
                  "nickname": "cycmx",
                  "signature": "",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 109951164426031660,
                  "backgroundImgId": 109951164125634980,
                  "backgroundUrl": "http://p1.music.126.net/64s4Y0IcTocyWkvFpI1N_Q==/109951164125634970.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": {
                      "1": "音乐视频达人"
                  },
                  "djStatus": 0,
                  "vipType": 10,
                  "remarkName": null,
                  "backgroundImgIdStr": "109951164125634970",
                  "avatarImgIdStr": "109951164426031658",
                  "avatarImgId_str": "109951164426031658"
              },
              "urlInfo": {
                  "id": "32768492F390E6FCAF3D415D8A939535",
                  "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/1nE0LKp6_2356471291_uhd.mp4?ts=1615791905&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=ZAZUWLFjWRfnZBFBUHKYgVnMNDgYEfRG&sign=dee703df6f5f1764b0196d7b24d18398&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Sa0j3qVDqFFz1htftC8htI2Gw8COIJSzHpoMZPf/N9qRC9BUFvXIcmXphtAMk13t+gcQ72Bb/ElrwO/qnzFrjd3IWHu5akxN2q/o1Np5jhoC1",
                  "size": 60143471,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 1080
              },
              "videoGroup": [
                  {
                      "id": -12960,
                      "name": "#《五十度灰》Fifty Shades of Grey ★ 全版#",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 94106,
                      "name": "选秀节目",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 75122,
                      "name": "欧美综艺",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 76108,
                      "name": "综艺片段",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 3101,
                      "name": "综艺",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 4101,
                      "name": "娱乐",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": "groupTagRank"
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [
                  {
                      "name": "Wicked Game",
                      "id": 1147363,
                      "pst": 0,
                      "t": 0,
                      "ar": [
                          {
                              "id": 29984,
                              "name": "Chris Isaak",
                              "tns": [],
                              "alias": []
                          }
                      ],
                      "alia": [],
                      "pop": 75,
                      "st": 0,
                      "rt": "600902000000370252",
                      "fee": 8,
                      "v": 8,
                      "crbt": null,
                      "cf": "",
                      "al": {
                          "id": 118857,
                          "name": "Wicked Game",
                          "picUrl": "http://p4.music.126.net/Yv4chC95xvOpB1Ucwkavmg==/6631154627257230.jpg",
                          "tns": [],
                          "pic": 6631154627257230
                      },
                      "dt": 289000,
                      "h": {
                          "br": 320000,
                          "fid": 0,
                          "size": 11579784,
                          "vd": 9586
                      },
                      "m": {
                          "br": 192000,
                          "fid": 0,
                          "size": 6947960,
                          "vd": 13117
                      },
                      "l": {
                          "br": 128000,
                          "fid": 0,
                          "size": 4632048,
                          "vd": 13071
                      },
                      "a": null,
                      "cd": "1",
                      "no": 1,
                      "rtUrl": null,
                      "ftype": 0,
                      "rtUrls": [],
                      "djId": 0,
                      "copyright": 1,
                      "s_id": 0,
                      "mst": 9,
                      "cp": 405025,
                      "mv": 0,
                      "rtype": 0,
                      "rurl": null,
                      "publishTime": 928080000007,
                      "privilege": {
                          "id": 1147363,
                          "fee": 8,
                          "payed": 0,
                          "st": 0,
                          "pl": 128000,
                          "dl": 0,
                          "sp": 7,
                          "cp": 1,
                          "subp": 1,
                          "cs": false,
                          "maxbr": 999000,
                          "fl": 128000,
                          "toast": false,
                          "flag": 256,
                          "preSell": false
                      }
                  }
              ],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "32768492F390E6FCAF3D415D8A939535",
              "durationms": 147610,
              "playTime": 66326,
              "praisedCount": 421,
              "praised": false,
              "subscribed": false
          }
      },
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_E099636956AFA76743613365919F9882",
              "coverUrl": "https://p2.music.126.net/hujxY2YV5XZ1YDSDXBrjxA==/109951165354009230.jpg",
              "height": 360,
              "width": 640,
              "title": "ZARD - 負けないで(別認輸) [主唱:坂井泉水]",
              "description": null,
              "commentCount": 52,
              "shareCount": 119,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 15547900
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 350000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/OhZOh-sLqNg6HGRdiHji4A==/109951165219390178.jpg",
                  "accountStatus": 0,
                  "gender": 1,
                  "city": 350200,
                  "birthday": 922711250126,
                  "userId": 376276492,
                  "userType": 0,
                  "nickname": "南博哥哥吖",
                  "signature": "do not forget the beginning of the heart must always be all the time i am me clover. 喜欢就请关注我 （美丽）（帅气）（可爱）如你💓",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 109951165219390180,
                  "backgroundImgId": 109951165173637400,
                  "backgroundUrl": "http://p1.music.126.net/aJ68YfCdgI2u_qnOAKlVWA==/109951165173637415.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": null,
                  "djStatus": 10,
                  "vipType": 0,
                  "remarkName": null,
                  "backgroundImgIdStr": "109951165173637415",
                  "avatarImgIdStr": "109951165219390178",
                  "avatarImgId_str": "109951165219390178"
              },
              "urlInfo": {
                  "id": "E099636956AFA76743613365919F9882",
                  "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/csGbaTlc_3140926979_sd.mp4?ts=1615791905&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=RVjLDDRZdqjOgVBIMgIEbXkxROWeCQXH&sign=7cf3475c7592a48828ed7a0ac3122fed&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Sa0j3qVDqFFz1htftC8htI2Gw8COIJSzHpoMZPf/N9qRC9BUFvXIcmXphtAMk13t+gcQ72Bb/ElrwO/qnzFrjd3IWHu5akxN2q/o1Np5jhoC1",
                  "size": 15547900,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 240
              },
              "videoGroup": [
                  {
                      "id": 12100,
                      "name": "流行",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 15116,
                      "name": "日语",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 13164,
                      "name": "快乐",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": "groupTagRank"
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": [
                  109
              ],
              "relateSong": [],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "E099636956AFA76743613365919F9882",
              "durationms": 230550,
              "playTime": 34257,
              "praisedCount": 448,
              "praised": false,
              "subscribed": false
          }
      },
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_2BF7324F22608D89C4FBA31798BDBF3B",
              "coverUrl": "https://p2.music.126.net/aUARJa8pm5DDM0eiFR-fPQ==/109951163573475984.jpg",
              "height": 1080,
              "width": 1920,
              "title": "当街头响起Imagine这首史上最伟大歌曲之一时，警察都前来欣赏。",
              "description": "当街头响起 Imagine 这首史上最伟大歌曲之一时，警察都前来欣赏。",
              "commentCount": 2255,
              "shareCount": 2906,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 35537769
                  },
                  {
                      "resolution": 480,
                      "size": 61755592
                  },
                  {
                      "resolution": 720,
                      "size": 91418705
                  },
                  {
                      "resolution": 1080,
                      "size": 153059934
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 450000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/lVTaNtFdNVh2HhD0ORhAaA==/109951163601870551.jpg",
                  "accountStatus": 0,
                  "gender": 1,
                  "city": 450100,
                  "birthday": 692121600000,
                  "userId": 255096203,
                  "userType": 0,
                  "nickname": "John_分享",
                  "signature": "用音乐点缀怒放的生命。",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 109951163601870540,
                  "backgroundImgId": 109951163285208750,
                  "backgroundUrl": "http://p1.music.126.net/lpOxaFlD6ems9969KHltcg==/109951163285208749.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": {
                      "1": "音乐视频达人"
                  },
                  "djStatus": 10,
                  "vipType": 0,
                  "remarkName": null,
                  "backgroundImgIdStr": "109951163285208749",
                  "avatarImgIdStr": "109951163601870551",
                  "avatarImgId_str": "109951163601870551"
              },
              "urlInfo": {
                  "id": "2BF7324F22608D89C4FBA31798BDBF3B",
                  "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/z1EYLUFH_1576597192_uhd.mp4?ts=1615791905&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=rELiWBoaWXvasQhbOthjYGzXHelfcUgh&sign=49fcdcc31385ce112bbc9ff89af3ff94&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Sa0j3qVDqFFz1htftC8htI2Gw8COIJSzHpoMZPf/N9qRC9BUFvXIcmXphtAMk13t+gcQ72Bb/ElrwO/qnzFrjd3IWHu5akxN2q/o1Np5jhoC1",
                  "size": 153059934,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 1080
              },
              "videoGroup": [
                  {
                      "id": -11840,
                      "name": "#★【欧美】至尊经典合集★#",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 59106,
                      "name": "街头表演",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 14242,
                      "name": "伤感",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 14212,
                      "name": "欧美音乐",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 12100,
                      "name": "流行",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 23116,
                      "name": "音乐推荐",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": "groupTagRank"
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [
                  {
                      "name": "Imagine",
                      "id": 26961953,
                      "pst": 0,
                      "t": 0,
                      "ar": [
                          {
                              "id": 35333,
                              "name": "John Lennon",
                              "tns": [],
                              "alias": []
                          }
                      ],
                      "alia": [],
                      "pop": 100,
                      "st": 0,
                      "rt": "",
                      "fee": 8,
                      "v": 8,
                      "crbt": null,
                      "cf": "",
                      "al": {
                          "id": 2576598,
                          "name": "Remember",
                          "picUrl": "http://p4.music.126.net/_jlw8clvDpHLNLVjSCP8zA==/5726256557541976.jpg",
                          "tns": [],
                          "pic": 5726256557541976
                      },
                      "dt": 183000,
                      "h": {
                          "br": 320000,
                          "fid": 0,
                          "size": 7344740,
                          "vd": -4900
                      },
                      "m": {
                          "br": 192000,
                          "fid": 0,
                          "size": 4406905,
                          "vd": -2300
                      },
                      "l": {
                          "br": 128000,
                          "fid": 0,
                          "size": 2937988,
                          "vd": -600
                      },
                      "a": null,
                      "cd": "1",
                      "no": 10,
                      "rtUrl": null,
                      "ftype": 0,
                      "rtUrls": [],
                      "djId": 0,
                      "copyright": 1,
                      "s_id": 0,
                      "mst": 9,
                      "cp": 655010,
                      "mv": 503077,
                      "rtype": 0,
                      "rurl": null,
                      "publishTime": 1225814400007,
                      "privilege": {
                          "id": 26961953,
                          "fee": 8,
                          "payed": 0,
                          "st": 0,
                          "pl": 128000,
                          "dl": 0,
                          "sp": 7,
                          "cp": 1,
                          "subp": 1,
                          "cs": false,
                          "maxbr": 320000,
                          "fl": 128000,
                          "toast": false,
                          "flag": 256,
                          "preSell": false
                      }
                  }
              ],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "2BF7324F22608D89C4FBA31798BDBF3B",
              "durationms": 200807,
              "playTime": 6157261,
              "praisedCount": 28365,
              "praised": false,
              "subscribed": false
          }
      },
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_B9AE93FDACC613DDEE3B60A985308B01",
              "coverUrl": "https://p2.music.126.net/rzVV9DNnUBM0ObdARINiJw==/109951163252358001.jpg",
              "height": 720,
              "width": 1280,
              "title": "T-ara Bo Peep Bo Peep 现场版，喜欢就关注吧",
              "description": " T-ara     Bo Peep Bo Peep 现场版，喜欢就关注吧，每天更新",
              "commentCount": 424,
              "shareCount": 421,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 50525436
                  },
                  {
                      "resolution": 480,
                      "size": 91649663
                  },
                  {
                      "resolution": 720,
                      "size": 144347912
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 110000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/xkNKgO3OVb5-f2ImiYyBsw==/109951163836855570.jpg",
                  "accountStatus": 0,
                  "gender": 2,
                  "city": 110101,
                  "birthday": 646416000000,
                  "userId": 344107898,
                  "userType": 0,
                  "nickname": "皇冠团敏敏敏",
                  "signature": "T-ara的团名意思是皇冠，有要成为歌谣界女王的寓意，所以俗称皇冠团Queen's代表着“女王”、“女王的所有”等意义，表明T-ara是Queen‘s的拥有者所以T-ara的粉丝被称为Queen's",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 109951163836855570,
                  "backgroundImgId": 109951163247631330,
                  "backgroundUrl": "http://p1.music.126.net/UI7BI9nDoJWR_BqkmZFqzw==/109951163247631332.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": null,
                  "djStatus": 0,
                  "vipType": 0,
                  "remarkName": null,
                  "backgroundImgIdStr": "109951163247631332",
                  "avatarImgIdStr": "109951163836855570",
                  "avatarImgId_str": "109951163836855570"
              },
              "urlInfo": {
                  "id": "B9AE93FDACC613DDEE3B60A985308B01",
                  "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/DLhhWKeN_1498433435_shd.mp4?ts=1615791905&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=bhZnmbNJnxEgbOJdLmrzPJkMRtzZQYOP&sign=76bc2af4a9d8dfa058a938001eaaa521&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Sa0j3qVDqFFz1htftC8htI2Gw8COIJSzHpoMZPf/N9qRC9BUFvXIcmXphtAMk13t+gcQ72Bb/ElrwO/qnzFrjd3IWHu5akxN2q/o1Np5jhoC1",
                  "size": 144347912,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 720
              },
              "videoGroup": [
                  {
                      "id": -21580,
                      "name": "#T-ara#",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 9127,
                      "name": "T-ara",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 13164,
                      "name": "快乐",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 57107,
                      "name": "韩语现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 59108,
                      "name": "巡演现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 57108,
                      "name": "流行现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": "groupTagRank"
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "B9AE93FDACC613DDEE3B60A985308B01",
              "durationms": 259392,
              "playTime": 790162,
              "praisedCount": 3493,
              "praised": false,
              "subscribed": false
          }
      },
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_52A8D1A13D7C70DCACB622084DD85C01",
              "coverUrl": "https://p2.music.126.net/g53aPrTrCn0kKW_MNP96FA==/109951163573461886.jpg",
              "height": 1080,
              "width": 1920,
              "title": "【皇冠战歌】T-ARA - Number Nine(131013)",
              "description": "皇冠团经典战歌系列现场回顾",
              "commentCount": 815,
              "shareCount": 1183,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 64120879
                  },
                  {
                      "resolution": 480,
                      "size": 124504253
                  },
                  {
                      "resolution": 720,
                      "size": 206601721
                  },
                  {
                      "resolution": 1080,
                      "size": 558990127
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 1000000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/_RMfyoBvxi_B477jQvcZtQ==/109951164872628349.jpg",
                  "accountStatus": 0,
                  "gender": 1,
                  "city": 1004400,
                  "birthday": 840556800000,
                  "userId": 34616088,
                  "userType": 204,
                  "nickname": "LA角斗士",
                  "signature": "Stay Alive",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 109951164872628350,
                  "backgroundImgId": 109951163484001120,
                  "backgroundUrl": "http://p1.music.126.net/2HvSVB6h_ydXsfyu1K2oig==/109951163484001128.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": {
                      "1": "音乐视频达人"
                  },
                  "djStatus": 10,
                  "vipType": 11,
                  "remarkName": null,
                  "backgroundImgIdStr": "109951163484001128",
                  "avatarImgIdStr": "109951164872628349",
                  "avatarImgId_str": "109951164872628349"
              },
              "urlInfo": {
                  "id": "52A8D1A13D7C70DCACB622084DD85C01",
                  "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/LnFjDgjz_1561447318_uhd.mp4?ts=1615791905&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=oYijKABcEUrwlLXVGIGjldSpNHijiEyS&sign=5ad4314e52ffe5fe1b1c80c4755549e8&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Sa0j3qVDqFFz1htftC8htI2Gw8COIJSzHpoMZPf/N9qRC9BUFvXIcmXphtAMk13t+gcQ72Bb/ElrwO/qnzFrjd3IWHu5akxN2q/o1Np5jhoC1",
                  "size": 558990127,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 1080
              },
              "videoGroup": [
                  {
                      "id": -8008,
                      "name": "#10W+播放#",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 9127,
                      "name": "T-ara",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 16201,
                      "name": "温暖",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 57107,
                      "name": "韩语现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 59108,
                      "name": "巡演现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 57108,
                      "name": "流行现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": "groupTagRank"
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [
                  {
                      "name": "NUMBER NINE (Japanese ver.)",
                      "id": 28009077,
                      "pst": 0,
                      "t": 0,
                      "ar": [
                          {
                              "id": 127815,
                              "name": "T-ara",
                              "tns": [],
                              "alias": []
                          }
                      ],
                      "alia": [],
                      "pop": 100,
                      "st": 0,
                      "rt": "",
                      "fee": 0,
                      "v": 19,
                      "crbt": null,
                      "cf": "",
                      "al": {
                          "id": 2709129,
                          "name": "NUMBER NINE (Japanese ver.) / 記憶~君がくれた道標(みちしるべ)~",
                          "picUrl": "http://p3.music.126.net/NWfPKvsUeVprNv0bov6Kyw==/5826312115623975.jpg",
                          "tns": [],
                          "pic": 5826312115623975
                      },
                      "dt": 230280,
                      "h": {
                          "br": 320000,
                          "fid": 0,
                          "size": 9213953,
                          "vd": -33700
                      },
                      "m": {
                          "br": 192000,
                          "fid": 0,
                          "size": 5528389,
                          "vd": -31300
                      },
                      "l": {
                          "br": 128000,
                          "fid": 0,
                          "size": 3685607,
                          "vd": -30200
                      },
                      "a": null,
                      "cd": "1",
                      "no": 1,
                      "rtUrl": null,
                      "ftype": 0,
                      "rtUrls": [],
                      "djId": 0,
                      "copyright": 2,
                      "s_id": 0,
                      "mst": 9,
                      "cp": 663018,
                      "mv": 205047,
                      "rtype": 0,
                      "rurl": null,
                      "publishTime": 1384876800007,
                      "privilege": {
                          "id": 28009077,
                          "fee": 0,
                          "payed": 0,
                          "st": 0,
                          "pl": 320000,
                          "dl": 999000,
                          "sp": 7,
                          "cp": 1,
                          "subp": 1,
                          "cs": false,
                          "maxbr": 999000,
                          "fl": 320000,
                          "toast": false,
                          "flag": 256,
                          "preSell": false
                      }
                  }
              ],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "52A8D1A13D7C70DCACB622084DD85C01",
              "durationms": 230359,
              "playTime": 1883127,
              "praisedCount": 8240,
              "praised": false,
              "subscribed": false
          }
      },
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_834A799CFD81E85869ACD6BDD4970A61",
              "coverUrl": "https://p2.music.126.net/GgBICWHBFA2P6hpVtQTTww==/109951163779566868.jpg",
              "height": 720,
              "width": 1280,
              "title": "来自美帝的中国风！TSFH- Flight of the Silverbird",
              "description": "来自美帝的中国风！Two Steps From Hell - Flight of the Silverbird",
              "commentCount": 576,
              "shareCount": 699,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 19549443
                  },
                  {
                      "resolution": 480,
                      "size": 31986415
                  },
                  {
                      "resolution": 720,
                      "size": 42729956
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 110000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/Iiimb-dJmLy1Wso_vpUNcA==/109951163461227112.jpg",
                  "accountStatus": 0,
                  "gender": 1,
                  "city": 110101,
                  "birthday": -1576224000000,
                  "userId": 348277913,
                  "userType": 204,
                  "nickname": "音乐小纸条儿",
                  "signature": "v： papermusic",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 109951163461227100,
                  "backgroundImgId": 109951162845774200,
                  "backgroundUrl": "http://p1.music.126.net/HZwsIJsbX6mJhsW6wVpXZQ==/109951162845774203.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": {
                      "1": "音乐视频达人",
                      "2": "生活图文达人"
                  },
                  "djStatus": 10,
                  "vipType": 11,
                  "remarkName": null,
                  "backgroundImgIdStr": "109951162845774203",
                  "avatarImgIdStr": "109951163461227112",
                  "avatarImgId_str": "109951163461227112"
              },
              "urlInfo": {
                  "id": "834A799CFD81E85869ACD6BDD4970A61",
                  "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/30LTYcov_2236402189_shd.mp4?ts=1615791905&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=OUfppLNlBMQomfUkXsdFvgOdGAECkhTj&sign=de5e9d2ac212dfde456fa98e413213ce&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Sa0j3qVDqFFz1htftC8htI2Gw8COIJSzHpoMZPf/N9qRC9BUFvXIcmXphtAMk13t+gcQ72Bb/ElrwO/qnzFrjd3IWHu5akxN2q/o1Np5jhoC1",
                  "size": 42729956,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 720
              },
              "videoGroup": [
                  {
                      "id": -12851,
                      "name": "#BGM-史诗级大气磅礴震撼心灵#",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 16152,
                      "name": "交响乐",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 15105,
                      "name": "古典",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 57106,
                      "name": "欧美现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": "groupTagRank"
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [
                  {
                      "name": "Flight Of The Silverbird",
                      "id": 31654464,
                      "pst": 0,
                      "t": 0,
                      "ar": [
                          {
                              "id": 102714,
                              "name": "Two Steps From Hell",
                              "tns": [],
                              "alias": []
                          }
                      ],
                      "alia": [],
                      "pop": 100,
                      "st": 0,
                      "rt": null,
                      "fee": 8,
                      "v": 419,
                      "crbt": null,
                      "cf": "",
                      "al": {
                          "id": 3131119,
                          "name": "Battlecry",
                          "picUrl": "http://p3.music.126.net/n41bSTrQwG_lQzkXz7cygg==/109951163892182787.jpg",
                          "tns": [],
                          "pic_str": "109951163892182787",
                          "pic": 109951163892182780
                      },
                      "dt": 201793,
                      "h": {
                          "br": 320000,
                          "fid": 0,
                          "size": 8073969,
                          "vd": -23000
                      },
                      "m": {
                          "br": 192000,
                          "fid": 0,
                          "size": 4844399,
                          "vd": -20600
                      },
                      "l": {
                          "br": 128000,
                          "fid": 0,
                          "size": 3229613,
                          "vd": -19500
                      },
                      "a": null,
                      "cd": "1",
                      "no": 18,
                      "rtUrl": null,
                      "ftype": 0,
                      "rtUrls": [],
                      "djId": 0,
                      "copyright": 2,
                      "s_id": 0,
                      "mst": 9,
                      "cp": 743010,
                      "mv": 0,
                      "rtype": 0,
                      "rurl": null,
                      "publishTime": 1430150400007,
                      "privilege": {
                          "id": 31654464,
                          "fee": 8,
                          "payed": 0,
                          "st": 0,
                          "pl": 128000,
                          "dl": 0,
                          "sp": 7,
                          "cp": 1,
                          "subp": 1,
                          "cs": false,
                          "maxbr": 999000,
                          "fl": 128000,
                          "toast": false,
                          "flag": 260,
                          "preSell": false
                      }
                  }
              ],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "834A799CFD81E85869ACD6BDD4970A61",
              "durationms": 199831,
              "playTime": 592711,
              "praisedCount": 2826,
              "praised": false,
              "subscribed": false
          }
      },
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_3693A781BFDE0B2F59DB505ED25C9426",
              "coverUrl": "https://p2.music.126.net/YEFeem7_Tmjay9kof-jT2g==/109951163749100837.jpg",
              "height": 960,
              "width": 540,
              "title": "150404 불스레이스 축하공연 AOA 흔들려",
              "description": null,
              "commentCount": 97,
              "shareCount": 214,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 26606347
                  },
                  {
                      "resolution": 480,
                      "size": 45328441
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 500000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/Snn05VWuUdHV2KvBON9ikQ==/109951165516710812.jpg",
                  "accountStatus": 0,
                  "gender": 2,
                  "city": 500101,
                  "birthday": 832521600000,
                  "userId": 1299210887,
                  "userType": 201,
                  "nickname": "韩国音乐现场精选",
                  "signature": "",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 109951165516710820,
                  "backgroundImgId": 109951165395733630,
                  "backgroundUrl": "http://p1.music.126.net/JoV68ORMXbVRqYMDNp28GA==/109951165395733633.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": {
                      "1": "舞蹈视频达人"
                  },
                  "djStatus": 0,
                  "vipType": 0,
                  "remarkName": null,
                  "backgroundImgIdStr": "109951165395733633",
                  "avatarImgIdStr": "109951165516710812",
                  "avatarImgId_str": "109951165516710812"
              },
              "urlInfo": {
                  "id": "3693A781BFDE0B2F59DB505ED25C9426",
                  "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/QErYAWgk_2212586473_hd.mp4?ts=1615791905&rid=3009063014E119FC636C42FBC02D0085&rl=3&rs=zJVubWHfJDDbWEkMoiRWRReMnzmyvsER&sign=d005b0cde3666d718eda07f930c0f28a&ext=f0xw0mOJqGcf8yfMQn4khLo0vOAZ2Oret6FDS9VvANIOB778zOa0GNkWKbpJigsU1/LRXD34eWSbIsfK5Nf586spdEE4Wri2VDcekpyg9chJ4eehs/uQrxQG2oM8W8tL/Rb8Frul7SS5uAWlhL0Sa0j3qVDqFFz1htftC8htI2Gw8COIJSzHpoMZPf/N9qRC9BUFvXIcmXphtAMk13t+gcQ72Bb/ElrwO/qnzFrjd3IWHu5akxN2q/o1Np5jhoC1",
                  "size": 45328441,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 480
              },
              "videoGroup": [
                  {
                      "id": 57107,
                      "name": "韩语现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 57110,
                      "name": "饭拍现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 57108,
                      "name": "流行现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 1101,
                      "name": "舞蹈",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": "groupTagRank"
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": "groupTagRank"
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [
                  {
                      "name": "흔들려",
                      "id": 27836836,
                      "pst": 0,
                      "t": 0,
                      "ar": [
                          {
                              "id": 126312,
                              "name": "AOA",
                              "tns": [],
                              "alias": []
                          }
                      ],
                      "alia": [],
                      "pop": 95,
                      "st": 0,
                      "rt": "",
                      "fee": 8,
                      "v": 31,
                      "crbt": null,
                      "cf": "",
                      "al": {
                          "id": 2685109,
                          "name": "RED MOTION",
                          "picUrl": "http://p3.music.126.net/Qv2x3Nrp-NSza53MjmY0bQ==/109951164742698945.jpg",
                          "tns": [],
                          "pic_str": "109951164742698945",
                          "pic": 109951164742698940
                      },
                      "dt": 222915,
                      "h": {
                          "br": 320000,
                          "fid": 0,
                          "size": 8919293,
                          "vd": -42600
                      },
                      "m": {
                          "br": 192000,
                          "fid": 0,
                          "size": 5351593,
                          "vd": -40000
                      },
                      "l": {
                          "br": 128000,
                          "fid": 0,
                          "size": 3567743,
                          "vd": -38500
                      },
                      "a": null,
                      "cd": "1",
                      "no": 1,
                      "rtUrl": null,
                      "ftype": 0,
                      "rtUrls": [],
                      "djId": 0,
                      "copyright": 1,
                      "s_id": 0,
                      "mst": 9,
                      "cp": 1410822,
                      "mv": 193065,
                      "rtype": 0,
                      "rurl": null,
                      "publishTime": 1381766400007,
                      "tns": [
                          "动摇"
                      ],
                      "privilege": {
                          "id": 27836836,
                          "fee": 8,
                          "payed": 0,
                          "st": 0,
                          "pl": 128000,
                          "dl": 0,
                          "sp": 7,
                          "cp": 1,
                          "subp": 1,
                          "cs": false,
                          "maxbr": 999000,
                          "fl": 128000,
                          "toast": false,
                          "flag": 68,
                          "preSell": false
                      }
                  }
              ],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "3693A781BFDE0B2F59DB505ED25C9426",
              "durationms": 220062,
              "playTime": 391306,
              "praisedCount": 1463,
              "praised": false,
              "subscribed": false
          }
      }
    ]
    let {videoList} = this.data;
    videoList = videoList.concat(newVideoList);
    this.setData({
      videoList
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
    console.log('页面下拉刷新')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('页面上拉触底')

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
    if(from === 'menu'){
      return {
        title: 'menu自定义转发',
        path: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }else {
      return {
        title: 'button自定义转发',
        path: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }
  }
})