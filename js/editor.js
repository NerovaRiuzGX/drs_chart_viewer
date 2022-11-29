var editor = new JSONEditor(document.getElementById("editor"), { mode: "code" });
var score = [
    //{type:"tap",time:{int:1,num:1,den:4},lr:"L",width:[3,7]},
    { type: "tap", time: { int: 2, num: 1, den: 4 }, lr: "R", width: [10, 14] },
    { type: "tap", time: { int: 2, num: 2, den: 4 }, lr: "L", width: [3, 7] },
    { type: "tap", time: { int: 2, num: 3, den: 4 }, lr: "R", width: [10, 14] },
    { type: "tap", time: { int: 2, num: 4, den: 4 }, lr: "L", width: [3, 7] }
];

var cvs = document.getElementById('cvs');
var stage = new createjs.Stage(cvs);
var ct = 10;
var maxme = score[score.length - 1].time.int;
var mh = 500;
cvs.height = ($(window).height() - parseInt(window.getComputedStyle(document.getElementsByTagName("body")[0]).getPropertyValue('padding-top')) - parseInt(window.getComputedStyle(document.getElementsByTagName("body")[0]).getPropertyValue('padding-bottom')));
var ch = maxme * mh;
var cw = cvs.width - 20;
var update = false;
var rebuild = false;
var min = 4;
var hlock = [false, false];
var addtap = false;
var addtype = "R";
var addwid = 5;
var addhld = { start: false, clicked: false, prev: null };
var addsld = { start: false, clicked: false, prev: null, washold: false };
var adddwn = false;
var addjmp = false;
var edit = "d";
var sliderY = 0;
var dummy = new createjs.Shape();

var lcolor = "#FFAA33";
var rcolor = "#66CCFF";
var lholdc = "#EE9922";
var rholdc = "#55BBEE";
var jumpco = "#88DDFF";
var downco = "#FFFF88";

