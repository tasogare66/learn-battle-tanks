const GameObject = require('./GameObject.js');
const OverlapTester = require('./OverlapTester.js');
const Bullet = require('./Bullet.js');

const SharedSettings = require('../public/js/SharedSettings.js');
const GameSettings = require('./GameSettings.js');

module.exports = class Tank extends GameObject
{
  constructor(strSocketID, strNickName, rectField, setWall)
  {
    super(SharedSettings.TANK_WIDTH, SharedSettings.TANK_HEIGHT, 0.0, 0.0, Math.random() * 2 * Math.PI);

    this.strSocketID = strSocketID;
    this.strNickName = strNickName;
    this.objMovement = {}; //動作
    this.fSpeed = GameSettings.TANK_SPEED;
    this.fRotationSpeed = GameSettings.TANK_ROTATION_SPEED;
    this.iTimeLastShot = 0; //最終ショット時刻
    this.iLife = GameSettings.TANK_LIFE_MAX;
    this.iLifeMax = GameSettings.TANK_LIFE_MAX;
    this.iScore = 0;

    //障害物にぶつからない初期位置の算出
    do {
      this.setPos(rectField.fLeft + Math.random() * (rectField.fRight - rectField.fLeft),
        rectField.fBottom + Math.random() * (rectField.fTop - rectField.fBottom));
    } while (this.overlapWalls(setWall));
  }

  toJSON()
  {
    return Object.assign(
      super.toJSON(),
      {
        strSocketID: this.strSocketID,
        strNickName: this.strNickName,
        iLife: this.iLife,
        iLifeMax: this.iLifeMax,
        iScore: this.iScore,
      }
    );
  }

  update(fDeltaTime, rectField, setWall)
  {
    const fX_old = this.fX;
    const fY_old = this.fY;
    let bDrived = false; //前後方向に動きがあったか
    const fDistance = this.fSpeed * fDeltaTime;
    if (this.objMovement['forward'])
    {
      this.fX += fDistance * Math.cos(this.fAngle);
      this.fY += fDistance * Math.sin(this.fAngle);
      this.setPos(this.fX,this.fY);
      bDrived = true;
    }
    if (this.objMovement['back'])
    {
      this.fX -= fDistance * Math.cos(this.fAngle);
      this.fY -= fDistance * Math.sin(this.fAngle);
      this.setPos(this.fX,this.fY);
      bDrived = true;
    }
    if (bDrived) //更新ある場合衝突チェック
    {
      let bCollision = false;
      if (!OverlapTester.pointInRect(rectField, { fX: this.fX, fY: this.fY}))
      {
        bCollision = true;
      }
      else if(this.overlapWalls(setWall))
      {
        bCollision = true;
      }

      if (bCollision) {
        this.setPos(fX_old,fY_old); //戻す
        bDrived = false;
      }
    }

    if (this.objMovement['left'])
    {
      this.fAngle -= this.fRotationSpeed * fDeltaTime;
    }
    if (this.objMovement['right'])
    {
      this.fAngle += this.fRotationSpeed * fDeltaTime;
    }

    return bDrived; //前後の動きがあったか返す
  }

  canShoot()
  {
    return !(GameSettings.TANK_WAIT_FOR_NEW_BULLET > Date.now()-this.iTimeLastShot);
  }
  shoot()
  {
    if (!this.canShoot()){
      return null;
    }
    //最終ショット時刻
    this.iTimeLastShot = Date.now();
    const fX = this.fX + this.fWidth * 0.5 * Math.cos(this.fAngle);
    const fY = this.fY + this.fWidth * 0.5 * Math.sin(this.fAngle);
    return new Bullet(fX, fY, this.fAngle, this);
  }

  damage()
  {
    this.iLife--;
    return this.iLife;
  }
}