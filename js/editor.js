// enable the tooltips in bootstrap
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
        trigger: "hover"
    })
})

// JSON editor initialization
const editor = new JSONEditor(document.getElementById("editor"), { mode: "code" });

// default chart
var chart_data = [
    //{type:"tap",time:{bar:1,num:1,dvs:4},lr:"L",width:[3,7]},
    { type: "tap", time: { bar: 2, num: 1, dvs: 4 }, lr: "R", width: [10, 14], hold: [] },
    { type: "tap", time: { bar: 2, num: 2, dvs: 4 }, lr: "L", width: [3, 7], hold: [] },
    { type: "tap", time: { bar: 2, num: 3, dvs: 4 }, lr: "R", width: [10, 14], hold: [] },
    { type: "tap", time: { bar: 2, num: 4, dvs: 4 }, lr: "L", width: [3, 7], hold: [] }
];

// canvas and stage (using const)
const cvs = document.getElementById('cvs');
const stage = new createjs.Stage(cvs);
const chart = new createjs.Container()
const indicate_lines = new createjs.Container()
const main_ct = new createjs.Container()
const dummy = new createjs.Shape();
const layer = [new createjs.Container(), new createjs.Container(), new createjs.Container(), new createjs.Container()]
chart.addChild(layer[0], layer[1], layer[2], layer[3])
main_ct.addChild(dummy, indicate_lines, chart)
stage.addChild(main_ct)

stage.enableMouseOver();

// basic size settings
var note_thick = 10;
var last_bar = chart_data[chart_data.length - 1].time.bar;
var bar_height = 500;

var chart_height = last_bar * bar_height;
var chart_width = cvs.width - 20;

var block_width = chart_width / 16
var edge_fallback = block_width / 2

// stage refresh indicators
var update = false;
var rebuild = false;

// default divisor & settings
var note_divisor = 4;
var note_polarity = "R";
var note_width = 5;

// note type indicator
var addtap = false;
var addhld = { start: false, clicked: false, prev: null };
var addsld = { start: false, clicked: false, prev: null, washold: false };
var adddwn = false;
var addjmp = false;

// edit type
var edit_mode = ["add", "delete", "nudgeV", "nudgeH", "stretchL", "stretchR"]
var edit = "";
var slider_steps = 10

// settings
var scr_invert = false
var hide_divisor = false
var hide_block = false

// color scheme, must use color codes for string concat
var lcolor = "#FFAA33";
var rcolor = "#66CCFF";
var lholdc = "#EE9922";
var rholdc = "#55BBEE";
var jumpco = "#88DDFF";
var downco = "#FFFF88";

function check_hold(a, b) {
    return ((a.width[0] == b.width[0])
        && (a.width[1] == b.width[1])
        && (a.time.bar == b.time.bar)
        && (a.time.num == b.time.num)
        && (a.time.dvs == b.time.dvs))
}

function get_last_hold(x = null, prev) {
    if (x == null) {
        if (prev.hold.length) return prev.hold.at(-1)
        else return prev
    }

    let ind = prev.hold.findIndex((element) => {
        return check_hold(element, x)
    })

    if (ind > 0) return prev.hold.at(ind - 1)
    else return prev
}

/* ==================================== Functions: Adding new objects ====================================
    This section contains functions that adds five types of basic objects onto the canvas and editor/JSON.
*/

