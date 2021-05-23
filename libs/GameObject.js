module.exports = class GameObject
{
  constructor(fWidth, fHeight, fX, fY, fAngle)
  {
    this.fWidth = fWidth;
    this.fHeight = fHeight;
    this.fX = fX;
    this.fY = fY;
    this.fAngle = fAngle;
  }

  toJSON()
  {
    return {
      fX: this.fX,
      fY: this.fY,
      fAngle: this.fAngle
    };
  }
};