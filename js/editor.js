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
var chart = [
    //{type:"tap",time:{int:1,num:1,den:4},lr:"L",width:[3,7]},
    { type: "tap", time: { int: 2, num: 1, den: 4 }, lr: "R", width: [10, 14] },
    { type: "tap", time: { int: 2, num: 2, den: 4 }, lr: "L", width: [3, 7] },
    { type: "tap", time: { int: 2, num: 3, den: 4 }, lr: "R", width: [10, 14] },
    { type: "tap", time: { int: 2, num: 4, den: 4 }, lr: "L", width: [3, 7] }
];

// canvas and stage (using const)
const cvs = document.getElementById('cvs');
cvs.height = 1000
const stage = new createjs.Stage(cvs);
stage.enableMouseOver();
const dummy = new createjs.Shape();
// was using this whole shit to calculate the length but I'd rather make it stable
//($(window).height() - parseInt(window.getComputedStyle(document.getElementsByTagName("body")[0]).getPropertyValue('padding-top')) - parseInt(window.getComputedStyle(document.getElementsByTagName("body")[0]).getPropertyValue('padding-bottom')));


// basic size settings
var note_thick = 10;
var last_bar = chart[chart.length - 1].time.int;
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
var edit = "add";
var sliderY = 0;

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
    var tap = new createjs.Shape();
    tap.graphics.f((x.lr == "L") ? lcolor : rcolor).rr(
        ((x.width[0] - 1) * (block_width)),
        (bar_height * (last_bar - x.time.int + 1) - ((x.time.num - 1) * bar_height / x.time.den) - note_thick),
        ((x.width[1] - x.width[0] + 1) * (block_width)),
        note_thick,
        2
    );

    tap.on("mouseover", function (evt) {
        if (edit == "nudgeV")
            tap.cursor = "n-resize";
        else if ((addhld.start && !addhld.clicked) || edit == "delete")
            tap.cursor = "pointer";
        else if (edit == "add")
            tap.cursor = "default";
        else
            tap.cursor = "e-resize";
    });

    tap.on("mousedown", function (evt) {
        this.parent.addChild(this);
        var dummyY = evt.stageY + sliderY;
        this.offset = { x: this.x - evt.stageX, y: this.y - dummyY, px: Math.round(evt.stageX * 16 / chart_width) - x.width[0] };
        if (addhld.start && !addhld.clicked) {
            addhld.clicked = true;
            addhld.prev = x;
        }
    });

    tap.on("pressmove", function (evt) {
        if (edit == "stretchL") {
            var left = Math.round(evt.stageX * 16 / chart_width);
            if (left >= 17) left--;
            if (left <= 0) left++;
            if (left >= x.width[1]) left = x.width[1] - 1;
            x.width[0] = left;
            evt.target.graphics.command.x = (left - 1) * block_width;
            evt.target.graphics.command.w = ((x.width[1] - x.width[0] + 1) * (block_width));
        } else if (edit == "stretchR") {
            var right = Math.round(evt.stageX * 16 / chart_width);
            if (right >= 17) right--;
            if (right <= 0) right++;
            if (right <= x.width[0]) right = x.width[0] + 1;
            x.width[1] = right;
            evt.target.graphics.command.w = ((x.width[1] - x.width[0] + 1) * (block_width));
        } else if (edit == "nudgeH") {
            var left = Math.round(evt.stageX * 16 / chart_width);
            var width = x.width[1] - x.width[0];
            if (left >= 17 - width) left = 16 - width;
            if (left <= 0) left = 1;
            x.width = [left, left + width];
            evt.target.graphics.command.x = (left - 1) * block_width;
        } else if (edit == "nudgeV") {
            var dummyY = evt.stageY + sliderY;
            var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
            x.time = { int: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, den: note_divisor };
            evt.target.y = time * bar_height / note_divisor + Math.floor(this.offset.y * note_divisor / bar_height) * bar_height / note_divisor;
        }
        update = true;
    });

    tap.on("dblclick", function (evt) {
        if (edit == "delete") {
            remove(x);
            stage.removeChild(tap);
            update = true;
        }
    });

    stage.addChild(tap);
    update = true;
};

