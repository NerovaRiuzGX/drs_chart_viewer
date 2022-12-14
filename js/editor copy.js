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
    { type: "tap", time: { bar: 2, num: 1, dvs: 4 }, lr: "R", width: [10, 14] },
    { type: "tap", time: { bar: 2, num: 2, dvs: 4 }, lr: "L", width: [3, 7] },
    { type: "tap", time: { bar: 2, num: 3, dvs: 4 }, lr: "R", width: [10, 14] },
    { type: "tap", time: { bar: 2, num: 4, dvs: 4 }, lr: "L", width: [3, 7] }
];

// canvas and stage (using const)
const cvs = document.getElementById('cvs');
const stage = new createjs.Stage(cvs);
const chart = new createjs.Container()
const indicate_lines = new createjs.Container()
const main_ct = new createjs.Container()
const dummy = new createjs.Shape();
const layer = [new createjs.Container(),new createjs.Container(),new createjs.Container(),new createjs.Container()]
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
//var slider_offsetY = 0

// color scheme, must use color codes for string concat
var lcolor = "#FFAA33";
var rcolor = "#66CCFF";
var lholdc = "#EE9922";
var rholdc = "#55BBEE";
var jumpco = "#88DDFF";
var downco = "#FFFF88";

// I don't know what this is but I'll keep it for now
var hlock = [false, false];

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
            left = Math.max(1, Math.min(16-width, left))
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
    hold.graphics.f((x.lr == "L") ? lholdc : rholdc)
        .moveTo((prev.width[0] * block_width - edge_fallback),
            (bar_height * (last_bar - prev.time.bar + 1) - (prev.time.num - 1) * bar_height / prev.time.dvs))
        .lineTo((prev.width[1] * block_width - edge_fallback),
            (bar_height * (last_bar - prev.time.bar + 1) - (prev.time.num - 1) * bar_height / prev.time.dvs))
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
            addhld.prev = x;
        } else if (addsld.start && !addsld.clicked) {
            addsld.clicked = true;
            addsld.prev = x;
        }
    });

    hold.on("pressmove", function (evt) {
        if (edit == "stretchL") {
            let left = Math.round(evt.stageX / block_width);
            left = Math.max(1, Math.min(16, left))
            if (left >= x.width[1]) left = x.width[1] - 1;
            x.width[0] = left;
        } else if (edit == "stretchR") {
            let right = Math.round(evt.stageX / block_width);
            right = Math.max(1, Math.min(16, right))
            if (right <= x.width[0]) right = x.width[0] + 1;
            x.width[1] = right;
        } else if (edit == "nudgeH") {
            let left = Math.round(evt.stageX / block_width);
            let width = x.width[1] - x.width[0];
            left = Math.max(1, Math.min(16 - width, left))
            x.width = [left, left + width];
        } else if (edit == "nudgeV") {
            let dummyY = evt.stageY - main_ct.y;
            let time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
            x.time = { bar: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, dvs: note_divisor };
        }
        hold.graphics.c().f((x.lr == "L") ? lholdc : rholdc)
            .moveTo((prev.width[0] * block_width - edge_fallback),
                (bar_height * (last_bar - prev.time.bar + 1) - (prev.time.num - 1) * bar_height / prev.time.dvs))
            .lineTo((prev.width[1] * block_width - edge_fallback),
                (bar_height * (last_bar - prev.time.bar + 1) - (prev.time.num - 1) * bar_height / prev.time.dvs))
            .lineTo((x.width[1] * block_width - edge_fallback),
                (bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs))
            .lineTo((x.width[0] * block_width - edge_fallback),
                (bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs))
            .closePath();
        update = true;
    });

    hold.on("dblclick", function (evt) {
        if (edit == "delete") {
            remove(x);
            layer[0].removeChild(hold);
            update = true;
        }
    });

    layer[0].addChild(hold);
    update = true;
};

