import {
  Tab
} from '../../../model/tab-model.js';
const tab = new Tab();
var app = getApp();
Page({
  data: {},
  onLoad: function(options) {
    var that = this
    this.setData({
      options: options
    });
    tab.getStorage('storage', (res) => {
      that.setData({
        openid: res.data[1]
      })
    })
  },

  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var that = this;
    var formData = e.detail.value;
    var fId = e.detail.formId
    var fid = {
      fid: fId
    }
    var obj = Object.assign(formData, fid); //把两个对象合并为一个对象
    var content = formData.content;
    if (!content.trim()) { //验证是否填写内容
      tab.showModal('提示', '请填写内容')
      return false
    }
    var mobile = formData.mobile;
    if (!(/^1[34578]\d{9}$/.test(mobile))) { //验证是不是正确的11位手机号码
      tab.showModal('提示', '请输入11位手机号码')
      return false
    }
    tab.getDataFromServer('vfapi/sendBuyInquiry', obj, (res) => {
      if (res.data[1] == 1) {
        tab.showModal('提示', res.data[0])
        return false
      } else {
        tab.showModal('提示', res.data, (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/tabBar/buy/buy'
            })
          }
        })
      }
    })
  }
})