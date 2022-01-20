import { ImageType } from "./ImageType.js";
import { ParticleText } from "./particle.js";
var audioContext = new AudioContext();
var file = document.getElementById('fileupload');
var container = document.getElementById('container');
var canvas = document.getElementById('canvas1');
var canvas2 = document.getElementById('pantalla1');
var snail = document.getElementById('snail');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
var pantalla1 = canvas2.getContext('2d');
canvas2.width = 490;
canvas2.height = window.innerHeight;
var audioSource;
var analyser;
var imagenSal;
canvas2.addEventListener('mousemove', handleMouse);
file.addEventListener('change', function () {
    var files = this.files;
    var audio1 = document.getElementById('audio1');
    console.log(files);
    audio1.src = URL.createObjectURL(files[0]);
    audio1.load();
    audio1.play();
    audioContext.resume();
    audioSource = audioContext.createMediaElementSource(audio1);
    var analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 512;
    var bufferLenght = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLenght);
    var barWidth = 3; //canvas.width/2/bufferLenght;
    var barHeight;
    var x;
    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLenght, x, barWidth, barHeight, dataArray);
        requestAnimationFrame(animate);
    }
    animate();
});
//let softVolume=0;
function drawVisualiser(bufferLenght, x, barWidth, barHeight, dataArray) {
    for (var i = 0; i < bufferLenght; i++) {
        barHeight = dataArray[i] * 1.45;
        ctx.save();
        ctx.translate(canvas.width / 2 - 70, canvas.height / 2 + 30);
        var hue = i * 1.2;
        ctx.fillStyle = 'hsl(' + hue + ',100%, 50%)';
        ctx.strokeStyle = 'hsl(' + hue + ',100%, 50%)';
        //ctx.fillRect(0,0, barWidth, barHeight);
        if (dataArray[i] > 0) {
            ctx.rotate(i * 1.243);
            ctx.beginPath();
            ctx.moveTo(40, 40);
            ctx.bezierCurveTo(barHeight / 2, barWidth / 2, barHeight * -0.5 - 150, barHeight + 50, barWidth, barHeight);
            //ctx.quadraticCurveTo(100,barHeight/2,0,barHeight);
            ctx.stroke();
        }
        x += barWidth;
        if (dataArray[i] > 2) {
            ctx.beginPath();
            ctx.arc(barWidth, barHeight, 5, 0, 2 * Math.PI, false);
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.fill();
        }
        ctx.restore();
        //softVolume = softVolume * 0.9 + dataArray[i] * 0.1;
        //snail.style.transform = 'translate (70%, 70%)';
    }
}
var particleArray;
var mouse = {
    x: null,
    y: null,
    radius: 100
};
function handleMouse(e) {
    mouse.x = e.x; // - canvasPosition.left;
    mouse.y = e.y; // - canvasPosition.top;
    //console.log(mouse.x, mouse.y)
}
function textEfects() {
    pantalla1.font = 'bold  ' + 50 + 'px Verdana';
    pantalla1.fillText('Música Visual', 50, 100);
    imagenSal = new ImageType(pantalla1, null, canvas2.width, canvas2.height, true);
    initParticles();
    animateParticles();
}
function initParticles() {
    particleArray = [];
    var arrImage = imagenSal.getArrayImg();
    for (var i = 0; i < canvas2.height; i++) {
        for (var j = 0; j < canvas2.width; j++) {
            if (arrImage[0][i][j] > 128) {
                particleArray.push(new ParticleText(j, i, pantalla1));
            }
        }
    }
}
function animateParticles() {
    pantalla1.clearRect(0, 0, canvas2.width, canvas2.height);
    for (var i = 0; i < particleArray.length; i++) {
        particleArray[i].update(mouse);
        particleArray[i].draw(i);
    }
    requestAnimationFrame(animateParticles);
}
textEfects();