var newtap = function (x) {
    let tap = new createjs.Shape();
    tap.graphics.f((x.lr == "L") ? lcolor : rcolor).rr(
        ((x.width[0] - 1) * (block_width)),
        (bar_height * (last_bar - x.time.bar + 1) - ((x.time.num - 1) * bar_height / x.time.dvs) - note_thick),
        ((x.width[1] - x.width[0] + 1) * (block_width)),
        note_thick,
        2
    );

    tap.on("mouseover", function (evt) {
        switch (edit) {
            case "delete":
                tap.cursor = "pointer"; break
            case "nudgeV":
                tap.cursor = "ns-resize"; break
            case "nudgeH":
                tap.cursor = "ew-resize"; break
            case "stretchL":
            case "streatchR":
                tap.cursor = "col-resize"; break
            default:
                if (addhld.start && !addhld.clicked) tap.cursor = "pointer"
                else tap.cursor = "default"
        }
    });

    tap.on("mousedown", function (evt) {
        let dummyY = evt.stageY - main_ct.y;
        this.offset = { x: this.x - evt.stageX, y: this.y - dummyY, px: Math.round(evt.stageX * 16 / chart_width) - x.width[0] };
        if (addhld.start && !addhld.clicked) {
            addhld.clicked = true;
            addhld.prev = x;
        }
    });

    tap.on("pressmove", function (evt) {
        if (edit == "stretchL") {
            let left = Math.round(evt.stageX / block_width);
            left = Math.max(1, Math.min(16, left))
            if (left >= x.width[1]) left = x.width[1] - 1;
            x.width[0] = left;
            evt.target.graphics.command.x = (left - 1) * block_width;
            evt.target.graphics.command.w = ((x.width[1] - x.width[0] + 1) * (block_width));
        } else if (edit == "stretchR") {
            let right = Math.round(evt.stageX / block_width);
            right = Math.max(1, Math.min(16, right))
            if (right <= x.width[0]) right = x.width[0] + 1;
            x.width[1] = right;
            evt.target.graphics.command.w = ((x.width[1] - x.width[0] + 1) * (block_width));
        } else if (edit == "nudgeH") {
            let left = Math.round(evt.stageX / block_width);
            let width = x.width[1] - x.width[0];
            left = Math.max(1, Math.min(16 - width, left))
            x.width = [left, left + width];
            evt.target.graphics.command.x = (left - 1) * block_width;
        } else if (edit == "nudgeV") {
            let dummyY = evt.stageY - main_ct.y;
            let time = Math.ceil(Math.max(1, dummyY) * note_divisor / bar_height);
            x.time = { bar: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, dvs: note_divisor };
            evt.target.y = time * bar_height / note_divisor + Math.floor(this.offset.y * note_divisor / bar_height) * bar_height / note_divisor;
        }
        update = true;
    });

    tap.on("dblclick", function (evt) {
        if (edit == "delete") {
            remove(x);
            layer[3].removeChild(tap);
            update = true;
        }
    });

    layer[3].addChild(tap);
    update = true;
};

var newhold = function (x, prev) {
    let hold = new createjs.Shape();
    let last_data = get_last_hold(x, prev)
    let color = prev.lr

    hold.graphics.f((color == "L") ? lholdc : rholdc)
        .moveTo((last_data.width[0] * block_width - edge_fallback),
            (bar_height * (last_bar - last_data.time.bar + 1) - (last_data.time.num - 1) * bar_height / last_data.time.dvs))
        .lineTo((last_data.width[1] * block_width - edge_fallback),
            (bar_height * (last_bar - last_data.time.bar + 1) - (last_data.time.num - 1) * bar_height / last_data.time.dvs))
        .lineTo((x.width[1] * block_width - edge_fallback),
            (bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs))
        .lineTo((x.width[0] * block_width - edge_fallback),
            (bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs))
        .closePath();

    hold.on("mouseover", function (evt) {
        switch (edit) {
            case "delete":
                hold.cursor = "pointer"; break
            case "nudgeV":
                hold.cursor = "ns-resize"; break
            case "nudgeH":
                hold.cursor = "ew-resize"; break
            case "stretchL":
            case "streatchR":
                hold.cursor = "col-resize"; break
            default:
                if ((addhld.start && !addhld.clicked) || (addsld.start && !addsld.clicked)) hold.cursor = "pointer"
                else hold.cursor = "default"
        }
    });

    hold.on("mousedown", function (evt) {
        let dummyY = evt.stageY - main_ct.y;
        this.offset = { x: this.x - evt.stageX, y: this.y - dummyY };
        if (addhld.start && !addhld.clicked) {
            addhld.clicked = true;
            addhld.prev = prev;
        } else if (addsld.start && !addsld.clicked) {
            if (!prev.hold.at(-1).hasOwnProperty("from")) {
                addsld.clicked = true;
                addsld.prev = prev;
            }
        }
    });

    hold.on("pressmove", function (evt) {
        let changed = false
        if (edit == "stretchL") {
            let left = Math.round(evt.stageX / block_width);
            left = Math.max(1, Math.min(16, left))
            if (left >= x.width[1]) left = x.width[1] - 1;
            x.width[0] = left;
            changed = true
        } else if (edit == "stretchR") {
            let right = Math.round(evt.stageX / block_width);
            right = Math.max(1, Math.min(16, right))
            if (right <= x.width[0]) right = x.width[0] + 1;
            x.width[1] = right;
            changed = true
        } else if (edit == "nudgeH") {
            let left = Math.round(evt.stageX / block_width);
            let width = x.width[1] - x.width[0];
            left = Math.max(1, Math.min(16 - width, left))
            x.width = [left, left + width];
            changed = true
        } else if (edit == "nudgeV") {
            let dummyY = evt.stageY - main_ct.y;
            let time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
            x.time = { bar: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, dvs: note_divisor };
            changed = true
        }
        if (!changed) return
        hold.graphics.c().f((color == "L") ? lholdc : rholdc)
            .moveTo((last_data.width[0] * block_width - edge_fallback),
                (bar_height * (last_bar - last_data.time.bar + 1) - (last_data.time.num - 1) * bar_height / last_data.time.dvs))
            .lineTo((last_data.width[1] * block_width - edge_fallback),
                (bar_height * (last_bar - last_data.time.bar + 1) - (last_data.time.num - 1) * bar_height / last_data.time.dvs))
            .lineTo((x.width[1] * block_width - edge_fallback),
                (bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs))
            .lineTo((x.width[0] * block_width - edge_fallback),
                (bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs))
            .closePath();
        update = true;
    });

    hold.on("dblclick", function (evt) {
        if (edit == "delete") {
            remove(x, "hold");
            layer[0].removeChild(hold);
            update = true;
        }
    });

    layer[0].addChild(hold);
    update = true;
};

