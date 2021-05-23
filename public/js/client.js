'use strict';

const socket = io.connect();
const canvas = document.querySelector('#canvas-2d');
const screen = new Screen(socket, canvas);

screen.animate(0);

$(window).on(
  'beforeunload',
  (event)=>
  {
    socket.disconnect();
  }
);

// キー入力の処理
let objMovement = {}; //動作
$(document).on(
  'keydown keyup',
  (event) => {
    const KeyToCommand = {
      'ArrowUp': 'forward',
      'ArrowDown': 'back',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
    };
    const command = KeyToCommand[event.key];
    if (command)
    {
      if (event.type == 'keydown'){
        objMovement[command] = true;
      } else {
        objMovement[command] = false;
      }
      // サーバーに, イベント名'change-my-ovement' objMovementオブジェクトを送信
      socket.emit('change-my-movement', objMovement);
    }

    if (' '===event.key && 'keydown' == event.type)
    {
      socket.emit('shoot');
    }
  }
);

//start button
$('#start-button').on(
  'click',()=>{
    const objConfig = { strNickName: $('#nickname').val() };
    socket.emit('enter-the-game', objConfig);
    $('#start-screen').hide();
  }
);