var app = getApp();
import {
  Tab
} from '../../../model/tab-model.js';
const tab = new Tab();
Page({
  data: {
    options: {},
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      options: options
    });
  },

  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var that = this;
    var formData = e.detail.value;
    var content = formData.content
    if (!content.trim()) {
      tab.showModal('提示', '请填写回复内容')
      return false
    }
    tab.getDataFromServer('vfapi/replyInquiry', formData, (res) => {
      tab.showModal('提示', res.data, (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/tabBar/home/home'
          })
        }
      })
    })
  }

})