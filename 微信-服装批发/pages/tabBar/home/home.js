var app = getApp()
import {
  Tab
} from '../../model/tab-model.js';
const tab = new Tab();
Page({
  onShareAppMessage: function() {
    return {
      title: '发布平台，大量采购商在找货源，发布您的批发供求信息，让买家找到您！',
      desc: '本衣优质服装供求平台',
      path: '/pages/tabBar/home/home'
    }
  },
  data: {
    moreText: 'none',
    goodslist: [],
    reply: 'none',
    page: 1,
    clientHeight: 0,
    arr: [],
    arrHight: [],
    systeminfo: '',
    nav:[
      {name:'女装',cid:890},
      { name: '童装', cid: 893 },
      { name: '男装', cid: 892 },
      { name: '母婴', cid: 891 },
      { name: '鞋子', cid: 894 },
      { name: '箱包', cid: 895 },
      { name: '运动', cid: 9 },
      { name: '辅料', cid: 10 },
      { name: '道具', cid: 12 },
      { name: '设备', cid: 13 },
      { name: '其他', cid: 32 }
    ]
  },
  //导航分类跳转的方法
  nav:function(e){
    console.log(e)
    var _this = this
    var cid = e.currentTarget.dataset.cid
    if (app.globalData.dyxx) {
      wx.requestSubscribeMessage({
        tmplIds: [app.globalData.qdtx_template_id],
        success(res) {
          console.log(res[app.globalData.qdtx_template_id])
          if (res[app.globalData.qdtx_template_id] == 'accept') {
            app.globalData.dyxx = false
            tab.getDataFromServer('vipapi/addTemplate', {
              openid: _this.data.openid,
              template_id: app.globalData.qdtx_template_id
            }, (res) => {
              console.log(res)
              
            })
          }
        }
      })
    }
    // wx.navigateTo({
    //   url: '/pages/sell/pages/categroy/categroy?catid='+cid,
    // })
  },

  // 获取商品数据
  getGoodsData: function(options) {
    this.setData({
      hidden: false
    });
    wx.showNavigationBarLoading();
    var _this = this;
    var tarrHight = [];
    tab.getDataFromServer('vipapi/getNew', {
      page: _this.data.page
    }, (res) => {
      var windowWidth = _this.data.windowWidth
      wx.hideNavigationBarLoading();
      if (_this.data.page < 2) {
        var arr = [];
        var length = Array.from(res.data.data).length;
        for (var i = 0; i < length; i++) {
          arr[i] = false;
          tarrHight[i] = Math.floor(i / 2) * (windowWidth / 750) * 414;
        }
        for (var i = 0; i < 6; i++) {
          if (arr[i] == false) {
            arr[i] = true;
          }
        }
        _this.setData({
          goodslist: res.data.data,
          style: 'block',
          reply: 'none',
          on: 'none',
          hidden: true,
          arr: arr,
          arrHight: tarrHight
        })
      } else {
        var arr = [];
        var goodslist = _this.data.goodslist;
        for (var i = 0; i < res.data.data.length; i++) {
          goodslist.push(res.data.data[i]);
        }
        var length = Array.from(goodslist).length;
        for (var i = 0; i < length; i++) {
          arr[i] = false;
          tarrHight[i] = Math.floor(i / 2) * (windowWidth / 750) * 414;
        }
        var seeHeight = _this.data.clientHeight;
        for (var i = 0; i < _this.data.goodslist.length; i++) {
          if (tarrHight[i] < _this.data.scrollTop + seeHeight) {
            if (arr[i] == false) {
              arr[i] = true;
            }
          }
        }
        _this.setData({
          goodslist: goodslist,
          style: 'block',
          reply: 'none',
          on: 'none',
          hidden: true,
          arr: arr,
          arrHight: tarrHight
        });
      }
    }, () => {
      wx.hideNavigationBarLoading();
      _this.setData({
        style: 'none',
        reply: 'block',
      })
    })
  },

  onLoad: function() {
    var _this = this;
    _this.getGoodsData();
    // tab.getStorage('storage', (res) => {
    //   _this.setData({
    //     storage: res.data[0],
    //     groupid: res.data[2],
    //   })
    // })
    this.getphonesystem()
    var sysinfo = this.data.systeminfo
    var sys = sysinfo.indexOf("iOS") != -1
    if (sys) {
      this.setData({
        block: 'none' // 这里ios会影藏认证的标识
      });
    } else {
      this.setData({
        block: 'block' // 这里ios会显示认证的标识
      });
    }

    var userinfo = wx.getStorageSync("storage")
    if (userinfo) { //获取缓存数据
      var openid = userinfo[1]
      _this.setData({
        storage: userinfo[0],
        openid:openid,
        groupid: userinfo[2],
      })
      if(openid){
        tab.getDataFromServer('vipapi/getQx', {
          openid: openid,
          template_id: app.globalData.qdtx_template_id
        }, (res) => {
          console.log(res)
          res.data == 1 ? app.globalData.dyxx = false : app.globalData.dyxx = true
        })
      }
      
    } else {
      app.userInfoCallback = userInfo => {
        console.log(userInfo)
        var openid = userInfo[1]
        _this.setData({
          storage: userInfo[0],
          openid: openid,
          groupid: userInfo[2],
        })
        if (openid) {
          tab.getDataFromServer('vipapi/getQx', {
            openid: openid,
            template_id: app.globalData.qdtx_template_id
          }, (res) => {
            console.log(res)
            res.data == 1 ? app.globalData.dyxx = false : app.globalData.dyxx = true
          })
        }
      }
    }
  },

  //判断是ios还是安卓手机
  getphonesystem: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          systeminfo: res.system, // 这里会显示手机系统信息
          clientHeight: res.windowHeight,
          windowWidth: res.windowWidth
        });
      },
    })
  },

  scroll: function(e) {
    var seeHeight = this.data.clientHeight; //可见区域高度  
    var arrHight = this.data.arrHight;
    var scrollTop = e.detail.scrollTop;
    var arr = this.data.arr;
    for (var i = 0; i < this.data.goodslist.length; i++) {
      if (arrHight[i] < scrollTop + seeHeight) {
        if (arr[i] == false) {
          arr[i] = true;
        }
      }
    }
    this.setData({
      arr: arr,
      scrollTop: scrollTop
    })
  },

  pullDownRefresh: function(e) {
    console.log("下拉刷新....")
    this.setData({
      page: 1,
      on: 'block'
    });
    this.getGoodsData();
  },

  pullUpLoad: function(e) {
    var _page = this.data.page + 1;
    if (_page <= 100) {
      this.setData({
        page: _page,
        on: 'block',
        moreText: "none"
      });
      this.getGoodsData();
    } else {
      this.setData({
        moreText: "block"
      });
    }
  },
  //供应信息搜索框
  formSubmit: function(e) {
    var formData = e.detail.value;
    var word = formData.rsearch.trim()
    if (!word) {
      tab.showModal('提示','请填写关键词！')
      return false;
    }
    wx.navigateTo({
      url: "/pages/sell/pages/search/search?word=" + word
    })
  },
})