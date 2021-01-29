// pages/mybuy/mybuy.js
var app = getApp()
var common = require('../../common/common.js')
import {
  Tab
} from '../../model/tab-model.js';
const tab = new Tab();
Page({
  data: {
    city: '',
    province: '',
    district: '',
    a: [],
    imgUrl1: '',
  },

  onLoad: function(options) {
    if (options.r == 1) {
      common.createvideoAd('adunit-290a8ed39af1b39b', '/pages/tabBar/me/me');
    }
    this.loadInfo();

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

  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var that = this;
    var formData = e.detail.value;
    var fId = e.detail.formId;
    var fid = {
      fid: fId
    }
    var obj = Object.assign(formData, fid); //把两个对象合并为一个对象
    if (!formData.uid) {
      tab.showModal('提示', '请确认按钮上方授权发布！')
      return false
    }
    var mobile = formData.mobile;
    if (!(/^1[34578]\d{9}$/.test(mobile))) { //验证是不是正确的11位手机号码
      tab.showModal('提示', '请输入11位手机号码')
      return false
    }
    tab.getDataFromServer('vfapi/getBuyFabu', obj, (res) => {
      if (res.data[1] == 1) {
        tab.showModal('提示', res.data[0])
        return false
      } else {
        const itemid = res.data[1];
        tab.showModal('提示', res.data[0], (res) => {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/buy/pages/qgxq/qgxq?itemid=' + itemid + '&is_share=1'
            })
          }
        })
      }
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
        tab.uploadFiles('vipapi/uploads', tempFilePaths[0], 'file', {
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
  //获取当前位置函数
  loadInfo: function() {
    var page = this
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function(res) {
        // success 
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
      },
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
      },
    })
  }
})