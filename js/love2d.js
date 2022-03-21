/*
love2d.js version b0.3
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
let mouse = {"x":0,"y":0,"w":6,"h":6,"btnG":0,"btnD":0,"btnM":0};
let keyboard = {"key":["nil"]};
let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 480;
canvas.id = "canvas";
context.imageSmoothingEnabled = false;
// context.msImageSmoothingEnabled = false;
// context.webkitImageSmoothingEnabled = false;
// context.mozImageSmoothingEnabled = false; 
context.fillStyle = "#f0f0e2";
context.fillRect(0,0,canvas.width,canvas.height);
context.fillStyle = "#FFFFFF"; 

const pmouse = true;
const pkeyboard = true;
let interval = null;
document.body.insertBefore(canvas, document.body.childNodes[0]);
document.body.overflow = "hidden";
document.body.position = "fixed";
const freq = 60;
let loading=0;
let n_exit=false;
let curant_color="#000000";
let curant_volume=1.0;
let font = "arial";
let fps=0;
let derniereUpdate=0;
//disableLeftClick();
let love = {
	load:undefined,
	update:undefined,
	draw:undefined,
	mousepressed:undefined,
	mousereleased:undefined,
	keypressed:undefined,
	keyreleased:undefined,
	window:{
		setMode:function(width,height)
		{
			canvas.width = width;
			canvas.height = height;
		},
		getMode:function()
		{
			return canvas.width,canvas.height;
		},
		setIcon(object)
		{
			let s = object.src;
			let d = document.createElement("link");
			d.rel = "icon";
			d.href = s;
			document.head.appendChild(d);
		}
	},
	audio:{
		newSource:function(filename,type)
		{
			let sg;
			if(type=="static")
			{
				sg = new Audio();
				sg.src = filename;
				sg.setAttribute("volume", 1.0);
				sg.setAttribute("preload", "auto");
				sg.setAttribute("controls", "none");
				sg.style.display = "none";
				sg.currentTime = 0;
			}
			else if(type=="stream")
			{
				sg = new Audio();
				sg.src = filename;
				sg.setAttribute("volume", 1.0);
				sg.setAttribute("preload", "auto");
				sg.setAttribute("controls", "none");
				sg.style.display = "none";
				sg.currentTime = 0;
				sg.setAttribute("loop","true");
			}
			return sg;
		},
		getVolume:function()
		{
			return curant_volume;
		},
		setVolume:function(vol)
		{
			if(vol>=0.0 && vol<1.1) curant_volume=vol;
		},
		play:function(clas)
		{
			clas.volume = curant_volume;
			if(clas.loop==false && clas.currentTime > 0) clas.currentTime =0;
			clas.play();
		},
		pause:function(clas)
		{
			clas.pause();
		},
		stop:function(clas)
		{
			clas.pause();
		}
	},
	graphics:{
		//newFont:function(filename,url)
		//{
			//let f = new FontFace(filename,url);
			//return f;
			////f.load();
			////document.fonts.add(f);
		//},
		newImage:function(filename)
		{
			let img; 
			img = new Image();
			img.src=filename;
			img.type="image";
			img.getWidth=function(){
				return img.width;
			};
			img.getHeight=function(){
				return img.height;
			};
			return img;
			//return new Img(filename);
		},
		newVideo:function(filename)
		{
			let vid;
			vid = document.createElement("VIDEO");
			vid.src = filename;
			vid.setAttribute("preload", "auto");
			vid.setAttribute("controls", "none");
			vid.type="video";
			return vid;
		},
		newQuad:function(x,y,w,h,sw,sh)
		{
			let q = {
				x:x,
				y:y,
				w:w,
				h:h
			};
			return q;
		},
		draw:function(clas,x,y,r,sx,sy,o)
		{
			if(clas.type=="image" ||
			(clas.type=="video" && clas.ended==false))
			{
				if(typeof(x)=="number")
				{
			
					if(sx!=null && sy!=null)
					{
						if(r>0)
						{
							context.translate(x+(sx/2),y+(sy/2));
							context.rotate(r);
							context.translate(-x-(sx/2),-y-(sy/2));
							context.drawImage(clas,x,y,sx,sy);
							context.setTransform(1,0,0,1,0,0);
						}
						else context.drawImage(clas,x,y,sx,sy);
					}
					else
					{
						if(r>0)
						{
							context.translate(x+(clas.width/2),y+(clas.height/2));
							context.rotate(r);
							context.translate(-x-(clas.width/2),-y-(clas.height/2));
							context.drawImage(clas,x,y);
							context.setTransform(1,0,0,1,0,0);
						}
						else context.drawImage(clas,x,y);
					}
				}
				else if(typeof(x)=="object")
				{
					/* x -> quad
					 * y -> x
					 * r -> y
					 * sx ->r
					 * sy ->sx
					 * o ->sy
					*/
					if(sy!=null && o!=null)
					{
						if(sx>0)
						{
							context.translate(y+(x.w/2),r+(x.h/2));
							context.rotate(sx);
							context.translate(-y-(x.w/2),-r-(x.h/2));
							context.drawImage(clas,x.x,x.y,x.w,x.h,y,r,sy,o);
							context.setTransform(1,0,0,1,0,0);
						}
						else
							context.drawImage(clas,x.x,x.y,x.w,x.h,y,r,sy,o);

					}
					else
					{
						if(sx>0)
						{
							context.translate(y+(x.w/2),r+(x.h/2));
							context.rotate(sx);
							context.translate(-y-(x.w/2),-r-(x.h/2));
							context.drawImage(clas,x.x,x.y,x.w,x.h,y,r,x.w,x.h);
							context.setTransform(1,0,0,1,0,0);
						}
						else
							context.drawImage(clas,x.x,x.y,x.w,x.h,y,r,x.w,x.h);
					}
				}
			}
			if(curant_color.length>7) context.globalAlpha = 1;
		
					
		},
		getColor:function()
		{
			return curant_color;
		},
		setColor:function(r,g,b,a)
		{
			let hex;
			hex = "#" + (r | 1 << 8).toString(16).slice(1) +(g | 1 << 8).toString(16).slice(1) +(b | 1 << 8).toString(16).slice(1);
			if (a != null) 
			{	
				hex = hex + (a | 1 << 8).toString(16).slice(1);
				let ca = Math.floor((a/255)*10)/10;
				if(ca != context.globalAlpha) context.globalAlpha = ca; 
			}
			else if(!context.globalAlpha) context.globalAlpha = 1;
			curant_color=hex;
		},
		setFont:function(pfont)
		{
			font = pfont;
		},

		print:function(text,x,y,r,size)
		{
			if(r==0)
			{
				context.fillStyle= curant_color;
				context.font = size + "px " + font;
				context.fillText(text,x,y);
			}
			else
			{
				context.translate(x,y);
				context.rotate(r);
				context.translate(-x,-y);
				context.fillStyle= curant_color;
				context.font = size + "px " + font;
				context.fillText(text,x,y);
				context.setTransform(1,0,0,1,0,0);
			}
		},
		rectangle:function(mode,x,y,w,h)
		{
			if(mode=="fill") {
				context.fillStyle = curant_color;
				context.fillRect(x, y, w, h);
			}
			if(mode=="line") {
				context.strokeStyle = curant_color;
				context.strokeRect(x, y, w, h);
			}
		},
		line:function(x,y,x2,y2)
		{
			context.beginPath();
			context.moveTo(x,y);
			context.lineTo(x2,y2);
			context.stroke();
		},
		circle:function(mode,x,y,radius)
		{
			context.beginPath();
			context.arc(x, y, radius, 0, 4 * Math.PI, false);
			if(mode=="fill") 
			{ 
				context.fillStyle = curant_color;
				context.fill();
			}
			context.stroke();
			
		},
		scale:function(w,h)
		{
			context.scale(w,h);
		}
	},
	keyboard:{
		isDown:function(key)
		{
			if(key=="up"){
				return K_key("ArrowUp");
			}
			else if(key=="down"){
				return K_key("ArrowDown");
			}
			else if(key=="left"){
				return K_key("ArrowLeft");
			}
			else if(key=="right"){
				return K_key("ArrowRight");
			}
			return K_key(key);
		}
	},
	mouse:{
		getX:function()
		{
			return mouse.x;
		},
		getY:function()
		{
			return mouse.y;
		},
		isDown:function(btn,btn2,btn3)
		{
			let res = 0;
			if(btn==2)
				res += mouse.btnD;
			else if(btn==1)
				res += mouse.btnG;
			else if(btn==3)
				res += mouse.btnM;
			if(btn2!=null)
			{
				if(btn2==2)
					res += mouse.btnD;
				else if(btn2==1)
					res += mouse.btnG;
				else if(btn2==3)
					res += mouse.btnM;
			}
			if(btn3!=null)
			{
				if(btn3==2)
					res += mouse.btnD;
				else if(btn3==1)
					res += mouse.btnG;
				else if(btn3==3)
					res += mouse.btnM;
			}
			if(res>0) return true;
			return false;
		}
	},
	event:{
		quit:function()
		{
			n_exit=true;
		}

	}
};

