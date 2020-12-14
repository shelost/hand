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
let center, ratio, rawWidth, factor, display;
let width = Apply()
let ScanHeight = 0
let Scanning = false
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
    ratio = (display/width)**2
    canvas.width = window.innerWidth/2
    canvas.height = window.innerWidth/2
    effects.width = canvas.width
    effects.height = canvas.height
    center = canvas.width/2
    display = canvas.width*0.7

    switch(document.getElementById("hand").value){
        case 'jacob':
            rawWidth = 19.6;
            break;
        case 'benigno':
            rawWidth = 21.0;
            break;
        default:
            rawWidth = 20;
            break;
    }

    factor = (rawWidth / width)**2;
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
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.width);
    var data = imgData.data;
    var sum = 0;

    for (let i = 0; i < data.length; i += 4) {
        let alpha = data[i + 3];
        if (alpha > 100) {
            sum++;
        }

    }


    Log
    (
        `Calculating...`
    )

    RESULT =
    `
        Image Width: <span> ${rawWidth} cm </span> <br>
        Image Width: <span> ${width} px </span> <br>
        <br>
        Pixel Density: <span> ${(factor).toFixed(3)} cm<sup>2</sup>/px </span> <br>
        <br>
        Display Width: <span> ${display.toFixed(3)} px </span> <br>
        Scale Factor: <span> ${ratio.toFixed(3)} </span> <br>
        <br>
        Hand Area: <span> ${(sum/ratio).toFixed(3)} px</span> <br>
        Hand Area: <span> ${(sum*factor/ratio/6.4516).toFixed(3)} in<sup>2</sup> <span> <br>
        <br>
        Hand Area: <span class = 'gold'> ${(sum*factor/ratio).toFixed(3)} cm<sup>2</sup> <span> <br>
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
        vfx.fillRect(center-display/2, center-display/2, display, display)
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
        if (canvas.width-ScanHeight < center+display/2 && canvas.width-ScanHeight > center-display/2){
            vfx.fillRect(center-display/2, canvas.width-ScanHeight, display, (center+display/2)-(canvas.width-ScanHeight))

        }

        if (canvas.width-ScanHeight < center-display/2){
            vfx.fillRect(center-display/2, center-display/2, display, display)
        }

        vfx.globalAlpha = 1
    }

    //ctx.drawImage(image, center-width*ratio/2, center-width*ratio/2, width*ratio, width*ratio)

 //   ctx.drawImage(image, center/2, center/2, center, center)

    ctx.drawImage(image, center-display/2, center-display/2, display, display)

    window.requestAnimationFrame(loop)
}

window.requestAnimationFrame(loop)