var newhold = function (x, prev) {
    var hold = new createjs.Shape();
    hold.compositeOperation = "destination-over";
    hold.graphics.f((x.lr == "L") ? lholdc : rholdc)
        .moveTo((prev.width[0] * 2 - 1) * (edge_fallback),
            (bar_height * (last_bar - prev.time.int + 1) - (prev.time.num - 1) * bar_height / prev.time.den))
        .lineTo((prev.width[1] * 2 - 1) * (edge_fallback),
            (bar_height * (last_bar - prev.time.int + 1) - (prev.time.num - 1) * bar_height / prev.time.den))
        .lineTo((x.width[1] * 2 - 1) * (edge_fallback),
            (bar_height * (last_bar - x.time.int + 1) - (x.time.num - 1) * bar_height / x.time.den))
        .lineTo((x.width[0] * 2 - 1) * (edge_fallback),
            (bar_height * (last_bar - x.time.int + 1) - (x.time.num - 1) * bar_height / x.time.den))
        .closePath();

    hold.on("mouseover", function (evt) {
        if (edit == "nudgeV")
            hold.cursor = "n-resize";
        else if ((addhld.start && !addhld.clicked) || (addsld.start && !addsld.clicked) || (edit ==
            "delete"))
            hold.cursor = "pointer";
        else if (edit == "add")
            hold.cursor = "default";
        else
            hold.cursor = "e-resize";
    });

    hold.on("mousedown", function (evt) {
        this.parent.addChild(this);
        var dummyY = evt.stageY + sliderY;
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
            var left = Math.round(evt.stageX * 16 / chart_width);
            if (left >= 17) left--;
            if (left <= 0) left++;
            if (left >= x.width[1]) left = x.width[1] - 1;
            x.width[0] = left;
        } else if (edit == "stretchR") {
            var right = Math.round(evt.stageX * 16 / chart_width);
            if (right >= 17) right--;
            if (right <= 0) right++;
            if (right <= x.width[0]) right = x.width[0] + 1;
            x.width[1] = right;
        } else if (edit == "nudgeH") {
            var left = Math.round(evt.stageX * 16 / chart_width);
            var width = x.width[1] - x.width[0];
            if (left >= 17 - width) left = 16 - width;
            if (left <= 0) left = 1;
            x.width = [left, left + width];
        } else if (edit == "nudgeV") {
            var dummyY = evt.stageY + sliderY;
            var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
            x.time = { int: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, den: note_divisor };
        }
        hold.graphics.c().f((x.lr == "L") ? lholdc : rholdc)
            .moveTo((prev.width[0] * 2 - 1) * (edge_fallback),
                (bar_height * (last_bar - prev.time.int + 1) - (prev.time.num - 1) * bar_height / prev.time.den))
            .lineTo((prev.width[1] * 2 - 1) * (edge_fallback),
                (bar_height * (last_bar - prev.time.int + 1) - (prev.time.num - 1) * bar_height / prev.time.den))
            .lineTo((x.width[1] * 2 - 1) * (edge_fallback),
                (bar_height * (last_bar - x.time.int + 1) - (x.time.num - 1) * bar_height / x.time.den))
            .lineTo((x.width[0] * 2 - 1) * (edge_fallback),
                (bar_height * (last_bar - x.time.int + 1) - (x.time.num - 1) * bar_height / x.time.den))
            .closePath();
        update = true;
    });

    hold.on("dblclick", function (evt) {
        if (edit == "delete") {
            remove(x);
            stage.removeChild(hold);
            update = true;
        }
    });

    stage.addChild(hold);
    update = true;
};

