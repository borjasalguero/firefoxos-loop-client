(function(exports) {
  
  'use strict';

  var _panel, _createButton, _listButton, _list, _closeButton;

  var randomNames = ['Gato', 'Perro', 'Gorrión', 'León', 'Colibrí', 'Perezoso'];
  var randonColors = ['azul', 'rosa', 'verde', 'rojo', 'amarillo', 'verde'];

  function randomInteger (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
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
            li.innerHTML = '<p>Room: ' + rooms[i].roomName + '</p><p>' + Utils.getHeaderDate(rooms[i].creationTime*1000) + ' ' + Utils.getFormattedHour(rooms[i].creationTime*1000)+ '</p>';
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
        _list = document.getElementById('rp-list-rooms')

        _closeButton.addEventListener(
          'click',
          function() {
            RoomScreen.hide();
          }
        )

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

            var options = new OptionMenu({
              type: 'action',
              items: [
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
              ]
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
