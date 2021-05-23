const GameObject = require('./GameObject.js');

const SharedSettings = require('../public/js/SharedSettings.js');
const GameSettings = require('./GameSettings.js');

module.exports = class Tank extends GameObject
{
  constructor()
  {
    super(SharedSettings.TAKN_WIDTH, SharedSettings.TAKN_HEIGHT, 0.0, 0.0, Math.random() * 2 * Math.PI);

    this.objMovement = {}; //動作
    this.fSpeed = GameSettings.TANK_SPEED;
    this.fRotationSpeed = GameSettings.TANK_ROTATION_SPEED;

    this.fX = Math.random() * (SharedSettings.FIELD_WIDTH-SharedSettings.TANK_WIDTH);
    this.fY = Math.random() * (SharedSettings.FIELD_HEIGHT-SharedSettings.TANK_HEIGHT);
  }

  update(fDeltaTime)
  {
    const fDistance = this.fSpeed * fDeltaTime;
    if (this.objMovement['forward'])
    {
      this.fX += fDistance * Math.cos(this.fAngle);
      this.fY += fDistance * Math.sin(this.fAngle);
    }
    if (this.objMovement['back'])
    {
      this.fX -= fDistance * Math.cos(this.fAngle);
      this.fY -= fDistance * Math.sin(this.fAngle);
    }

    if (this.objMovement['left'])
    {
      this.fAngle -= this.fRotationSpeed * fDeltaTime;
    }
    if (this.objMovement['right'])
    {
      this.fAngle += this.fRotationSpeed * fDeltaTime;
    }
  }
}