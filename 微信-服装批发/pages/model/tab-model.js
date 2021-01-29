import {
  Base
} from '../common/base.js';

class Tab extends Base {
  constructor() {
    super();
  }

  getDataFromServer(url, data, callback, ecallback) {
    var param = {
      url: url,
      data: data,
      sCallback: function(res) {
        callback && callback(res)
      },
      eCallback: function(err) {
        ecallback && ecallback(err)
      }
    }
    this.request(param)
  }

  uploadFiles(url, filePath, name, formData, callback) {
    var param = {
      url: url, //图片上传接口地址
      filePath: filePath,
      name: name,
      formData: formData,
      sCallback: function(res) {
        callback && callback(res)
      }
    }
    this.uploadFile(param)
  }

  //提交名片id
  postCardId(url, data, ty, callback, ecallback) {
    var param = {
      url: url,
      data: data,
      type: ty,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      sCallback: function(res) {
        callback && callback(res)
      },
      eCallback: function(err) {
        ecallback && ecallback(err)
      }
    }
    this.request(param)
  }
}

export {
  Tab
}