var newslide = function (x, prev) {
    let slide = new createjs.Shape();
    let last_data = get_last_hold(x, prev)
    let color = prev.lr

    slide.graphics.f((color == "L") ? lcolor : rcolor).r(
        (x.from[0] * block_width - edge_fallback),
        bar_height * (last_bar - last_data.time.bar + 1) - (last_data.time.num - 1) * bar_height / x.time.dvs - note_thick * 2,
        (x.from[1] - x.from[0]) * (block_width),
        note_thick * 2
    );

    slide.on("mouseover", function (evt) {
        switch (edit) {
            case "delete":
                slide.cursor = "pointer"; break
            case "nudgeV":
                slide.cursor = "ns-resize"; break
            case "nudgeH":
                slide.cursor = "ew-resize"; break
            case "stretchL":
            case "streatchR":
                slide.cursor = "col-resize"; break
            default:
                if (addhld.start && !addhld.clicked) slide.cursor = "pointer"
                else slide.cursor = "default"
        }
    });

    slide.on("mousedown", function (evt) {
        let dummyY = evt.stageY - main_ct.y;
        this.offset = { x: this.x - evt.stageX, y: this.y - dummyY };
        if (addhld.start & !addhld.clicked) {
            addhld.clicked = true;
            addhld.prev = prev;
        }
    });

    slide.on("pressmove", function (evt) {
        let changed = false
        if (edit == "stretchL") {
            let left = Math.round(evt.stageX / block_width);
            left = Math.max(1, Math.min(16, left))
            if (left >= x.width[1]) left = x.width[1] - 1;
            x.width[0] = left;
            changed = true
        } else if (edit == "stretchR") {
            let right = Math.round(evt.stageX / block_width);
            right = Math.max(1, Math.min(16, right))
            if (right <= x.width[0]) right = x.width[0] + 1;
            x.width[1] = right;
            changed = true
        } else if (edit == "nudgeH") {
            let left = Math.round(evt.stageX / block_width);
            left = Math.max(1, Math.min(16 - width, left))
            let width = x.width[1] - x.width[0];
            x.width = [left, left + width];
            changed = true
        } else if (edit == "nudgeV") {
            let dummyY = evt.stageY - main_ct.y;
            let time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
            x.time = { bar: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, dvs: note_divisor };
            changed = true
        }
        if (!changed) return
        slide.graphics.c().f((color == "L") ? lholdc : rholdc)
            .moveTo((last_data.width[0] * block_width - edge_fallback),
                (bar_height * (last_bar - last_data.time.bar + 1) - (last_data.time.num - 1) * bar_height / last_data.time.dvs))
            .lineTo((last_data.width[1] * block_width - edge_fallback),
                (bar_height * (last_bar - last_data.time.bar + 1) - (last_data.time.num - 1) * bar_height / last_data.time.dvs))
            .lineTo((x.width[1] * block_width - edge_fallback),
                (bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs))
            .lineTo((x.width[0] * block_width - edge_fallback),
                (bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs))
            .closePath();
        update = true;
    });

    slide.on("dblclick", function (evt) {
        if (edit == "delete") {
            remove(x, "slide");
            layer[1].removeChild(slide);
            update = true;
        }
    });

    layer[1].addChild(slide);
    update = true;
};

