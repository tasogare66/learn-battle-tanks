const Tank = require('./Tank.js');
const Wall = require('./Wall.js');
const BotTank = require('./BotTank.js');

// 設定
const SharedSettings = require( '../public/js/SharedSettings.js' );
const GameSettings = require( './GameSettings.js' );
const OverlapTester = require('./OverlapTester.js');
const Game = require('./game.js');

//ワールドクラス
module.exports = class World{
  constructor(io)
  {
    this.io = io; //socketIO
    this.setTank = new Set(); //taknリスト
    this.setWall = new Set(); //壁リスト
    this.setBullet = new Set(); //弾丸リスト
    this.setNotPlayingSocketID = new Set(); //プレイしていない通信のsocketIDリスト

    //壁の生成
    for(let i=0;i<GameSettings.WALL_COUNT; i++){
      const fX_left = Math.random() * (SharedSettings.FIELD_WIDTH - SharedSettings.WALL_WIDTH);
      const fY_bottom = Math.random() * (SharedSettings.FIELD_HEIGHT - SharedSettings.WALL_HEIGHT);
      // 壁生成
      const wall = new Wall(fX_left + SharedSettings.WALL_WIDTH * 0.5,
        fY_bottom + SharedSettings.WALL_HEIGHT * 0.5);
      // 壁リストへの登録
      this.setWall.add(wall);
    }

    //botの生成
    for (let i=0; i<GameSettings.BOTTANK_COUNT; i++)
    {
      this.createBotTank('BOT'+(i+1));
    }
  }

  update(fDeltaTime)
  {
    this.updateObjects(fDeltaTime);
    this.checkCollisions();
    this.doNewActions(fDeltaTime);
  }

  updateObjects(fDeltaTime)
  {
    //tankの可動域
    const rectTankField = {
      fLeft: 0+SharedSettings.TANK_WIDTH*0.5,
      fBottom: 0+SharedSettings.TANK_HEIGHT*0.5,
      fRight: SharedSettings.FIELD_WIDTH - SharedSettings.TANK_WIDTH*0.5,
      fTop: SharedSettings.FIELD_HEIGHT - SharedSettings.TANK_HEIGHT*0.5
    };
    this.setTank.forEach(
      (tank)=> {
        tank.update(fDeltaTime, rectTankField, this.setWall);
      }
    );

    // 弾丸の可動域
    const rectBulletField = {
      fLeft: 0 + SharedSettings.BULLET_WIDTH * 0.5,
      fBottom: 0 + SharedSettings.BULLET_HEIGHT * 0.5,
      fRight: SharedSettings.FIELD_WIDTH - SharedSettings.BULLET_WIDTH * 0.5,
      fTop: SharedSettings.FIELD_HEIGHT - SharedSettings.BULLET_HEIGHT * 0.5
    };
    this.setBullet.forEach(
      (bullet)=>{
        const bDisappear = bullet.update(fDeltaTime, rectBulletField, this.setWall);
        if (bDisappear)
        {
          this.destroyBullet(bullet);
        }
      }
    );
  }

  checkCollisions()
  {
    this.setBullet.forEach(
      (bullet)=>{
        this.setTank.forEach(
          (tank)=>{
            if (tank != bullet.tank)
            {
              if (OverlapTester.overlapRects(tank.rectBound, bullet.rectBound))
              {
                if (0 === tank.damage()) {
                  console.log('dead : socket.id = %s', tank.strSocketID);
                  this.destroyTank(tank);
                }
                this.destroyBullet(bullet);
                bullet.tank.iScore++; //当てたtankの得点を加算
              }
            }
          }
        );
      }
    );
  }

  doNewActions(fDeltaTime)
  {
    //botは新な弾を打つかも
    this.setTank.forEach(
      (tank)=>{
        if (tank.isBot) {
          if (GameSettings.BOTTANK_SHOOT_PROBABLITY_PER_SEC*fDeltaTime>Math.random())
          {
            this.createBullet(tank);
          }
        }
      }
    );
  }

  createTank(strSocketID, strNickName)
  {
    //ゲーム開始,プレイしていな通信のソケットIDリストから削除
    this.setNotPlayingSocketID.delete(strSocketID);

    //tankの可動域
    const rectTankField = {
      fLeft: 0+SharedSettings.TANK_WIDTH*0.5,
      fBottom: 0+SharedSettings.TANK_HEIGHT*0.5,
      fRight: SharedSettings.FIELD_WIDTH - SharedSettings.TANK_WIDTH*0.5,
      fTop: SharedSettings.FIELD_HEIGHT - SharedSettings.TANK_HEIGHT*0.5
    };

    const tank = new Tank(strSocketID, strNickName, rectTankField, this.setWall);
    this.setTank.add(tank);
    return tank;
  }
  createBotTank(strNickName)
  {
    //tankの可動域
    const rectTankField = {
      fLeft: 0+SharedSettings.TANK_WIDTH*0.5,
      fBottom: 0+SharedSettings.TANK_HEIGHT*0.5,
      fRight: SharedSettings.FIELD_WIDTH - SharedSettings.TANK_WIDTH*0.5,
      fTop: SharedSettings.FIELD_HEIGHT - SharedSettings.TANK_HEIGHT*0.5
    };

    const tank = new BotTank(strNickName, rectTankField, this.setWall);
    this.setTank.add(tank);
  }
  destroyTank(tank)
  {
    this.setTank.delete(tank);

    if (tank.isBot)
    {
      //timerを設置し、新たなbotを生成する
      setTimeout(
        ()=>{
          this.createBotTank(tank.strNickName);
        }, GameSettings.BOTTANK_WAIT_FOR_NEW_BOT);
    }else{
      this.setNotPlayingSocketID.add(tank.strSocketID); //プレイしていない通信のソケットIDリストに追加
      this.io.to(tank.strSocketID).emit('dead'); //dead event
    }
  }

  createBullet(tank)
  {
    const bullet = tank.shoot();
    if (bullet) {
      this.setBullet.add(bullet);
    }
  }
  destroyBullet(bullet)
  {
    this.setBullet.delete(bullet);
  }
}