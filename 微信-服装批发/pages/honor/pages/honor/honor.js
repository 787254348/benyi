// pages/honor/honor.js
import {
  Tab
} from '../../../model/tab-model.js';
const tab = new Tab();
Page({
  data: {
    botton: 'block',
    img: 'none',
    content: '例如：营业执照/身份证',
    company: '与营业执照一致',
    array: ['营业执照', '身份证'],
    index: 0,
    right: '>',
  },
  onLoad: function(options) {
    var _this = this;
    tab.getStorage('storage', (res) => {
      _this.setData({
        storage: res.data[0],
      })
    })
  },
  chooseimage: function() {
    var _this = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        tab.uploadFiles('vfapi/honorUpload', tempFilePaths[0], 'file', {
          'user': 'test'
        }, (ress) => {
          var data = ress.data
          var data = ress.data
          _this.setData({
            a: res.tempFilePaths,
            botton: 'none',
            img: 'block',
            imgUrl1: data,
          })
        })
      }
    })
  },
  delete1: function() {
    this.setData({
      botton: 'block',
      img: 'none',
      imgUrl1: '',
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var that = this;
    var formData = e.detail.value;
    var img = formData.imgUrl1;
    var company = formData.company.trim();
    if (!company) {
      tab.showModal('提示', '请填写公司的名称')
      return false
    }
    if (!img) {
      tab.showModal('提示', '请上传证书')
      return false
    }
    tab.getDataFromServer('vfapi/honor', formData, (res) => {
      tab.showModal('提示', res.data, (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/tabBar/me/me'
          })
        }
      })
    })
  },

  onfocus: function() {
    this.setData({
      content: '',
    })
  },
  blur: function() {
    this.setData({
      content: '例如：营业执照/身份证',
    })
  },
  onfocus1: function() {
    this.setData({
      company: '',
    })
  },
  blur1: function() {
    this.setData({
      company: '与营业执照一致',
    })
  },

})