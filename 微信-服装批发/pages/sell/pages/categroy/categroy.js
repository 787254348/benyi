var app = getApp();
import {
  Tab
} from '../../../model/tab-model.js';
const tab = new Tab();
Page({
  onShareAppMessage: function() {
    var catid = this.data.options.catid
    return {
      title: '大量采购商在找货源，发布您的供应，让买家找到您！',
      desc: '本衣优质服装供求平台',
      path: '/pages/sell/pages/categroy/categroy?catid=' + catid
    }
  },
  data: {
    options: {},
    moreText: 'none',
    goodsList: [],
    reply: 'none',
    page: 1,
    total: 0,
    arr: [],
    arrHight: [],
    hidden: false
  },

  onLoad: function(options) {
    this.setData({
      options: options,
    })
    var _this = this;
    _this.getGoodsData(options);
    tab.getStorage('storage', (res) => {
      _this.setData({
        storage: res.data[0],
      })
    })
  },

  // 获取商品数据
  getGoodsData: function(options) {
    wx.showNavigationBarLoading();
    var _this = this;
    var tarrHight = [];
    tab.getDataFromServer('vipapi/getNewcategory', {
      page: _this.data.page,
      catid: _this.data.options.catid,
    }, (res) => {
      console.log(res.data)
      wx.hideNavigationBarLoading();
      var windowWidth = _this.data.windowWidth
      var total = res.data.total;
      _this.setData({
        total: total
      });
      if (_this.data.page < 2) {
        var arr = [];
        var length = Array.from(res.data.data).length;
        for (var i = 0; i < length; i++) {
          arr[i] = false;
          tarrHight[i] = Math.floor(i / 2) * (windowWidth / 750) * 414;
        }
        for (var i = 0; i < res.data.data.length; i++) {
          if (tarrHight[i] < _this.data.clientHeight) {
            if (arr[i] == false) {
              arr[i] = true;
            }
          }
        }
        _this.setData({
          goodslist: res.data.data,
          style: 'block',
          reply: 'none',
          hidden: true,
          arr: arr,
          arrHight: tarrHight
        })
      } else {
        var arr = [];
        var goodslist = _this.data.goodslist;
        for (var i = 0; i < res.data.data.length; i++) {
          goodslist.push(res.data.data[i]);
        }
        var length = Array.from(goodslist).length;
        for (var i = 0; i < length; i++) {
          arr[i] = false;
          tarrHight[i] = Math.floor(i / 2) * (windowWidth / 750) * 414;
        }
        var seeHeight = _this.data.clientHeight;
        for (var i = 0; i < _this.data.goodslist.length; i++) {
          if (tarrHight[i] < _this.data.scrollTop + seeHeight) {
            if (arr[i] == false) {
              arr[i] = true;
            }
          }
        }
        _this.setData({
          goodslist: goodslist,
          style: 'block',
          reply: 'none',
          hidden: true,
          arr: arr,
          arrHight: tarrHight
        });
      }
    }, () => {
      wx.hideNavigationBarLoading();
      _this.setData({
        style: 'none',
        reply: 'block',
      })
    })
  },

  cate: function(e) {
    var catid = e.target.dataset.name
    this.setData({
      options: {
        catid: catid,
      },
      page: 1,
      goodslist: [],
    })
    this.getGoodsData()
  },


  onShow: function(e) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          clientHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },

  scroll: function(e) {
    var seeHeight = this.data.clientHeight; //可见区域高度  
    var arrHight = this.data.arrHight;
    var scrollTop = e.detail.scrollTop;
    var arr = this.data.arr;
    for (var i = 0; i < this.data.goodslist.length; i++) {
      if (arrHight[i] < scrollTop + seeHeight) {
        if (arr[i] == false) {
          arr[i] = true;
        }
      }
    }
    this.setData({
      arr: arr,
      scrollTop: scrollTop
    })
  },

  pullDownRefresh: function(options) {
    console.log("下拉刷新....")
    this.setData({
      page: 1,
    });
    this.getGoodsData(options);
  },

  pullUpLoad: function(options) {
    var _page = this.data.page + 1;
    var _total = this.data.total;
    if (_page <= _total && _page <= 100) {
      this.setData({
        page: _page,
        moreText: "none"
      });
      this.getGoodsData(options);
    } else {
      this.setData({
        moreText: "block"
      });
    }
  },
})