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

//タッチ情報
const touches = {};

//タッチ開始
$('#canvas-2d').on(
  'touchstart',(event)=>{
    event.preventDefault();
    socket.emit('shoot');
    objMovement['forward'] = true;
    Array.from(event.originalEvent.changedTouches).forEach(
      (touch) => {
        touches[touch.identifier] = { pageX: touch.pageX, pageY: touch.pageY };
      }
    );
  }
);

//タッチしながら移動
$('#canvas-2d').on(
  'touchmove',(event)=>{
    event.preventDefault(); //ブラウザ規定の動作の抑止
    objMovement['right']=false;
    objMovement['left']=false;
    Array.from(event.originalEvent.changedTouches).forEach(
      (touch)=>{
        const startTouch = touches[touch.identifier];
        objMovement['right'] |= (30 < (touch.pageX - startTouch.pageX));
        objMovement['left'] |= (-30 > (touch.pageX - startTouch.pageX));
      }
    );
    socket.emit('change-my-movement',objMovement);
  }
);

//タッチ終了
$('#canvas-2d').on(
  'touchend',(event)=>{
    event.preventDefault();
    Array.from(event.originalEvent.changedTouches).forEach(
      (touch)=>{
        delete touches[touch.identifier];
      }
    );
    if (0===Object.keys(touches).length){
      objMovement={};
      socket.emit('change-my-movement', objMovement);
    }
  }
);