var newslide = function (x, prev) {
    let slide = new createjs.Shape();
    slide.graphics.f((x.lr == "L") ? lcolor : rcolor).r(
        (x.from[0] * block_width - edge_fallback),
        bar_height * (last_bar - prev.time.bar + 1) - (prev.time.num - 1) * bar_height / x.time.dvs - note_thick * 2,
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
            addhld.prev = x;
        }
    });

    slide.on("pressmove", function (evt) {
        if (edit == "stretchL") {
            let left = Math.round(evt.stageX / block_width);
            left  = Math.max(1, Math.min(16, left))
            if (left >= x.width[1]) left = x.width[1] - 1;
            x.width[0] = left;
        } else if (edit == "stretchR") {
            let right = Math.round(evt.stageX / block_width);
            right  = Math.max(1, Math.min(16, right))
            if (right <= x.width[0]) right = x.width[0] + 1;
            x.width[1] = right;
        } else if (edit == "nudgeH") {
            let left = Math.round(evt.stageX / block_width);
            left  = Math.max(1, Math.min(16 - width, left))
            let width = x.width[1] - x.width[0];
            x.width = [left, left + width];
        } else if (edit == "nudgeV") {
            let dummyY = evt.stageY - main_ct.y;
            let time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
            x.time = { bar: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, dvs: note_divisor };
        }
        slide.graphics.c().f((x.lr == "L") ? lholdc : rholdc)
            .moveTo((prev.width[0] * block_width - edge_fallback),
                (bar_height * (last_bar - prev.time.bar + 1) - (prev.time.num - 1) * bar_height / prev.time.dvs))
            .lineTo((prev.width[1] * block_width - edge_fallback),
                (bar_height * (last_bar - prev.time.bar + 1) - (prev.time.num - 1) * bar_height / prev.time.dvs))
            .lineTo((x.width[1] * block_width - edge_fallback),
                (bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs))
            .lineTo((x.width[0] * block_width - edge_fallback),
                (bar_height * (last_bar - x.time.bar + 1) - (x.time.num - 1) * bar_height / x.time.dvs))
            .closePath();
        update = true;
    });

    slide.on("dblclick", function (evt) {
        if (edit == "delete") {
            remove(x);
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

var search = function (x) {
    if (typeof x == "undefined") {
        console.log("undefined in search!");
        return [-1, -2];
    }
    let tcx = time_calculation(x);
    if (x.type == "hold" || x.type == "slide") {
        for (i = 0; i < chart_data.length; i++) {
            if (time_calculation(chart_data[i]) > tcx) break;
            if (typeof chart_data[i].hold !== "undefined") {
                let l = 0;
                let r = (chart_data[i].hold.length - 1);
                while (l <= r) {
                    let m = Math.floor((l + r) / 2);
                    let tcm = time_calculation(chart_data[i].hold[m]);
                    if (tcm < tcx)
                        l = m + 1;
                    else if (tcm > tcx)
                        r = m - 1;
                    else {
                        if (chart_data[i].hold[m] == x) return [i, m];
                        if (chart_data[i].hold[m + 1] == x) return [i, m + 1];
                        if (chart_data[i].hold[m - 1] == x) return [i, m - 1];
                        break;
                    }
                }
            }
        }
        return [-1, -1];
    }
    let l = 0;
    let r = (chart_data.length - 1);
    while (l <= r) {
        let m = Math.floor((l + r) / 2);
        let tcm = time_calculation(chart_data[m]);
        if (tcm < tcx)
            l = m + 1;
        else if (tcm > tcx)
            r = m - 1;
        else {
            if (chart_data[m] == x) return [m, -1];
            if (chart_data[m + 1] == x) return [m + 1, -1];
            if (chart_data[m - 1] == x) return [m - 1, -1];
            return [-1, -1];
        }
    }
    return [-1, -1];
};

var insert = function (x, prev = null) {
    console.log(prev)
    let tcx = time_calculation(x);
    if (x.type == "hold" || x.type == "slide") {
        let rp = search(prev);
        if (rp[0] >= 0) {
            if (typeof chart_data[rp[0]].hold == "undefined") {
                chart_data[rp[0]].hold = [x];
                return;
            }
            chart_data[rp[0]].hold.splice(rp[1] + 1, 0, x);
        }
    } else {
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

var remove = function (x) {
    let r = search(x);
    if (r[1] >= 0) {
        if (chart_data[r[0]].hold.length == 1)
            delete chart_data[r[0]].hold;
        else
            chart_data[r[0]].hold.splice(r[1], 1);
    } else if (r[0] >= 0) {
        chart_data.splice(r[0], 1);
    }
};

var redraw = function () {
    chart_data.forEach(function (x) {
        if (x.type == "tap") {
            newtap(x);
            if (typeof x.hold != "undefined") {
                let prev = x;
                x.hold.forEach(function (y) {
                    if (y.type == "hold") {
                        newhold(y, prev);
                    } else if (y.type == "slide") {
                        newslide(y, prev);
                    }
                    prev = y;
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
    //ml.compositeOperation = "destination-over";
    for (i = 1; i < 17; i++)
        ml.graphics.f("rgba(255,255," + (i % 4 ? 255 : 0) + ",0.3)").r(block_width * i, 0, (i % 4) ? 1 : 2, chart_height);


    // 4-12 divisor lines
    for (i = 0; i < last_bar; i++) {
        ml.graphics.f("rgba(255, 255, 255, 0.4)").r(0, bar_height * i - 4, chart_width + 19, 4);
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
    if (update) {
        update = false; // only update once
        stage.update(event);
        editor.set(chart_data);
    } else if (rebuild) {
        rebuild = false; // only update once
        layer.forEach(element=>{
            element.removeAllChildren()
        })
        //chart.removeAllChildren();
        chart_data = editor.get();
        redraw();
    }
}
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
            width: [place, place + (note_width - 1)]
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

        place = Math.max(1, Math.min(16, place));
        let pwidth = addhld.prev.width[1] - addhld.prev.width[0];
        let left = (place < addhld.prev.width[0]) ? place : (place > addhld.prev.width[1] ? place - pwidth : addhld.prev.width[0]);
        let right = (place < addhld.prev.width[0]) ? (place + pwidth) : (place > addhld.prev.width[1] ? place : addhld.prev.width[1]);
        let x = {
            type: "slide",
            width: [left, right],
            from: [],
            lr: addsld.prev.lr
        };
        x.from = [(x.width[0] < addsld.prev.width[0]) ? x.width[0] : addsld.prev.width[0], x.width[1] > addsld.prev.width[1] ? x.width[1] : addsld.prev.width[1]];

        dummy.graphics.f((x.lr == "L") ? lcolor + "80" : rcolor + "80	").r(
            (x.from[0] * block_width - edge_fallback),
            bar_height * (last_bar - addsld.prev.time.bar + 1) - (addsld.prev.time.num - 1) * bar_height / addsld.prev.time.dvs - note_thick * 2,
            (x.from[1] - x.from[0]) * (block_width),
            note_thick * 2
        );
        update = true;
    } else if (addhld.clicked) {
        place = Math.max(1, Math.min(16, place));
        let pwidth = addhld.prev.width[1] - addhld.prev.width[0];
        let left = (place < addhld.prev.width[0]) ? place : (place > addhld.prev.width[1] ? place - pwidth : addhld.prev.width[0]);
        let right = (place < addhld.prev.width[0]) ? (place + pwidth) : (place > addhld.prev.width[1] ? place : addhld.prev.width[1]);
        let x = {
            type: "hold",
            time: { bar: bar_time, num: new_dvs_time, dvs: note_divisor },
            width: [left, right],
            lr: addhld.prev.lr
        };

        dummy.graphics.f((x.lr == "L") ? lholdc + "80" : rholdc + "80")
            .moveTo((addhld.prev.width[0] * block_width - edge_fallback),
                (bar_height * (last_bar - addhld.prev.time.bar + 1) - (addhld.prev.time.num - 1) * bar_height / addhld.prev.time.dvs))
            .lineTo((addhld.prev.width[1] * block_width - edge_fallback),
                (bar_height * (last_bar - addhld.prev.time.bar + 1) - (addhld.prev.time.num - 1) * bar_height / addhld.prev.time.dvs))
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
            width: [place, place + (note_width - 1)]
        };

        insert(x);
        newtap(x);
    } else if (addsld.clicked) {
        addsld.clicked = false;
        addsld.start = false;

        place = Math.max(1, Math.min(16, place));
        let pwidth = addhld.prev.width[1] - addhld.prev.width[0];
        let left = (place < addhld.prev.width[0]) ? place : (place > addhld.prev.width[1] ? place - pwidth : addhld.prev.width[0]);
        let right = (place < addhld.prev.width[0]) ? (place + pwidth) : (place > addhld.prev.width[1] ? place : addhld.prev.width[1]);
        let x = {
            type: "slide",
            width: [left, right],
            from: [],
            time: addsld.prev.time,
            lr: addsld.prev.lr
        };
        x.from = [(x.width[0] < addsld.prev.width[0]) ? x.width[0] : addsld.prev.width[0], x.width[1] > addsld.prev.width[1] ? x.width[1] : addsld.prev.width[1]];

        insert(x, addsld.prev);
        newslide(x, addsld.prev);
        addsld.clicked = false;
        if (addsld.washold) {
            addsld.washold = false;
            $(".hldbt").click();
        }
    } else if (addhld.clicked) {

        place = Math.max(1, Math.min(16, place));
        let pwidth = addhld.prev.width[1] - addhld.prev.width[0];
        let left = (place < addhld.prev.width[0]) ? place : (place > addhld.prev.width[1] ? place - pwidth : addhld.prev.width[0]);
        let right = (place < addhld.prev.width[0]) ? (place + pwidth) : (place > addhld.prev.width[1] ? place : addhld.prev.width[1]);
        let x = {
            type: "hold",
            time: { bar: bar_time, num: new_dvs_time, dvs: note_divisor },
            width: [left, right],
            lr: addhld.prev.lr
        };

        insert(x, addhld.prev);
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
    rebuild = true;
});

// new bar handler
$(".nmebt").click(function (e) {
    last_bar += 1;
    chart_height = bar_height * last_bar;
    $("#slider").slider("option", "min", -(last_bar - 2) * slider_steps)
    rebuild = true;
});

// I deleted the submit action so it no longer exists

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
    $("#slider").slider("value", ($("#slider").slider("value") + (event.deltaY > 0 ? -1 : 1)));
})