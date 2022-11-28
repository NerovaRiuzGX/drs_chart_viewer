const canvas = document.getElementById("cont")
const ctx = canvas.getContext("2d")

const poscheck = document.getElementById("poscheck")

canvas.height = 7000

var dj_counter = 0

//poscheck.width = 1216
//poscheck.height = canvas.height

// settings

var note_thickness = 5
var hispeed = 0.5

var thick = 13
var thick_base = 10
var speed_mul = 42
var speed_base = 42

var fps = 60
var flowspeed = 1200

var test_run = true


$("#judgeline").css({height: (thick * note_thickness + thick_base - 9) + "px"})

// still missing: judge lift
// default judge lift from bottom is 140px

// base objects

const lane_orange = document.getElementById("lanestyle-orange")
const lane_blue = document.getElementById("lanestyle-blue")

const arrow_orange = document.getElementById("arrowstyle-orange")
const arrow_blue = document.getElementById("arrowstyle-blue")

const downstyle = document.getElementById("downstyle")
const jumpstyle = document.getElementById("jumpstyle")

const graydot = document.getElementById("graydot")

// color scheme

palette_orange = ["orange", "gold", "orangered", "red"]
palette_blue = ["dodgerblue", "deepskyblue", "royalblue", "blue"]

palette_down = ["yellow", "goldenrod"]
palette_jump = ["lightskyblue", "steelblue"]

// style template

// lanecolor: 2-color stripes
function make_lanestyle (obj, color1, color2) {
    let lo = obj.getContext("2d")
    let gradient = lo.createLinearGradient(0, 0, 15, 0)
    gradient.addColorStop(0, color1)
    gradient.addColorStop(0.5, color2)
    gradient.addColorStop(1, color1)
    lo.fillStyle = gradient
    lo.fillRect(0, 0, 15, 10)
}

// arrowcolor: color1 - background, color2: arrow
function make_arrowstyle (obj, color1, color2) {
    let ao = obj.getContext("2d")
    
    ao.fillStyle = color1
    ao.fillRect(0, 0, 60, 40)
    ao.strokeStyle = color2
    ao.lineWidth = 3
    
    ao.beginPath()
    ao.moveTo(-30, 200)
    ao.lineTo(30, 20)
    ao.lineTo(90, 200)
    
    ao.moveTo(-30, 160)
    ao.lineTo(30, -20)
    ao.lineTo(90, 160)

    ao.moveTo(-30, 120)
    ao.lineTo(30, -60)
    ao.lineTo(90, 120)
    
    ao.stroke()
}

function make_downjumpstyle () {
    let dn = downstyle.getContext("2d")
    dn.shadowBlur = 10
    dn.shadowColor = palette_down[1]

    dn.beginPath()
    dn.arc(250, 440, 240, 0, 2*Math.PI)
    dn.strokeStyle = palette_down[0]
    dn.lineWidth = 7
    dn.stroke()

    dn.fillStyle = palette_down[0]
    dn.font = "50px Arial"
    dn.textAlign = "center"
    dn.textBaseline = 'alphabetic'
    dn.fillText("D O W N", 250, 490)

    let jp = jumpstyle.getContext("2d")
    jp.shadowBlur = 10
    jp.shadowColor = palette_jump[1]

    jp.beginPath()
    jp.moveTo(10, 490)
    jp.lineTo(40, 460)
    jp.lineTo(70, 490)

    jp.moveTo(490, 490)
    jp.lineTo(460, 460)
    jp.lineTo(430, 490)

    jp.moveTo(10, 470)
    jp.lineTo(40, 440)
    jp.lineTo(70, 470)

    jp.moveTo(490, 470)
    jp.lineTo(460, 440)
    jp.lineTo(430, 470)

    jp.moveTo(10, 450)
    jp.lineTo(40, 420)
    jp.lineTo(70, 450)

    jp.moveTo(490, 450)
    jp.lineTo(460, 420)
    jp.lineTo(430, 450)
    jp.strokeStyle = palette_jump[0]
    jp.lineWidth = 7
    jp.stroke()

    jp.fillStyle = palette_jump[0]
    jp.font = "50px Arial"
    jp.textAlign = "center"
    jp.textBaseline = 'alphabetic'
    jp.fillText("J U M P", 250, 490)
}

