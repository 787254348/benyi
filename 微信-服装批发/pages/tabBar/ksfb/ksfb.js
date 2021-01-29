//获取应用实例  
var app = getApp()
var common = require('../../common/common.js');
import {
  Tab
} from '../../model/tab-model.js';
const tab = new Tab();
Page({
  data: {
    tempFilePaths: '',
    array: ['女装', '母婴', '男装', '童装', '鞋子', '箱包', '运动服饰', '服装辅料', '展示道具', '加工设备', '其他服饰'],
    cateIdArray: [890, 891, 892, 893, 894, 895, 9, 10, 12, 13, 32],
    array1: ['件', '套', '个', '只', '条'],
    index: 0,
    array1index: 0,
    userInfo: {},
    storage: '',
    city: '',
    province: '',
    district: '',
    a: [],
    imgUrl1: '',
    systeminfo: ''
  },

  onLoad: function(options) {
    this.loadInfo();
    var _this = this;
    var Num = "";
    for (var i = 0; i < 6; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    _this.setData({
      num: Num,
    })
    this.getphonesystem();
    if (options.r == 1) {
      common.createvideoAd('adunit-290a8ed39af1b39b', '/pages/tabBar/me/me');
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

  onShow: function() {
    var _this = this
    tab.getStorage('storage', (res) => {
      _this.setData({
        storage: res.data[0],
        openid: res.data[1],
        groupid: res.data[2],
        username: res.data[3],
      })
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
    })
  },

  bindPickerChange1: function(e) {
    this.setData({
      array1index: e.detail.value
    })
  },

  chooseimage: function() {
    var _this = this;
    var l = _this.data.a
    if (l.length == 3) {
      tab.showModal('提示', '最多上传3张图片')
      return false
    }
    wx.chooseImage({
      count: 1,
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        tab.uploadFiles('vipapi/upload', tempFilePaths[0], 'file', {
          'user': 'test'
        }, (ress) => {
          var data = ress.data
          var a = _this.data.a
          var imgUrl1 = _this.data.imgUrl1
          var imgUrl1 = imgUrl1 + data + ","
          var ss = imgUrl1.split(",");
          if (a.length < 1) {
            _this.setData({
              a: res.tempFilePaths,
              imgUrl1: imgUrl1,
              ss: ss,
            })
          } else {
            a.push(res.tempFilePaths[0]);
            _this.setData({
              a: a,
              imgUrl1: imgUrl1,
              ss: ss,
            })
          }
        })
      }
    })
  },
  //删除图片
  delete1: function(e) {
    var k = e.target.dataset.name
    var img = this.data.ss
    img.splice(k, 1)
    var b = img.join(",");
    var s = this.data.a
    var ss = s.splice(k, 1)
    this.setData({
      a: s,
      ss: img,
      imgUrl1: b
    })
  },

  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var that = this;
    var formData = e.detail.value;
    var openid = formData.openid
    var username = formData.username
    var num = formData.num
    const title = formData.title
    var fId = e.detail.formId;
    var fid = {
      fid: fId
    }
    var obj = Object.assign(formData, fid); //把两个对象合并为一个对象
    var sysinfo = this.data.systeminfo
    var sys = sysinfo.indexOf("iOS") != -1
    if (!username) { //验证是否授权过
      tab.showModal('提示', '请点确认按钮上方授权发布！')
      return false
    }
    var mobile = formData.telephone;
    if (!(/^1[34578]\d{9}$/.test(mobile))) { //验证是不是正确的11位手机号码
      tab.showModal('提示', '请输入11位正确的手机号码')
      return false
    }
    tab.getDataFromServer('vfapi/ksfb', obj, (res) => {
      const itemid = res.data[2];
      if (res.data[1] > 2) {
        if (res.data[1] == 3) {
          tab.showModal('提示', res.data[0])
          return false
        } else {
          tab.showModal('提示', res.data[0], (res) => {
            if (res.confirm && sys) {
              wx.switchTab({
                url: '/pages/tabBar/me/me'
              })
            } else if (res.confirm && !sys) {
              wx.navigateTo({
                url: '/pages/pay/pages/pay/pay'
              })
            }
          })
        }
      } else {
        tab.showModal('提示', res.data[0], (res) => {
          if (res.confirm && !sys) {
            wx.navigateTo({
              url: '/pages/pay/pages/payment/payment'
            })
          } else if (res.confirm && sys) {
            wx.navigateTo({
              url: "/pages/sell/pages/good/good?itemid=" + itemid + "&username=" + username + "&title=" + title + "&is_share=1",
            })
          }
        })
      }
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
        })
      }
    })
  },
  loadInfo: function() {
    var page = this
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function(res) {
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
      }
    })
  },
  loadCity: function(longitude, latitude) {
    var page = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=08056362638948c41f72463616dcd173&location=' + latitude + ',' + longitude + '&output=json',
      success: function(res) {
        var city = res.data.result.addressComponent.city;
        var province = res.data.result.addressComponent.province;
        var district = res.data.result.addressComponent.district;
        page.setData({
          city: city,
          province: province,
          district: district,
        });
      }
    })
  }
})