let math={
	random:function(min,max)
	{
		if(max == null) return Math.floor(Math.random()*Math.floor(min));
		else return Math.floor(min + Math.random()*Math.floor(max));
	},
	rad:function(x)
	{
		return x*Math.PI/180;
	}
	
};

function game(time){
	window.requestAnimationFrame(game);
	let dt = (time - derniereUpdate) / 1000;
	if (dt < (1 / 60) - 0.001) return;
	fps = 1 / dt;
	derniereUpdate = time;
	if(n_exit!=true) 
	{
		if(document.readyState=="complete")
		{ 
			if(loading==0)
			{
				if(love.load!=undefined) love.load();
				loading=1;
			}
			context.fillStyle = "#f0f0e2";
			context.fillRect(0,0,canvas.width,canvas.height);
			context.fillStyle = "#FFFFFF";  
			context.save(); 
			if(love.update!=undefined)love.update(dt);
			if(love.draw!=undefined)love.draw();
			context.restore();
		}
		else
		{
			context.fillStyle= curant_color;
			context.font = "50px arial";
			context.fillText("--------------",160,70);
			context.fillText("  loading ... ",160,120);
			context.fillText("--------------",160,170);
		}
		// Delay(dt*1000);

	}
	else
	{
		context.fillStyle = "#000000";
		context.fillRect(0,0,canvas.width,canvas.height);
		context.fillStyle = "#FFFFFF";  
		context.font = "50px arial";
		context.fillText("game is stopped",160,120);
	}
}