var newslide = function (x, prev) {
    var slide = new createjs.Shape();
    slide.graphics.f((x.lr == "L") ? lcolor : rcolor).r(
        (x.from[0] * 2 - 1) * (edge_fallback),
        bar_height * (last_bar - prev.time.int + 1) - (prev.time.num - 1) * bar_height / x.time.den - note_thick * 2,
        (x.from[1] - x.from[0]) * (block_width),
        note_thick * 2
    );

    slide.on("mouseover", function (evt) {
        if (edit == "nudgeV")
            slide.cursor = "n-resize";
        else if ((addhld.start && !addhld.clicked) || (edit == "delete"))
            slide.cursor = "pointer";
        else if (edit == "add")
            slide.cursor = "default";
        else
            slide.cursor = "e-resize";
    });

    slide.on("mousedown", function (evt) {
        this.parent.addChild(this);
        var dummyY = evt.stageY + sliderY;
        this.offset = { x: this.x - evt.stageX, y: this.y - dummyY };
        if (addhld.start & !addhld.clicked) {
            addhld.clicked = true;
            addhld.prev = x;
        }
    });

    slide.on("pressmove", function (evt) {
        if (edit == "stretchL") {
            var left = Math.round(evt.stageX * 16 / chart_width);
            if (left >= 17) left--;
            if (left <= 0) left++;
            if (left >= x.width[1]) left = x.width[1] - 1;
            x.width[0] = left;
        } else if (edit == "stretchR") {
            var right = Math.round(evt.stageX * 16 / chart_width);
            if (right >= 17) right--;
            if (right <= 0) right++;
            if (right <= x.width[0]) right = x.width[0] + 1;
            x.width[1] = right;
        } else if (edit == "nudgeH") {
            var left = Math.round(evt.stageX * 16 / chart_width);
            var width = x.width[1] - x.width[0];
            if (left >= 17 - width) left = 16 - width;
            if (left <= 0) left = 1;
            x.width = [left, left + width];
        } else if (edit == "nudgeV") {
            var dummyY = evt.stageY + sliderY;
            var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
            x.time = { int: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, den: note_divisor };
        }
        slide.graphics.c().f((x.lr == "L") ? lholdc : rholdc)
            .moveTo((prev.width[0] * 2 - 1) * (edge_fallback),
                (bar_height * (last_bar - prev.time.int + 1) - (prev.time.num - 1) * bar_height / prev.time.den))
            .lineTo((prev.width[1] * 2 - 1) * (edge_fallback),
                (bar_height * (last_bar - prev.time.int + 1) - (prev.time.num - 1) * bar_height / prev.time.den))
            .lineTo((x.width[1] * 2 - 1) * (edge_fallback),
                (bar_height * (last_bar - x.time.int + 1) - (x.time.num - 1) * bar_height / x.time.den))
            .lineTo((x.width[0] * 2 - 1) * (edge_fallback),
                (bar_height * (last_bar - x.time.int + 1) - (x.time.num - 1) * bar_height / x.time.den))
            .closePath();
        update = true;
    });

    slide.on("dblclick", function (evt) {
        if (edit == "delete") {
            remove(x);
            stage.removeChild(slide);
            update = true;
        }
    });

    stage.addChild(slide);
    update = true;
};

var newdown = function (x) {
    var down = new createjs.Shape();
    down.compositeOperation = "destination-over";
    down.graphics.f(downco).r(
        0,
        bar_height * (last_bar - x.time.int + 1) - (x.time.num - 1) * bar_height / x.time.den - note_thick * 0.75,
        chart_width - 1,
        note_thick * 0.75
    );

    down.on("mouseover", function (evt) {
        if (edit == "nudgeV")
            down.cursor = "n-resize";
        else if (edit == "delete")
            down.cursor = "pointer";
        else
            down.cursor = "default";
    });

    down.on("mousedown", function (evt) {
        this.parent.addChild(this);
        var dummyY = evt.stageY + sliderY;
        this.offset = { x: this.x - evt.stageX, y: this.y - dummyY };
    });

    down.on("pressmove", function (evt) {
        if (edit == "nudgeV") {
            var dummyY = evt.stageY + sliderY;
            var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
            x.time = { int: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, den: note_divisor };
            evt.target.y = time * bar_height / note_divisor + Math.floor(this.offset.y * note_divisor / bar_height) * bar_height / note_divisor;
        }
        update = true;
    });

    down.on("dblclick", function (evt) {
        if (edit == "delete") {
            remove(x);
            stage.removeChild(down);
            update = true;
        }
    });

    stage.addChild(down);
};

