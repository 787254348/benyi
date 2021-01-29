var app = getApp()
var common = require('../../common/common.js')
import {
  Tab
} from '../../model/tab-model.js';
const tab = new Tab();
Page({
  data: {
    storage: '',
    right: ">",

  },
  onLoad: function() {
    this.getphonesystem();
    var sysinfo = this.data.systeminfo
    var sys = sysinfo.indexOf("iOS") != -1
    if (sys) {
      this.setData({
        block: 'none' // 这里会显示手机系统信息
      });
    } else {
      this.setData({
        block: 'block' // 这里会显示手机系统信息
      });
    }
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

  onShow: function(e) {
    var that = this
    var userinfo = wx.getStorageSync("storage")
    if (userinfo) { //获取缓存数据
      that.setData({
        storage: userinfo[0],
        groupid: userinfo[2],
      })
      that.showMessageStatus();
    } else {
      app.userInfoCallback = userInfo => {
        that.setData({
          storage: userInfo[0],
          groupid: userInfo[2],
        })
        that.showMessageStatus();
      }
    }
  },

  onGotUserInfo: function(e) { //重新获取用户信息
    var that = this
    var userInfo = e.detail.userInfo
    app.globalData.userInfo = userInfo
    that.setData({
      userInfo: userInfo,
    })
    if (!this.data.storage) {
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
              tab.showModal('提示', res.data[0], (res) => {
                wx.switchTab({
                  url: '/pages/tabBar/me/me'
                })
              })
              return false
            }
            that.setData({
              storage: res.data[0],
              groupid: res.data[2],
            })
            tab.setStorage('storage', res.data)
            that.showMessageStatus(res);
          })
        }
      })
    }
  },

  //未注册用户点击时的提示信息
  tishi: function() {
    tab.showModal('提示', '请点击上方授权按钮,方可使用此功能！', (res) => {
      wx.switchTab({
        url: '/pages/tabBar/me/me'
      })
    })
  },
  //查询是否有新消息
  showMessageStatus: function(res) {
    var that = this;
    var uid = this.data.storage
    tab.getDataFromServer('vipapi/showMessageStatus', {
      uid: uid
    }, (res) => {
      that.setData({
        isread: res.data[0],
        username: res.data[1],
        company: res.data[2],
        honor_id: res.data[3],
        introduce_id: res.data[4],
        w_money: res.data[5], //助力金
        itemid: res.data[6], //最新发布的一条供应信息的itemid
        title: res.data[7], //最新发布的一条供应信息的标题
      });
      if (res.data[0] == 0) { //显示 tabBar 个人页的右上角的红点
        wx.showTabBarRedDot({
          index: 4
        })
      }
      if (res.data[0] == 1) { //隐藏 tabBar 个人页的右上角的红点
        wx.hideTabBarRedDot({
          index: 4
        })
      }
    })
  }
})