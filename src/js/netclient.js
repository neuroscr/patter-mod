// base.js
//
// EventProxyClient for appnet.js
// authorization and session proxyclient

/*global define:true */

define(['jquery', 'js/util', 'js/netclient-api', 'js/appnet', 'js/appnet-note', 'js/netserver'],
function ($, util, netclientapi, appnet, note, netserver) {
  'use strict';

  var netclient = {
    api: netclientapi, // proxy stub
    note: note, // real deal
    user: null // user object proxy
  };

  netclient.init = function (tokenCookie, urlCookie)
  {
    var evt = document.createEvent('Event');
    evt.initEvent('init', true, true);
    evt.data = {};
    evt.data.tokenCookie = tokenCookie;
    evt.data.urlCookie = urlCookie;
    document.dispatchEvent(evt);
  };

  netclient.isLogged = function () {
    // but our values aren't set or up to date
    return this.api.accessToken !== null && this.api.accessToken !== undefined;
  };

  document.addEventListener('ADN_API_call_response', function (e) {
    //, e.data.url
    console.log('netclient::ADN_API_call_response', e.data.result);
    //appnet.updateUser(e.data.success, e.data.failure);
    if (e.data.url === 'https://alpha-api.app.net/stream/0/users/me' && e.data.type === 'GET') {
      //console.log('getUser response!', e.data.response);
      this.user = e.data.response.data;
    }
    if (e.data.result) {
      if (e.data.success) {
        e.data.success(e.data.response);
      }
    } else {
      if (e.data.failure) {
        e.data.failure(e.data.response);
      }
    }
  }, false);

  netclient.updateUser = function (success, failure)
  {
    netclient.api.getUser('me', { 'include_annotations': 1 }, success, failure);
  };

  // @ryantharp: Compat shims, could be refactored out of appnet into appnet-utils
  netclient.textToHtml = appnet.textToHtml;
  netclient.renderStatus = appnet.renderStatus;

  return netclient;
});
