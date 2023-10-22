/*Copyright (c) 2023 oblerion

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const LOVE2D_VERSION = "b0.6"
const LOVE2D_MOUSE = true;
const LOVE2D_KEYBOARD = true;
const LOVE2D_TOUCH = true;

function WriteSave(name, data) {
	//limite to 5Mb;
	localStorage.setItem(name, JSON.stringify(data));
}
function LoadSave(name) {
	return JSON.parse(localStorage.getItem(name));
}
function collide(a, b) {
	if (a.x + a.w > b.x &&
		a.x < b.x + b.w &&
		a.y + a.h > b.y &&
		a.y < b.y + b.h)
		return true;
	return false;
}
class Love
{
    constructor()
    {
        this.mouse = {
            "x":0,
            "y":0,
            "w":6,
            "h":6,
            "btn":[false,false,false]
        };
        this.keyboard = {
            "key":[]
        };
        this.touches = [];
	    this.curant_color = "#000000";
		this.curant_volume = 1.0;
		this.curant_font = "arial";
        this.n_exit = false;
        this.canvas = _create_canvas(800,480,"love2d");
        this.context = _create_context(this.canvas);

        this.dt = 0;
		this.timer_url=0;
	    this.load = undefined;
		this.update = undefined;
		this.draw = undefined;
		this.mousepressed = undefined;
		this.mousereleased = undefined;
		this.keypressed = undefined;
		this.keyreleased = undefined;
		this.touchpressed = undefined;
		this.touchreleased = undefined;

        this.lastUpdate = 0;
        this.loading = 0;
    }
	system_openURL(url)
	{
		if(this.timer_url<=0)
		{
			this.timer_url=0.5;
			if(window.open(url)!=null)return true;
		}
		return false;
	}
    timer_getDelta()
    {
        return this.dt;
    }
    window_setMode(w,h)
    {
		this.canvas.width = w;
		this.canvas.height = h;
    }
    window_setIcon(object)
    {
        let s = object.src;
        let d = document.createElement("link");
		d.rel = "icon";
		d.href = s;
		document.head.appendChild(d);
    }
	audio_newSource(filename, type) {
		let sg;
		if (type == "static") {
			sg = new Audio();
			sg.src = filename;
			sg.volume=1.0;
			sg.preload="auto";
			sg.controls=false;
			sg.style.display = "none";
			sg.currentTime = 0;
			sg.loop=false;
		}
		else if (type == "stream") {
			sg = new Audio();
			sg.src = filename;
			sg.volume=1.0;
			sg.preload="auto";
			sg.controls=false;
			sg.style.display = "none";
			sg.currentTime = 0;
			sg.loop=true;
		}
		return sg;
	}
	audio_getVolume() {
		return this.curant_volume;
	}
	audio_setVolume(vol) {
		if (vol >= 0 && vol < 1.1) this.curant_volume = vol;
	}
	audio_play(clas) {
		clas.volume = this.curant_volume;
		if (clas.loop == false && clas.currentTime>0) 
		{
			clas.currentTime = 0;
		}
		clas.play();
	}
	audio_pause(clas) {
		clas.pause();
	}
	audio_stop(clas) {
		clas.pause();
	}
	graphics_getWidth() {
		return this.canvas.width;
	}
	graphics_getHeight() {
		return this.canvas.height;
	}
	graphics_newText(pfont,ptext)
	{
		let text={};
		text.text = ptext;
		text.font = pfont;
		text.getWidth = function()
		{
            this.context.font = text.font;
            return this.context.measureText(text.text).width;
		};
		text.getHeight = function()
		{
            this.context.font = text.font;
            return this.context.measureText(text.text).height;
		};
	}
    async graphics_newFont(filename, url) {
		let f = new FontFace(filename, url);
		//return f;
		f.load();
		document.fonts.add(f);
	}
	graphics_newImage(filename) {
		let img;
		img = new Image();
		img.src = filename;
		img.type = "image";
		img.getWidth = function () {
			return img.width;
		};
		img.getHeight = function () {
			return img.height;
		};
		return img;
	}
	graphics_newVideo(filename) {
		let vid;
		vid = document.createElement("VIDEO");
		vid.src = filename;
		vid.preload="auto";
		vid.controls="none";
		vid.type = "video";
		return vid;
	}
	graphics_newQuad(x, y, w, h, sw, sh) {
		let q = {
			x: x,
			y: y,
			w: w,
			h: h
		};
		return q;
	}
    graphics_draw(clas, x, y, r, sx, sy, o) 
    {
        if (clas.type == "image" ||
			(clas.type == "video" && clas.ended == false)) 
        {
			if (typeof (x) == "number") 
            {
				if (sx != null && sy != null) 
                {
					if (r > 0) 
                    {
						//rotate with scalling
						this.context.translate(x + (sx / 2), y + (sy / 2));
						this.context.rotate(r);
						this.context.translate(-x - (sx / 2), -y - (sy / 2));
						this.context.drawImage(clas, x, y, sx, sy);
						this.context.setTransform(1, 0, 0, 1, 0, 0);
					}
					else 
                        this.context.drawImage(clas, x, y, sx, sy);
				}
				else 
                {
					if (r > 0) 
                    {
						// rotate without scalling
						this.context.translate(x + (clas.width / 2), y + (clas.height / 2));
						this.context.rotate(r);
						this.context.translate(-x - (clas.width / 2), -y - (clas.height / 2));
						this.context.drawImage(clas, x, y);
						this.context.setTransform(1, 0, 0, 1, 0, 0);
					}
					else this.context.drawImage(clas, x, y);
				}
			}
			else if (typeof (x) == "object") 
            {
				// x -> quad
				// * y -> x
				// * r -> y
				// * sx ->r
				// * sy ->sx
				// * o ->sy

				if (sy != null && o != null) 
                {
					if (sx > 0) 
                    {
						//rotate with scalling
						this.context.translate(y + (x.w / 2), r + (x.h / 2));
						this.context.rotate(sx);
						this.context.translate(-y - (x.w / 2), -r - (x.h / 2));
						this.context.drawImage(clas, x.x, x.y, x.w, x.h, y, r, sy, o);
						this.context.setTransform(1, 0, 0, 1, 0, 0);
					}
					else
						this.context.drawImage(clas, x.x, x.y, x.w, x.h, y, r, sy, o);
				}
				else 
                {
					if (sx > 0) 
                    {
						//rotate without scalling
						this.context.translate(y + (x.w / 2), r + (x.h / 2));
						this.context.rotate(sx);
						this.context.translate(-y - (x.w / 2), -r - (x.h / 2));
						this.context.drawImage(clas, x.x, x.y, x.w, x.h, y, r, x.w, x.h);
						this.context.setTransform(1, 0, 0, 1, 0, 0);
					}
					else
						this.context.drawImage(clas, x.x, x.y, x.w, x.h, y, r, x.w, x.h);
				}
			}
		}
		if (this.curant_color.length > 7) 
            this.context.globalAlpha = 1;
			
	}
    graphics_getColor() {
		return this.curant_color;
	}
    graphics_setColor(r, g, b, a) {
		let hex="";
		if(typeof(r)=="string")
		{
			this.curant_color=r;
			this.context.fillStyle=r;
			this.context.globalAlpha=1;
		}
		else
        {
            let lc={
                r:r,
                g:g,
                b:b,
                a:a
            };
            hex = "#"; 
            hex += ((lc.r|1 << 8).toString(16)).slice(1);
            hex += ((lc.g|1 << 8).toString(16)).slice(1); 
            hex += ((lc.b|1 << 8).toString(16)).slice(1);
            this.context.fillStyle=hex;
            this.curant_color = hex;

            if(lc.a==undefined) lc.a=1;
            else lc.a /= 255;
            this.context.globalAlpha=lc.a;
        }
	}
    graphics_setFont(pfont) 
    {
		this.curant_font = pfont;
	}
    graphics_print(text, x, y, r, size) 
    {
		if (r == 0) {
			//this.context.fillStyle = this.curant_color;
			this.context.font = size + "px " + this.curant_font;
			this.context.fillText(text, x, y);
		}
		else {
			this.context.translate(x, y);
			this.context.rotate(r);
			this.context.translate(-x, -y);
			this.context.fillStyle = this.curant_color;
			this.context.font = size + "px " + this.curant_font;
			this.context.fillText(text, x, y);
			this.context.setTransform(1, 0, 0, 1, 0, 0);
		}
	}
	graphics_rectangle(mode, x, y, w, h) 
    {
	    if (mode == "fill") {
			this.context.fillStyle = this.curant_color;
			this.context.fillRect(x, y, w, h);
		}
		if (mode == "line") {
			this.context.strokeStyle = this.curant_color;
			this.context.strokeRect(x, y, w, h);
		}
	}
	graphics_circle(mode, x, y, radius) 
    {
		this.context.beginPath();	
		if (mode == "fill") {
			this.context.fillStyle = this.curant_color;
			this.context.strokeStyle = this.curant_color;
			this.context.arc(x, y, radius, 0, 4 * Math.PI, false);
			this.context.fill();
		}
		else
		{
			this.context.strokeStyle = this.curant_color;
			this.context.arc(x, y, radius, 0, 4 * Math.PI, false);
		}
		this.context.stroke();
	}
	graphics_line(x,y,x2,y2)
	{
		this.context.fillStyle = this.curant_color;
		this.context.beginPath();
		this.context.moveTo(x,y);
		this.context.lineTo(x2,y2);
		this.context.stroke();
	}
    graphics_scale(w, h) 
    {
        this.context.scale(w, h);
	}

    keyboard_isDown(key)
    {
        let lkey = key;
		switch (lkey) {
			case "up":
				lkey = "ArrowUp";
				break;
			case "down":
				lkey = "ArrowDown";
				break;
			case "left":
				lkey = "ArrowLeft";
				break;
			case "right":
				lkey = "ArrowRight";
				break;
			default: ;
		}
		if (this.keyboard.key[0] != "nil") {
			// if(k == void) return keyboard.key[0];
			for (let i = 0; i < 2; i++) {
				if (this.keyboard.key[i] == lkey) return true;
			}
		}
		return false;
    }
	mouse_getX() {
		return this.mouse.x;
	}
	mouse_getY() {
		return this.mouse.y;
	}
	mouse_isDown(id) {
		switch (id) {
			case 1: 
            case 2:
            case 3:
				return this.mouse.btn[id];
			break;
			default: ;
		}
		return false;
	}
	touch_getPosition(id) {
		let t = { x: 0, y: 0 };
		if (id < this.touches.length && id >= 0) {
			t.x = this.touches[id].clientX;
			t.y = this.touches[id].clientY;
		}
		return t;
	}
	touch_getTouches() {
		let i;
		let t = [];
		for (i = 0; i < this.touches.length; i++) {
			t.push(i);
		}
		return t;
	}
	event_quit() {
		this.n_exit = true;
	}
}
let love = new Love();
function math_random (min, max) {
	if (max == null) 
		return Math.random() * Math.ceil(min);
	else 
		return Math.ceil(min) + Math.random() * Math.floor(max);
}

function _disableRightClickMenu() {
	document.addEventListener("contextmenu", (e) => e.preventDefault() );
}
function _disableConsole()
{
	let fkeydown = function (e) {
		function t(e) {
			return e.stopPropagation ? e.stopPropagation() : window.event && (window.event.cancelBubble = !0), e.preventDefault(), !1
		};
		e.ctrlKey && e.shiftKey && 73 == e.keyCode && t(e), e.ctrlKey && e.shiftKey && 74 == e.keyCode && t(e), 83 == e.keyCode && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && t(e), e.ctrlKey && 85 == e.keyCode && t(e), 123 == event.keyCode && t(e)
	}
	document.addEventListener("keydown", fkeydown);
}
function _create_canvas(w,h,id)
{
    let icanvas = document.querySelector("#canvas_"+id);
    let lcanvas;
    if(icanvas==null)
    {
        lcanvas = document.createElement("canvas");
    }
    else
        lcanvas = icanvas;
    lcanvas.width = w;
    lcanvas.height = h;
//cursor:none;
    lcanvas.style = "padding:0;margin:auto;display:block";
    lcanvas.id = "canvas_" + id;
    return lcanvas;
}
function _create_context(canvas)
{
	let context = canvas.getContext("2d");
	context.imageSmoothingEnabled = false;
    context.fillStyle = "#f0f0e2";
    context.fillRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "#FFFFFF";
	if(document.querySelector("#"+canvas.id) == null)
		document.body.appendChild(canvas);
	document.body.overflow = "hidden";
	document.body.position = "fixed";
    return context;
}
function _main_loop(time) 
{
	window.requestAnimationFrame(_main_loop);

	love.dt = (time - love.lastUpdate) / 1000;
	if (love.dt < (1 / 60) - 0.001) return;
	//fps = 1 / this.dt;
	love.lastUpdate = time;
	if (love.n_exit != true) {
		if (document.readyState == "complete") {
			if (love.loading == 0) {
				//love.csetCursorStyle("none");
				if (love.load != undefined) love.load();
				love.loading = 1;
			}
			love.graphics_setColor("#f0f0e2");
			love.graphics_rectangle("fill", 0, 0, love.graphics_getWidth(), love.graphics_getHeight());
			love.graphics_setColor(1, 1, 1, 1);
			love.context.save();
			if(love.timer_url>0) love.timer_url-=love.dt;
			if (love.update != undefined) love.update(love.dt);
			if (love.draw != undefined) love.draw();
			love.context.restore();
		}
		else {
			love.context.fillStyle = love.canvas.curant_color;
			love.graphics_setColor("#000000");
			love.graphics_print("--------------", 160, 70, 0, 50);
			love.graphics_print("  loading ... ", 160, 120, 0, 50);
			love.graphics_print("--------------", 160, 170, 0, 50);
			love.canvas.style.cursor = "progress";
		}
		// Delay(dt*1000);

	}
	else {
		this.graphics_setColor(0, 0, 0, 1);
		this.graphics_rectangle("fill", 0, 0, this.graphics_getWidth(), this.graphics_getHeight());
		this.graphics_setColor(1, 1, 1, 1);
		this.graphics_print("game is stopped", 200, 180, 0, 50);
	}
	//disableLeftClick();
}
//--------------- EVENT -----------------
function _event_onkeydown(e) 
{
	if (love.keyboard.key[0] != "nil") {
		for (let i = 0; i < love.keyboard.key.lenght; i++) {
			if (e.key == love.keyboard.key[i]) {
				return;
			}
		}
	}
	else love.keyboard.key = [];
	love.keyboard.key.push(e.key);
	if (love.keypressed != undefined)
		love.keypressed(e.key, e.keyCode, e.repeat);
}
function _event_onkeyup(e) 
{
	love.keyboard.key = ["nil"];
	if (love.keyreleased != undefined)
		love.keyreleased(e.key, e.keyCode);
}    
function _event_onmousedown(e) 
{
	switch (e.buttons) {
		case 1: love.mouse.btn[1] = true;
			break;
		case 2: love.mouse.btn[2] = true;
			break;
		case 4: love.mouse.btn[3] = true;
			break;
		default: ;
	}
	if (love.mousepressed != undefined) {
		if (love.mouse.btn[1] == true) {
			love.mousepressed(love.mouse.x, love.mouse.y, 1, false);
		}
		else if (love.mouse.btn[2] == true) {
			love.mousepressed(love.mouse.x, love.mouse.y, 2, false);
		}
		else if (love.mouse.btn[3] == true) {
			love.mousepressed(love.mouse.x, love.mouse.y, 3, false);
		}
	}
}
function _event_onmousemove(e) {
	love.mouse.y = e.y - love.canvas.offsetTop;
	love.mouse.x = e.x - love.canvas.offsetLeft;
}
function _event_onmouseup(e) {
	if(e.buttons==0)
	{
		for(let i=1;i<4;i++)
		{
			if(love.mouse.btn[i]) 
			{
				love.mouse.btn[i] = false;
				if (love.mousereleased != undefined) 
					love.mousereleased(love.mouse.x, love.mouse.y, i, false);
			
			}
		}
	}
}
function _event_ontouchstart(e) {
	//console.log("touch");
	e.preventDefault();
	love.touches = e.touches;
	if(love.touchpressed != undefined)
	{
		for(let i=0;i<e.touches.lenght;i++)
		{
			let touch = e.touches[i];
			love.touchpressed(touch.identifier,touch.clientX,touch.clientY,0,0,1);
		}
	}	
}
function _event_ontouchend(e) {
	e.preventDefault();
	//console.log("touch end");
	if(love.touchreleased != undefined)
	{
		for(let i=0;i<e.touches.lenght;i++)
		{
			let touch = e.touches[i];
			love.touchreleased(touch.identifier,touch.clientX,touch.clientY,0,0,1);
			for(let j=0;j<this.touches.lenght;j++)
			{
				if(touch.clientX == love.touches[j].clientX &&
					touch.clientY == love.touches[j].clientY)
				{
					love.touches.splice(j,1);
					break;
				}
			}
		}
	}
}
// load event
if (LOVE2D_KEYBOARD == true) {
	document.addEventListener('keydown', _event_onkeydown);
	document.addEventListener('keyup', _event_onkeyup);
}
if (LOVE2D_MOUSE == true) {
	document.addEventListener('mousedown', _event_onmousedown);
	document.addEventListener('mousemove', _event_onmousemove);
	document.addEventListener('mouseup', _event_onmouseup);
	_disableRightClickMenu();
}
if (LOVE2D_TOUCH == true) {
	document.addEventListener("touchstart", _event_ontouchstart, false);
	document.addEventListener("touchend", _event_ontouchend, false);
	_disableRightClickMenu();
}
window.requestAnimationFrame(_main_loop);
export {love,math_random,WriteSave,LoadSave};

