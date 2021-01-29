function share() {
  wx.showToast({
    title: '点右上角-转发',
    icon: 'success',
  })
  setTimeout(function() {
    wx.hideToast()
  }, 2000)
}

function is_array(array, str) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == str) {
      return true
    }
  }
  return false
}

function addScreenAd(adId) {
  let interstitialAd = null
  // 在页面onLoad回调事件中创建插屏广告实例
  if (wx.createInterstitialAd) {
    interstitialAd = wx.createInterstitialAd({
      adUnitId: adId
    })
  }
  if (interstitialAd) {
    interstitialAd.show().catch((err) => {
      console.error(err)
    })
  }
  interstitialAd.onError((err) => {
    console.log('onError event emit', err)
  })
  interstitialAd.onClose((res) => {
    console.log('onClose event emit', res)
  })
}

function createvideoAd(adUnitId, url) {
  let videoAd = null;
  if (wx.createRewardedVideoAd) {
    videoAd = wx.createRewardedVideoAd({
      adUnitId: adUnitId
    })
  }
  if (videoAd) {
    videoAd.load()
      .then(() => videoAd.show())
      .catch(err => console.log(err.errMsg))
  }
  videoAd.onError(err => {
    console.log(err)
  })
  videoAd.onClose((status) => {
    if (status && status.isEnded || status === undefined) {

    } else {
      wx.reLaunch({
        url: url,
      })
    }
  })
}

module.exports = {
  share: share,
  is_array: is_array,
  createvideoAd: createvideoAd,
  addScreenAd: addScreenAd
}