function make_graydot () {
    let gd = graydot.getContext("2d")

    gd.fillStyle = "dimgray"
    gd.beginPath()
    gd.arc(8, 8, 4, 0, 2*Math.PI)
    gd.fill()
}

make_lanestyle(lane_orange, palette_orange[0], palette_orange[2])
make_lanestyle(lane_blue, palette_blue[0], palette_blue[2])

make_arrowstyle(arrow_orange, palette_orange[1], palette_orange[2])
make_arrowstyle(arrow_blue, palette_blue[1], palette_blue[2])

make_downjumpstyle()
make_graydot()

$("#judgeline").css({"background-image": 'url('+graydot.toDataURL()+')'})

//lane mask?



const orange_pattern = ctx.createPattern(lane_orange, "repeat")
const blue_pattern = ctx.createPattern(lane_blue, "repeat")

function generate_straight_hold (color, start_time, start_pos, width, length) {
    let tmp_canvas = document.createElement("canvas")
    tmp_canvas.width = width
    tmp_canvas.height = length

    let tmp = tmp_canvas.getContext("2d")

    switch (color) {
        case "blue":
            tmp.fillStyle = blue_pattern
            break
        case "orange":
        default:
            tmp.fillStyle = orange_pattern
            break
    }

    tmp.fillRect(0, 0, width, length)

    tmp.lineWidth = 19
    tmp.strokeStyle = 'black'
    tmp.shadowColor = 'black'
    tmp.globalCompositeOperation = 'destination-out'
    tmp.strokeRect(0, 0, width, length)

    ctx.drawImage(tmp_canvas, start_pos, start_time-length)
}

const orange_arrow_pattern = ctx.createPattern(arrow_orange, 'repeat-y')
const blue_arrow_pattern = ctx.createPattern(arrow_blue, 'repeat-y')

function generate_diagonal_hold (color, start_time, start_pos, start_width, length, end_pos, end_width) {
    let tmp_canvas = document.createElement('canvas')
    tmp_canvas.width = Math.max(start_pos+start_width, end_pos+end_width) - Math.min(start_pos, end_pos)
    tmp_canvas.height = length

    let tmp = tmp_canvas.getContext("2d")

    let e = (end_pos > start_pos) ? end_pos-start_pos : 0
    let s = (end_pos > start_pos) ? 0 : start_pos-end_pos

    tmp.beginPath()
    tmp.moveTo(e, 0)
    tmp.lineTo(e+end_width, 0)
    tmp.lineTo(s+start_width, length)
    tmp.lineTo(s, length)
    tmp.closePath()

    tmp.shadowBlur = 10
    tmp.lineWidth = 38

    switch(color) {
        case "blue":
            tmp.strokeStyle = palette_blue[2]
            tmp.shadowColor = palette_blue[2]
            break
        case "orange":
        default:
            tmp.strokeStyle = palette_orange[2]
            tmp.shadowColor = palette_orange[2]
            break
    }
    
    tmp.stroke()

    tmp.shadowColor = 'transparent'
    tmp.globalCompositeOperation = "destination-in"
    tmp.fill()

    let t = (end_pos+end_width/2)-(start_pos+start_width/2)
    let r = Math.atan2(t, length) * 180 / Math.PI
    let l = Math.max(start_width, end_width)/60
    let sin = Math.abs(Math.sin(r / 180 * Math.PI) / 4)

    let matrix = new DOMMatrix()
    matrix = matrix.translateSelf((start_width > end_width)? -(start_width-end_width)/2 : 0, 0, 0)
    matrix = matrix.translateSelf(e - Math.max(start_width, end_width)*sin, 0, 0)
    //matrix = matrix.translateSelf((t>0)?Math.max(start_width, end_width)/2:0, 0, 0)
    matrix = matrix.rotateSelf(r)
    matrix = matrix.scaleSelf(l, l/2, 1)

    switch(color) {
        case "blue":
            blue_arrow_pattern.setTransform(matrix)
            tmp.fillStyle = blue_arrow_pattern
            break
        case "orange":
        default:
            orange_arrow_pattern.setTransform(matrix)
            tmp.fillStyle = orange_arrow_pattern
            break
    }
    
    tmp.globalCompositeOperation = "destination-over"
    tmp.fill()

    tmp.lineWidth = 19
    tmp.shadowColor = 'black'
    tmp.globalCompositeOperation = 'destination-out'
    tmp.stroke()

    ctx.drawImage(tmp_canvas, Math.min(start_pos, end_pos), start_time-length)
}

