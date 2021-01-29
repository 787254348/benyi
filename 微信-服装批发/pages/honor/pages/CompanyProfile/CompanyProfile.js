// pages/CompanyProfile/CompanyProfile.js
import {
  Tab
} from '../../../model/tab-model.js';
const tab = new Tab();
Page({
  data: {},
  onLoad: function(options) {
    var that = this;
    tab.getStorage('storage', (res) => {
      that.setData({
        storage: res.data[0],
        username: res.data[3],
      })
    })
  },

  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var that = this;
    var formData = e.detail.value;
    var content = formData.content.trim();
    if (!content) {
      tab.showModal('提示', '请填写公司介绍')
      return false
    }
    tab.getDataFromServer('vfapi/CompanyProfile', formData, (res) => {
      tab.showModal('提示', res.data, (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/tabBar/me/me'
          })
        }
      })
    })
  }

})