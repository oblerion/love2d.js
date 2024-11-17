/*Copyright (c) 2024 oblerion

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
const LOVE2D_VERSION = "b0.6.2-2"
const LOVE2D_MOUSE = true;
const LOVE2D_KEYBOARD = true;
const LOVE2D_TOUCH = true;

function _sizeOf(value)
{
	switch(typeof(value))
	{
		case "undefined": return 0;
		case "boolean": return 4;
		case "number": return 8;
		case "string": return 2 * value.length;
		default:;
	}
	// const typeSizes = {
	// "object": item => !item ? 0 : Object
	// .keys(item)
	// .reduce((total, key) => _sizeOf(key) + _sizeOf(item[key]) + total, 0)
	// };
	// return typeSizes[typeof(value)];
	return 0;
}
function _WriteSave(name, data) 
{
	//limite to 5Mb;
	const sjson = JSON.stringify(data);
	if(_sizeOf(sjson)<5000000)
	localStorage.setItem(name,sjson);
}
function _LoadSave(name) 
{
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
    getTextWidth(text)
    {
    	return this.context.measureText(text);
    }
	system_writeSave(name,val)
	{
		if(typeof(name)=="string" &&
			typeof(val)=="object")
		{
			_WriteSave(name,val);
		}
	}
	system_readSave(name)
	{
		if(typeof(name)=="string")
		{
			return _LoadSave(name) || {};
		}
		return {};
	}
	system_openURL(url)
	{
		if(window.open(url,"_top","popup=false")!=null)
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
			return true;
		}
		return false;
	}
	system_getOs()
	{	let userAgent = window.navigator.userAgent
		let OSName = "Unknown";
		if (userAgent.indexOf("Windows NT 10.0")!= -1) OSName="Windows";
		if (userAgent.indexOf("Windows NT 6.3") != -1) OSName="Windows";
		if (userAgent.indexOf("Windows NT 6.2") != -1) OSName="Windows";
		if (userAgent.indexOf("Windows NT 6.1") != -1) OSName="Windows";
		if (userAgent.indexOf("Windows NT 6.0") != -1) OSName="Windows";
		if (userAgent.indexOf("Windows NT 5.1") != -1) OSName="Windows";
		if (userAgent.indexOf("Windows NT 5.0") != -1) OSName="Windows";
		if (userAgent.indexOf("Mac")            != -1) OSName="OS X";
		if (userAgent.indexOf("iPhone")!= -1 ||
			userAgent.indexOf("iPad")!=-1 ||
			userAgent.indexOf("iPod")!=-1) 
				OSName="iOS";
		if (userAgent.indexOf("X11")            != -1) OSName="UNIX";
		if (userAgent.indexOf("Linux")          != -1) OSName="Linux";
		if (userAgent.indexOf("Android")        != -1) OSName="Android";
		if (userAgent.indexOf("CrOS")           != -1) OSName="Chrome OS";
		// Window, OS X, UNIX, LINUX, Android, Chrome OS
		return OSName;
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
	window_getTitle()
	{
		return document.title;
	}
	window_setTitle(title)
	{
		if( typeof(title)=="string" )
		{
			document.title=title;
		}
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
		//let os = love.system_getOs();
		//print(os)
		//if(os!="iOS" && os!="Android")
			return this.canvas.width;
		//return window.screen.width;
	}
	graphics_getHeight() {
		//let os = this.system_getOs();
		//if(os!="iOS" && os!="Android")
			return this.canvas.height;
		//return window.screen.height;
	}
	
	window_getWidth() {
		//let os = love.system_getOs();
		//print(os)
		//if(os!="iOS" && os!="Android")
		//	return this.canvas.width;
		return window.screen.width;
	}
	window_getHeight() {
		//let os = this.system_getOs();
		//if(os!="iOS" && os!="Android")
		//	return this.canvas.height;
		return window.screen.height;
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
	    if (mode === "fill") {
			this.context.fillStyle = this.curant_color;
			this.context.fillRect(x, y, w, h);
		}
		if (mode === "line") {
			this.context.strokeStyle = this.curant_color;
			this.context.strokeRect(x, y, w, h);
		}
	}
	graphics_circle(mode, x, y, radius) 
    {
		this.context.beginPath();	
		if (mode == "fill") 
		{
			this.context.fillStyle = this.curant_color;
			this.context.strokeStyle = this.curant_color;
			this.context.arc(x, y, radius, 0, 4 * Math.PI, false);
			this.context.fill();
		}
		if(mode == "line")
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
			t.state = this.touches[id].state;
		}
		return t;
	}
	touch_getTouches() {
		let i;
		let lt = [];
		for (i = 0; i < this.touches.length; i++) {
			lt.push(i);
		}
		return lt;
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
				love.canvas.style.cursor = "auto";
				if (love.load != undefined) love.load();
				love.loading = 1;
			}
			love.graphics_setColor("#f0f0e2");
			love.graphics_rectangle("fill", 0, 0, love.graphics_getWidth(), love.graphics_getHeight());
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
	if (love.keyboard.key[0] != "nil") 
	{
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
	love.mouse.y = window.pageYOffset + e.y - love.canvas.offsetTop;
	love.mouse.x = window.pageXOffset + e.x - love.canvas.offsetLeft;
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
	//console.log("touch start");
	//e.preventDefault();
	
	for(let j=0;j<e.changedTouches.length;j++)
	{
		love.touches[j] = {};
		love.touches[j].identifier = e.changedTouches[j].indentifier;
		love.touches[j].clientX = window.pageXOffset + e.changedTouches[j].clientX;
		love.touches[j].clientY = window.pageYOffset + e.changedTouches[j].clientY;
		love.touches[j].state = "start";
		if(love.touchpressed != undefined)
		{
			love.touchpressed(
			love.touches[j].identifier,
			love.touches[j].clientX,
			love.touches[j].clientY,0,0,1);
		}
	}
}
function _event_ontouchmove(e) {
	//console.log("touch move");
	//e.preventDefault();
	for(let i=0;i<e.changedTouches.length;i++)
	{
		for(let j=0;j<love.touches.length;j++)
		{
			if( love.touches[j].indentifier==e.changedTouches[i].indentifier)
			{
				love.touches[j].clientX = window.pageXOffset + e.changedTouches[i].clientX;
				love.touches[j].clientY = window.pageYOffset + e.changedTouches[i].clientY;
				love.touches[j].state = "move";
				if(love.touchpressed != undefined)
				{
					love.touchpressed(
					love.touches[j].identifier,
					love.touches[j].clientX,
					love.touches[j].clientY,0,0,1);
				}
			}
		}
	}
}
function _event_ontouchend(e) {
	//e.preventDefault();
	//console.log("touch end");
	for(let i=0;i<e.changedTouches.length;i++)
	{
		for(let j=0;j<love.touches.length;j++)
		{
			if( love.touches[j].indentifier==e.changedTouches[i].indentifier)
			{
				if(love.touchreleased != undefined)
				{
					love.touchreleased(
					love.touches[j].identifier,
					love.touches[j].clientX,
					love.touches[j].clientY,0,0,1);
				}
				love.touches.splice(j,1);
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
	document.addEventListener("touchmove", _event_ontouchmove, false);
	document.addEventListener("touchend", _event_ontouchend, false);
	document.addEventListener("touchcancel", _event_ontouchend, false);
	_disableRightClickMenu();
}
window.requestAnimationFrame(_main_loop);
//export {love,math_random};