function generate_L_slide(color, start_time, start_pos, end_pos, speed_t) {
    var thickness = hispeed * speed_mul + speed_base
    
    let tmp_canvas = document.createElement('canvas')
    tmp_canvas.width = Math.abs(start_pos-end_pos)
    tmp_canvas.height = thickness

    let tmp = tmp_canvas.getContext("2d")

    tmp.shadowBlur = 10
    tmp.lineWidth = 12

    switch (color) {
        case "blue":
            tmp.strokeStyle = palette_blue[2]
            tmp.shadowColor = palette_blue[2]
            break
        case "orange":
        default:
            tmp.strokeStyle = palette_orange[2]
            tmp.shadowColor = palette_orange[2]
            break
    }
    
    tmp.strokeRect(0, 0, Math.abs(start_pos-end_pos), thickness)

    tmp.shadowColor = 'transparent'
    tmp.globalCompositeOperation = "destination-in"
    tmp.fill()
    
    var matrix = new DOMMatrix()
    matrix = matrix.translateSelf(0, (start_pos > end_pos)? thickness : 0 , 0)
    matrix = matrix.rotateSelf((start_pos > end_pos) ? -90 : 90)
    matrix = matrix.scaleSelf(thickness/60, thickness/60, 1)
    switch (color) {
        case "blue":
            blue_arrow_pattern.setTransform(matrix)
            tmp.fillStyle = blue_arrow_pattern
            break
        case "orange":
        default:
            orange_arrow_pattern.setTransform(matrix)
            tmp.fillStyle = orange_arrow_pattern
            break
    }

    tmp.globalCompositeOperation = "destination-over"
    tmp.fillRect(0, 0, Math.abs(start_pos-end_pos), thickness)

    let gra = tmp.createLinearGradient(0, 0, Math.abs(start_pos-end_pos), 0)
    gra.addColorStop((start_pos > end_pos) ? 0 : 1, "black")
    gra.addColorStop((start_pos > end_pos) ? 0.2 : 0.8, "transparent")

    tmp.globalCompositeOperation = "destination-out"
    tmp.fillStyle = gra
    tmp.fillRect(0, 0, Math.abs(start_pos-end_pos), thickness)

    ctx.drawImage(tmp_canvas, Math.min(start_pos, end_pos), start_time-thickness)
}

function generate_note (color, start_time, start_pos, end_pos, note_t) {
    var thickness = note_t * thick + thick_base

    let tmp_canvas = document.createElement("canvas")
    tmp_canvas.width = Math.abs(start_pos-end_pos)
    tmp_canvas.height = thickness

    let tmp = tmp_canvas.getContext("2d")
    
    let gra = tmp.createLinearGradient(0, 0, 76, thickness)
    switch (color) {
        case "blue":
            gra.addColorStop(0, palette_blue[1])
            gra.addColorStop(1, palette_blue[2])
            break
        case "orange":
        default:
            gra.addColorStop(0, palette_orange[1])
            gra.addColorStop(1, palette_orange[2])
            break
    }

    //let white = Math.max(thick * note_thickness / 10, 4) + 10

    tmp.beginPath()
    tmp.roundRect(5, 5, tmp_canvas.width-10, thickness-19, 10)
    tmp.fillStyle = gra
    tmp.fill()

    tmp.globalCompositeOperation = "destination-atop"
    tmp.beginPath()
    tmp.roundRect(5, 5, tmp_canvas.width-10, thickness-10, 10)
    tmp.fillStyle = "white"
    tmp.fill()

    tmp.globalCompositeOperation = "source-over"
    tmp.lineWidth = 5
    tmp.strokeStyle = "black"
    tmp.stroke()


    ctx.drawImage(tmp_canvas, Math.min(start_pos, end_pos), start_time-thickness)
}

