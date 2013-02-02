// netclient-api.js
//
// EventProxy abstraction for API calls on the app.net web service

/*global define: true */
define(['jquery'],
function ($) {
  'use strict';

  var netclientapi = {
    accessToken: null
  };

  netclientapi.init = function (newAuthCookie, newUrlCookie)
  {
    console.log('netclientapi::init');
    var evt = document.createEvent('Event');
    evt.initEvent('ADN_API_init', true, true);
    evt.data = {};
    evt.data.newAuthCookie = newAuthCookie;
    evt.data.newUrlCookie = newUrlCookie;
    document.dispatchEvent(evt);
  };

  document.addEventListener('ADN_API_init_response', function (e) {
    console.log('netclient::ADN_API_init_response', e.data);
    netclientapi.accessToken = e.data;
  }, false);

  function makeUrl(pieces)
  {
    var result = '';
    var i = 0;
    for (i = 0; i < pieces.length; i += 1)
    {
      if (pieces[i])
      {
        result += pieces[i];
      }
    }
    return result;
  }

  function add(name, type, url)
  {
    netclientapi[name] = function (args, success, failure) {
      this.call(url, type, args, success, failure);
    };
  }

  function addOne(name, type, prefix, suffix)
  {
    netclientapi[name] = function (target, args, success, failure) {
      var url = makeUrl([prefix, target, suffix]);
      this.call(url, type, args, success, failure);
    };
  }

  function addTwo(name, type, prefix, middle, suffix)
  {
    netclientapi[name] = function (first, second, args, success, failure) {
      var url = makeUrl([prefix, first, middle, second, suffix]);
      this.call(url, type, args, success, failure);
    };
  }

  function addList(name, type, url)
  {
    netclientapi[name] = function (list, argsIn, success, failure) {
      var ids = list.join(',');
      var args = { ids: ids};
      $.extend(args, argsIn);
      this.call(url, type, args, success, failure);
    };
  }

  function addData(name, type, url)
  {
    netclientapi[name] = function (data, args, success, failure) {
      this.call(url, type, args, success, failure, data);
    };
  }

  function addDataOne(name, type, prefix, suffix)
  {
    netclientapi[name] = function (target, data, args, success, failure) {
      var url = makeUrl([prefix, target, suffix]);
      this.call(url, type, args, success, failure, data);
    };
  }

  // ------------------------------------------------------------------------
  // User
  // ------------------------------------------------------------------------

  // getUser(userId, args, success, failure);
  addOne('getUser', 'GET',
         'https://alpha-api.app.net/stream/0/users/');

  // getUserList([userId1, userId2], args, success, failure);
  addList('getUserList', 'GET',
          'https://alpha-api.app.net/stream/0/users');

  // updateUser(newUser, args, success, failure);
  addData('updateUser', 'PUT',
          'https://alpha-api.app.net/stream/0/users/me');

  // ------------------------------------------------------------------------
  // Channel
  // ------------------------------------------------------------------------

  // createChannel
  addData('createChannel', 'POST',
          'https://alpha-api.app.net/stream/0/channels');

  // getChannel(channelId, args, success, failure);
  addOne('getChannel', 'GET',
         'https://alpha-api.app.net/stream/0/channels/');

  // getChannelList([channelId1, channelId2], args, success, failure);
  addList('getChannelList', 'GET',
          'https://alpha-api.app.net/stream/0/channels/');

  // updateChannel(channelId, newChannel, args, success, failure);
  addDataOne('updateChannel', 'PUT',
             'https://alpha-api.app.net/stream/0/channels/');

  // ------------------------------------------------------------------------
  // Message
  // ------------------------------------------------------------------------

  // getMessages(channelId, args, success, failure);
  addOne('getMessages', 'GET',
         'https://alpha-api.app.net/stream/0/channels/', '/messages');

  // createMessage(channelId, newMessage, args, success, failure);
  addDataOne('createMessage', 'POST',
             'https://alpha-api.app.net/stream/0/channels/', '/messages');

  // deleteMessage(messageId, args, success, failure);
  addTwo('deleteMessage', 'DELETE',
         'https://alpha-api.app.net/stream/0/channels/', '/messages/');

  // ------------------------------------------------------------------------
  // Post
  // ------------------------------------------------------------------------

  // createPost(newPost, args, success, failure);
  addData('createPost', 'POST',
          'https://alpha-api.app.net/stream/0/posts');

  // ------------------------------------------------------------------------
  // Subscription
  // ------------------------------------------------------------------------

  // getSubscriptions(args, success, failure);
  add('getSubscriptions', 'GET',
      'https://alpha-api.app.net/stream/0/channels/');

  // createSubscription(channelId, args, success, failure);
  addOne('createSubscription', 'POST',
         'https://alpha-api.app.net/stream/0/channels/', '/subscribe');

  // deleteSubscription(channelId, args, success, failure);
  addOne('deleteSubscription', 'DELETE',
         'https://alpha-api.app.net/stream/0/channels/', '/subscribe');

  // ------------------------------------------------------------------------
  // Marker
  // ------------------------------------------------------------------------

  // updateMarker(newMarker, args, success, failure);
  addData('updateMarker', 'POST',
          'https://alpha-api.app.net/stream/0/posts/marker');

  netclientapi.authorize = function ()
  {
    console.log('netclientapi::authorize');
    var evt = document.createEvent('Event');
    evt.initEvent('ADN_API_authorize', true, true);
    document.dispatchEvent(evt);
  };

  // args can be null
  netclientapi.call = function (url, type, args, success, failure, data)
  {
    // , url, type, args, data
    console.log('netclientapi::call');
    var evt = document.createEvent('Event');
    evt.initEvent('ADN_API_call', true, true);
    evt.data = {};
    evt.data.url = url;
    evt.data.type = type;
    evt.data.args = args;
    evt.data.success = success;
    evt.data.failure = failure;
    evt.data.data = data;
    document.dispatchEvent(evt);
  };

  return netclientapi;
});
