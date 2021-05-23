module.exports = class GameSettings
{
  static get FRAMERATE() { return 30; } //frame per sec

  static get TANK_SPEED() { return 150.0;}  //m/s
  static get TANK_ROTATION_SPEED() { return 3.0; } //rad/s
  static get TANK_WAIT_FOR_NEW_BULLET() { return 1000.0*0.2;} //ms

  //壁
  static get WALL_COUNT() {return 3;}

  //弾
  static get BULLET_SPEED() {return 300.0;}
  static get BULLET_LIFETIME_MAX() {return 2.0;}
}