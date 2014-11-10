(function(exports) {
  'use strict';

  /*
   * Interface based on the API exposed in [1]
   * [1] https://wiki.mozilla.org/Loop/Architecture/Rooms
   */


  var Rooms = {
    // Retrieve all rooms
    getAll: function() {
      return new Promise(function(resolve, reject) {
        ClientRequestHelper.getRooms(resolve, reject);
      });
    },
    // Retrieve all rooms given a version number
    getChanges: function(version) {

    },
    // Create one room given some params
    create: function(params) {
      return new Promise(function(resolve, reject) {
        ClientRequestHelper.createRoom(params, resolve, reject);
      });
    },
    // Get info from a room given a token
    get: function(token) {
      return new Promise(function(resolve, reject) {
        ClientRequestHelper.getRoom(token, resolve, reject);
      });
    },
    // Delete a room given a token
    delete: function(token) {
      return new Promise(function(resolve, reject) {
        ClientRequestHelper.deleteRoom(token, resolve, reject);
      });
    },
    // Join a room given a token
    join: function(token, params) {
      return new Promise(function(resolve, reject) {
        ClientRequestHelper.joinRoom(token, params, resolve, reject);
      });
    },
    // Refresh my status in order to keep me connected to a room.
    // This must be done periodically
    refresh: function(token) {

    },
    // Leave a room and indicates the reason
    leave: function(token) {
      return new Promise(function(resolve, reject) {
        ClientRequestHelper.leaveRoom(token, resolve, reject);
      });
    }
  };


  exports.Rooms = Rooms;

}(this));