//app.js
import {
  Config
} from '/pages/common/config.js';
App({
  onLaunch: function(ops) {
    var that = this
    wx.getStorageInfo({
      success: function(res) {
        var currentSize = res.currentSize
        if (currentSize > 10000) { //缓存数据大于10M时清除缓存
          wx.clearStorage()
          that.getUserInfo()
        }
      }
    })
    var storage = wx.getStorageSync('storage')
    if (!storage) {
      that.getUserInfo()
    } else {
      this.showMessageStatus()
    }
  },
  getUserInfo: function(cb) {
    var that = this
    //调用登录接口
    wx.login({
      success: function(ress) {
        that.globalData.code = ress.code
        wx.request({
          url: Config.tokenUrl, //接口地址
          data: {
            code: that.globalData.code,
          },
          success: function(res) {
            that.globalData.uid = res.data[0]
            if (that.userInfoCallback) {
              that.userInfoCallback(res.data);
            }
            wx.setStorage({
              key: "storage",
              data: res.data
            })
            that.showMessageStatus(res)
          }
        })
      }
    })
  },

  //查询是否有新消息
  showMessageStatus: function(res) {
    var storage = wx.getStorageSync('storage')
    if (!storage) {
      var storage = res.data
    }
    var that = this;
    wx.request({
      url: Config.messageUrl,
      data: {
        uid: storage[0],
      },
      success: function(res) {
        if (res.data[0] == 0) { //显示 tabBar 个人页的右上角的红点
          wx.showTabBarRedDot({
            index: 4
          })
        }
      }
    })
  },

  setNaivgationBarTitle: function(title) {
    wx.setNavigationBarTitle({
      title: title
    })
  },

  globalData: {
    userInfo: null,
    uid: '',
    iv: '',
    encryptedData: '',
    qdtx_template_id:'v1R9rYQGq2mywJZ8IrnlhdpFE0uR2CG-iJl6BfFpeOM'
  },

})