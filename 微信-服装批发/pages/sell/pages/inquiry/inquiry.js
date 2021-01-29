var app = getApp();
import {
  Tab
} from '../../../model/tab-model.js';
const tab = new Tab();
Page({
  data: {},
  onLoad: function(options) {
    this.setData({
      options: options
    });
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
    if (!content.trim()) {
      tab.showModal('提示', '请填写内容！')
      return false
    }
    var mobile = formData.mobile;
    if (!(/^1[34578]\d{9}$/.test(mobile))) {
      tab.showModal('提示', '请输入11位正确的手机号码')
      return false
    }
    tab.getDataFromServer('vfapi/sendInquiry', obj, (res) => {
      if (res.data[1] == 1) {
        tab.showModal('提示', res.data[0])
        return false
      } else {
        tab.showModal('提示', res.data, (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/tabBar/home/home'
            })
          }
        })
      }
    })
  }
})