var newjump = function (x) {
    var jump = new createjs.Shape();
    jump.compositeOperation = "destination-over";
    jump.graphics.f(jumpco).r(
        0,
        bar_height * (last_bar - x.time.int + 1) - (x.time.num - 1) * bar_height / x.time.den - note_thick * 0.75,
        chart_width - 1,
        note_thick * 0.75
    );

    jump.on("mouseover", function (evt) {
        if (edit == "nudgeV")
            jump.cursor = "n-resize";
        else if (edit == "delete")
            jump.cursor = "pointer";
        else
            jump.cursor = "default";
    });

    jump.on("mousedown", function (evt) {
        this.parent.addChild(this);
        var dummyY = evt.stageY + sliderY;
        this.offset = { x: this.x - evt.stageX, y: this.y - dummyY };
    });

    jump.on("pressmove", function (evt) {
        if (edit == "nudgeV") {
            var dummyY = evt.stageY + sliderY;
            var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
            x.time = { int: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, den: note_divisor };
            evt.target.y = time * bar_height / note_divisor + Math.floor(this.offset.y * note_divisor / bar_height) * bar_height / note_divisor;
        }
        update = true;
    });

    jump.on("dblclick", function (evt) {
        if (edit == "delete") {
            remove(x);
            stage.removeChild(jump);
            update = true;
        }
    });

    stage.addChild(jump);
};

/* ==================================== Functions: Control & Calculation ====================================
    This section contains functions that control some types of objects or do some calculations.
*/

var tc = function (a) {
    return a.time.int + (a.time.num - 1) / a.time.den;
};

var search = function (x) {
    if (typeof x == "undefined") {
        console.log("undefined in search!");
        return [-1, -2];
    }
    var tcx = tc(x);
    if (x.type == "hold" || x.type == "slide") {
        for (i = 0; i < chart.length; i++) {
            if (tc(chart[i]) > tcx) break;
            if (typeof chart[i].hold !== "undefined") {
                var l = 0;
                var r = (chart[i].hold.length - 1);
                while (l <= r) {
                    var m = Math.floor((l + r) / 2);
                    var tcm = tc(chart[i].hold[m]);
                    if (tcm < tcx)
                        l = m + 1;
                    else if (tcm > tcx)
                        r = m - 1;
                    else {
                        if (chart[i].hold[m] == x) return [i, m];
                        if (chart[i].hold[m + 1] == x) return [i, m + 1];
                        if (chart[i].hold[m - 1] == x) return [i, m - 1];
                        break;
                    }
                }
            }
        }
        return [-1, -1];
    }
    var l = 0;
    var r = (chart.length - 1);
    while (l <= r) {
        var m = Math.floor((l + r) / 2);
        var tcm = tc(chart[m]);
        if (tcm < tcx)
            l = m + 1;
        else if (tcm > tcx)
            r = m - 1;
        else {
            if (chart[m] == x) return [m, -1];
            if (chart[m + 1] == x) return [m + 1, -1];
            if (chart[m - 1] == x) return [m - 1, -1];
            return [-1, -1];
        }
    }
    return [-1, -1];
};

var insert = function (x, prev = null) {
    var tcx = tc(x);
    if (x.type == "hold" || x.type == "slide") {
        var rp = search(prev);
        if (rp[0] >= 0) {
            if (typeof chart[rp[0]].hold == "undefined") {
                chart[rp[0]].hold = [x];
                return;
            }
            chart[rp[0]].hold.splice(rp[1] + 1, 0, x);
        }
    } else {
        var l = 0;
        var r = chart.length;
        while (r > l) {
            var m = (l + r) >>> 1;
            var tcm = tc(chart[m]);
            if (tcm < tcx)
                l = m + 1;
            else
                r = m;
        }
        while (typeof chart[l] != "undefined") {
            if (tc(chart[l]) == tcx)
                l++;
            else
                break;
        }
        chart.splice(l, 0, x);
    }
};