var newdown = function (x) {
    let down = new createjs.Shape();
    down.graphics.f(downco).r(
        0,
        bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs - note_thick * 0.75,
        chart_width - 1,
        note_thick * 0.75
    );

    down.on("mouseover", function (evt) {
        switch (edit) {
            case "delete":
                down.cursor = "pointer"; break
            case "nudgeV":
                down.cursor = "ns-resize"; break
            default:
                down.cursor = "default"
        }
    });

    down.on("mousedown", function (evt) {
        // this.parent.addChild(this);
        let dummyY = evt.stageY - main_ct.y;
        this.offset = { x: this.x - evt.stageX, y: this.y - dummyY };
        console.log("triggered", this)
    });

    down.on("pressmove", function (evt) {
        if (edit == "nudgeV") {
            let dummyY = evt.stageY - main_ct.y;
            let time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
            x.time = { bar: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, dvs: note_divisor };
            evt.target.y = time * bar_height / note_divisor + Math.floor(this.offset.y * note_divisor / bar_height) * bar_height / note_divisor;
            update = true;
        }
    });

    down.on("dblclick", function (evt) {
        if (edit == "delete") {
            remove(x);
            layer[2].removeChild(down);
            update = true;
        }
    });

    layer[2].addChild(down);
};

var newjump = function (x) {
    let jump = new createjs.Shape();
    jump.graphics.f(jumpco).r(
        0,
        bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs - note_thick * 0.75,
        chart_width - 1,
        note_thick * 0.75
    );

    jump.on("mouseover", function (evt) {
        switch (edit) {
            case "delete":
                jump.cursor = "pointer"; break
            case "nudgeV":
                jump.cursor = "ns-resize"; break
            default:
                jump.cursor = "default"
        }
    });

    jump.on("mousedown", function (evt) {
        let dummyY = evt.stageY - main_ct.y;
        this.offset = { x: this.x - evt.stageX, y: this.y - dummyY };
    });

    jump.on("pressmove", function (evt) {
        if (edit == "nudgeV") {
            let dummyY = evt.stageY - main_ct.y;
            let time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
            x.time = { bar: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, dvs: note_divisor };
            evt.target.y = time * bar_height / note_divisor + Math.floor(this.offset.y * note_divisor / bar_height) * bar_height / note_divisor;
            update = true;
        }
    });

    jump.on("dblclick", function (evt) {
        if (edit == "delete") {
            remove(x);
            layer[2].removeChild(jump);
            update = true;
        }
    });

    layer[2].addChild(jump);
};

/* ==================================== Functions: Control & Calculation ====================================
    This section contains functions that control some types of objects or do some calculations.
*/

var time_calculation = function (a) {
    return a.time.bar + (a.time.num - 1) / a.time.dvs;
};

var search = function (x, type = null) {
    if (typeof x == "undefined") {
        console.log("undefined in search!");
        return [-1, -2];
    }

    console.log(x, type)
    let tcx = time_calculation(x);
    if (type == "hold" || type == "slide") {
        console.log(chart_data.length)
        for (let i = 0; i < chart_data.length; i++) {
            if (time_calculation(chart_data[i]) > tcx) break;
            if (chart_data[i].type != "tap") continue;
            let ind = chart_data[i].hold.findIndex((element) => { return check_hold(element, x) })
            //chart_data[i].hold.forEach(e=>{console.log(e)})
            //console.log(chart_data[i])
            if (ind >= 0) return [i, ind]
            //else return [-1, -1]
        }
        
        return [-1, -1];
    }
    return [chart_data.findIndex((element) => { return (element == x) }), -1]
};

var insert = function (x, prev = null, type = null) {
    //------------- I'll start my own test here

    if (type == "hold" || type == "slide") {
        let rp = search(prev);
        if (rp[0] >= 0) {
            chart_data[rp[0]].hold.push(x)
        }
    }

    //not yet changed below
    else {
        let tcx = time_calculation(x);
        let l = 0;
        let r = chart_data.length;
        while (r > l) {
            let m = (l + r) >>> 1;
            let tcm = time_calculation(chart_data[m]);
            if (tcm < tcx)
                l = m + 1;
            else
                r = m;
        }
        while (typeof chart_data[l] != "undefined") {
            if (time_calculation(chart_data[l]) == tcx)
                l++;
            else
                break;
        }
        chart_data.splice(l, 0, x);
    }
};

var remove = function (x, type = null) {
    let r = search(x, type);
    console.log(r)
    if (r[1] >= 0) { // hold or slide
        chart_data[r[0]].hold.splice(r[1]);
        editor.set(chart_data);
        rebuild = true
    } else if (r[0] >= 0) {
        chart_data.splice(r[0], 1);
        editor.set(chart_data);
        rebuild = TextTrackCue
    }
};

