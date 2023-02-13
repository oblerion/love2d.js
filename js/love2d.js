/*
love2d.js version b0.5
MIT License
Copyright (c) 2022 oblerion

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

const MOUSE = true;
const KEYBOARD = false;
const TOUCH = true;
class Input {
	constructor() {
		this.mouse = { "x": 0, "y": 0, "w": 6, "h": 6, "btnG": 0, "btnD": 0, "btnM": 0 };
		this.keyboard = { "key": [] };
		this.touches = [];
	}

	ikeyboard_isDown(key) {
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
	imouse_getX() {
		return this.mouse.x;
	}
	imouse_getY() {
		return this.mouse.y;
	}
	imouse_isDown(e) {
		switch (e) {
			case 1: return this.mouse.btnG == 1;
				break;
			case 2: return this.mouse.btnD == 1;
				break;
			case 3: return this.mouse.btnM == 1;
				break;
			default: ;
		}
		return false;
	}
	itouch_getPosition(id) {
		let t = { x: 0, y: 0 };
		if (id < this.touches.length && id >= 0) {
			t.x = this.touches[id].clientX;
			t.y = this.touches[id].clientY;
		}
		return t;
	}
	itouch_getTouches() {
		let i;
		let t = [];
		for (i = 0; i < this.touches.length; i++) {
			t.push(i);
		}
		return t;
	}
}

class Canvas extends Input{
	constructor(w, h, id) {
		super();
		this.curant_color = "#000000";
		this.curant_volume = 1.0;
		this.curant_font = "arial";


		this.canvas = document.createElement("canvas");
		this.canvas.width = w;
		this.canvas.height = h;
//cursor:none;
		this.canvas.style = "padding:0;margin:auto;display:block";
		this.canvas.id = "canvas_" + id;
		this.context = this.canvas.getContext("2d");

		this.context.imageSmoothingEnabled = false;

		this.context.fillStyle = "#f0f0e2";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.fillStyle = "#FFFFFF";

		document.body.appendChild(this.canvas);
		document.body.overflow = "hidden";
		document.body.position = "fixed";
	}
	csetCursorStyle(pstyle) {
		if (this.canvas.style.cursor != pstyle)
			this.canvas.style.cursor = pstyle;
	}
	csetSize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
	}
	cgetSize() {
		return { w: this.canvas.width, h: this.canvas.height };
	}
	cgetWidthText = function(text)
	{
		this.context.font = text.font;
		const textWidth = this.context.measureText(text.text).width;
		return textWidth;
	};
	cgetHeightText = function(text)
	{
		this.context.font = text.font;
		const textHeight = this.context.measureText(text.text).height;
		return textHeight;
	};
	csetColor(r, g, b, a) {
		let hex="";
		if(typeof(r)=="string")
		{
			this.curant_color = r;
			this.context.fillStyle=r;
			this.context.globalAlpha=1;
		}
		else
		{//'rgb(r,g,b)'
			let lc={
				r:r,
				g:g,
				b:b,
				a:a
			};
			// this.curant_color = 'rgb(lc.r,lc.g,lc.b)';
			// this.context.fillStyle= this.curant_color;
			// this.context.globalAlpha = lc.a;
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

	cgetColor() {
		return this.curant_color;
	}
	cdraw(clas, x, y, r, sx, sy, o) {
		
		if (clas.type == "image" ||
			(clas.type == "video" && clas.ended == false)) {

			if (typeof (x) == "number") {

				if (sx != null && sy != null) {
					if (r > 0) {
						//rotate with scalling
						this.context.translate(x + (sx / 2), y + (sy / 2));
						this.context.rotate(r);
						this.context.translate(-x - (sx / 2), -y - (sy / 2));
						this.context.drawImage(clas, x, y, sx, sy);
						this.context.setTransform(1, 0, 0, 1, 0, 0);
					}
					else this.context.drawImage(clas, x, y, sx, sy);
				}
				else {
					if (r > 0) {
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
			else if (typeof (x) == "object") {
				// x -> quad
				// * y -> x
				// * r -> y
				// * sx ->r
				// * sy ->sx
				// * o ->sy

				if (sy != null && o != null) {
					if (sx > 0) {
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
				else {
					if (sx > 0) {
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
		if (this.curant_color.length > 7) this.context.globalAlpha = 1;
	}
	cprint(text, x, y, r, size) {
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
	crectangle(mode, x, y, w, h) {
		if (mode == "fill") {
			this.context.fillStyle = this.curant_color;
			this.context.fillRect(x, y, w, h);
		}
		if (mode == "line") {
			this.context.strokeStyle = this.curant_color;
			this.context.strokeRect(x, y, w, h);
		}
	}
	ccircle(mode, x, y, radius) {
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
	cscale(w, h) {
		this.context.scale(w, h);
	}
	cclear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
class Color{
	constructor(r,g,b,a){
		this.r=r;
		this.g=g;
		this.b=b;
		this.a=a;
	}
}
//disableLeftClick();

function math_random (min, max) {
	if (max == null) 
		return Math.random() * Math.ceil(min);
	else 
		return Math.ceil(min) + Math.random() * Math.floor(max);
}


function disableRightClickMenu() {
	// disable popup click droit
	let fcontextmenu = function (e) {
		e.preventDefault()
	}
	document.addEventListener("contextmenu", fcontextmenu);
}
function disableConsole()
{
	let fkeydown = function (e) {
		function t(e) {
			return e.stopPropagation ? e.stopPropagation() : window.event && (window.event.cancelBubble = !0), e.preventDefault(), !1
		};
		e.ctrlKey && e.shiftKey && 73 == e.keyCode && t(e), e.ctrlKey && e.shiftKey && 74 == e.keyCode && t(e), 83 == e.keyCode && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && t(e), e.ctrlKey && 85 == e.keyCode && t(e), 123 == event.keyCode && t(e)
	}
	document.addEventListener("keydown", fkeydown);
}

const sleep = async (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}
const Delay = async (ms) => {
	await sleep(ms);
}

function Timer() {
	let t = {
		"t": 0,
		"test": function () {
			if (t.t > 0) {

				t.t = t.t - 1;
			}
			if (t.t == 0) {
				return true;
			}
			return false;
		},
		"start": function (n) {
			t.t = n;
		}
	};
	return t;
}

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
function START(love) {
	function event_onkeydown(e) {
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
	};
	function event_onkeyup(e) {
		love.keyboard.key = ["nil"];
		if (love.keyreleased != undefined)
			love.keyreleased(e.key, e.keyCode);
	};
	function event_onmousedown(e) {
		switch (e.buttons) {
			case 1: love.mouse.btnG = 1;
				break;
			case 2: love.mouse.btnD = 1;
				break;
			case 4: love.mouse.btnM = 1;
				break;
			default: ;
		}
		if (love.mousepressed != undefined) {
			if (love.mouse.btnG == 1) {
				love.mousepressed(love.mouse.x, love.mouse.y, 1, false);
			}
			else if (love.mouse.btnD == 1) {
				love.mousepressed(love.mouse.x, love.mouse.y, 2, false);
			}
			else if (love.mouse.btnM == 1) {
				love.mousepressed(love.mouse.x, love.mouse.y, 3, false);
			}
		}
	};
	function event_onmousemove(e) {
		love.mouse.y = e.y - love.canvas.offsetTop;
		love.mouse.x = e.x - love.canvas.offsetLeft;
	};
	function event_onmouseup(e) {
		if (love.mousereleased != undefined) {
			if (love.mouse.btnG == 1) {
				love.mousereleased(love.mouse.x, love.mouse.y, 1, false);
			}
			else if (love.mouse.btnD == 1) {
				love.mousereleased(love.mouse.x, love.mouse.y, 2, false);
			}
			else if (love.mouse.btnM == 1) {
				love.mousereleased(love.mouse.x, love.mouse.y, 3, false);
			}
		}
		love.mouse.btnG = 0;
		love.mouse.btnD = 0;
		love.mouse.btnM = 0;
	};
	function event_ontouchstart(e) {
		console.log("touch");
		e.preventDefault();

		//console.log(touches);
		//mouse.x = touches[0].clientX;
		//mouse.y = touches[0].clientY;
		//mouse.btnG = 1;
		//let i;
		// if(this.touchpressed!=undefined)
		// {
		//for(i=0;i<e.changedTouches.length;i++)
		//{
		//this.touchpressed();
		//}
		love.touches = e.touches;
		// this.touchpressed( touches[0].clientX,
		// 	touches[0].clientY,1,true); 
		// }
		
	};
	function event_ontouchmove(e) {
		console.log("touch move");
		e.preventDefault();
		love.touches = e.touches;
		//let touches = e.touches;
		//mouse.x = touches[0].clientX;
		//mouse.y = touches[0].clientY;
		//mouse.btnG = 1;
		//let i;
		//if(this.touchmoved!=undefined)
		//{
		//for(i=0;i<e.changedTouches.length;i++)
		//{
		////this.touchmoved();
		//}		
		//}
	};
	function event_ontouchend(e) {
		e.preventDefault();
		console.log("touch end");
		//mouse.x = touches[0].clientX;
		//mouse.y = touches[0].clientY;
		//mouse.btnG = 0;
		//let i;
		//let last_touch={};
		//if(e.touches.length>0)
		//{
		//for(i=0;i<touches.length;i++)
		//{

		//}
		//}
		//if(this.touchreleased!=undefined)
		//{
		////this.touchreleased(mouse.x,mouse.y,1,true); 
		//}
		//console.log(e.changedTouches);
		love.touches = e.touches;
	};
	// load event
	if (KEYBOARD == true) {
		document.addEventListener('keydown', event_onkeydown);
		document.addEventListener('keyup', event_onkeyup);
	}
	if (MOUSE == true) {
		love.canvas.addEventListener('mousedown', event_onmousedown);
		love.canvas.addEventListener('mousemove', event_onmousemove);
		love.canvas.addEventListener('mouseup', event_onmouseup);
	}
	if (TOUCH == true) {
		love.canvas.addEventListener("touchstart", event_ontouchstart, false);
		love.canvas.addEventListener("touchmove", event_ontouchmove, false);
		love.canvas.addEventListener("touchend", event_ontouchend, false);
	}

	let fps = 0;
	let lastUpdate = 0;
	let loading = 0;
	let interval = 0;
	const FREQ = 60;
	let n_exit = 0;

	function main_loop(time) {
		window.requestAnimationFrame(main_loop);

		love.dt = (time - lastUpdate) / 1000;
		if (love.dt < (1 / FREQ) - 0.001) return;
		fps = 1 / love.dt;
		lastUpdate = time;
		if (n_exit != true) {
			if (document.readyState == "complete") {
				if (loading == 0) {
					//love.csetCursorStyle("none");
					if (love.load != undefined) love.load();
					loading = 1;
				}
				love.graphics_setColor("#f0f0e2");
				love.graphics_rectangle("fill", 0, 0, love.cgetSize().w, love.cgetSize().h);
				love.graphics_setColor(1, 1, 1, 1);
				love.context.save();
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
				love.csetCursorStyle("progress");
			}
			// Delay(dt*1000);

		}
		else {
			love.graphics_setColor(0, 0, 0, 1);
			love.graphics_rectangle("fill", 0, 0, love.graphics_getWidth(), love.graphics_getHeight());
			love.graphics_setColor(1, 1, 1, 1);
			love.graphics_print("game is stopped", 200, 180, 0, 50);
		}

	}
	//disableLeftClick();
	window.requestAnimationFrame(main_loop);
}
class Love extends Canvas {
	constructor() {
		super(800,480,"love2d");
		this.dt = 0;

		this.load = undefined;
		this.update = undefined;
		this.draw = undefined;
		this.mousepressed = undefined;
		this.mousereleased = undefined;
		this.keypressed = undefined;
		this.keyreleased = undefined;
		this.touchpressed = undefined;
		this.touchreleased = undefined;
		this.touchmoved = undefined;
		START(this);
	}
	timer_getDelta() {
		return this.dt;
	}
	window_setMode(width, height) {
		this.csetSize(width, height);
	}

	window_setIcon(object) {
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
		return this.cgetSize().w;
	}
	graphics_getHeight() {
		return this.cgetSize().h;
	}
	graphics_newText(pfont,ptext)
	{// in work
		let text={};
		text.text = ptext;
		text.font = pfont;
		text.getWidth = function()
		{
			//Love.context.font = text.font;
			//const textWidth = ctx.measureText(text.text).width;
			return this.cgetWidthText(text.text);
		};
		text.getHeight = function()
		{
			return this.cgetHeightText(text.text);
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
	graphics_draw(clas, x, y, r, sx, sy, o) {
		this.cdraw(clas, x, y, r, sx, sy, o);
	}
	graphics_getColor() {
		return this.curant_color;
	}
	graphics_setColor(r, g, b, a) {
		this.csetColor(r, g, b, a);
	}
	graphics_setFont(pfont) {
		this.curant_font = pfont;
	}
	graphics_print(text, x, y, r, size) {
		this.cprint(text, x, y, r, size);
	}
	graphics_rectangle(mode, x, y, w, h) {
		this.crectangle(mode, x, y, w, h);
	}
	graphics_circle(mode, x, y, radius) {
		this.ccircle(mode, x, y, radius);
	}
	graphics_scale(w, h) {
		this.cscale(w, h);
	}
	keyboard_isDown(key) {
		return this.ikeyboard_isDown(key);
	}
	mouse_getX() {
		return this.imouse_getX();
	}
	mouse_getY() {
		return this.imouse_getY();
	}
	mouse_isDown(e) {
		return this.imouse_isDown(e);
	}
	touch_getPosition(id) {
		this.itouch_getPosition(id);
	}
	touch_getTouches() {
		this.itouch_getTouches();
	}
	event_quit() {
		this.n_exit = true;
	}
}
export {Love,Canvas,Color,disableRightClickMenu,collide,math_random};
