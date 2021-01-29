var app = getApp()
var common = require('../../../common/common.js')
import {
  Tab
} from '../../../model/tab-model.js';
const tab = new Tab();
Page({
  onShareAppMessage: function(options) {
    var itemid = this.data.itemid;
    return {
      title: '大量采购商在找货源，发布您的供应，让买家找到您！',
      desc: '本衣优质服装供求平台',
      path: '/pages/buy/pages/qgxq/qgxq?itemid=' + itemid
    }
    this.options.is_share == 0;
  },
  data: {
    options: {},
    good: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    right: '>',
    systeminfo: ''
  },
  onLoad: function(options) {
    if (options.r == 1) {
      common.createvideoAd('adunit-290a8ed39af1b39b', '/pages/tabBar/buy/buy');
    }
    this.getphonesystem();
    var sysinfo = this.data.systeminfo
    var sys = sysinfo.indexOf("iOS") != -1
    this.setData({
      sys: sys
    })
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading',
    })
    this.setData({
      itemid: options.itemid,
      options: options
    })
    var that = this
    tab.getStorage('storage', (res) => {
      that.setData({
        storage: res.data[0],
        groupid: res.data[2],
        username: res.data[3],
      })
      that.getGoodsData(res)
    })
  },

  //判断是ios还是安卓手机
  getphonesystem: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          systeminfo: res.system // 这里会显示手机系统信息
        });
      },
    })
  },

  // 获取商店详情数据
  getGoodsData: function(res) {
    var that = this;
    tab.getDataFromServer('vipapi/getBuyDetail', {
      itemid: that.data.itemid,
      username: res.data[3],
    }, (res) => {
      var good = res.data.data;
      that.setData({
        good: good
      });
      wx.hideToast();
    })
  },

  tishi: function(e) {
    var uid = e.target.dataset.name
    if (!uid) {
      tab.showModal('提示', '请点查看联系方式上方授权按钮，方可使用！')
      return false
    } else {
      tab.showModal('提示', '亲，您每日2次免费查看求购联系方式的次数已用完，请明天再来~您可购买供货通服务，198元/年，每天可无限查看求购信息联系方式，助您及时抓住商机！', (res) => {
        wx.navigateTo({
          url: '/pages/pay/pages/qgpay/qgpay'
        })
      })
    }
  },
  //拨打电话
  mobile: function(e) {
    var num = e.currentTarget.dataset.name
    wx.makePhoneCall({
      phoneNumber: num
    })
  },

  onGotUserInfo: function(e) { //重新获取用户信息
    var that = this
    var userInfo = e.detail.userInfo
    app.globalData.userInfo = userInfo
    that.setData({
      userInfo: userInfo,
    })
    wx.login({
      success: function(ress) {
        var code = ress.code
        tab.getDataFromServer('vipapi/creatUserNew', {
          userinfo: userInfo,
          code: code,
          nickName: userInfo.nickName,
          sex: userInfo.gender,
        }, (res) => {
          if (res.data[1] == 1) {
            tab.showModal('提示', res.data[0])
            return false
          }
          that.setData({
            storage: res.data[0],
            openid: res.data[1],
            groupid: res.data[2],
            username: res.data[3],
          })
          tab.setStorage('storage', res.data)
          that.getGoodsData(res)
        })
      }
    })
  },

  //点击图片预览函数
  aaa: function(e) {
    var a = e.target.dataset.name
    var b = e.target.dataset.hi
    var c = e.target.dataset.nam
    var d = e.target.dataset.nm
    if (b.length > 0 && c.length == 0 && d.length == 0) {
      var s = [b]
    } else if (c.length > 0 && b.length == 0 && d.length == 0) {
      var s = [c]
    } else if (d.length > 0 && b.length == 0 && c.length == 0) {
      var s = [d]
    } else if (b.length > 0 && c.length > 0 && d.length == 0) {
      var s = [b, c]
    } else if (b.length > 0 && d.length > 0 && c.length == 0) {
      var s = [b, d]
    } else if (c.length > 0 && d.length > 0 && b.length == 0) {
      var s = [c, d]
    } else {
      var s = [b, c, d]
    }
    wx.previewImage({
      current: a, // 当前显示图片的http链接
      urls: s // 需要预览的图片http链接列表
    })
  },

})