var redraw = function () {
    layer.forEach(element => {
        element.removeAllChildren()
    })

    chart_data.forEach(function (x) {
        if (x.type == "tap") {
            newtap(x);
            if (x.hold.length) {
                let prev = x;
                x.hold.forEach(function (y) {
                    if (y.hasOwnProperty("from"))
                        newslide(y, prev)
                    else
                        newhold(y, prev);
                });
            }
        } else if (x.type == "down") {
            newdown(x);
        } else if (x.type == "jump") {
            newjump(x);
        }
    });
    redraw_lines()
}

var redraw_lines = function () {
    indicate_lines.removeAllChildren()

    // block indicate lines
    let ml = new createjs.Shape();
    for (i = 1; i < 17; i++) {
        if (i % 4) {
            if (!hide_block) ml.graphics.f("rgba(255, 255, 255, 0.3)").r(block_width * i, 0, 1, chart_height);
        }
        else { ml.graphics.f("rgba(255, 255, 0, 0.3)").r(block_width * i, 0, 2, chart_height); }
    }



    // 4-12 divisor lines
    for (i = 0; i < last_bar; i++) {
        ml.graphics.f("rgba(255, 255, 255, 0.4)").r(0, bar_height * i - 4, chart_width + 19, 4);
        if (hide_divisor) continue
        if (note_divisor == 12) {
            let cut_12 = bar_height / 12
            for (let j = 0; j < 12; j += 3) {
                if (j)
                    ml.graphics.f("rgba(255, 0, 0, 0.2)").r(0, bar_height * i + cut_12 * j - 2, chart_width + 19, 2);
                ml.graphics.f("rgba(0, 255, 0, 0.2)").r(0, bar_height * i + cut_12 * (j + 1) - 2, chart_width + 19, 2);
                ml.graphics.f("rgba(0, 255, 0, 0.2)").r(0, bar_height * i + cut_12 * (j + 2) - 2, chart_width + 19, 2);
            }
        }
        else {
            let cut_16 = bar_height / 16
            for (let j = 0; j < 16; j += 4) {
                if (j)
                    ml.graphics.f("rgba(255, 0, 0, 0.2)").r(0, bar_height * i + cut_16 * j - 2, chart_width + 19, 2);
                if (note_divisor >= 8)
                    ml.graphics.f("rgba(0, 0, 255, 0.2)").r(0, bar_height * i + cut_16 * (j + 2) - 2, chart_width + 19, 2);
                if (note_divisor >= 16) {
                    ml.graphics.f("rgba(0, 255, 255, 0.2)").r(0, bar_height * i + cut_16 * (j + 1) - 2, chart_width + 19, 2);
                    ml.graphics.f("rgba(0, 255, 255, 0.2)").r(0, bar_height * i + cut_16 * (j + 3) - 2, chart_width + 19, 2);
                }
            }
        }

    }
    indicate_lines.addChild(ml);

    // bar counter
    for (i = 0; i < last_bar; i++) {
        let label = new createjs.Text(i, "bold 14px Arial", "#FFFFFF");
        label.textAlign = "left";
        label.x = 202;
        label.textBaseline = "bottom";
        label.y = bar_height * (last_bar - i) - 2;
        indicate_lines.addChild(label);
    }

    update = true
}

redraw();

/* ==================================== Listeners: Stage operation ====================================
    This section contains stage operations that controlls most of the editor comps.
*/

var tick = function (event) {
    // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
    if (rebuild) {
        //console.log("rebuild started")
        rebuild = false; // only update once
        chart_data = editor.get();
        redraw();
        //console.log("rebuild end")
    }
    else if (update) {
        //console.log("update started")
        update = false; // only update once
        stage.update(event);
        editor.set(chart_data);
        //console.log("update end")
    }
}

createjs.Ticker.framerate = 30
createjs.Ticker.addEventListener("tick", tick);
update = true;


