//ワールドクラス
module.exports = class World{
  constructor(io)
  {
    this.io = io;
  }

  update(fDeltaTime)
  {
    this.updateObjects(fDeltaTime);
    this.checkCollisions();
    this.doNewActions(fDeltaTime);
  }

  updateObjects(fDeltaTime)
  {

  }

  checkCollisions()
  {

  }

  doNewActions(fDeltaTime)
  {

  }
}