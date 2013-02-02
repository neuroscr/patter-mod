// netserver.js
// ProxyServer for ADN authentication/session functions
// Utility functions for dealing with app.net

// this could be combined or replace appnet.js

/*global define:true */
// we get API through appnet
define(['appnet'],
function (appnet) {
  'use strict';

  var netserver = {
    appnet: appnet
  };

  //console.log('listener set up');
  document.addEventListener('init', function (e) {
    console.log('netserver::init');
    appnet.init(e.data.tokenCookie, e.data.urlCookie);

    // let netclient-api update it's token
    var evt = document.createEvent('Event');
    evt.initEvent('ADN_API_init_response', true, true);
    evt.data = appnet.api.accessToken;
    document.dispatchEvent(evt);
  }, false);

// Probably should be this object's responsibility to handle session
  document.addEventListener('isLogged', function (e) {
    console.log('netserver::isLogged');
    var evt = document.createEvent('Event');
    evt.initEvent('isLoggedResponse', true, true);
    evt.data = e.data;
    evt.data.result = appnet.api.accessToken !== null && appnet.api.accessToken !== undefined;
    document.dispatchEvent(evt);
  }, false);

  document.addEventListener('updateUser', function (e) {
    console.log('netserver::updateUser');
    var complete = {
      success: e.data.success,
      failure: e.data.failure
    };
    appnet.api.getUser('me', { 'include_annotations': 1 },
               appnet.$.proxy(appnet.updateUserSuccess, complete),
               appnet.$.proxy(appnet.updateUserFailure, complete));
  }, false);

  document.addEventListener('ADN_API_init', function (e) {
    console.log('netserver::ADN_API_init');
    appnet.api.init(e.data.newAuthCookie, e.data.newUrlCookie);
    var evt = document.createEvent('Event');
    evt.initEvent('ADN_API_init_response', true, true);
    evt.data = appnet.api.accessToken;
    document.dispatchEvent(evt);
  }, false);

  document.addEventListener('ADN_API_authorize', function (e) {
    console.log('netserver::ADN_API_authorize');
    appnet.api.authorize();
  }, false);

  document.addEventListener('ADN_API_call', function (e) {
    console.log('netserver::ADN_API_call');
    // functors should be executed on the client
    var evt = document.createEvent('Event');
    evt.initEvent('ADN_API_call_response', true, true);
    evt.data = e.data;
    var success = function (resp) {
      // send success event
      evt.data.result = 1; // success
      evt.data.response = resp;
      document.dispatchEvent(evt);
    };
    var failure = function (resp) {
      // send failure event
      evt.data.result = 0; // failure
      evt.data.response = resp;
      document.dispatchEvent(evt);
    };
    appnet.api.call(e.data.url, e.data.type, e.data.args, success, failure, e.data.data);
  }, false);

  return netserver;
});