stage.on("stagemousemove", function (evt) {
    dummy.graphics.c();

    if (edit != "add") return

    let place = Math.round(evt.stageX / block_width);
    let dummyY = evt.stageY - main_ct.y;
    let bar_time = last_bar - Math.ceil(Math.max(1, dummyY) / bar_height) + 1
    let new_dvs_time = note_divisor - Math.ceil((Math.max(1, dummyY) % bar_height) / bar_height * note_divisor) + 1

    if (addtap) {
        place = Math.max(1, Math.min((17 - note_width), place));
        let x = {
            type: "tap",
            time: { bar: bar_time, num: new_dvs_time, dvs: note_divisor },
            lr: note_polarity,
            width: [place, place + (note_width - 1)],
            hold: []
        };

        dummy.graphics.f((x.lr == "L") ? lcolor + "80" : rcolor + "80").rr(
            ((x.width[0] - 1) * (block_width)),
            (bar_height * (last_bar - x.time.bar + 1) - ((x.time.num - 1) * bar_height / x.time.dvs) - note_thick),
            ((x.width[1] - x.width[0] + 1) * (block_width)),
            note_thick,
            2
        );
        update = true;
    } else if (addsld.clicked) {
        let last_data = get_last_hold(null, addsld.prev)
        place = Math.max(1, Math.min(16, place));
        let pwidth = last_data.width[1] - last_data.width[0];
        let left = (place < last_data.width[0]) ? place : (place > last_data.width[1] ? place - pwidth : last_data.width[0]);
        let right = (place < last_data.width[0]) ? (place + pwidth) : (place > last_data.width[1] ? place : last_data.width[1]);
        let x = {
            //type: "slide",
            width: [left, right],
            from: [],
            //lr: addsld.prev.lr
        };
        x.from = [(x.width[0] < last_data.width[0]) ? x.width[0] : last_data.width[0], x.width[1] > last_data.width[1] ? x.width[1] : last_data.width[1]];

        dummy.graphics.f((addsld.prev.lr == "L") ? lcolor + "80" : rcolor + "80	").r(
            (x.from[0] * block_width - edge_fallback),
            bar_height * (last_bar - last_data.time.bar + 1) - (last_data.time.num - 1) * bar_height / last_data.time.dvs - note_thick * 2,
            (x.from[1] - x.from[0]) * (block_width),
            note_thick * 2
        );
        update = true;
    } else if (addhld.clicked) {
        let last_data = get_last_hold(null, addhld.prev)
        place = Math.max(1, Math.min(16, place));
        let pwidth = last_data.width[1] - last_data.width[0];
        let left = (place < last_data.width[0]) ? place : (place > last_data.width[1] ? place - pwidth : last_data.width[0]);
        let right = (place < last_data.width[0]) ? (place + pwidth) : (place > last_data.width[1] ? place : last_data.width[1]);
        let x = {
            time: { bar: bar_time, num: new_dvs_time, dvs: note_divisor },
            width: [left, right],
        };


        dummy.graphics.f((addhld.prev.lr == "L") ? lholdc + "80" : rholdc + "80")
            .moveTo((last_data.width[0] * block_width - edge_fallback),
                (bar_height * (last_bar - last_data.time.bar + 1) - (last_data.time.num - 1) * bar_height / last_data.time.dvs))
            .lineTo((last_data.width[1] * block_width - edge_fallback),
                (bar_height * (last_bar - last_data.time.bar + 1) - (last_data.time.num - 1) * bar_height / last_data.time.dvs))
            .lineTo((x.width[1] * block_width - edge_fallback),
                (bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs))
            .lineTo((x.width[0] * block_width - edge_fallback),
                (bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs))
            .closePath();

        update = true;
    } else if (adddwn) {
        let x = {
            type: "down",
            time: { bar: bar_time, num: new_dvs_time, dvs: note_divisor }
        };

        dummy.graphics.f(downco + "80").r(
            0,
            bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs - note_thick * 0.75,
            chart_width,
            note_thick * 0.75
        );
        update = true;
    } else if (addjmp) {
        let x = {
            type: "jump",
            time: { bar: bar_time, num: new_dvs_time, dvs: note_divisor }
        };

        dummy.graphics.f(jumpco + "80").r(
            0,
            bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs - note_thick * 0.75,
            chart_width,
            note_thick * 0.75
        );
        update = true;
    }
});

