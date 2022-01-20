import { ImageType } from "./ImageType.js";
import { ParticleText } from "./particle.js";


const audioContext = new AudioContext();
const file =<HTMLInputElement>document.getElementById('fileupload');
const container = <HTMLCanvasElement>document.getElementById('container');
const canvas = <HTMLCanvasElement>document.getElementById('canvas1');
const canvas2 = <HTMLCanvasElement>document.getElementById('pantalla1');
const snail = document.getElementById('snail') as HTMLOrSVGElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const pantalla1 = canvas2.getContext('2d');
canvas2.width=490;
canvas2.height=window.innerHeight;
let audioSource;
let analyser;

var imagenSal: ImageType;
canvas2.addEventListener('mousemove', handleMouse);

file.addEventListener('change', function(){
    let files: FileList= this.files;
    let audio1=<HTMLAudioElement>document.getElementById('audio1');
    console.log(files);
    audio1.src = URL.createObjectURL(files[0]);
    audio1.load();
    audio1.play();
    audioContext.resume();
    audioSource = audioContext.createMediaElementSource(audio1);
    let analyser: AnalyserNode= audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 512;
    const bufferLenght = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLenght);

    const barWidth = 3//canvas.width/2/bufferLenght;
    let barHeight: number;
    let x;

    function animate(){
        x=0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLenght, x, barWidth, barHeight, dataArray);
        requestAnimationFrame(animate);
    }
    animate();
});

//let softVolume=0;
function drawVisualiser(bufferLenght:number, x:number, barWidth:number, barHeight:number, dataArray:Uint8Array):void{
    for(let i=0; i<bufferLenght; i++){
        barHeight = dataArray[i]*1.45;
        ctx.save();
        ctx.translate(canvas.width/2 - 70, canvas.height/2 + 30);
        const hue= i*1.2;
        ctx.fillStyle = 'hsl(' +hue+',100%, 50%)';
        ctx.strokeStyle = 'hsl(' +hue+',100%, 50%)';
        //ctx.fillRect(0,0, barWidth, barHeight);
        if(dataArray[i]>0){
            ctx.rotate(i * 1.243);
            ctx.beginPath();
            ctx.moveTo(40,40);
            ctx.bezierCurveTo(barHeight/2, barWidth/2, barHeight*-0.5 -150,barHeight+50,barWidth,barHeight);
            //ctx.quadraticCurveTo(100,barHeight/2,0,barHeight);
            ctx.stroke();
        }
        
        x+=barWidth;
        if(dataArray[i]>2){
            ctx.beginPath();
            ctx.arc(barWidth, barHeight,5, 0, 2 * Math.PI, false);
            ctx.strokeStyle='white';
            ctx.stroke();
            ctx.fill();
        }
        ctx.restore();
        //softVolume = softVolume * 0.9 + dataArray[i] * 0.1;
        //snail.style.transform = 'translate (70%, 70%)';
    }
}

let particleArray: ParticleText[];
let mouse:any = {
  x: null,
  y: null,
  radius: 100
};

function handleMouse(e: any) {
    mouse.x = e.x// - canvasPosition.left;
    mouse.y = e.y;// - canvasPosition.top;
    //console.log(mouse.x, mouse.y)
}

function textEfects(): void{
    pantalla1.font = 'bold  ' + 50 + 'px Verdana';
    pantalla1.fillText('Música Visual', 50, 100);
    imagenSal = new ImageType(pantalla1, null, canvas2.width, canvas2.height, true);
    initParticles();
    animateParticles();
}
  
function initParticles() {
    particleArray = [];
    let arrImage = imagenSal.getArrayImg();
    for (let i = 0; i < canvas2.height; i++){
      for (let j = 0; j < canvas2.width; j++) { 
        if (arrImage[0][i][j] > 128) {
          particleArray.push(new ParticleText(j, i, pantalla1));
        }
      }
    } 
}
  
  function animateParticles(){
    pantalla1.clearRect(0,0,canvas2.width,canvas2.height);
    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].update(mouse);
        particleArray[i].draw(i);
    }
    requestAnimationFrame(animateParticles);
  }
  textEfects();