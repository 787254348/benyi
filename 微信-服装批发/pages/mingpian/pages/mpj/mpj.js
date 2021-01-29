import {
  Tab
} from '../../../model/tab-model.js';
const tab = new Tab();
Page({
  data: {},

  onLoad: function(options) {
    var that = this
    var storage = wx.getStorageSync('storage')
    var me_uid = storage[0] //本人的id
    this.setData({
      me_uid: me_uid,
    })
    that.getcard()
  },

  getcard: function() {
    var that = this;
    var uid = this.data.me_uid
    tab.getDataFromServer('vipapi/getmycard', {
      userid: uid
    }, (res) => {
      var result = res.data
      console.log(result)
      that.setData({
        my_card: res.data[0],
        other_card: res.data[1],
      })
    })
  }

})