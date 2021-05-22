'use strict'

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Game = require('./libs/Game.js');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const PORT_NO = process.env.PORT || 1337;

const game = new Game();
game.start(io);

app.use(express.static(__dirname+'/public'));

server.listen(
  PORT_NO,
  ()=>{
    console.log('Starting server on port %d',PORT_NO);
  }
);