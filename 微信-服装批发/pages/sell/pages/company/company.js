var app = getApp();
import {
  Tab
} from '../../../model/tab-model.js';
const tab = new Tab();
Page({
  onShareAppMessage: function() {
    var company = this.data.options.company
    var groupid = this.data.options.groupid
    var honor_id = this.data.options.honor_id
    var username = this.data.options.username
    return {
      title: '大量采购商在找货源，发布您的供应，让买家找到您！',
      desc: '本衣优质服装供求平台',
      path: '/pages/sell/pages/company/company?username=' + username + '&company=' + company + '&groupid=' + groupid + '&honor_id=' + honor_id
    }
  },
  data: {
    options: {},
    goodsList: [],
    page: 1,
    total: 0,
    imgUrls: [
      'https://wap.goods100.com/uploads/xcx/banner1.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },

  onLoad: function(options) {
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading',
    })
    this.setData({
      options: options,
    })
    var _this = this;
    _this.getGoodsData(options);
  },

  // 获取商品数据
  getGoodsData: function(options) {
    wx.showNavigationBarLoading();
    var _this = this;
    tab.getDataFromServer('vfapi/getNewcompany', {
      page: _this.data.page,
      username: _this.data.options.username,
    }, (res) => {
      wx.hideNavigationBarLoading();
      var total = res.data.total;
      if (_this.data.page < 2) {
        _this.setData({
          goodslist: res.data.data,
          total: total
        })
      } else {
        var goodslist = _this.data.goodslist;
        for (var i = 0; i < res.data.data.length; i++) {
          goodslist.push(res.data.data[i]);
        }
        _this.setData({
          goodslist: goodslist,
          total: total
        });
      }
      wx.hideToast();
    }, () => {
      wx.hideNavigationBarLoading();
    })
  },

  onShow: function(e) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },

  pullUpLoad: function(options) {
    var _page = this.data.page + 1;
    var _total = this.data.total;
    if (_page <= _total) {
      this.setData({
        page: _page
      });
      this.getGoodsData(options);
    } else {
      this.setData({
        moreText: "所有数据加载完"
      });
    }
  },

  onshare: function() {
    wx.showToast({
      title: '点击右上角-选择转发',
      icon: 'success',
    })
    setTimeout(function() {
      wx.hideToast()
    }, 2000)
  }
})