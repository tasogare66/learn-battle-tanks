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
        let tank = null;

        socket.on('enter-the-game',
          ()=>{
            console.log('enter-the-game : socket.id=%s',socket.id);
            tank = world.createTank();
          }
        );

        socket.on('change-my-movement',
          (objMovement)=>{
            if(!tank){
              return;
            }
            tank.objMovement = objMovement; //動作
          }
        );

        socket.on('shoot',
          () => {
            if (!tank) return;
            world.createBullet(tank); //ショット
          }
        );

        socket.on('disconnect',
          ()=>{
            console.log('disconnect : socket.id=%s',socket.id);
            if (!tank) {
              return;
            }
            world.destroyTank(tank);
            tank = null; //自タンク解放
          }
        );
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
        io.emit('update',
          Array.from(world.setTank), //Tankのリスト、Setオブジェクトは送信不可(SetにJSON変換が未定義だから?)
          Array.from(world.setWall),
          Array.from(world.setBullet),
          iNanosecDiff);
      },
      1000 / GameSettings.FRAMERATE //[ms]
    );

  }
}