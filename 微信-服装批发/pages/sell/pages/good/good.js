var app = getApp();
import {
  Tab
} from '../../../model/tab-model.js';
const tab = new Tab();
Page({
  onShareAppMessage: function(options) {
    var itemid = this.data.options.itemid;
    var tl = this.data.options.title;
    var userid = this.data.good.userid;
    var company = this.data.good.company;
    var str = company.replace("的公司", "");
    return {
      title: tl + '-服装供求信息发布平台！',
      desc: '本衣优质服装供求平台',
      path: '/pages/sell/pages/good/good?itemid=' + itemid + '&title=' + tl + '&userid=' + userid,
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
    right: ">",
  },

  onLoad: function(options) {
    var that = this
    console.log('onLoad的时候：', options)
    this.setData({
      options: options,
    })
    var tl = this.data.options.title;
    wx.setNavigationBarTitle({ //导航栏标题
      title: tl + ' 一 服装批发采购小程序'
    })
    var value = wx.getStorageSync(options.itemid)
    var totime = value.totime
    var nowtime = new Date() / 1000
    if (!value || totime < nowtime) { //判断商品数据是否存在缓存且是否过期
      that.getGoodsData(options)
    } else {
      console.log(value)
      that.setData({
        good: value.good
      });
    }
    var userinfo = wx.getStorageSync("storage")
    if (userinfo) {
      that.setData({
        storage: userinfo[0],
        openid: userinfo[1],
        groupid: userinfo[2],
      })
    } else {
      app.userInfoCallback = userInfo => {
        that.setData({
          storage: userInfo[0],
          openid: userInfo[1],
          groupid: userInfo[2],
        })
      }
    }
    if (Object.prototype.toString.call(options.userid) !== '[object Undefined]') { //通过分享进入的增加一个助力金
      var userid = options.userid
      var itemid = options.itemid
      var f_value = wx.getStorageSync("f_" + itemid)
      var storage = this.data.storage
      if (!userinfo) {
        app.userInfoCallback = userInfo => {
          that.setData({
            storage: userInfo[0],
            openid: userInfo[1],
            groupid: userInfo[2],
          })
          if (userInfo[0] != userid && !f_value) {
            wx.setStorage({
              key: "f_" + itemid,
              data: itemid
            })
            tab.getDataFromServer('vipapi/addMoney', {
              userid: userid
            }, () => {})
          }
        }
      } else {
        if (storage != userid && !f_value) {
          wx.setStorage({
            key: "f_" + itemid,
            data: itemid
          })
          tab.getDataFromServer('vipapi/addmoney', {
            userid: userid
          }, () => {})
        }
      }
    }
  },

  onReady: function() {
    //获得shareModal
    this.shareModal = this.selectComponent("#shareModal");
  },

  onShareModal() {
    this.shareModal.showModal();
  },

  //点击图片预览函数
  aaa: function(e) {
    var a = e.target.dataset.name
    var b = e.target.dataset.b
    var c = e.target.dataset.c
    var d = e.target.dataset.d
    var g = e.target.dataset.e
    var f = e.target.dataset.f
    console.log(e)
    if (g.length == 0) {
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
    } else {
      if (f.length == 0) {
        var s = [b, c, d, g]
      } else {
        var s = [b, c, d, g, f]
      }
    }
    wx.previewImage({
      current: a, // 当前显示图片的http链接
      urls: s // 需要预览的图片http链接列表
    })
  },
  shouquan: function() {
    tab.showModal('提示', '点击下方授权按钮授权，方可咨询！')
    return false
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
        wx.request({
          method: 'GET',
          url: 'https://wap.goods100.com/home/vipapi/creatUserNew', //接口地址
          data: {
            userinfo: userInfo,
            code: code,
            nickName: userInfo.nickName,
            sex: userInfo.gender,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            if (res.data[1] == 1) {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: res.data[0],
                complete: function() {

                }
              })
              return false
            }
            that.setData({
              storage: res.data[0],
              openid: res.data[1],
              groupid: res.data[2],
              username: res.data[3],
            })
            wx.setStorage({
              key: "storage",
              data: res.data
            })
          }
        })
      }
    })

  },
  //拨打电话
  mobile: function(e) {
    var num = e.currentTarget.dataset.name
    wx.makePhoneCall({
      phoneNumber: num
    })
  },

  // 获取商品详情数据
  getGoodsData: function(options) {
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading',
      duration: 10000
    })
    var itemid = this.data.options.itemid;
    var that = this;
    wx.request({
      method: 'GET',
      url: 'https://wap.goods100.com/home/vipapi/getSellDetail',
      header: {
        mid: 0,
        token: 0,
      },
      data: {
        itemid: options.itemid
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.retcode == 1) {
          var good = res.data.data;
          that.setData({
            good: good
          });
          var totime = new Date() / 1000 + 60 * 60 * 24 * 30 //设置缓存30天到期时间
          var obj = {
            good: good,
            totime: totime
          }
          wx.setStorage({ //将获取的数组缓存
            key: good.itemid,
            data: obj
          })
        }
        wx.hideToast();
      }
    })
  },

})