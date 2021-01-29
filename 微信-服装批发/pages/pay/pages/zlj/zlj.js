var app = getApp();
import {
  Tab
} from '../../../model/tab-model.js';
const tab = new Tab();
Page({
  data: {
    submit: true,
    Number: 1,
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      options: options,
    })
    var that = this;
  },

  formSubmit: function(e) {
    var that = this
    that.setData({
      submit: false
    })
    var userid = that.data.options.userid
    var itemid = that.data.options.itemid
    var title = that.data.options.title
    var formData = e.detail.value
    var num = formData.num //购买的天数
    var money = num * 30 //消耗的助力金
    var myMoney = that.data.options.myMoney //拥有的助力金
    if (money > myMoney) {
      tab.showModal('提示', '您的助力金余额不足，赶紧转发供应信息给好友赚取助力金！', (res) => {
        wx.navigateTo({
          url: '/pages/sell/pages/good/good?itemid=' + itemid + '&title=' + title,
        })
      })
      that.setData({
        submit: true
      })
      return false
    }
    tab.getDataFromServer('vipapi/useMoney', {
      userid: userid,
      itemid: itemid,
      num: num,
      money: money,
    }, (res) => {
      that.setData({
        submit: true,
        options: {
          myMoney: res.data[0],
          userid: res.data[1],
          itemid: res.data[2],
          title: title,
        }
      })
      tab.showModal('提示', '成功！8分钟后您的供应信息会优先展示，继续赚取更多助力金！', (res) => {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/sell/pages/good/good?itemid=' + itemid + '&title=' + title,
          })
        }
      })
    })
  },

  bindblur: function(e) {
    var a = e.detail.value
    if (a < 1) {
      var a = 1
    }
    var b = parseInt(a)
    this.setData({
      Number: b,
    })
  },


  add: function() {
    var that = this
    var num = that.data.Number
    var aa = ++num
    this.setData({
      Number: aa,
    })
  },
  down: function() {
    var that = this
    var num = that.data.Number
    var aa = --num
    if (aa < 1) {
      var aa = 1
    }
    this.setData({
      Number: aa,
    })
  }

})