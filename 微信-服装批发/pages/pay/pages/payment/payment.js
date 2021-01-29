// pages/pay/pay.js
var util = require('../../utils/md5.js')
var app = getApp();
Page({

  data: {
    storage: [],
    options: {},
    Number: 1,
    style: 'none',
    total: '188',
    ty: 1,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      options: options,
    })
    var that = this;
    that.setToken()
    wx.getStorage({
      key: 'storage',
      success: function (res) {
        console.log("用户ID：", res.data);
        that.setData({
          storage: res.data[0],
          openid: res.data[1],
          username: res.data[3],
        })
        that.open(res)
      }
    })
  },

  wait: function () {
    wx.switchTab({
      url: '/pages/tabBar/me/me'
    })
  },

  tishi: function () {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: "请点确定上方按钮授权，方可确定",
      complete: function () {

      }
    })
    return false
  },
  onGotUserInfo: function (e) {//重新获取用户信息
    var that = this
    var userInfo = e.detail.userInfo
    app.globalData.userInfo = userInfo
    that.setData({
      userInfo: userInfo,
    })
    wx.login({
      success: function (ress) {
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
          success: function (res) {
            if (res.data[1] == 1) {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: res.data[0],
                complete: function () {

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
            that.open(res)
            wx.setStorage({
              key: "storage",
              data: res.data
            })
          }
        })
      }
    })
  },
  open: function (res) {
    var username = res.data[3]
    var that = this
    wx.request({
      url: 'https://wap.goods100.com/home/zzfapi/get', //仅为示例，并非真实的接口地址
      data: {
        username: username,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          information: res.data,
        })
      }
    })
  },

  //获取token
  setToken: function () {
    var that = this
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx78d67b2f2e81ffea&secret=71822bbe2ef4113b4bf4ca95dcefcee1',
      data: {},
      method: 'GET',
      success: function (res) {
        var token = res.data.access_token
        that.setData({
          token: token
        })
        wx.setStorageSync('token', token)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  //发起支付
  pay: function (e) {
    var that = this
    var fId = e.detail.formId;
    var aa = e.detail.value;
    var username = aa.username;
    var openid = aa.openid;
    var money = aa.money * 100;
    var ty = aa.ty;
    var num = aa.number;
    var address = aa.address;
    var totime = aa.totime;
    if (!username) {//授权提示信息
      wx.showModal({
        title: '提示',
        content: '去个人中心授权才能使用！',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/tabBar/me/me'
            })
          }
        }
      })
      return false
    }
    var date = (Date.parse(new Date()) / 1000).toString();
    var Num = "";
    for (var i = 0; i < 6; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    var time = date + Num;
    that.setData({
      Out_trade_no: time,
    })
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
      success: function (response) {
        var appId = response.data.appid;
        var prepay_id = response.data.prepay_id;
        var timeStamp = (Date.parse(new Date()) / 1000).toString();
        var pkg = 'prepay_id=' + response.data.prepay_id;
        var nonceStr = response.data.nonce_str;
        var paySign = util.hexMD5('appId=' + appId + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + '&key=qRLIizxpFML4VbnCLCiQMXO5y3LCQpal');
        wx.requestPayment({
          'timeStamp': timeStamp,
          'nonceStr': nonceStr,
          'package': pkg,
          'signType': 'MD5',
          'paySign': paySign,
          'success': function (res) {
            console.log('success');
            console.log(res);
            that.getchange(e);//购买成功后发送服务通知
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '购买成功！生效时间需要几分钟后重新打开小程序',
              complete: function () {
                wx.switchTab({
                  url: '/pages/tabBar/me/me'
                })
              }
            })
          },
          'fail': function (res) {
          },
        });
      },

    });
  },
  //发送服务通知
  getchange: function (e) {
    var cc = e.detail.value;
    console.log(cc)
    var userid = cc.userid;
    var money = cc.money * 100;
    var username = cc.username;
    var openid = cc.openid;
    var ty = cc.ty;
    var Number = cc.number;
    var fId = e.detail.formId;
    var btotime = cc.totime * 1000;
    //获取有效期的起止时间
    var timestamp = Date.parse(new Date());
    if (btotime > timestamp) {
      var da = new Date(btotime);
    } else {
      var da = new Date();
    }
    var date = da.getDate()
    var year = da.getFullYear()
    var month = da.getMonth() + 1
    console.log(month)
    var kk = JSON.parse(Number)
    var ss = kk + 1
    var month1 = da.getMonth() + ss
    var tyear = year
    if (month1 > 12) {
      var aa = parseInt(month1 / 12)
      var month1 = month1 % 12
      if (month1 == 0) {
        var month1 = 12
        var aa = aa - 1
      }
      var tyear = da.getFullYear() + aa
    }

    var Ndata = year + '年' + month + '月' + date + '日'
    var Tdata = tyear + '年' + month1 + '月' + date + '日'
    console.log(Ndata)
    console.log(Tdata)
    //获取当前时间
    var ndate = new Date().getDate()
    var nyear = new Date().getFullYear()
    var nmonth = new Date().getMonth() + 1
    var nowdata = nyear + '年' + nmonth + '月' + ndate + '日'
    var content = '财富通特权服务'
    var totime = Number + '个月'
    console.log(money)
    var that = this;
    var Out_trade_no = that.data.Out_trade_no
    var  l  =  'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='  + wx.getStorageSync('token');
    wx.request({
      url:  l,
      data: {
        touser: openid,
        template_id:  'o_J3zLa7jVcGAU32kNt29r79HHzmoSQDkCWsMXaVct0',//这个是1、申请的模板消息id，  
        page:  'pages/tabBar/me/me',
        form_id: fId,
        data:  {
          "keyword1":  {
            "value":  nowdata,
            "color":  "#9b9b9b"
          },
          "keyword2":  {
            "value":  content,
            "color":  "#009933"
          },
          "keyword3":  {
            "value":  totime,
            "color":  "#9b9b9b"
          },
          "keyword4":  {
            "value":  Ndata + "-" + Tdata,
            "color":  "#9b9b9b"
          },

          "keyword5":  {
            "value":  "感谢您的惠顾！您在本衣网（www.goods100.com）的账号是" + username + "，小程序服装批发采购，继续用您的手机正常使用。诚邀您关注我们官方公众号“服装批发生意（fzpf9188）”，助力您的服装生意！",
            "color":  "#9b9b9b"
          },
        },
        // color: '#ccc',  
        //emphasis_keyword: 'keyword1.DATA' 
      },
      method:  'POST',
      success:  function (res) {
        console.log("push msg");
      },
      fail:  function (err)  {
        // fail  
        console.log(err);
      }
    });
  },


  bindblur: function (e) {
    var a = e.detail.value
    if (a < 1) {
      var a = 1
    }
    var b = parseInt(a)
    var total = b * 188
    this.setData({
      Number: b,
      total: total,
    })
  },


  add: function () {
    var that = this
    var num = that.data.Number
    var aa = ++num
    var total = aa * 188
    this.setData({
      Number: aa,
      total: total
    })
  },
  down: function () {
    var that = this
    var num = that.data.Number
    var aa = --num
    if (aa < 1) {
      var aa = 1
    }
    var total = aa * 188
    this.setData({
      Number: aa,
      total: total
    })
  },

})