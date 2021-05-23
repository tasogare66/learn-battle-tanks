class Assets
{
  constructor()
  {
    this.imageField = new Image();
    this.imageField.src = '../images/grass01.png';
    this.rectFieldInFieldImage = {sx:0,sy:0,sw:512,sh:512};

    this.imageItems = new Image();
    this.imageItems.src = '../images/items.png';

    // アイテム画像
    this.arectTankInItemsImage = [
      { sx: 2, sy: 2, sw: 16, sh: 16 },
      { sx: 20, sy: 2, sw: 16, sh: 16 },
    ];
    this.rectWallInItemsImage = { sx: 38, sy: 2, sw: 64, sh: 16 };
    this.rectBulletInItemsImage = { sx: 104, sy: 2, sw: 8, sh: 8 };
  }
}