stage.on("stagemousedown", function (evt) {
    if (edit != "add") return

    let place = Math.round(evt.stageX / block_width);
    let dummyY = evt.stageY - main_ct.y;
    let bar_time = last_bar - Math.ceil(Math.max(1, dummyY) / bar_height) + 1
    let new_dvs_time = note_divisor - Math.ceil((Math.max(1, dummyY) % bar_height) / bar_height * note_divisor) + 1

    if (addtap) {
        place = Math.max(1, Math.min((17 - note_width), place));
        let x = {
            type: "tap",
            time: { bar: bar_time, num: new_dvs_time, dvs: note_divisor },
            lr: note_polarity,
            width: [place, place + (note_width - 1)],
            hold: []
        };

        insert(x);
        newtap(x);
    } else if (addsld.clicked) {

        let last_data = get_last_hold(null, addsld.prev)

        place = Math.max(1, Math.min(16, place));
        let pwidth = last_data.width[1] - last_data.width[0];
        let left = (place < last_data.width[0]) ? place : (place > last_data.width[1] ? place - pwidth : last_data.width[0]);
        let right = (place < last_data.width[0]) ? (place + pwidth) : (place > last_data.width[1] ? place : last_data.width[1]);
        let x = {
            //type: "slide",
            time: last_data.time,
            width: [left, right],
            from: []
            //lr: addsld.prev.lr
        };
        x.from = [(x.width[0] < last_data.width[0]) ? x.width[0] : last_data.width[0], x.width[1] > last_data.width[1] ? x.width[1] : last_data.width[1]];

        insert(x, addsld.prev, "slide");
        newslide(x, addsld.prev);

        // he reset addsld.start but I don't think that matters
        addsld.clicked = false;
    } else if (addhld.clicked) {

        let last_data = get_last_hold(null, addhld.prev)
        place = Math.max(1, Math.min(16, place));
        let pwidth = last_data.width[1] - last_data.width[0];
        let left = (place < last_data.width[0]) ? place : (place > last_data.width[1] ? place - pwidth : last_data.width[0]);
        let right = (place < last_data.width[0]) ? (place + pwidth) : (place > last_data.width[1] ? place : last_data.width[1]);
        let x = {
            //type: "hold",
            time: { bar: bar_time, num: new_dvs_time, dvs: note_divisor },
            width: [left, right],
            //lr: addhld.prev.lr
        };

        if (time_calculation(last_data) >= time_calculation(x)) return

        insert(x, addhld.prev, "hold");
        newhold(x, addhld.prev);
        addhld.clicked = false;
    } else if (adddwn) {
        let x = {
            type: "down",
            time: { bar: bar_time, num: new_dvs_time, dvs: note_divisor }
        };
        insert(x);
        newdown(x);
    } else if (addjmp) {
        let x = {
            type: "jump",
            time: { bar: bar_time, num: new_dvs_time, dvs: note_divisor }
        };
        insert(x);
        newjump(x);
    }
});

/* ==================================== Events: HTML bindings ====================================
    This section contains events that are binded to HTML elements.
    Most of them are button controls.
*/

// beat divisor
$(".minbt").click(function (e) {
    note_divisor = Number($(this).val());
    $("#beat-divisor-selector").html($(this).html())
    redraw_lines()
});

// edit options
$(".edtbt").click(function (e) {
    $(".clrbt").click();
    dummy.graphics.c()
    update = true

    $(".edtbt").removeClass(["btn-primary", "btn-success", "btn-danger"]);
    $(".edtbt").addClass("btn-light");
    $(this).removeClass("btn-light");
    edit = $(this).val();

    switch (edit) {
        case "add":
            $(this).addClass("btn-success");
            $("#note-add-option").collapse('show')
            break;
        case "delete":
            $(this).addClass("btn-danger");
            $("#note-add-option").collapse('hide')
            break;
        default:
            $(this).addClass("btn-primary");
            $("#note-add-option").collapse('hide')
            break;
    }
});

// default note width
$(".tawbt").click(function (e) {
    $(".tawbt").removeClass(["btn-success", "btn-warning"]);
    $(".tawbt").addClass("btn-secondary");
    $(this).removeClass("btn-secondary");
    note_width = Number($(this).val())
    $(this).addClass((note_width == 6) ? "btn-success" : "btn-warning");
    update = true
});

// note polarity
$(".tapbt").click(function (e) {
    $(".tapbt").removeClass(["btn-primary", "btn-warning"])
    $(".tapbt").addClass("btn-secondary")
    $(this).removeClass("btn-secondary")
    note_polarity = $(this).val();
    $(this).addClass((note_polarity == 'R') ? "btn-primary" : "btn-warning")
    update = true
});

// old note type handlers
/*
$(".tonbt").click(function (e) {
    if (addtap) {
        addtap = false;
        $(this).html("TAP-ON");
        $(this).removeClass("btn-danger");
        $(this).addClass("btn-success");
    } else {
        addtap = true;
        if (addhld.start) $(".hldbt").click();
        $(this).html("TAP-OFF");
        $(this).removeClass("btn-success");
        $(this).addClass("btn-danger");
    }
});


$(".hldbt").click(function (e) {
    if (addhld.start) {
        addhld.start = false;
        addhld.clicked = false;
        $(this).html("HOLD-ON");
        $(this).removeClass("btn-danger");
        $(this).addClass("btn-success");
    } else {
        addhld.start = true;
        addhld.clicked = false;
        if (addtap) $(".tonbt").click();
        $(this).html("HOLD-OFF");
        $(this).removeClass("btn-success");
        $(this).addClass("btn-danger");
    }
});

$(".sldbt").click(function (e) {
    addsld.start = true;
    addsld.clicked = false;
    if (addhld.start) {
        $(".hldbt").click();
        addsld.washold = true;
    }
});

$(".dwnbt").click(function (e) {
    adddwn = true;
});

$(".jmpbt").click(function (e) { 
    addjmp = true;
});
*/

