var app = getApp()
var common = require('../../common/common.js');
import {
  Tab
} from '../../model/tab-model.js';
const tab = new Tab();
Page({
  onShareAppMessage: function() {
    return {
      title: '大量采购商在找货源，发布您的供应，让买家找到您！',
      desc: '本衣优质服装供求平台',
      path: '/pages/tabBar/buy/buy'
    }
  },
  data: {
    goodsList: [],
    page: 1,
    total: 0,
    reply: 'none',
  },

  // 获取求购数据
  getGoodsData: function(options) {
    wx.showNavigationBarLoading();
    var _this = this;
    tab.getDataFromServer('vipapi/getBuy', {
      page: _this.data.page
    }, (res) => {
      wx.hideNavigationBarLoading();
      if (_this.data.page < 2) {
        _this.setData({
          goodslist: res.data.data,
          style: 'block',
          reply: 'none',
        })
      } else {
        var goodslist = _this.data.goodslist;
        for (var i = 0; i < res.data.data.length; i++) {
          goodslist.push(res.data.data[i]);
        }
        _this.setData({
          goodslist: goodslist,
          style: 'block',
          reply: 'none',
        });
      }
      wx.hideToast();
    }, () => {
      wx.hideNavigationBarLoading();
      _this.setData({
        style: 'none',
        reply: 'block',
      })
    })
  },

  scroll: function() {},

  onLoad: function(options) {
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading',
    })
    var _this = this;
    _this.getGoodsData();
    tab.getStorage('storage', (res) => {
      _this.setData({
        storage: res.data[0],
        groupid: res.data[2],
        username: res.data[3],
      })
    })
  },

  onShow: function(e) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight
        })
      }
    })
  },
  pullDownRefresh: function(e) {
    console.log("上拉加载更多....")
    this.setData({
      page: 1,
    });
    this.getGoodsData()
  },

  pullUpLoad: function(e) {
    console.log("下拉刷新....")
    var _page = this.data.page + 1;
    if (_page <= 100) {
      this.setData({
        page: _page
      });
      this.getGoodsData();
    } else {
      this.setData({
        moreText: "亲，暂时只能显示到此，如需查看更多请前往本衣网。"
      });
    }
  },

})