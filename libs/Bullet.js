const GameObject = require('./GameObject.js');
const OverlapTester = require('./OverlapTester.js');

//設定
const SharedSettings = require('../public/js/SharedSettings.js');
const GameSettings = require('./GameSettings.js');

module.exports = class Bullet extends GameObject
{
  constructor(fX, fY, fAngle, tank)
  {
    super(SharedSettings.BULLET_WIDTH, SharedSettings.BULLET_HEIGHT, fX, fY, fAngle);

    this.fSpeed = GameSettings.BULLET_SPEED;
    this.tank = tank;
    this.fLifeTime = GameSettings.BULLET_LIFETIME_MAX;
  }

  update(fDeltaTime, rectField, setWall)
  {
    this.fLifeTime -= fDeltaTime;
    if (0>this.fLifeTime){
      return true; //寿命
    }

    const fDistance = this.fSpeed * fDeltaTime;
    this.setPos(this.fX + fDistance*Math.cos(this.fAngle),
      this.fY + fDistance * Math.sin(this.fAngle));

    let bCollision = false;
    if (!OverlapTester.pointInRect(rectField, { fX: this.fX, fY: this.fY }))
    {
      bCollision = true;
    }
    else if (this.overlapWalls(setWall))
    {
      bCollision = true;
    }

    return bCollision;
  }
}