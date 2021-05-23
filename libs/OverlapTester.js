module.exports = class OverlapTester
{
  static overlapRects(rect1,rect2)
  {
    if (rect1.fLeft > rect2.fRight) {
      return false;
    }
    if (rect1.fRight < rect2.fLeft) {
      return false;
    }
    if (rect1.fBottom > rect2.fTop) {
      return false;
    }
    if (rect1.fTop < rect2.fBottom) {
      return false;
    }
    return true; //overlap
  }

  static pointInRect(rect, point)
  {
    return rect.fLeft <= point.fX
      && rect.fRight >= point.fX
      && rect.fBottom <= point.fY
      && rect.fTop >= point.fY;
  }
}