const canvas = document.getElementById("cont")
const ctx = canvas.getContext("2d")
const djcvs = document.getElementById("dj-handler")

const ctx_height = canvas.height

const poscheck = document.getElementById("poscheck")

//canvas.height = 7000

var dj_counter = 0

// settings

var note_thickness = 3
var hispeed = 3.5

var thick = 13
var thick_base = 10
var speed_mul = 42
var speed_base = 42

var fps = 60
var flowspeed = 1000

var cache_all_object = false
var enable_tick_handler = false
var timing_mode = [
    createjs.Ticker.SYNCHED,
    createjs.Ticker.RAF,
    createjs.Ticker.RAF_SYNCHED,
    createjs.Ticker.TIMEOUT
]

const MAX_HOLD_LENGTH = 6000


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

// ========================================================
// ==================== color scheme   ====================
// ========================================================

palette_orange = ["orange", "gold", "orangered", "red"]
palette_blue = ["dodgerblue", "deepskyblue", "royalblue", "blue"]

palette_down = ["yellow", "goldenrod"]
palette_jump = ["lightskyblue", "steelblue"]

// ========================================================
// ==================== style template ====================
// ========================================================

/* 
    style templates are written in canvas functions.
    I'm not planning on using them in other places so let's just don't change them
*/

// lanecolor: 2-color stripes
function make_lanestyle(obj, color1, color2) {
    let lo = obj.getContext("2d")
    let gradient = lo.createLinearGradient(0, 0, 15, 0)
    gradient.addColorStop(0, color1)
    gradient.addColorStop(0.5, color2)
    gradient.addColorStop(1, color1)
    lo.fillStyle = gradient
    lo.fillRect(0, 0, 15, 10)
}

