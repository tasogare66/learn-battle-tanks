const World = require('./World.js');

const GameSettings = require('./GameSettings.js');

module.exports = class Game
{
  start(io)
  {
    const world = new World(io);
    let iTimeLast = Date.now();

    io.on(
      'connection',
      (socket)=>{
        console.log('connection : socket.id=%s', socket.id);
        socket.on('disconnect',
        ()=>{
          console.log('disconnect : socket.id=%s',socket.id);
        });
      }
    );
    //周期処理
    setInterval(
      ()=>{
        const iTimeCurrent = Date.now(); //ms
        const fDeltaTime = (iTimeCurrent - iTimeLast) * 0.001; //to second
        iTimeLast = iTimeCurrent;
        //処理時間計測
        const hrtime = process.hrtime();
        world.update(fDeltaTime);

        const hrtimeDiff = process.hrtime(hrtime);
        const iNanosecDiff = hrtimeDiff[0] * 1e9 + hrtimeDiff[1];

        //最新状況をクライアントに送信
        io.emit('update', iNanosecDiff);
      },
      1000 / GameSettings.FRAMERATE //[ms]
    );

  }
}