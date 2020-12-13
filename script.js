// Initialize DOM elements

// "VFX" ==> scanning effects, "FTX" ==> actual hand image
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d')
const effects= document.getElementById('effects');
const vfx = effects.getContext('2d')
const CalcButton = document.getElementById('calculate')
const LogBox = document.getElementById('log')
CalcButton.onclick = Calculate

// Variables
let image = new Image()
let center, ratio;
let width = Apply()
let ScanHeight = 0
let Scanning = false
const rawWidth = 21.575;
let factor = (rawWidth / width)**2;
let RESULT;


/*

FUNCTIONS
    Resize(): Resize canvas according to screen size
    Log(): Display results in box
    Apply(): Change hand & size values
    Calculate(): Calculate results & display

*/

function Resize(){
    width = parseInt(Apply())
    ratio = canvas.width/4200
    factor = (rawWidth / width)**2;
    canvas.width = window.innerWidth/2
    canvas.height = window.innerWidth/2
    effects.width = canvas.width
    effects.height = canvas.height
    center = canvas.width/2
}

function Log(arg){
    LogBox.innerHTML = arg
}

function Apply(){

    // Set Size
    let sizeSelect = document.getElementById("size");
    let sizeValue = sizeSelect.value

    // Set Hand
    let handSelect = document.getElementById("hand");
    let handValue = handSelect.value

    image.src = `img/${handValue}-${sizeValue}.png`

    return sizeValue;
}

function Calculate() {

    Scanning = true
    var imgData = ctx.getImageData(0, 0, width, width);
    var data = imgData.data;
    var sum = 0;

    for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha > 100) {
            sum++;
        }

    }
    if (!Scanning){

    }

    Log
    (
        `Calculating...`
    )

    RESULT =
    `
        Scale Factor: <span> ${(factor/(ratio**2)).toFixed(5)} cm<sup>2</sup>/px </span>
        <br>
        <br>
        Hand Area: <span> ${(sum/(ratio**2)).toFixed(3)} px</span>
        <br>
        Hand Area: <span> ${((sum/(ratio**2))* factor/6.452).toFixed(3)} in<sup>2</sup> <span>
        <br>
        <br>
        Hand Area: <span class = 'gold'> ${((sum/(ratio**2))* factor).toFixed(3)} cm<sup>2</sup> <span>
        <br>
    `

}

/*

ANIMATION LOOP
Some funky stuff going on here
Would recommend staying away if possible

*/

const loop = () => {

    Resize()

    if (Scanning){

        ScanHeight += 8

        vfx.strokeStyle = 'red'
        vfx.lineWidth = 5
        vfx.beginPath()
        vfx.moveTo(0, canvas.width-ScanHeight)
        vfx.lineTo(canvas.width, canvas.width-ScanHeight)
        vfx.closePath()
        vfx.stroke()

        vfx.globalAlpha = 0.1
        vfx.fillStyle = 'blue'
        vfx.fillRect(center-width*ratio/2, center-width*ratio/2, width*ratio, width*ratio)
        vfx.globalAlpha = 1

        if (ScanHeight == canvas.width){
            Scanning = false;
            Log(RESULT)
            setTimeout(()=>{
                ScanHeight = 0
            },500)
        }

        vfx.globalAlpha = 0.3
        vfx.fillStyle = 'red'
        if (canvas.width-ScanHeight < center+width*ratio/2 && canvas.width-ScanHeight > center-width*ratio/2){
            vfx.fillRect(center-width*ratio/2, canvas.width-ScanHeight, width*ratio,(center+width*ratio/2)-(canvas.width-ScanHeight))

        }

        if (canvas.width-ScanHeight < center-width*ratio/2){
            vfx.fillRect(center-width*ratio/2, center-width*ratio/2, width*ratio, width*ratio)
        }
        vfx.globalAlpha = 1
    }

    ctx.drawImage(image, center-width*ratio/2, center-width*ratio/2, width*ratio, width*ratio)

    window.requestAnimationFrame(loop)
}

window.requestAnimationFrame(loop)