var remove = function (x) {
    var r = search(x);
    if (r[1] >= 0) {
        if (chart[r[0]].hold.length == 1)
            delete chart[r[0]].hold;
        else
            chart[r[0]].hold.splice(r[1], 1);
    } else if (r[0] >= 0) {
        chart.splice(r[0], 1);
    }
};

var redraw = function () {
    chart.forEach(function (x) {
        if (x.type == "tap") {
            newtap(x);
            if (typeof x.hold != "undefined") {
                var prev = x;
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
    stage.addChild(dummy);

    var ml = new createjs.Shape();
    ml.compositeOperation = "destination-over";
    for (i = 1; i < 17; i++)
        ml.graphics.f("rgba(255,255," + (i % 4 ? 255 : 0) + ",0.1)").r(chart_width * i / 16, 0, i % 4 ? 1 : 2, chart_height - 1);

    for (i = 0; i < last_bar * 8; i++)
        ml.graphics.f("#" + (i % 2 ? "6688FF20" : "FF443340")).r(0, bar_height * (last_bar - (i / 8)) - 2, chart_width + 19, 2);

    stage.addChild(ml);

    for (i = 0; i < last_bar; i++) {
        var label = new createjs.Text(i, "bold 14px Arial", "#FFFFFF");
        label.textAlign = "left";
        label.x = 202;
        label.textBaseline = "bottom";
        label.y = bar_height * (last_bar - i) - 2;
        stage.addChild(label);
    }

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
        editor.set(chart);
    } else if (rebuild) {
        rebuild = false; // only update once
        stage.removeAllChildren();
        chart = editor.get();
        redraw();
    }
}
createjs.Ticker.addEventListener("tick", tick);
update = true;

stage.on("stagemousemove", function (evt) {
    dummy.graphics.c();
    if (addtap) {
        //Since I use a slider for transform(), mouseY should be re-calculated.
        var place = Math.round(evt.stageX * 16 / chart_width);
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
        if (place > (17 - note_width)) place = (17 - note_width);
        if (place < 1) place = 1;
        var x = {
            type: "tap",
            time: { int: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, den: note_divisor },
            lr: note_polarity,
            width: [place, place + (note_width - 1)]
        };
        dummy.compositeOperation = "source-over";
        dummy.graphics.f((x.lr == "L") ? lcolor + "80" : rcolor + "80").rr(
            ((x.width[0] - 1) * (block_width)),
            (bar_height * (last_bar - x.time.int + 1) - ((x.time.num - 1) * bar_height / x.time.den) - note_thick),
            ((x.width[1] - x.width[0] + 1) * (block_width)),
            note_thick,
            2
        );
    } else if (addsld.clicked) {
        var place = Math.round(evt.stageX * 16 / chart_width);
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
        if (place > 16) place = (16);
        if (place < 1) place = 1;
        var pwidth = addhld.prev.width[1] - addhld.prev.width[0];
        var left = (place < addhld.prev.width[0]) ? place : (place > addhld.prev.width[1] ? place - pwidth : addhld.prev.width[0]);
        var right = (place < addhld.prev.width[0]) ? (place + pwidth) : (place > addhld.prev.width[1] ? place : addhld.prev.width[1]);
        var x = {
            type: "slide",
            width: [left, right],
            from: [],
            lr: addsld.prev.lr
        };
        x.from = [(x.width[0] < addsld.prev.width[0]) ? x.width[0] : addsld.prev.width[0], x.width[1] > addsld.prev.width[1] ? x.width[1] : addsld.prev.width[1]];
        dummy.compositeOperation = "source-over";
        dummy.graphics.f((x.lr == "L") ? lcolor + "80" : rcolor + "80	").r(
            (x.from[0] * 2 - 1) * (edge_fallback),
            bar_height * (last_bar - addsld.prev.time.int + 1) - (addsld.prev.time.num - 1) * bar_height / addsld.prev.time.den - note_thick * 2,
            (x.from[1] - x.from[0]) * (block_width),
            note_thick * 2
        );
    } else if (addhld.clicked) {
        var place = Math.round(evt.stageX * 16 / chart_width);
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
        if (place > 16) place = (16);
        if (place < 1) place = 1;
        var pwidth = addhld.prev.width[1] - addhld.prev.width[0];
        var left = (place < addhld.prev.width[0]) ? place : (place > addhld.prev.width[1] ? place - pwidth : addhld.prev.width[0]);
        var right = (place < addhld.prev.width[0]) ? (place + pwidth) : (place > addhld.prev.width[1] ? place : addhld.prev.width[1]);
        var x = {
            type: "hold",
            time: { int: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, den: note_divisor },
            width: [left, right],
            lr: addhld.prev.lr
        };
        dummy.compositeOperation = "destination-over";
        dummy.graphics.f((x.lr == "L") ? lholdc + "80" : rholdc + "80")
            .moveTo((addhld.prev.width[0] * 2 - 1) * (edge_fallback),
                (bar_height * (last_bar - addhld.prev.time.int + 1) - (addhld.prev.time.num - 1) * bar_height / addhld.prev.time.den))
            .lineTo((addhld.prev.width[1] * 2 - 1) * (edge_fallback),
                (bar_height * (last_bar - addhld.prev.time.int + 1) - (addhld.prev.time.num - 1) * bar_height / addhld.prev.time.den))
            .lineTo((x.width[1] * 2 - 1) * (edge_fallback),
                (bar_height * (last_bar - x.time.int + 1) - (x.time.num - 1) * bar_height / x.time.den))
            .lineTo((x.width[0] * 2 - 1) * (edge_fallback),
                (bar_height * (last_bar - x.time.int + 1) - (x.time.num - 1) * bar_height / x.time.den))
            .closePath();
    } else if (adddwn) {
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
        var x = {
            type: "down",
            time: { int: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, den: note_divisor }
        };
        dummy.compositeOperation = "destination-over";
        dummy.graphics.f(downco + "80").r(
            0,
            bar_height * (last_bar - x.time.int + 1) - (x.time.num - 1) * bar_height / x.time.den - note_thick * 0.75,
            chart_width - 1,
            note_thick * 0.75
        );
    } else if (addjmp) {
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
        var x = {
            type: "jump",
            time: { int: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, den: note_divisor }
        };
        dummy.compositeOperation = "destination-over";
        dummy.graphics.f(jumpco + "80").r(
            0,
            bar_height * (last_bar - x.time.int + 1) - (x.time.num - 1) * bar_height / x.time.den - note_thick * 0.75,
            chart_width - 1,
            note_thick * 0.75
        );
    }
    update = true;
});

stage.on("stagemousedown", function (evt) {
    if (addtap) {
        var place = Math.round(evt.stageX * 16 / chart_width);
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
        if (place > (17 - note_width)) place = (17 - note_width);
        if (place < 1) place = 1;
        var x = {
            type: "tap",
            time: { int: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, den: note_divisor },
            lr: note_polarity,
            width: [place, place + (note_width - 1)]
        };
        dummy.graphics.c();
        insert(x);
        newtap(x);
    } else if (addsld.clicked) {
        addsld.clicked = false;
        addsld.start = false;
        var place = Math.round(evt.stageX * 16 / chart_width);
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
        if (place > 16) place = (16);
        if (place < 1) place = 1;
        var pwidth = addhld.prev.width[1] - addhld.prev.width[0];
        var left = (place < addhld.prev.width[0]) ? place : (place > addhld.prev.width[1] ? place - pwidth : addhld.prev.width[0]);
        var right = (place < addhld.prev.width[0]) ? (place + pwidth) : (place > addhld.prev.width[1] ? place : addhld.prev.width[1]);
        var x = {
            type: "slide",
            width: [left, right],
            from: [],
            time: addsld.prev.time,
            lr: addsld.prev.lr
        };
        x.from = [(x.width[0] < addsld.prev.width[0]) ? x.width[0] : addsld.prev.width[0], x.width[1] > addsld.prev.width[1] ? x.width[1] : addsld.prev.width[1]];
        dummy.graphics.c();
        insert(x, addsld.prev);
        newslide(x, addsld.prev);
        addsld.clicked = false;
        if (addsld.washold) {
            addsld.washold = false;
            $(".hldbt").click();
        }
    } else if (addhld.clicked) {
        var place = Math.round(evt.stageX * 16 / chart_width);
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
        if (place > 16) place = (16);
        if (place < 1) place = 1;
        var pwidth = addhld.prev.width[1] - addhld.prev.width[0];
        var left = (place < addhld.prev.width[0]) ? place : (place > addhld.prev.width[1] ? place - pwidth : addhld.prev.width[0]);
        var right = (place < addhld.prev.width[0]) ? (place + pwidth) : (place > addhld.prev.width[1] ? place : addhld.prev.width[1]);
        var x = {
            type: "hold",
            time: { int: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, den: note_divisor },
            width: [left, right],
            lr: addhld.prev.lr
        };
        dummy.graphics.c();
        insert(x, addhld.prev);
        newhold(x, addhld.prev);
        addhld.clicked = false;
    } else if (adddwn) {
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
        var x = {
            type: "down",
            time: { int: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, den: note_divisor }
        };
        dummy.graphics.c();
        insert(x);
        newdown(x);
        adddwn = false;
    } else if (addjmp) {
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * note_divisor / bar_height);
        var x = {
            type: "jump",
            time: { int: last_bar - Math.floor((time - 1) / note_divisor), num: (note_divisor - time % note_divisor) % note_divisor + 1, den: note_divisor }
        };
        dummy.graphics.c();
        insert(x);
        newjump(x);
        addjmp = false;
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
});

// edit options
$(".edtbt").click(function (e) {
    $(".clrbt").click();

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
});

// note polarity
$(".tapbt").click(function (e) {
    $(".tapbt").removeClass(["btn-primary", "btn-warning"])
    $(".tapbt").addClass("btn-secondary")
    $(this).removeClass("btn-secondary")
    note_polarity = $(this).val();
    $(this).addClass((note_polarity == 'R') ? "btn-primary" : "btn-warning")
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
});

// redraw button handler
$(".rdrbt").click(function (e) {
    chart = editor.get();
    last_bar = chart[chart.length - 1].time.int;
    chart_height = bar_height * last_bar;
    rebuild = true;
});

// new bar handler
$(".nmebt").click(function (e) {
    last_bar += 1;
    chart_height = bar_height * last_bar;
    rebuild = true;
});

// I deleted the submit action so it no longer exists

/* ==================================== Others: I don't know ====================================
    Didn't even touch these things before.
*/

$("#slider").height($(window).height() - parseInt(window.getComputedStyle(document.getElementsByTagName("body")[0]).getPropertyValue('padding-top')) - parseInt(window.getComputedStyle(document.getElementsByTagName("body")[0]).getPropertyValue('padding-bottom')));

$("#slider").slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 10000,
    value: 10000,
    change: function (event, ui) {
        var pos = 1 - (ui.value / 10000);
        sliderY = (last_bar * bar_height - $(window).height()) * pos;
        stage.setTransform(0, (-1 * sliderY));
        update = true;
    }
});
document.getElementsByClassName("editarea")[0].addEventListener("wheel", function (evt) {
    $("#slider").slider("value", ($("#slider").slider("value") + (evt.deltaY > 0 ? -100 : 100)));
    //$("#slider").trigger("slide");
});

// setInterval(()=>{
//     console.log(addsld)
// }, 1000)