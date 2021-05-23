const Tank = require('./Tank.js');

//ワールドクラス
module.exports = class World{
  constructor(io)
  {
    this.io = io;
    this.setTank = new Set();
  }

  update(fDeltaTime)
  {
    this.updateObjects(fDeltaTime);
    this.checkCollisions();
    this.doNewActions(fDeltaTime);
  }

  updateObjects(fDeltaTime)
  {
    this.setTank.forEach(
      (tank)=> {
        tank.update(fDeltaTime);
      }
    );
  }

  checkCollisions()
  {

  }

  doNewActions(fDeltaTime)
  {

  }

  createTank()
  {
    const tank = new Tank();
    this.setTank.add(tank);
    return tank;
  }
  destroyTank(tank)
  {
    this.setTank.delete(tank);
  }
}