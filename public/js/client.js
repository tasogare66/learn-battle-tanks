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