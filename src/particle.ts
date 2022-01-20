export class ParticleText {
    protected x: number;
    protected y: number;
    protected size: number;
    protected ctx: CanvasRenderingContext2D;
    protected _2PI: number;
    protected baseX: number;
    protected baseY: number;
    protected density: number;
    protected mappedImage: any[][][];
    
    constructor(x: number, y: number, screenCanvas?: CanvasRenderingContext2D,
      mapImg?: number[][][]) {
      this.ctx = screenCanvas;
      this.x = x;// + 200;
      this.y = y;// - 100,
      this.size = 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = ((Math.random() * 30) + 1);
      this._2PI = Math.PI * 2;
      this.mappedImage = mapImg;
    }
  
    public update(mouse: any) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx*dx + dy*dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      var maxDistance = mouse.radius;
      var force = (maxDistance - distance) / maxDistance;
  
      let directionX = (forceDirectionX * force * this.density);
      let directionY = (forceDirectionY * force * this.density);
      
      if (distance < mouse.radius) {
        this.x -= directionX ;
        this.y -= directionY ;
      }
      else {
        if (this.x !== this.baseX ) {
            let dx = this.x - this.baseX;
            this.x -= dx/5;
        } if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy/5;
        }
      }
    }
  
    public draw(color:number) {
      this.ctx.fillStyle = 'hsl(' +color+',100%, 50%)';
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.size, 0, this._2PI);
      this.ctx.closePath();
      this.ctx.fill();
    }
}