function load_event()
{	
	if(pkeyboard == true)
	{
		document.addEventListener('keydown',
		function(e){   
			if(keyboard.key[0]!="nil")
			{
				for(let i=0;i<keyboard.key.lenght;i++)
				{
					if(e.key == keyboard.key[i]) 
					{
						return;
					}
				}
			}
			else keyboard.key= [];
			keyboard.key.push(e.key);
			if(love.keypressed!=undefined) 
				love.keypressed(e.key,e.keyCode,e.repeat);
		});
		document.addEventListener('keyup',
		function(e){
			keyboard.key= ["nil"];
			if(love.keyreleased!=undefined)
				love.keyreleased(e.key,e.keyCode);

		});
	}
	if(pmouse == true)
	{
		canvas.addEventListener('mousedown', function(e){
			switch(e.buttons)
			{
				case 1: mouse.btnG = 1;
				break;
				case 2: mouse.btnD = 1;
				break;
				case 4: mouse.btnM = 1;
				break;
				default:;
			}
			if(love.mousepressed!=undefined)
			{
				if(mouse.btnG==1)
				{
					love.mousepressed(mouse.x,mouse.y,1,false);
				}
				else if(mouse.btnD==1)
				{
					love.mousepressed(mouse.x,mouse.y,2,false);
				}
				else if(mouse.btnM==1)
				{
					love.mousepressed(mouse.x,mouse.y,3,false);
				}
			}
		});
		canvas.addEventListener('mousemove', 
		function(e)
		{
			mouse.y =e.y-canvas.offsetTop;
			mouse.x =e.x-canvas.offsetLeft;
		});
		canvas.addEventListener('mouseup', 
		function(e){
 
			if(love.mousereleased!=undefined)
			{
				if(mouse.btnG==1)
				{
					love.mousereleased(mouse.x,mouse.y,1,false);
				}
				else if(mouse.btnD==1)
				{
					love.mousereleased(mouse.x,mouse.y,2,false);
				}
				else if(mouse.btnM==1)
				{
					love.mousereleased(mouse.x,mouse.y,3,false);
				}
			}
			mouse.btnG = 0;
			mouse.btnD = 0;
			mouse.btnM = 0;
		});
		canvas.addEventListener("touchstart",
		function(e){
			console.log("touch");
			e.preventDefault();
			let touches = e.touches;
			mouse.x = touches[0].clientX;
			mouse.y = touches[0].clientY;
			mouse.btnG = 1;
			if(love.mousepressed!=undefined)
			{
				love.mousepressed(mouse.x,mouse.y,1,true); 
			}
		},false);
		canvas.addEventListener("touchmove",
		function(e){
			console.log("touch move");
			e.preventDefault();
			let touches = e.touches;
			mouse.x = touches[0].clientX;
			mouse.y = touches[0].clientY;
			mouse.btnG = 1;
		},false);
		canvas.addEventListener("touchend",
		function(e){
			e.preventDefault();
			console.log("touch end");
			mouse.x = 0;//e.targetTouches[0].x;
			mouse.y = 0;//e.targetTouches[0].y;
			mouse.btnG = 0;
			if(love.mousereleased!=undefined)
			{
				love.mousereleased(mouse.x,mouse.y,1,true); 
			}
		},false);
	}
}
function disableLeftClick()
{
	// disable click gauche
	document.addEventListener("contextmenu", function(e) {
		e.preventDefault()
	});
	document.addEventListener("keydown", function(e) {
		function t(e) {
			return e.stopPropagation ? e.stopPropagation() : window.event && (window.event.cancelBubble = !0), e.preventDefault(), !1
		};
		e.ctrlKey && e.shiftKey && 73 == e.keyCode && t(e), e.ctrlKey && e.shiftKey && 74 == e.keyCode && t(e), 83 == e.keyCode && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && t(e), e.ctrlKey && 85 == e.keyCode && t(e), 123 == event.keyCode && t(e)
	});
}