// new note type handlers (which is more general)
$(".btntp").click(function (e) {
    $(".clrbt").click()
    $(this).removeClass("btn-secondary")
    switch ($(this).val()) {
        case "note":
            addtap = true
            $(this).addClass("btn-light")
            break
        case "hold":
            addhld.start = true
            $(this).addClass("btn-light")
            break
        case "slide":
            addsld.start = true
            $(this).addClass("btn-light")
            break
        case "down":
            adddwn = true
            $(this).addClass("btn-warning")
            break
        case "jump":
            addjmp = true
            $(this).addClass("btn-info")
            break
    }
    update = true
})

// clear note type and reset everything
$(".clrbt").click(function (e) {
    $(".btntp").removeClass("btn-light")
    $(".btntp").removeClass("btn-warning")
    $(".btntp").removeClass("btn-info")
    $(".btntp").addClass("btn-secondary")
    addtap = false
    addhld = { start: false, clicked: false, prev: null };
    addsld = { start: false, clicked: false, prev: null, washold: false };
    adddwn = false;
    addjmp = false;
    update = true
});

// redraw button handler
$(".rdrbt").click(function (e) {
    chart_data = editor.get();
    last_bar = chart_data[chart_data.length - 1].time.bar;
    chart_height = bar_height * last_bar;
    $("#slider").slider("option", "min", -(last_bar - 2) * slider_steps)
    $("#slider").slider("value", 0)
    $(".clrbt").click()
    rebuild = true;
});

// new bar handler
$(".nmebt").click(function (e) {
    last_bar += 1;
    chart_height = bar_height * last_bar;
    $("#slider").slider("option", "min", -(last_bar - 2) * slider_steps)
    //$(".clrbt").click()
    //rebuild = true;
});

// I deleted the submit action so it no longer exists

// settings binding
$("#hide-divisor").change(() => { hide_divisor = !hide_divisor; redraw_lines() })
$("#hide-block").change(() => { hide_block = !hide_block; redraw_lines() })
$("#scroll-invert").change(() => { scr_invert = !scr_invert })

/* ==================================== Sliders: jQuery UI ====================================
    Set the sliders and attach event listeners.
*/

var reallocate_slider = function (event, ui) {
    main_ct.y = bar_height / slider_steps * ui.value
    update = true;
}

// slider setting
$("#slider").slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 0,
    value: 0,
    change: reallocate_slider,
    slide: reallocate_slider
});

// mouse wheel scroll event
document.getElementById("edit-area").addEventListener("wheel", (event) => {
    event.preventDefault()
    $("#slider").slider("value", ($("#slider").slider("value") + (((event.deltaY > 0) ^ scr_invert) ? -1 : 1)));
})

/* ==================================== Downloads: Save/load ====================================
    Save and load related functions, which includes downloading.
*/

function download_chart() {
    // making downloadable files
    let a = document.createElement("a")
    let file = new Blob([JSON.stringify(chart_data)], { type: 'text/plain' })
    a.href = URL.createObjectURL(file)
    a.download = ((new Date()).toISOString().slice(0, 10)) + ".drschart"
    a.click()
}

$("#loader").on('change', (event) => {
    let file_list = event.target.files
    let reader = new FileReader()
    reader.readAsText(file_list[0], "UTF-8")
    reader.onload = function (evt) {
        editor.set(JSON.parse(evt.target.result))
        rebuild = true
    }
    // reset the loader
    event.target.value = null
    update = true
})

/* ==================================== Alert ====================================
    A custom alert function is here.
*/

const alertPlaceholder = document.getElementById("alert-placeholder")

const showalert = (message, type) => {
    const wrapper = document.createElement("div")
    wrapper.innerHTML = [
        '<div class="alert alert-' + type +' alert-dismissible" role="alert">',
        '   <div>',
        '   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-diamond-fill" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg> ' + message ,
        '   </div>',
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')
    alertPlaceholder.append(wrapper)
}

setInterval(() => {
    showalert("Hey, It's been over 15 minutes. You <strong>REALLY</strong> should consider download your chart as a backup.", 'warning')
}, 900000);