function generate_downjump (type, start_time, note_t) {
    var thickness = note_t * thick + thick_base

    let tmp_canvas = document.createElement("canvas")
    tmp_canvas.width = 1216
    tmp_canvas.height = thickness

    let tmp = tmp_canvas.getContext("2d")

    let gra = tmp.createLinearGradient(0, 0, 0, thickness)
    switch (type) {
        case "jump":
            gra.addColorStop(0, palette_jump[0])
            gra.addColorStop(1, palette_jump[1])
            break
        case "down":
        default:
            gra.addColorStop(0, palette_down[0])
            gra.addColorStop(1, palette_down[1])
            break
    }
    //let white = Math.max(thick * note_thickness / 10, 4) + 10

    tmp.beginPath()
    tmp.roundRect(5, 5, 1206, thickness-19, 10)
    tmp.fillStyle = gra
    tmp.fill()

    tmp.globalCompositeOperation = "destination-atop"
    tmp.beginPath()
    tmp.roundRect(5, 5, 1206, thickness-10, 10)
    tmp.fillStyle = "white"
    tmp.fill()

    tmp.globalCompositeOperation = "source-over"
    tmp.lineWidth = 5
    tmp.strokeStyle = "grey"
    tmp.stroke()

    ctx.drawImage(tmp_canvas, 0, start_time-thickness)

    // some extra stuff

    let flit = document.createElement("div")
    flit.id = 'f' + String(dj_counter)
    flit.classList.add("flit")
    flit.style = "bottom: " + (canvas.height-start_time) + "px;"
    flit.innerHTML = '<div class="dot"></div>'
    poscheck.appendChild(flit)    

    let arc = document.createElement("canvas")
    arc.width = 500
    arc.height = 500
    arc.getContext('2d').drawImage((type=="jump")? jumpstyle:downstyle, 0, 0)
    arc.id = 'a' + String(dj_counter)
    arc.classList.add("arc")
    document.getElementById("downjump").appendChild(arc)

    dj_counter++
}

function generate_barline (start_time) {
    ctx.moveTo(0, start_time)
    ctx.lineTo(1216, start_time)
    ctx.lineWidth = 5
    ctx.strokeStyle = "white"

    ctx.stroke()
}

generate_barline(2250)

generate_straight_hold("orange", 4000, 608, 304, 500)
generate_straight_hold("orange", 5500, 608, 304, 500)
generate_straight_hold("blue", 3500, 912, 304, 500)
//generate_straight_hold("blue", 5500, 304, 304, 500)

generate_diagonal_hold("orange", 5000, 608, 304, 1000, 912, 304)
generate_diagonal_hold("blue", 3000, 912, 304, 2000, 228, 304)

//generate_diagonal_hold("blue", 1000, 912, 304, 50000, 228, 304)
//generate_diagonal_hold("blue", 5000, 304, 304, 1000, 0, 304)

generate_L_slide("orange", 4000, 1216, 608, hispeed)
generate_L_slide("orange", 3500, 912, 304, hispeed)
//generate_L_slide("blue", 4000, 0, 608, hispeed)

generate_downjump("jump", 1000, note_thickness)
generate_downjump("down", 1500, note_thickness)
generate_downjump("down", 2000, note_thickness)
generate_downjump("down", 3000, note_thickness)


//generate_note("blue", 5500, 608, 304, note_thickness)
generate_note("orange", 5500, 608, 912, note_thickness)
generate_note("blue", 4500, 912, 1216, note_thickness)
generate_note("blue", 3500, 912, 1216, note_thickness)

generate_note("orange", 5860, 608, 912, note_thickness)

generate_note("orange", 2500, 456, 760, note_thickness)
generate_note("orange", 2000, 380, 684, note_thickness)
generate_note("orange", 1500, 304, 608, note_thickness)


var x=0;

const viewer = document.getElementById("viewer")
const viewcxt = viewer.getContext("2d")

function set () {
    let cam = $("#camera").offset()

    for (let i=0; i<dj_counter; i++) {
        let arc = $('#a'+ i)
        let flit = $('#f'+ i).offset()
        let dot = $('#f'+ i + ' .dot')

        arc.css({
            top: flit.top - cam.top - 3,
            left: flit.left - cam.left,
            width: dot.position().left
        })      

    }

    // flow speed is here, this is temporary
    //if (test_run) $('#canv').css({bottom: x-=(flowspeed*hispeed/fps)})

    if (test_run) {
        viewcxt.clearRect(0, 0, 1216, 6000)
        viewcxt.drawImage(canvas, 0, canvas.height - 6000 + x, 1216, 6000,  0, 0, 1216, 6000)
        x-=(flowspeed*hispeed/fps)
    }
}

// runs at 60 fps
setInterval(set, 1000/fps)
//set()

// setInterval(()=>{
//     console.log($("#f0").offset())
//     console.log($("#f0 .dot").offset())
//     console.log($("#f0").position())
//     console.log($("#f0 .dot").position())
// }, 3000)