const World = require('./World.js');
const OverlapTester = require('./OverlapTester.js');

const SharedSettings = require('../public/js/SharedSettings.js');
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

        //まだゲーム開始前.プレイしていない通信のソケットIDに追加
        world.setNotPlayingSocketID.add(socket.id);

        socket.on('enter-the-game',
          (objConfig)=>{
            console.log('enter-the-game : socket.id=%s',socket.id);
            tank = world.createTank(socket.id, objConfig.strNickName);
          }
        );

        socket.on('change-my-movement',
          (objMovement)=>{
            if(!tank || 0===tank.iLife){
              return;
            }
            tank.objMovement = objMovement; //動作
          }
        );

        socket.on('shoot',
          () => {
            if (!tank || 0===tank.iLife) return;
            world.createBullet(tank); //ショット
          }
        );

        socket.on('disconnect',
          ()=>{
            console.log('disconnect : socket.id=%s',socket.id);
            if (!tank) {
              // プレイしていない通信のソケットIDリストから削除
              world.setNotPlayingSocketID.delete(socket.id);
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
        // io.emit('update',
        //   Array.from(world.setTank), //Tankのリスト、Setオブジェクトは送信不可(SetにJSON変換が未定義だから?)
        //   Array.from(world.setWall),
        //   Array.from(world.setBullet),
        //   iNanosecDiff);
        world.setTank.forEach(
          (tank)=>{
            if ('' !== tank.strSocketID) { //botやらない
              const rectVisibleArea = {
                fLeft: tank.fX - SharedSettings.CANVAS_WIDTH * 0.5,
                fBottom: tank.fY - SharedSettings.CANVAS_HEIGHT * 0.5,
                fRight: tank.fX + SharedSettings.CANVAS_WIDTH * 0.5,
                fTop: tank.fY + SharedSettings.CANVAS_HEIGHT * 0.5,
              };
              io.to(tank.strSocketID).emit('update',
                Array.from(world.setTank).filter(
                  (tank)=>{ return OverlapTester.overlapRects(rectVisibleArea, tank.rectBound); }
                ),
                Array.from(world.setWall).filter(
                  (wall)=>{ return OverlapTester.overlapRects(rectVisibleArea, wall.rectBound); }
                ),
                Array.from(world.setBullet).filter(
                  (bullet)=>{ return OverlapTester.overlapRects(rectVisibleArea, bullet.rectBound); }
                ),
                iNanosecDiff
              ); //個別送信
            }
          }
        );

        //プレイしていないsocketごとの処理
        const rectVisibleArea = {
          fLeft: SharedSettings.FIELD_WIDTH * 0.5 - SharedSettings.CANVAS_WIDTH * 0.5,
          fBottom: SharedSettings.FIELD_HEIGHT * 0.5 - SharedSettings.CANVAS_HEIGHT * 0.5,
          fRight: SharedSettings.FIELD_WIDTH * 0.5 + SharedSettings.CANVAS_WIDTH * 0.5,
          fTop: SharedSettings.FIELD_HEIGHT * 0.5 + SharedSettings.CANVAS_HEIGHT * 0.5,
        };
        world.setNotPlayingSocketID.forEach(
          (strSocketID) => {
            io.to(strSocketID).emit('update',
              Array.from(world.setTank).filter(
                (tank) => { return OverlapTester.overlapRects(rectVisibleArea, tank.rectBound); }
              ),
              Array.from(world.setWall).filter(
                (wall) => { return OverlapTester.overlapRects(rectVisibleArea, wall.rectBound); }
              ),
              Array.from(world.setBullet).filter(
                (bullet) => { return OverlapTester.overlapRects(rectVisibleArea, bullet.rectBound); }
              ),
              iNanosecDiff);	// 個別送信
          });
      },
      1000 / GameSettings.FRAMERATE //[ms]
    );

  }
}