function K_key(k)
{
    if(keyboard.key[0] != "nil")
    {
		if(k == null) return keyboard.key[0];
		for(let i=0;i<2;i++)
		{
			if(keyboard.key[i] == k) return true;
		}
	}
	else return false;
}
const sleep = async(milliseconds) =>{
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}
const Delay = async(ms)=>{
	await sleep(ms);
}


function Timer()
{
	let t={
		"t":0,
		"test":function()
		{
			if(t.t>0) 
			{
	
				t.t = t.t -1; 
			}
			if(t.t==0)
			{
				return true;
			}
			return false;
		},
		"start":function(n)
		{
			t.t = n;
		}
	};
	return t;
}

function WriteSave(name,data)
{
	//limite to 5Mb;
	localStorage.setItem(name, JSON.stringify(data));
}
function LoadSave(name)
{
	return JSON.parse(localStorage.getItem(name));
}


function print(a,b,c)
{
	if(b==null && c==null)
		console.log(a)
	else if(c==null && b!=null)
		console.log(a,b);
	else 
		console.log(a,b,c);
}
function collide(a,b)
{
  if(a.x + a.w > b.x &&
    a.x < b.x + b.w && 
    a.y + a.h > b.y &&
    a.y < b.y + b.h ) 
    return true; 
	return false;
}
load_event();  
window.requestAnimationFrame(game);