var newtap = function (x) {
    var tap = new createjs.Shape();
    tap.graphics.f((x.lr == "L") ? lcolor : rcolor).rr(
        ((x.width[0] - 1) * (cw / 16)),
        (mh * (maxme - x.time.int + 1) - ((x.time.num - 1) * mh / x.time.den) - ct),
        ((x.width[1] - x.width[0] + 1) * (cw / 16)),
        ct,
        2
    );

    tap.on("mouseover", function (evt) {
        if (edit == "n")
            tap.cursor = "n-resize";
        else if ((addhld.start && !addhld.clicked) || edit == "x")
            tap.cursor = "pointer";
        else if (edit == "d")
            tap.cursor = "default";
        else
            tap.cursor = "e-resize";
    });

    tap.on("mousedown", function (evt) {
        this.parent.addChild(this);
        var dummyY = evt.stageY + sliderY;
        this.offset = { x: this.x - evt.stageX, y: this.y - dummyY, px: Math.round(evt.stageX * 16 / cw) - x.width[0] };
        if (addhld.start && !addhld.clicked) {
            addhld.clicked = true;
            addhld.prev = x;
        }
    });

    tap.on("pressmove", function (evt) {
        if (edit == "l") {
            var left = Math.round(evt.stageX * 16 / cw);
            if (left >= 17) left--;
            if (left <= 0) left++;
            if (left >= x.width[1]) left = x.width[1] - 1;
            x.width[0] = left;
            evt.target.graphics.command.x = (left - 1) * cw / 16;
            evt.target.graphics.command.w = ((x.width[1] - x.width[0] + 1) * (cw / 16));
        } else if (edit == "r") {
            var right = Math.round(evt.stageX * 16 / cw);
            if (right >= 17) right--;
            if (right <= 0) right++;
            if (right <= x.width[0]) right = x.width[0] + 1;
            x.width[1] = right;
            evt.target.graphics.command.w = ((x.width[1] - x.width[0] + 1) * (cw / 16));
        } else if (edit == "e") {
            var left = Math.round(evt.stageX * 16 / cw);
            var width = x.width[1] - x.width[0];
            if (left >= 17 - width) left = 16 - width;
            if (left <= 0) left = 1;
            x.width = [left, left + width];
            evt.target.graphics.command.x = (left - 1) * cw / 16;
        } else if (edit == "n") {
            var dummyY = evt.stageY + sliderY;
            var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
            x.time = { int: maxme - Math.floor((time - 1) / min), num: (min - time % min) % min + 1, den: min };
            evt.target.y = time * mh / min + Math.floor(this.offset.y * min / mh) * mh / min;
        }
        update = true;
    });

    tap.on("dblclick", function (evt) {
        if (edit == "x") {
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
        .moveTo((prev.width[0] * 2 - 1) * (cw / 32),
            (mh * (maxme - prev.time.int + 1) - (prev.time.num - 1) * mh / prev.time.den))
        .lineTo((prev.width[1] * 2 - 1) * (cw / 32),
            (mh * (maxme - prev.time.int + 1) - (prev.time.num - 1) * mh / prev.time.den))
        .lineTo((x.width[1] * 2 - 1) * (cw / 32),
            (mh * (maxme - x.time.int + 1) - (x.time.num - 1) * mh / x.time.den))
        .lineTo((x.width[0] * 2 - 1) * (cw / 32),
            (mh * (maxme - x.time.int + 1) - (x.time.num - 1) * mh / x.time.den))
        .closePath();

    hold.on("mouseover", function (evt) {
        if (edit == "n")
            hold.cursor = "n-resize";
        else if ((addhld.start && !addhld.clicked) || (addsld.start && !addsld.clicked) || (edit ==
            "x"))
            hold.cursor = "pointer";
        else if (edit == "d")
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
        if (edit == "l") {
            var left = Math.round(evt.stageX * 16 / cw);
            if (left >= 17) left--;
            if (left <= 0) left++;
            if (left >= x.width[1]) left = x.width[1] - 1;
            x.width[0] = left;
        } else if (edit == "r") {
            var right = Math.round(evt.stageX * 16 / cw);
            if (right >= 17) right--;
            if (right <= 0) right++;
            if (right <= x.width[0]) right = x.width[0] + 1;
            x.width[1] = right;
        } else if (edit == "e") {
            var left = Math.round(evt.stageX * 16 / cw);
            var width = x.width[1] - x.width[0];
            if (left >= 17 - width) left = 16 - width;
            if (left <= 0) left = 1;
            x.width = [left, left + width];
        } else if (edit == "n") {
            var dummyY = evt.stageY + sliderY;
            var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
            x.time = { int: maxme - Math.floor((time - 1) / min), num: (min - time % min) % min + 1, den: min };
        }
        hold.graphics.c().f((x.lr == "L") ? lholdc : rholdc)
            .moveTo((prev.width[0] * 2 - 1) * (cw / 32),
                (mh * (maxme - prev.time.int + 1) - (prev.time.num - 1) * mh / prev.time.den))
            .lineTo((prev.width[1] * 2 - 1) * (cw / 32),
                (mh * (maxme - prev.time.int + 1) - (prev.time.num - 1) * mh / prev.time.den))
            .lineTo((x.width[1] * 2 - 1) * (cw / 32),
                (mh * (maxme - x.time.int + 1) - (x.time.num - 1) * mh / x.time.den))
            .lineTo((x.width[0] * 2 - 1) * (cw / 32),
                (mh * (maxme - x.time.int + 1) - (x.time.num - 1) * mh / x.time.den))
            .closePath();
        update = true;
    });

    hold.on("dblclick", function (evt) {
        if (edit == "x") {
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
        (x.from[0] * 2 - 1) * (cw / 32),
        mh * (maxme - prev.time.int + 1) - (prev.time.num - 1) * mh / x.time.den - ct * 2,
        (x.from[1] - x.from[0]) * (cw / 16),
        ct * 2
    );

    slide.on("mouseover", function (evt) {
        if (edit == "n")
            slide.cursor = "n-resize";
        else if ((addhld.start && !addhld.clicked) || (edit == "x"))
            slide.cursor = "pointer";
        else if (edit == "d")
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
        if (edit == "l") {
            var left = Math.round(evt.stageX * 16 / cw);
            if (left >= 17) left--;
            if (left <= 0) left++;
            if (left >= x.width[1]) left = x.width[1] - 1;
            x.width[0] = left;
        } else if (edit == "r") {
            var right = Math.round(evt.stageX * 16 / cw);
            if (right >= 17) right--;
            if (right <= 0) right++;
            if (right <= x.width[0]) right = x.width[0] + 1;
            x.width[1] = right;
        } else if (edit == "e") {
            var left = Math.round(evt.stageX * 16 / cw);
            var width = x.width[1] - x.width[0];
            if (left >= 17 - width) left = 16 - width;
            if (left <= 0) left = 1;
            x.width = [left, left + width];
        } else if (edit == "n") {
            var dummyY = evt.stageY + sliderY;
            var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
            x.time = { int: maxme - Math.floor((time - 1) / min), num: (min - time % min) % min + 1, den: min };
        }
        slide.graphics.c().f((x.lr == "L") ? lholdc : rholdc)
            .moveTo((prev.width[0] * 2 - 1) * (cw / 32),
                (mh * (maxme - prev.time.int + 1) - (prev.time.num - 1) * mh / prev.time.den))
            .lineTo((prev.width[1] * 2 - 1) * (cw / 32),
                (mh * (maxme - prev.time.int + 1) - (prev.time.num - 1) * mh / prev.time.den))
            .lineTo((x.width[1] * 2 - 1) * (cw / 32),
                (mh * (maxme - x.time.int + 1) - (x.time.num - 1) * mh / x.time.den))
            .lineTo((x.width[0] * 2 - 1) * (cw / 32),
                (mh * (maxme - x.time.int + 1) - (x.time.num - 1) * mh / x.time.den))
            .closePath();
        update = true;
    });

    slide.on("dblclick", function (evt) {
        if (edit == "x") {
            remove(x);
            stage.removeChild(slide);
            update = true;
        }
    });

    stage.addChild(slide);
    update = true;
};

var newdown = function (x, prev) {
    var down = new createjs.Shape();
    down.compositeOperation = "destination-over";
    down.graphics.f(downco).r(
        0,
        mh * (maxme - x.time.int + 1) - (x.time.num - 1) * mh / x.time.den - ct / 4 * 3,
        cw - 1,
        ct / 4 * 3
    );

    down.on("mouseover", function (evt) {
        if (edit == "n")
            down.cursor = "n-resize";
        else if (edit == "x")
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
        if (edit == "n") {
            var dummyY = evt.stageY + sliderY;
            var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
            x.time = { int: maxme - Math.floor((time - 1) / min), num: (min - time % min) % min + 1, den: min };
            evt.target.y = time * mh / min + Math.floor(this.offset.y * min / mh) * mh / min;
        }
        update = true;
    });

    down.on("dblclick", function (evt) {
        if (edit == "x") {
            remove(x);
            stage.removeChild(down);
            update = true;
        }
    });

    stage.addChild(down);
};

var newjump = function (x, prev) {
    var jump = new createjs.Shape();
    jump.compositeOperation = "destination-over";
    jump.graphics.f(jumpco).r(
        0,
        mh * (maxme - x.time.int + 1) - (x.time.num - 1) * mh / x.time.den - ct / 4 * 3,
        cw - 1,
        ct / 4 * 3
    );

    jump.on("mouseover", function (evt) {
        if (edit == "n")
            jump.cursor = "n-resize";
        else if (edit == "x")
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
        if (edit == "n") {
            var dummyY = evt.stageY + sliderY;
            var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
            x.time = { int: maxme - Math.floor((time - 1) / min), num: (min - time % min) % min + 1, den: min };
            evt.target.y = time * mh / min + Math.floor(this.offset.y * min / mh) * mh / min;
        }
        update = true;
    });

    jump.on("dblclick", function (evt) {
        if (edit == "x") {
            remove(x);
            stage.removeChild(jump);
            update = true;
        }
    });

    stage.addChild(jump);
};

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
        for (i = 0; i < score.length; i++) {
            if (tc(score[i]) > tcx) break;
            if (typeof score[i].hold !== "undefined") {
                var l = 0;
                var r = (score[i].hold.length - 1);
                while (l <= r) {
                    var m = Math.floor((l + r) / 2);
                    var tcm = tc(score[i].hold[m]);
                    if (tcm < tcx)
                        l = m + 1;
                    else if (tcm > tcx)
                        r = m - 1;
                    else {
                        if (score[i].hold[m] == x) return [i, m];
                        if (score[i].hold[m + 1] == x) return [i, m + 1];
                        if (score[i].hold[m - 1] == x) return [i, m - 1];
                        break;
                    }
                }
            }
        }
        return [-1, -1];
    }
    var l = 0;
    var r = (score.length - 1);
    while (l <= r) {
        var m = Math.floor((l + r) / 2);
        var tcm = tc(score[m]);
        if (tcm < tcx)
            l = m + 1;
        else if (tcm > tcx)
            r = m - 1;
        else {
            if (score[m] == x) return [m, -1];
            if (score[m + 1] == x) return [m + 1, -1];
            if (score[m - 1] == x) return [m - 1, -1];
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
            if (typeof score[rp[0]].hold == "undefined") {
                score[rp[0]].hold = [x];
                return;
            }
            score[rp[0]].hold.splice(rp[1] + 1, 0, x);
        }
    } else {
        var l = 0;
        var r = score.length;
        while (r > l) {
            var m = (l + r) >>> 1;
            var tcm = tc(score[m]);
            if (tcm < tcx)
                l = m + 1;
            else
                r = m;
        }
        while (typeof score[l] != "undefined") {
            if (tc(score[l]) == tcx)
                l++;
            else
                break;
        }
        score.splice(l, 0, x);
    }
};

var remove = function (x) {
    var r = search(x);
    if (r[1] >= 0) {
        if (score[r[0]].hold.length == 1)
            delete score[r[0]].hold;
        else
            score[r[0]].hold.splice(r[1], 1);
    } else if (r[0] >= 0) {
        score.splice(r[0], 1);
    }
};

var redraw = function () {
    score.forEach(function (x) {
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
        ml.graphics.f("rgba(255,255," + (i % 4 ? 255 : 0) + ",0.1)").r(cw * i / 16, 0, i % 4 ? 1 : 2, ch - 1);

    for (i = 0; i < maxme * 8; i++)
        ml.graphics.f("#" + (i % 2 ? "6688FF20" : "FF443340")).r(0, mh * (maxme - (i / 8)) - 2, cw + 19, 2);

    stage.addChild(ml);

    for (i = 0; i < maxme; i++) {
        var label = new createjs.Text(i, "bold 14px Arial", "#FFFFFF");
        label.textAlign = "left";
        label.x = 202;
        label.textBaseline = "bottom";
        label.y = mh * (maxme - i) - 2;
        stage.addChild(label);
    }

}

redraw();

//================================measure line

stage.enableMouseOver();

var tick = function (event) {
    // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
    if (update) {
        update = false; // only update once
        stage.update(event);
        editor.set(score);
    } else if (rebuild) {
        rebuild = false; // only update once
        stage.removeAllChildren();
        score = editor.get();
        redraw();
    }
}
createjs.Ticker.addEventListener("tick", tick);
update = true;

//=================stage controll

stage.on("stagemousemove", function (evt) {
    dummy.graphics.c();
    if (addtap) {
        //Since I use a slider for transform(), mouseY should be re-calculated.
        var place = Math.round(evt.stageX * 16 / cw);
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
        if (place > (17 - addwid)) place = (17 - addwid);
        if (place < 1) place = 1;
        var x = {
            type: "tap",
            time: { int: maxme - Math.floor((time - 1) / min), num: (min - time % min) % min + 1, den: min },
            lr: addtype,
            width: [place, place + (addwid - 1)]
        };
        dummy.compositeOperation = "source-over";
        dummy.graphics.f((x.lr == "L") ? lcolor + "80" : rcolor + "80").rr(
            ((x.width[0] - 1) * (cw / 16)),
            (mh * (maxme - x.time.int + 1) - ((x.time.num - 1) * mh / x.time.den) - ct),
            ((x.width[1] - x.width[0] + 1) * (cw / 16)),
            ct,
            2
        );
    } else if (addsld.clicked) {
        var place = Math.round(evt.stageX * 16 / cw);
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
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
            (x.from[0] * 2 - 1) * (cw / 32),
            mh * (maxme - addsld.prev.time.int + 1) - (addsld.prev.time.num - 1) * mh / addsld.prev.time.den - ct * 2,
            (x.from[1] - x.from[0]) * (cw / 16),
            ct * 2
        );
    } else if (addhld.clicked) {
        var place = Math.round(evt.stageX * 16 / cw);
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
        if (place > 16) place = (16);
        if (place < 1) place = 1;
        var pwidth = addhld.prev.width[1] - addhld.prev.width[0];
        var left = (place < addhld.prev.width[0]) ? place : (place > addhld.prev.width[1] ? place - pwidth : addhld.prev.width[0]);
        var right = (place < addhld.prev.width[0]) ? (place + pwidth) : (place > addhld.prev.width[1] ? place : addhld.prev.width[1]);
        var x = {
            type: "hold",
            time: { int: maxme - Math.floor((time - 1) / min), num: (min - time % min) % min + 1, den: min },
            width: [left, right],
            lr: addhld.prev.lr
        };
        dummy.compositeOperation = "destination-over";
        dummy.graphics.f((x.lr == "L") ? lholdc + "80" : rholdc + "80")
            .moveTo((addhld.prev.width[0] * 2 - 1) * (cw / 32),
                (mh * (maxme - addhld.prev.time.int + 1) - (addhld.prev.time.num - 1) * mh / addhld.prev.time.den))
            .lineTo((addhld.prev.width[1] * 2 - 1) * (cw / 32),
                (mh * (maxme - addhld.prev.time.int + 1) - (addhld.prev.time.num - 1) * mh / addhld.prev.time.den))
            .lineTo((x.width[1] * 2 - 1) * (cw / 32),
                (mh * (maxme - x.time.int + 1) - (x.time.num - 1) * mh / x.time.den))
            .lineTo((x.width[0] * 2 - 1) * (cw / 32),
                (mh * (maxme - x.time.int + 1) - (x.time.num - 1) * mh / x.time.den))
            .closePath();
    } else if (adddwn) {
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
        var x = {
            type: "down",
            time: { int: maxme - Math.floor((time - 1) / min), num: (min - time % min) % min + 1, den: min }
        };
        dummy.compositeOperation = "destination-over";
        dummy.graphics.f(downco + "80").r(
            0,
            mh * (maxme - x.time.int + 1) - (x.time.num - 1) * mh / x.time.den - ct / 4 * 3,
            cw - 1,
            ct / 4 * 3
        );
    } else if (addjmp) {
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
        var x = {
            type: "jump",
            time: { int: maxme - Math.floor((time - 1) / min), num: (min - time % min) % min + 1, den: min }
        };
        dummy.compositeOperation = "destination-over";
        dummy.graphics.f(jumpco + "80").r(
            0,
            mh * (maxme - x.time.int + 1) - (x.time.num - 1) * mh / x.time.den - ct / 4 * 3,
            cw - 1,
            ct / 4 * 3
        );
    }
    update = true;
});

stage.on("stagemousedown", function (evt) {
    if (addtap) {
        var place = Math.round(evt.stageX * 16 / cw);
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
        if (place > (17 - addwid)) place = (17 - addwid);
        if (place < 1) place = 1;
        var x = {
            type: "tap",
            time: { int: maxme - Math.floor((time - 1) / min), num: (min - time % min) % min + 1, den: min },
            lr: addtype,
            width: [place, place + (addwid - 1)]
        };
        dummy.graphics.c();
        insert(x);
        newtap(x);
    } else if (addsld.clicked) {
        addsld.clicked = false;
        addsld.start = false;
        var place = Math.round(evt.stageX * 16 / cw);
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
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
        var place = Math.round(evt.stageX * 16 / cw);
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
        if (place > 16) place = (16);
        if (place < 1) place = 1;
        var pwidth = addhld.prev.width[1] - addhld.prev.width[0];
        var left = (place < addhld.prev.width[0]) ? place : (place > addhld.prev.width[1] ? place - pwidth : addhld.prev.width[0]);
        var right = (place < addhld.prev.width[0]) ? (place + pwidth) : (place > addhld.prev.width[1] ? place : addhld.prev.width[1]);
        var x = {
            type: "hold",
            time: { int: maxme - Math.floor((time - 1) / min), num: (min - time % min) % min + 1, den: min },
            width: [left, right],
            lr: addhld.prev.lr
        };
        dummy.graphics.c();
        insert(x, addhld.prev);
        newhold(x, addhld.prev);
        addhld.clicked = false;
    } else if (adddwn) {
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
        var x = {
            type: "down",
            time: { int: maxme - Math.floor((time - 1) / min), num: (min - time % min) % min + 1, den: min }
        };
        dummy.graphics.c();
        insert(x);
        newdown(x);
        adddwn = false;
    } else if (addjmp) {
        var dummyY = evt.stageY + sliderY;
        var time = Math.ceil((dummyY == 0 ? 1 : dummyY) * min / mh);
        var x = {
            type: "jump",
            time: { int: maxme - Math.floor((time - 1) / min), num: (min - time % min) % min + 1, den: min }
        };
        dummy.graphics.c();
        insert(x);
        newjump(x);
        addjmp = false;
    }
});

//==============button controll

$(".minbt").click(function (e) {
    $(".minbt").removeClass("btn-primary");
    $(".minbt").addClass("btn-light");
    $(this).removeClass("btn-light");
    $(this).addClass("btn-primary");
    min = parseInt($(this).html());
});

$(".tonbt").click(function (e) {
    if (edit != "d") $(".dsbbt").click();
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

$(".tapbt").click(function (e) {
    addtype = $(this).html();
});

$(".tawbt").click(function (e) {
    if (addwid == 6) {
        addwid = 5;
        $(".tawbt").removeClass("btn-primary");
        $(".tawbt").addClass("btn-light");
        $(this).removeClass("btn-light");
        $(this).addClass("btn-primary");
    } else {
        addwid = 6;
        $(".tawbt").removeClass("btn-primary");
        $(".tawbt").addClass("btn-light");
        $(this).removeClass("btn-light");
        $(this).addClass("btn-primary");
    }
});

$(".hldbt").click(function (e) {
    if (edit != "d") $(".dsbbt").click();
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
    if (edit != "d") $(".dsbbt").click();
    addsld.start = true;
    addsld.clicked = false;
    if (addhld.start) {
        $(".hldbt").click();
        addsld.washold = true;
    }
});
$(".dwnbt").click(function (e) {
    if (edit != "d") $(".dsbbt").click();
    adddwn = true;
});
$(".jmpbt").click(function (e) {
    if (edit != "d") $(".dsbbt").click();
    addjmp = true;
});
$(".rdrbt").click(function (e) {
    score = editor.get();
    maxme = score[score.length - 1].time.int;
    ch = mh * maxme;
    rebuild = true;
});
$(".nmebt").click(function (e) {
    maxme += 1;
    ch = mh * maxme;
    rebuild = true;
});
$(".edtbt").click(function (e) {
    $(".clrbt").click();
    $(".edtbt").removeClass("btn-primary");
    $(".edtbt").addClass("btn-light");
    $(this).removeClass("btn-light");
    $(this).addClass("btn-primary");
    edit = $(this).attr("data");
});
$(".clrbt").click(function (e) {
    if (addhld.start)
        $(".hldbt").click();
    if (addtap)
        $(".tonbt").click();
    addsld.start = false;
    adddwn = false;
    addjmp = false;
});
$("#submit").click(function (e) {
    $.ajax({
        url: "receiver.php",
        method: "POST",
        data: { s: JSON.stringify(editor.get()), g: grecaptcha.getResponse(), n: $("#fn").val(), r: parseInt(Math.random() * 150) }
    }).done(function (data) {
        console.log(data);
    });
});
$("#slider").height($(window).height() - parseInt(window.getComputedStyle(document.getElementsByTagName("body")[0]).getPropertyValue('padding-top')) - parseInt(window.getComputedStyle(document.getElementsByTagName("body")[0]).getPropertyValue('padding-bottom')));

$("#slider").slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 10000,
    value: 10000,
    change: function (event, ui) {
        var pos = 1 - (ui.value / 10000);
        sliderY = (maxme * mh - $(window).height()) * pos;
        stage.setTransform(0, (-1 * sliderY));
        update = true;
    }
});
document.getElementsByClassName("editarea")[0].addEventListener("wheel", function (evt) {
    $("#slider").slider("value", ($("#slider").slider("value") + (evt.deltaY > 0 ? -100 : 100)));
    //$("#slider").trigger("slide");
});