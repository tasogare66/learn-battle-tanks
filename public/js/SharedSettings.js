class SharedSettings{
  static get FIELD_WIDTH() {return 1024.0;}
  static get FIELD_HEIGHT() {return 1024.0;}
}

if (typeof module != 'undefined' && typeof module.exports !== 'undefined')
{
  //サーバー処理(Node.js処理)用の記述
  module.exports = SharedSettings;
}