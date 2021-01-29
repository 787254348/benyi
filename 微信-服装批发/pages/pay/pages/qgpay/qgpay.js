// pages/qgpay/qgpay.js
var util = require('../../utils/md5.js')
var app = getApp();
import {
  Tab
} from '../../../model/tab-model.js';
const tab = new Tab();
Page({
  data: {},
  onLoad: function(options) {
    var that = this
    tab.getStorage('storage', (res) => {
      that.setData({
        storage: res.data[0],
        openid: res.data[1],
        groupid: res.data[2],
        username: res.data[3],
      })
      that.open(res)
    })
    this.setToken()
  },

  tishi: function() {
    tab.showModal('提示', '请点确定上方按钮授权，方可确定')
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
          that.open(res)
          tab.setStorage('storage', res.data)
        })
      }
    })
  },
  open: function(res) {
    var username = res.data[3]
    var that = this
    tab.getDataFromServer('zzfapi/getqgvip', {
      username: username
    }, (res) => {
      that.setData({
        information: res.data,
      })
    })
  },

  //调起微信支付
  pay: function(e) {
    var that = this
    var fId = e.detail.formId;
    var aa = e.detail.value;
    var username = aa.username;
    var openid = aa.openid;
    var money = aa.money;
    var ty = aa.ty;
    var num = aa.number;
    var address = aa.address;
    var totime = aa.totime;
    var date = (Date.parse(new Date()) / 1000).toString();
    var Num = "";
    for (var i = 0; i < 6; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    var time = date + Num;
    wx.request({
      url: 'https://wap.goods100.com/home/zzfapi/index',
      data: {
        openid: openid,
        money: money,
        Out_trade_no: time,
        ty: ty,
        username: username,
        num: num,
        address: address,
        totime: totime,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(response) {
        console.log(response.data);
        var appId = response.data.appid;
        var prepay_id = response.data.prepay_id;
        var timeStamp = (Date.parse(new Date()) / 1000).toString();
        var pkg = 'prepay_id=' + response.data.prepay_id;
        var nonceStr = response.data.nonce_str;
        var paySign = util.hexMD5('appId=' + appId + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + '&key=qRLIizxpFML4VbnCLCiQMXO5y3LCQpal');
        console.log(paySign);
        console.log(appId);
        wx.requestPayment({
          'timeStamp': timeStamp,
          'nonceStr': nonceStr,
          'package': pkg,
          'signType': 'MD5',
          'paySign': paySign,
          'success': function(res) {
            that.getchange(e); //购买成功后发送服务通知
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '恭喜您购买成功！',
              complete: function() {
                wx.switchTab({
                  url: '/pages/tabBar/me/me'
                })
              }
            })
          }
        })
      }
    })
  },
  //获取token
  setToken: function() {
    var that = this
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx78d67b2f2e81ffea&secret=71822bbe2ef4113b4bf4ca95dcefcee1',
      data: {},
      method: 'GET',
      success: function(res) {
        var token = res.data.access_token
        that.setData({
          token: token
        })
        wx.setStorageSync('token', token)
      }
    })
  },
  //发送服务通知
  getchange: function(e) {
    var cc = e.detail.value;
    console.log(cc)
    var userid = cc.userid;
    var username = cc.username;
    var openid = cc.openid;
    var ty = cc.ty;
    var Number = cc.number;
    var fId = e.detail.formId;
    var totime = cc.totime * 1000;
    var timestamp = Date.parse(new Date());
    if (totime > timestamp) {
      var timestamp = totime;
    } else {
      var timestamp = Date.parse(new Date());
    }
    var times = timestamp / 1000;
    var t = times * 1000;
    var da = new Date(t);
    //当前时间的年份
    var year = da.getFullYear();
    //当前时间的月份  
    var month = (da.getMonth() + 1 < 10 ? '0' + (da.getMonth() + 1) : da.getMonth() + 1);
    //当前时间的日期  
    var today = da.getDate() < 10 ? '0' + da.getDate() : da.getDate();
    //某一天后的时间
    timestamp = timestamp / 1000 + 365 * 24 * 60 * 60;
    var n = timestamp * 1000;
    var date = new Date(n);
    //某一天后的年份
    var Y_tomorrow = date.getFullYear();
    //某一天后的月份  
    var M_tomorrow = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //某一天后的日期  
    var D_tomorrow = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var Ndata = year + '年' + month + '月' + today + '日'
    var Tdata = Y_tomorrow + '年' + M_tomorrow + '月' + D_tomorrow + '日'
    var timestamp1 = Date.parse(new Date());
    var times = timestamp1 / 1000;
    var t = times * 1000;
    var da = new Date(t);
    //当前时间的年份
    var nyear = da.getFullYear();
    //当前时间的月份  
    var nmonth = (da.getMonth() + 1 < 10 ? '0' + (da.getMonth() + 1) : da.getMonth() + 1);
    //当前时间的日期  
    var ntoday = da.getDate() < 10 ? '0' + da.getDate() : da.getDate();
    var Nowdata = nyear + '年' + nmonth + '月' + ntoday + '日'
    var content = '供货通（随时查看采购信息联系方式）'
    var totime = '12个月'
    var that = this;
    var  l  =  'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='  + wx.getStorageSync('token');
    wx.request({
      url:  l,
      data: {
        touser: openid,
        template_id:   'o_J3zLa7jVcGAU32kNt29r79HHzmoSQDkCWsMXaVct0', //这个是1、申请的模板消息id，  
        page:   'pages/tabBar/me/me',
        form_id: fId,
        data:  {
          "keyword1":  {
            "value":  Nowdata,
            "color":   "#9b9b9b"
          },
          "keyword2":  {
            "value":  content,
            "color":   "#009933"
          },
          "keyword3":  {
            "value":  totime,
            "color":   "#9b9b9b"
          },
          "keyword4":  {
            "value":  Ndata + "-" + Tdata,
            "color":   "#9b9b9b"
          },
          "keyword5":  {
            "value":   "感谢您的惠顾！您在本衣网（www.goods100.com）的账号是" + username + "，小程序服装批发采购，继续用您的手机正常使用。诚邀您关注我们官方公众号“服装批发生意（fzpf9188）”，助力您的服装生意！",
            "color":   "#9b9b9b"
          },
        },
      },
      method:   'POST',
      success:   function(res) {
        console.log("push msg");
      }
    })
  }

})