class Screen
{
  constructor(socket, canvas)
  {
    this.socket = socket;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.assets = new Assets();
    this.iProcessingTimeNanoSec = 0;

    this.canvas.width = SharedSettings.FIELD_WIDTH;
    this.canvas.height = SharedSettings.FIELD_HEIGHT;

    this.initSocket();

    this.context.mozImageSmoothingEnabled = false;
    this.context.webkitImageSmoothingEnabled = false;
    this.context.msImageSmoothingEnabled = false;
    this.context.imageSmoothingEnabled = false;
  }

  initSocket()
  {
    this.socket.on(
      'connect', ()=>
      {
        console.log('connect : socket.id = %s', socket.id);
        this.socket.emit('enter-the-game');
      }
    );
    this.socket.on(
      'update', (iProcessingTimeNanoSec)=>{
        this.iProcessingTimeNanoSec = iProcessingTimeNanoSec;
      }
    );
  }

  animate(iTimeCurrent)
  {
    requestAnimationFrame(
      (iTimeCurrent)=>{
        this.animate(iTimeCurrent);
      }
    );
    this.render(iTimeCurrent);
  }

  render(iTimeCurrent)
  {
    this.context.clearRect(0,0,canvas.width,canvas.height);
    this.renderField();

    this.context.save();
    this.context.strokeStyle = RenderingSettings.FIELD_LINECOLOR;
    this.context.lineWidth = RenderingSettings.FIELD_WIDTH;
    this.context.strokeRect(0,0,canvas.width,canvas.height);
    this.context.restore();

    this.context.save();
    this.context.font = RenderingSettings.PROCESSINGTIME_FONT;
    this.context.fillStyle = RenderingSettings.PROCESSINGTIME_COLOR;
    this.context.fillText((this.iProcessingTimeNanoSec * 1e-9).toFixed(9) + ' [s]',
      this.canvas.width - 30*10,
      40
    );
    this.context.restore();
  }

  renderField()
  {
    this.context.save();

    let iCountX = parseInt(SharedSettings.FIELD_WIDTH / RenderingSettings.FIELDTILE_WIDTH);
    let iCountY = parseInt(SharedSettings.FIELD_HEIGHT / RenderingSettings.FIELDTILE_HEIGHT);
    for(let iIndexY=0; iIndexY < iCountY; iIndexY++)
    {
      for(let iIndexX=0;iIndexX<iCountX;iIndexX++){
        this.context.drawImage( this.assets.imageField,
          this.assets.rectFieldInFieldImage.sx, this.assets.rectFieldInFieldImage.sy,	// 描画元画像の右上座標
          this.assets.rectFieldInFieldImage.sw, this.assets.rectFieldInFieldImage.sh,	// 描画元画像の大きさ
          iIndexX * RenderingSettings.FIELDTILE_WIDTH,// 画像先領域の右上座標（領域中心が、原点になるように指定する）
          iIndexY * RenderingSettings.FIELDTILE_HEIGHT,// 画像先領域の右上座標（領域中心が、原点になるように指定する）
          RenderingSettings.FIELDTILE_WIDTH,	// 描画先領域の大きさ
          RenderingSettings.FIELDTILE_HEIGHT );	// 描画先領域の大きさ
      }
    }
    this.context.restore();
  }
}