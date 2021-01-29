import {
  Tab
} from '../../../model/tab-model.js';
const tab = new Tab();
Page({
  data: {},
  onLoad: function(res) {
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading',
      duration: 10000
    })
    wx.hideNavigationBarLoading();
    var _this = this;
    tab.getDataFromServer('vfapi/myMessagesNew', {
      uid: res.uid
    }, (res) => {
      _this.setData({
        messages: res.data
      });
      wx.hideToast()
    })
  }

})