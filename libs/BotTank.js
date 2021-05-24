const Tank = require('./Tank.js');

const GameSettings = require('./GameSettings.js');

module.exports = class BotTank extends Tank
{
  constructor(strNickName, rectField, setWall)
  {
    super('', strNickName, rectField, setWall);

    this.isBot = true;
    this.fSpeed = GameSettings.BOTTANK_SPEED;
    this.objMovement['forward'] = true;
  }

  update(fDeltaTime, rectField, setWall)
  {
    const bDrived = super.update(fDeltaTime, rectField, setWall);

    if (!bDrived){
      //前進できなかった
      this.fAngle = Math.random() * 2 * Math.PI;
    }
  }
}