// arrowcolor: color1 - background, color2: arrow
function make_arrowstyle(obj, color1, color2) {
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

function make_downjumpstyle() {
    let dn = downstyle.getContext("2d")
    dn.shadowBlur = 10
    dn.shadowColor = palette_down[1]

    dn.beginPath()
    dn.arc(250, 340, 240, 0, 2 * Math.PI)
    dn.strokeStyle = palette_down[0]
    dn.lineWidth = 7
    dn.stroke()

    dn.fillStyle = palette_down[0]
    dn.font = "50px Arial"
    dn.textAlign = "center"
    dn.textBaseline = 'alphabetic'
    dn.fillText("D O W N", 250, 390)

    let jp = jumpstyle.getContext("2d")
    jp.shadowBlur = 10
    jp.shadowColor = palette_jump[1]

    jp.beginPath()
    jp.moveTo(10, 390)
    jp.lineTo(40, 360)
    jp.lineTo(70, 390)

    jp.moveTo(490, 390)
    jp.lineTo(460, 360)
    jp.lineTo(430, 390)

    jp.moveTo(10, 370)
    jp.lineTo(40, 340)
    jp.lineTo(70, 370)

    jp.moveTo(490, 370)
    jp.lineTo(460, 340)
    jp.lineTo(430, 370)

    jp.moveTo(10, 350)
    jp.lineTo(40, 320)
    jp.lineTo(70, 350)

    jp.moveTo(490, 350)
    jp.lineTo(460, 320)
    jp.lineTo(430, 350)
    jp.strokeStyle = palette_jump[0]
    jp.lineWidth = 7
    jp.stroke()

    jp.fillStyle = palette_jump[0]
    jp.font = "50px Arial"
    jp.textAlign = "center"
    jp.textBaseline = 'alphabetic'
    jp.fillText("J U M P", 250, 390)
}

function make_graydot() {
    let gd = graydot.getContext("2d")

    // gd.fillStyle = "dimgray"
    // gd.beginPath()
    // gd.arc(8, 8, 4, 0, 2 * Math.PI)
    // gd.fill()

    let gra = gd.createLinearGradient(0, 0, 16, 0)
    gra.addColorStop(0, "black")
    gra.addColorStop(0.5, "dimgray")
    gra.addColorStop(1, "black")
    gd.fillStyle = gra
    gd.fillRect(0, 0, 16, 16)
}

make_lanestyle(lane_orange, palette_orange[0], palette_orange[2])
make_lanestyle(lane_blue, palette_blue[0], palette_blue[2])

make_arrowstyle(arrow_orange, palette_orange[1], palette_orange[2])
make_arrowstyle(arrow_blue, palette_blue[1], palette_blue[2])

make_downjumpstyle()
make_graydot()


$("#judgeline").css({ height: (thick * note_thickness + thick_base - 9) + "px" })
$("#judgeline").css({ "background-image": 'url(' + graydot.toDataURL() + ')' })


const stage = new createjs.Stage(canvas)
const dj = new createjs.Stage(djcvs)

// main container
const chart = new createjs.Container()

// creating four layers for layering
const layer = [
    new createjs.Container(),
    new createjs.Container(),
    new createjs.Container(),
    new createjs.Container(),
    new createjs.Container()
]

const edge = 38
const unit = 76

function generate_straight_hold(color, start_time, start_pos, width, length) {
    if (length > MAX_HOLD_LENGTH) {
        generate_straight_hold(color, start_time, start_pos, width, length / 2)
        generate_straight_hold(color, start_time + length / 2, start_pos, width, length / 2)
        return
    }

    width *= unit
    start_pos *= unit

    let ct = new createjs.Container()

    let obj = new createjs.Shape()
    obj.graphics.bf((color == "blue") ? lane_blue : lane_orange).r(0, 0, width, length)

    let mk = new createjs.Shape()
    mk.compositeOperation = "destination-out"
    mk.graphics.lf(["rgba(0, 0, 0, 0.75)", "transparent"], [0, 1], 0, 0, edge, 0).r(0, 0, edge, length)
    mk.graphics.lf(["rgba(0, 0, 0, 0.75)", "transparent"], [0, 1], width, 0, width - edge, 0).r(width - edge, 0, edge, length)

    mk.graphics.lf(["rgba(0, 0, 0, 0.5)", "transparent"], [0, 1], 0, 0, 0, edge).r(0, 0, width, edge)
    mk.graphics.lf(["rgba(0, 0, 0, 1)", "transparent"], [0, 1], 0, length, 0, length - edge).r(0, length - edge, width, edge)

    ct.addChild(obj, mk)

    ct.x = start_pos
    ct.y = -start_time
    ct.regY = length
    // optional caching
    if (cache_all_object) ct.cache(0, 0, width, length)

    ct.visible = false

    layer[1].addChild(ct)
}

function generate_diagonal_hold(color, start_time, start_pos, start_width, length, end_pos, end_width) {
    if (length > MAX_HOLD_LENGTH) {
        generate_diagonal_hold(color, start_time, start_pos, start_width, length / 2, (end_pos + start_pos) / 2, (end_width + start_width) / 2)
        generate_diagonal_hold(color, start_time + length / 2, (end_pos + start_pos) / 2, (end_width + start_width) / 2, length / 2, end_pos, end_width)
        return
    }

    start_pos *= unit
    start_width *= unit
    end_pos *= unit
    end_width *= unit

    let width = Math.max(start_pos + start_width, end_pos + end_width) - Math.min(start_pos, end_pos)
    let e = Math.max(end_pos - start_pos, 0)
    let s = Math.max(start_pos - end_pos, 0)

    let ct = new createjs.Container()

    let obj = new createjs.Shape()
    let bm = new createjs.Bitmap()

    let t = (end_pos + end_width / 2) - (start_pos + start_width / 2)
    let r = Math.atan2(t, length) * 180 / Math.PI
    let l = Math.max(start_width, end_width) / 60

    bm.x = e - Math.max((start_width - end_width) / 2, 0)
    bm.scaleX = l
    bm.scaleY = l / 2
    bm.skewX = r

    obj.graphics.bf((color == "blue") ? arrow_blue : arrow_orange, "repeat-y", bm.getMatrix()).mt(e, 0).lt(e + end_width, 0).lt(s + start_width, length).lt(s, length).ef()

    let mk = new createjs.Shape()
    mk.compositeOperation = "destination-out"
    //mk.graphics.lf(["rgba(0, 0, 0, 0.75)", "transparent"], [0, 1], 0, 0, edge, 0).r(0, 0, edge, length)
    //mk.graphics.lf(["rgba(0, 0, 0, 0.75)", "transparent"], [0, 1], width, 0, width-edge, 0).r(width-edge, 0, edge, length)

    mk.graphics.lf(["rgba(0, 0, 0, 0.5)", "transparent"], [0, 1], 0, 0, 0, edge).r(0, 0, width, edge)
    // mk.graphics.lf(["rgba(0, 0, 0, 1)", "transparent"], [0, 1], 0, length, 0, length - edge).r(0, length - edge, width, edge)

    ct.addChild(obj, mk)

    ct.x = Math.min(start_pos, end_pos)
    ct.y = -start_time
    ct.regY = length
    if (cache_all_object) ct.cache(0, 0, width, length)

    ct.visible = false

    layer[1].addChild(ct)
}

function generate_L_slide(color, start_time, start_pos, end_pos) {
    let thickness = hispeed * speed_mul + speed_base

    start_pos *= unit
    end_pos *= unit

    let width = Math.abs(start_pos - end_pos)

    let ct = new createjs.Container()
    let obj = new createjs.Shape()

    // using empty bitmap for rotation matrix
    let bm = new createjs.Bitmap()
    bm.scale = thickness / 60
    bm.rotation = (start_pos > end_pos) ? -90 : 90

    obj.graphics.bf((color == "blue") ? arrow_blue : arrow_orange, "repeat", bm.getMatrix()).r(0, 0, width, thickness)

    let mk = new createjs.Shape()
    mk.compositeOperation = "destination-out"
    if (start_pos > end_pos) { // left or right dim
        mk.graphics.lf(["rgba(0, 0, 0, 1)", "transparent"], [0, 1], 0, 0, edge * 2, 0).r(0, 0, edge * 2, thickness)
    }
    else {
        mk.graphics.lf(["rgba(0, 0, 0, 1)", "transparent"], [0, 1], width, 0, width - edge * 2, 0).r(width - edge * 2, 0, edge * 2, thickness)
    }

    // top and bottom dim
    mk.graphics.lf(["rgba(0, 0, 0, 0.5)", "transparent"], [0, 1], 0, 0, 0, edge).r(0, 0, width, edge)

    ct.addChild(obj, mk)

    ct.x = Math.min(start_pos, end_pos)
    ct.y = -start_time
    ct.regY = thickness
    if (cache_all_object) ct.cache(0, 0, width, thickness)

    ct.visible = false

    layer[2].addChild(ct)
}

function generate_note(color, start_time, start_pos, end_pos) {
    let thickness = note_thickness * thick + thick_base

    start_pos *= unit
    end_pos *= unit

    let width = Math.abs(start_pos - end_pos)

    let obj = new createjs.Shape()

    obj.graphics.s("black").ss(5).f("white").rr(5, 5, width - 10, thickness - 10, 10)
    obj.graphics.lf((color == "blue" ? [palette_blue[1], palette_blue[2]] : [palette_orange[1], palette_orange[2]]), [0, 1], (width - unit) / 2, 0, (width + unit) / 2, thickness).s("transparent").rr(5, 5, width - 10, thickness - 19, 10)

    obj.x = Math.min(start_pos, end_pos)
    obj.y = -start_time
    obj.regY = thickness
    obj.cache(0, 0, width, thickness)

    obj.visible = false

    layer[4].addChild(obj)
}

function generate_downjump(type, start_time) {
    let thickness = note_thickness * thick + thick_base

    let obj = new createjs.Shape()

    obj.graphics.s("black").ss(5).f("white").rr(5, 5, 1206, thickness - 10, 10)
    obj.graphics.lf((type == "jump" ? [palette_jump[0], palette_jump[1]] : [palette_down[0], palette_down[1]]), [0, 1], 0, 0, 0, thickness).s("transparent").rr(5, 5, 1206, thickness - 19, 10)

    obj.x = 0
    obj.y = -start_time
    obj.regY = thickness
    obj.cache(0, 0, 1216, thickness)

    obj.visible = false
    layer[3].addChild(obj)

    // the following code generates ring and arrows for down/jump

    let ring = new createjs.Shape()

    ring.graphics.bf((type == "jump" ? jumpstyle : downstyle)).r(0, 0, 500, 400)
    ring.x = 0
    ring.y = 0
    ring.regY = 400

    let f = $("#flit-tp").clone()
    f.attr("id", "f" + dj_counter)
    f.appendTo(poscheck)
    let fn = $("#f" + dj_counter)
    let dot = $("#f" + dj_counter + " .dot")

    ring.addEventListener("tick", () => {
        let cam = $("#camera").offset()

        let b = start_time - chart.y

        if (b > 6000 || b < 0) {
            ring.visible = false
            return
        }

        ring.visible = true
        
        fn.css({ bottom: b })
        ring.y = fn.offset().top - cam.top
        ring.x = fn.offset().left - cam.left
        ring.scale = dot.position().left / 500
    })

    dj_counter++

    ring.cache(0, 0, 500, 400)
    dj.addChild(ring)
}

function generate_barline(start_time) {
    let obj = new createjs.Shape()
    obj.graphics.f("white").r(0, 0, 1216, 5)

    obj.x = 0
    obj.y = -start_time
    obj.regY = 5
    obj.cache(0, 0, 1216, 5)

    obj.visible = false
    layer[0].addChild(obj)
}

generate_note("orange", 140, 2, 7)
generate_note("orange", 1000, 4, 8)
generate_note("blue", 2000, 8, 12)
generate_note("blue", 3000, 12, 16)

generate_note("orange", 5860, 8, 12)
generate_note("orange", 2500, 6, 10)
generate_note("orange", 2000, 5, 14)
generate_note("orange", 1500, 4, 8)

generate_note("orange", 3140, 2, 7)
generate_note("orange", 7000, 4, 8)
generate_note("blue", 12000, 8, 12)
generate_note("blue", 33000, 12, 16)

generate_note("orange", 55860, 8, 12)
generate_note("blue", 82500, 6, 10)
generate_note("orange", 42000, 5, 10)
generate_note("blue", 31500, 4, 8)

generate_barline(2250)
generate_barline(1250)
generate_barline(750)

generate_straight_hold("orange", 140, 2, 5, 360)
generate_straight_hold("orange", 1000, 5, 4, 500)
generate_straight_hold("blue", 3000, 4, 5, 500)
generate_straight_hold("blue", 2000, 11, 5, 500)

generate_diagonal_hold("orange", 26500, 12, 4, 50000, 7, 5)
generate_diagonal_hold("blue", 86000, 5, 4, 50000, 11, 5)
generate_diagonal_hold("orange", 133000, 0, 5, 50000, 7, 5)
generate_diagonal_hold("blue", 150000, 12, 4, 50000, 7, 5)
generate_diagonal_hold("orange", 250000, 12, 4, 50000, 7, 5)
generate_diagonal_hold("blue", 350000, 12, 4, 50000, 7, 5)
generate_diagonal_hold("orange", 450000, 12, 4, 50000, 7, 5)
generate_diagonal_hold("blue", 550000, 12, 4, 50000, 7, 5)
generate_diagonal_hold("orange", 650000, 12, 4, 50000, 7, 5)
generate_diagonal_hold("blue", 750000, 12, 4, 50000, 7, 5)
generate_diagonal_hold("orange", 850000, 12, 4, 50000, 7, 5)
generate_diagonal_hold("blue", 950000, 12, 4, 50000, 7, 5)
generate_diagonal_hold("orange", 1050000, 12, 4, 50000, 7, 5)
generate_diagonal_hold("blue", 1150000, 12, 4, 50000, 7, 5)
generate_diagonal_hold("orange", 1250000, 12, 4, 50000, 7, 5)

generate_L_slide("orange", 1000, 3, 13)
generate_L_slide("orange", 500, 2, 10)
generate_L_slide("blue", 2000, 11, 3)


generate_downjump("jump", 100000)
generate_downjump("down", 55000)
generate_downjump("jump", 56000)
generate_downjump("down", 57000)
generate_downjump("jump", 58000)
generate_downjump("down", 59000)
generate_downjump("jump", 60000)
generate_downjump("down", 61000)
generate_downjump("jump", 62000)
generate_downjump("down", 63000)
generate_downjump("jump", 64000)
generate_downjump("down", 65000)
generate_downjump("jump", 66000)
generate_downjump("down", 67000)
generate_downjump("jump", 68000)
generate_downjump("down", 69000)
generate_downjump("jump", 70000)
generate_downjump("down", 71000)
generate_downjump("jump", 72000)
generate_downjump("down", 73000)
generate_downjump("jump", 74000)
generate_downjump("down", 75000)
generate_downjump("jump", 76000)
generate_downjump("down", 77000)
generate_downjump("jump", 78000)
generate_downjump("down", 79000)
generate_downjump("jump", 80000)
generate_downjump("down", 81000)
generate_downjump("jump", 82000)
generate_downjump("down", 83000)
generate_downjump("jump", 84000)
generate_downjump("jump", 110000)
generate_downjump("down", 120000)
generate_downjump("jump", 130000)
generate_downjump("down", 150000)

// move the register point to the bottom, then add chart to the stage
stage.regY = -ctx_height

// sort everything by start time
layer.forEach(element=>{
    element.sortChildren((a, b)=>{return (b.y - a.y)})
})

chart.addChild(layer[0], layer[1], layer[2], layer[3], layer[4])
stage.addChild(chart)

let blocker = [0, 0, 0, 0, 0]

// dynamic loader
stage.addEventListener("tick", () => {
    layer.forEach((element, index)=>{
        for (var i=blocker[index]; i<element.numChildren; i++) {
            let child = element.getChildAt(i)
            let diff = chart.y + child.y

            if (diff > MAX_HOLD_LENGTH) {
                child.visible = false
                blocker[index]++
            }
            else if (diff > -6000) {
                if (!child.isVisible()) {
                    child.visible = true
                    break
                }
            }
            else break
        }
    })
});

// set fps to fit the running environment
// Ticker.framerate might be obsolete but I'm adding that just in case
createjs.Ticker.timingMode = timing_mode[0]
createjs.Ticker.framerate = fps
createjs.Ticker.addEventListener("tick", tick_handler)

let timestart

$(document).ready(() => {
    setTimeout(() => {
        enable_tick_handler = true
        timestart = new Date()
    }, 3000);
})

// temporary fps counter on the top left
const fps_counter = new createjs.Stage("fps")

let o = new createjs.Shape()
let t = new createjs.Text()

o.graphics.f("white").r(0, 0, 200, 200)
fps_counter.addChild(o)

t.font = "20px Arial"
t.color = "black"

t.x = 5
t.y = 5
fps_counter.addChild(t)


// pre-calculate the exp. flow
let expflow = flowspeed * hispeed / 1000

// stage updater
function tick_handler(event) {
    if (!enable_tick_handler) return

    // this is for calculating the flow speed, which must be done with event.delta to prevent frame glitch
    // after adding the control buttons this will be removed/changed
    chart.y += (expflow * event.delta)

    // don't touch this
    stage.update()
    dj.update()
}

setInterval(() => {
    let tp = ((new Date()) - timestart)
    let ps = chart.y.toFixed(3)
    let trueflow = (ps / tp * 1000).toFixed(2)

    t.text = "FPS: " + createjs.Ticker.getMeasuredFPS().toFixed(2) + "\n"
        + "Speed: " + hispeed.toFixed(1) + "x\n"
        + "\n"
        + "Pos: " + ps + "\n"
        + "Time: " + tp
        + "\n"
        + "Exp. flow: " + expflow * 1000 + "\n"
        + "True flow: " + trueflow + "\n"
    fps_counter.update()
}, 250);

function reset() {
    chart.y = 0
    timestart = new Date()
    blocker = [0, 0, 0, 0, 0]
}

function change_timing_mode(obj) {
    createjs.Ticker.timingMode = timing_mode[obj.value]
    reset()
}

function change_target_FPS(obj) {
    createjs.Ticker.framerate = obj.value
    reset()
}