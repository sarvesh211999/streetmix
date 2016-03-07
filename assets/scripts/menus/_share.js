/* global signedIn, street, signInData */
/* global FACEBOOK_APP_ID, _getPageTitle, htmlEncode */
'use strict'

var TRACK_ACTION_FACEBOOK = 'Facebook'
var TRACK_ACTION_TWITTER = 'Twitter'

var Menu = require('./menu')
var shareUrl = require('../util/share_url')
var eventTracking = require('../app/event_tracking')

var shareMenu = new Menu('share', {
  alignment: 'right',
  onInit: function () {
    document.querySelector('#share-via-twitter').addEventListener('pointerdown', _shareViaTwitter)
    document.querySelector('#share-via-facebook').addEventListener('pointerdown', _shareViaFacebook)
  },
  onShow: function () {
    // Auto-focus and select link when share menu is active
    var el = document.querySelector('#share-via-link')
    window.setTimeout(function () {
      el.focus()
      el.select()
    }, 200)
  }
})

function _shareViaTwitter () {
  eventTracking.track('Sharing', TRACK_ACTION_TWITTER, null, null, false)
}

function _shareViaFacebook () {
  eventTracking.track('Sharing', TRACK_ACTION_FACEBOOK, null, null, false)
}

function _getSharingMessage () {
  var message = ''

  if (signedIn) {
    if (!street.creatorId) {
      message = 'Check out ' + street.name + ' street on Streetmix!'
    } else if (street.creatorId === signInData.userId) {
      message = 'Check out my street, ' + street.name + ', on Streetmix!'
    } else {
      message = 'Check out ' + street.name + ' street by @' + street.creatorId + ' on Streetmix!'
    }
  } else {
    message = 'Check out ' + street.name + ' street on Streetmix!'
  }

  return message
}

function _updateFacebookLink (url) {
  var el = document.querySelector('#share-via-facebook')
  var text = _getSharingMessage()
  var appId = FACEBOOK_APP_ID

  // TODO const
  el.href = 'https://www.facebook.com/dialog/feed' +
    '?app_id=' + encodeURIComponent(appId) +
    '&redirect_uri=' + encodeURIComponent(url) +
    '&link=' + encodeURIComponent(url) +
    '&name=' + encodeURIComponent(_getPageTitle()) +
    '&description=' + encodeURIComponent(htmlEncode(text))
}

function _updateTwitterLink (url) {
  var el = document.querySelector('#share-via-twitter')

  var text = _getSharingMessage()

  // TODO const
  el.href = 'https://twitter.com/intent/tweet' +
    '?text=' + encodeURIComponent(text) +
    '&url=' + encodeURIComponent(url)
}

function _updateNakedLink (url) {
  document.querySelector('#share-via-link').value = url
}

function _updateShareMenu () {
  var url = shareUrl.getSharingUrl()

  _updateNakedLink(url)
  _updateTwitterLink(url)
  _updateFacebookLink(url)

  if (!signedIn) {
    document.querySelector('#sign-in-promo').classList.add('visible')
  }
}

shareMenu.update = _updateShareMenu

module.exports = shareMenu
