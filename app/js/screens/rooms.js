(function(exports) {
  
  'use strict';

  var _panel, _createButton, _listButton, _list, _closeButton, _connectedPanel, _closeCPButton;

  var randomNames = ['Gato', 'Perro', 'Gorrión', 'León', 'Colibrí', 'Perezoso'];
  var randonColors = ['azul', 'rosa', 'verde', 'rojo', 'amarillo', 'verde'];

  var _session;
  var _constraints = {
    video: true,
    audio: true
  };

  function randomInteger(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
  }

  function _connect(room) {
    console.log('Conectando a la ROOM ' + JSON.stringify(room));
    _connectedPanel.classList.remove('hide');
    _connectedPanel.classList.add('show');

    var files = [
      'libs/tokbox/' + window.OTProperties.version + '/js/TB.js',
      'libs/opentok.js'
      
    ];

    LazyLoader.load(
      files,
      function onCallScreen() {
        _session = TB.initSession(room.apiKey, room.sessionId);

        _session.on({
          streamCreated: function(event) {
            // As we don't have multi party calls yet there will be only one peer.
            var subscriber =
              _session.subscribe(
                event.stream,
                'rcp-remote-video-container',
                null,
                function onSubscribe(error) {
                  if (error) {
                    console.log('OpenTok: ' + error.message);
                  } else {
                    console.log('OpenTok: SUBSCRIBED');
                  }
              }
            );
            subscriber.on({
              loaded: function() {
                console.log('OpenTok: SUBSCRIBER LOADED');
              }
            });
          }
        });


        _session.connect(room.sessionToken, function(e) {
          if (e) {
            console.log('OpenTok: ' + e.message)
            return;
          }
          Opentok.setConstraints(_constraints);
          _session.publish(
            'rcp-local-video-container',
            null,
            function onPublish(ee) {
              if (ee) {
                console.log('OpenTok: ' + ee.message);
              } else {
                console.log('OpenTok: STREAM PUBLISHED');
              }
            }
          );
        });
      }
    );

    
  }

  function _join(element) {
    element.querySelector('.r-participants').textContent = 1;
  }

  function _leave(element) {
    element.querySelector('.r-participants').textContent = 0;
  }

  function _delete(token) {
    Rooms.delete(token).then(_render);
  }

  function _render() {
    _list.innerHTML = '';
    return new Promise(function(resolve, reject) {
      Rooms.getAll().then(
        function(rooms) {
          for (var i = rooms.length - 1; i >= 0; i--) {
            console.log(JSON.stringify(rooms[i]));
            var li = document.createElement('li');
            li.innerHTML = '<p>Room: ' + rooms[i].roomName + '(<span class="r-participants">' + rooms[i].participants.length + '</span>)</p><p>' + Utils.getHeaderDate(rooms[i].creationTime*1000) + ' ' + Utils.getFormattedHour(rooms[i].creationTime*1000)+ '</p>';
            li.dataset.roomToken = rooms[i].roomToken;
            li.dataset.creationTime = rooms[i].creationTime;
            _list.appendChild(li);
          }
          resolve();
        },
        reject
      );
    });
  }

  var RoomScreen = {
    init: function() {

      if (!_panel) {
        _panel = document.getElementById('rooms-panel');
        _createButton = document.getElementById('rp-create-room-button');
        _closeButton = document.getElementById('rp-close-room-button');
        _listButton = document.getElementById('rp-list-rooms-button');
        _list = document.getElementById('rp-list-rooms');
        _connectedPanel = document.getElementById('room-connected-panel');
        _closeCPButton = document.getElementById('rcp-close-room-button');

        _closeCPButton.addEventListener(
          'click',
          function() {
            _connectedPanel.classList.remove('show');
            _connectedPanel.classList.add('hide');
            _session && _session.disconnect();
            
            document.getElementById('rcp-videos-container').innerHTML = '<div id="rcp-local-video-container"></div>' +
                                        '<div id="rcp-remote-video-container"></div>';
          }
        );

        _closeButton.addEventListener(
          'click',
          function() {
            RoomScreen.hide();
          }
        );

        _createButton.addEventListener(
          'click',
          function() {
            var params = {
              roomName: randomNames[randomInteger(0,5)] + ' ' + randonColors[randomInteger(0,5)],
              expiresIn: 24,
              roomOwner: 'Borja',
              maxSize: 2
            }
            Rooms.create(params).then(_render);
          }
        );

        _listButton.addEventListener(
          'click',
          function() {
            _render();
          }
        );

        _list.addEventListener(
          'contextmenu',
          function(e) {
            if (!e.target.dataset.roomToken) {
              return;
            }
            e.stopPropagation();
            e.preventDefault();
            var items = [
              {
                name: 'Leave',
                method: function(element) {
                  var token = element.dataset.roomToken;
                  Rooms.leave(token).then(function() {
                    _leave(element);
                  }, function(e) {
                    console.log(e);
                  });
                },
                params: [e.target]
              },
              {
                name: 'Join',
                method: function(element) {
                  var token = element.dataset.roomToken;
                  var params = {
                    displayName: "User from FxOS",
                    clientMaxSize: 2
                  };
                  Rooms.join(token, params).then(function(room) {
                    _join(element);
                    var options = new OptionMenu({
                      type: 'confirm',
                      section: 'Do you want to connect to the room?',
                      items: [
                        {
                          name: 'Connect',
                          method: function(element) {
                            _connect(room);
                          },
                          params: [e.target]
                        },
                        {
                          name: 'Cancel'
                        }
                      ]
                    });
                  }, function(e) {
                    console.log(e);
                  });
                },
                params: [e.target]
              },
              {
                name: 'Delete',
                method: function(element) {
                  var token = element.dataset.roomToken;
                  _delete(token);
                },
                params: [e.target]
              },
              {
                name: 'Cancel'
              }
            ];

            var options = new OptionMenu({
              type: 'action',
              items: items
            });
           
          }
        );

        _list.addEventListener(
          'click',
          function(e) {
            if (e.target.dataset.roomToken) {
              alert('Room created by ');
            }
          }
        );
      }


      _render().then(RoomScreen.show);
     
    },
    show: function() {
      _panel.classList.remove('hide');
      _panel.classList.add('show');
    },
    hide: function() {
      _panel.classList.remove('show');
      _panel.classList.add('hide');
    }

  };

  exports.RoomScreen = RoomScreen;

}(this));
