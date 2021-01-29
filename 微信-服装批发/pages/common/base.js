import {
  Config
} from './config.js';

class Base {
  constructor() {
    "use strict";
    this.baseRestUrl = Config.restUrl;
  }

  request(params) {
    var that = this,
      url = this.baseRestUrl + params.url;
    if (!params.type) {
      params.type = 'get';
    }
    /*不需要再次组装地址*/
    if (params.setUpUrl == false) {
      url = params.url;
    }
    if (!params.header) {
      params.header = {
        'content-type': 'application/json',
      }
    }
    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header: params.header,
      success: function(res) {
        params.sCallback && params.sCallback(res);
      },
      fail: function(err) {
        // that._processError(err);
        params.eCallback && params.eCallback(err);
      }
    });
  }

  _processError(err) {
    console.log(err);
  }

  /*获得元素上的绑定的值*/
  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  };

  /**获取上传图片 */
  uploadFile(params) {
    wx.uploadFile({
      url: this.baseRestUrl + params.url, //图片上传接口地址
      filePath: params.filePath,
      name: params.name,
      formData: params.formData,
      success: function(res) {
        params.sCallback && params.sCallback(res);
      },
      fail: function(err) {
        // that._processError(err);
        params.eCallback && params.eCallback(err);
      }
    })
  }

  //提示框
  showModal(title, content, callback) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function(res) {
        callback && callback(res)
      }
    })
  }


  //设置缓存
  setStorage(key, data) {
    wx.setStorage({
      key: key,
      data: data,
    });
  }

  getStorage(key, callback) {
    wx.getStorage({
      key: key,
      success: function(res) {
        callback && callback(res)
      }
    })
  }

};

export {
  Base
};