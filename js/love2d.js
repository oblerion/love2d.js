
// love2d.js first post
let mouse = {"x":0,"y":0,"w":6,"h":6,"btnG":0,"btnD":0,"btnM":0};
let keyboard = {"key":["nil"]};
let ASSET=[];
let canvas = document.createElement("canvas");
let context;
const pmouse = true;
const pkeyboard = true;
const pexport = false;
let game;

curant_state={}
function Getstate()
{
	return curant_state;
}
function Setstate(t)
{
		curant_state=t;
		Getstate().load();
}


class State
{
	constructor(table)
	{
		if(table.length==2)
		{
			
				this.load=function(){};
				this.update=table[0];
				this.draw=table[1];
		}
		else if(table.length==3)
		{
			
				this.load=table[0];
				this.update=table[1];
				this.draw=table[2];
			
		}
	}
	
	update()
	{
		this.update();
	}
	draw()
	{
		this.draw();
		
	}
	
}

function asset(table)
{
    //let sc = document.createElement("script");
    let s = "";//"let IMGS=[];";
    let v;
    let t;
    for(let i=0;i<table.length;i++)
    {
        if(table[i].search("/")>0) v = table[i].search("/")+1;
        else v=0;
        let s1 = table[i].substr(v,table[i].length-(4+v));
        t = table[i].substr(table[i].length-3,3);
        if(t=="png" || t=="jpg" || t=="btm") 
        {
            s1 = "I"+s1; 
            ASSET[s1]= new Image();
            ASSET[s1].src=table[i];
            ASSET.length++;
        }
        if(t=="ogg")
        {
            s1 ="S"+s1;
            ASSET[s1] = document.createElement("audio");
            ASSET[s1].src = table[i];
            ASSET[s1].setAttribute("preload", "auto");
            ASSET[s1].setAttribute("controls", "none");
            ASSET[s1].style.display = "none";
        // document.body.appendChild(this.audio);
            ASSET[s1].currentTime = 0;
        }
        if(t=="mp3" || t=="wav")
        {
            s1="M"+s1;
            ASSET[s1] = document.createElement("audio");
            ASSET[s1].src = table[i];
            ASSET[s1].setAttribute("preload", "auto");
            ASSET[s1].setAttribute("controls", "none");
            ASSET[s1].style.display = "none";
        // document.body.appendChild(this.audio);
            ASSET[s1].currentTime = 0;
            ASSET[s1].setAttribute("loop","true");
        }
        if(t=="ebm")
        {
            s1="V"+s1.substr(0,s1.length-1);
            ASSET[s1] = {"x":0,"y":0};
            ASSET[s1].v = document.createElement("VIDEO");
            ASSET[s1].v.src = table[i];
            ASSET[s1].v.setAttribute("preload", "auto");
            ASSET[s1].v.setAttribute("controls", "none");
            //document.body.canvas.appendChild(this.v);
        }
        
    }
}

function ICON(name)
{
    let d = document.createElement("link");
    d.rel = "icon";
    d.href = ASSET["I"+name].src;
    document.body.appendChild(d);
}

function newGame(w,h,pcontext)
{
    game = new Game(w,h,pcontext);
    game.game();
}
function disableLeftClick()
{
    game.disableLeftClick();
}
class Game{
	constructor(w,h,pcontext,pfreq)
	{
		canvas.width = w;
		canvas.height = h;
        canvas.id = "canvas";
		this.context = canvas.getContext(pcontext);
		this.interval = null;
		context = this.context;
		document.body.insertBefore(canvas, document.body.childNodes[0]);
		document.body.overflow = "hidden";
		document.body.position = "fixed";
		if(pfreq==null)this.freq = 60;
		else this.freq=pfreq;
	}

	game()
	{
        this.load();  
        context.fillStyle = "#f0f0e2";
        context.fillRect(0,0,canvas.width,canvas.height);
        context.fillStyle = "#FFFFFF";  
		this.interval = setInterval(function e()
		{
            if(document.readyState=="complete")
            {
                context.fillStyle = "#f0f0e2";
                context.fillRect(0,0,canvas.width,canvas.height);
                context.fillStyle = "#FFFFFF";  
                context.save(); 
                love.update();
                love.draw();
                context.restore();
            }
            else
            {
				Text("--------------",160,70,"black",50);
                Text("on load ... ",160,120,"black",50);
                Text("--------------",160,170,"black",50);
            }
            
		},100/this.freq);
        
		
		
	}
	load()
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
            });
            document.addEventListener('keyup',
            function(e){
                keyboard.key= ["nil"];
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
            });
            canvas.addEventListener('mousemove', 
            function(e)
            {
                mouse.y =e.y-canvas.offsetTop;
                mouse.x =e.x-canvas.offsetLeft;
            });
            canvas.addEventListener('mouseup', 
            function(e){
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
            },false);
        }

	}
    disableLeftClick()
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
};

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
function K_Arrow(a,speed)
{
	let sx=0,sy=0;
    if(K_key("ArrowUp")){sy= -speed;}
    else if(K_key("ArrowDown")){sy = speed;}
    if(K_key("ArrowLeft")){sx= -speed;}
    else if(K_key("ArrowRight")){sx= speed;}
    a.x = a.x + sx;
    a.y = a.y + sy;
} 
const sleep = async(milliseconds) =>{
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}
const Delay = async(ms)=>{
	await sleep(ms);
}

function rgbaTohex(r,g,b,a) {
    hex = "#" + (r | 1 << 8).toString(16).slice(1) +(g | 1 << 8).toString(16).slice(1) +(b | 1 << 8).toString(16).slice(1);
    if (a != null) 
    {
        hex = hex + (a | 1 << 8).toString(16).slice(1);
     }
    else 
    { 
        //hex = hex + 00; 
        return "null";
    }
    return hex;
}

function collide(a,b)
{
    if(a != null && b != null &&
       a != undefined && b != undefined)
    {
        if((a.x+a.w>b.x && a.x<b.x+b.w &&
        a.y+a.h>b.y && a.y<b.y+b.h) ||
        (a.x == b.x && a.y == b.y))
            return true;
    }
    return false;
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
function Random(min,max)
{
    if(max == null) return Math.floor(Math.random()*Math.floor(min));
    else return Math.floor(min + Math.random()*Math.floor(max));
}
function requireJS(script,main)
{
    if(pexport == false)
    {
        let Script = document.createElement('script');
        //Script.type = 'text/javascript';
        Script.src = script+".js";
        if(main == null)document.body.appendChild(Script);
        else document.head.appendChild(Script);
    }
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

class Sound
{
    constructor(pSrc) 
    {
        this.audio = ASSET["S"+pSrc];
    }
    play() {
        this.audio.pause();
        if(this.audio.currentTime > 0) this.audio.currentTime =0;
        this.audio.play();
    }

}
class Music
{
    constructor(pSrc) 
    {
        this.audio = ASSET["M"+pSrc];
    }
    play() {
        this.audio.pause();
        if(this.audio.currentTime > 0) this.audio.currentTime =0;
        this.audio.play();
    }
    stop()
    {
        this.audio.pause();
    }

};
let font = "arial";
function Font(fontname)
{
	font = fontname;
};
function Text(text,x,y,color,width,pfont)
{
	if(color!=null)context.fillStyle= color;
	else context.fillStyle= "black";
	
	if(width!=null)
	{
		if(font!=[]) 
		{
			if(pfont==null)
			{
				context.font = width + "px " + font;
			}
			else if(pfont>=0 && pfont < font.lenght)
				context.font = width + "px " + font[pfont];
			
		}
		//else context.font = width + "px arial";
	}
	context.fillText(text,x,y);
};
	

/*class ImgComp
{
		constructor(source)
		{
			this.data = source;
			this.h = this.data.length;
			this.w = this.data[0].length;
			this.x = 0;
			this.y = 0;
            //let bw = new ArrayBuffer(this.h*this.w*4);
            let U8 = new Uint8ClampedArray(new ArrayBuffer(this.h*this.w*4));//bw);
            let g=0
            for(let j=0;j<this.h;j++)
            {
                for(let i=0;i<this.w;i++)
                {
                    U8[g] = this.data[j][i][0];
                    U8[g+1] = this.data[j][i][1];
                    U8[g+2] = this.data[j][i][2];
                    U8[g+3] = this.data[j][i][3];
                    g = g+4;
                }
            }
            this.imgdata = new ImageData(U8,this.w,this.h);
            console.log(this.w,this.h);
		}
		draw(x,y)
		{
			if(x==null && y==null)
			{
//				for(let i=0;i<this.h;i++)
//				{
//					for(let j=0;j<this.w;j++)
//					{
//                        let clr = rgbaTohex(this.data[i][j][0],this.data[i][j][1],this.data[i][j][2],this.data[i][j][3]);
//						if(clr != "null") fill_Rect(this.x+j,this.y+i,1,1,clr);
//					}	
//				}
                context.putImageData(this.imgdata,this.x,this.y,this.x,this.y,this.w,this.h);
			}
				
			else
			{
//				for(let i=0;i<this.h;i++)
//				{
//					for(let j=0;j<this.w;j++)
//					{
//						fill_Rect(x+j,y+i,1,1,this.data[i][j]);
//					}	
//				}
			}
			//	context.putImageData(this.data,x,y);
		}
}*/

class Img{
	constructor(source)
	{
        if(source.search(".")>0)console.log("ERROR Img() >> source name with .");
		this.image = ASSET["I"+source];
		//this.image.src = source;
		//this.image.alt = "image";
        this.w = this.image.width;
        this.h = this.image.height;
		this.x = 0;
		this.y = 0;
        
	}
	setPos(x,y)
	{
		this.x = x;
		this.y = y;
	}
	draw(x,y,w,h)
	{
        if(this.w==0 && this.h==0)
        {
            this.w = this.image.width;
            this.h = this.image.height;
        }
        if(x==null && y==null) 
        {
            context.drawImage(this.image,this.x,this.y);
        }
        else 
        {
			if(w!=null && h!=null)
				context.drawImage(this.image,x,y,w,h);
			else
				context.drawImage(this.image,x,y);
        }

	}
}

class Spritesheet
{
	constructor(source,tile)
	{
		this.image = ASSET["I"+source];//new Image();
		//this.image.src = source;
		this.tile = tile;
		this.nbtilew = this.image.width/tile;
		this.nbtileh = this.image.height/tile;
		this.nbtile = this.nbtilew*this.nbtileh;
		this.quad = [];
		var count = 1;
		//console.log(this.nbtilew,this.nbtileh,this.nbtile);
		// i - y j - x
		for(var i=0;this.nbtilew>i;i++)
		{
			for(var j=0;this.nbtileh>j;j++)
			{
				var py = j*tile;
				var px = i*tile;
				this.quad[count] = {x:px,y:py};
				count += 1;
			}
		}
		//console.log(this.quad[0]==null,this.quad[1].x,this.quad[1].y);
	}
    length()
    {
        return this.nbtile -1;
    }
	draw(id,x,y,scale)
	{
		if(scale == null) scale = 1;
		if(id > 0 && id <= this.nbtile)
            context.drawImage(this.image,this.quad[id].x,this.quad[id].y,this.tile,this.tile,x,y,this.tile*scale,this.tile*scale);
	}
}
class Map
{
    constructor(px,py,pmap,pspritesheet,ptile)
    {
	this.x=px;
	this.y=py;
        this.h=pmap.length;
        this.w=pmap[0].length;
	this.map=pmap; // map = [[]]
	this.tile=ptile;
        this.img = ASSET["I"+pspritesheet];//new Image(),
        this.quad=[];
    }
    drawMap()
    {   
       
        if(this.quad.length==0)
        {
            this.nbtilew = this.img.width/this.tile;
            this.nbtileh = this.img.height/this.tile;
            this.nbtile = this.nbtilew*this.nbtileh;
            this.quad.push({});
            for(let i=0;this.nbtilew>i;i++)
            {
                for(let j=0;this.nbtileh>j;j++)
                {
                    this.quad.push({x:i*this.tile,y:j*this.tile});
                }
            }
        }
        for(let j=0;j<this.map.length;j++)
        {
            for(let i=0;i<this.map[0].length;i++)
            {
                //if(m.map[j][i]>0) m.sc.draw(m.map[j][i],m.x+(i*m.tile),m.y+(j*m.tile));
                 let id = this.map[j][i];
                 //console.log(id);
                if(id > 0 && id < this.nbtile) 
                {
                     
                    context.drawImage(this.img,this.quad[id].x,this.quad[id].y,this.tile,this.tile,this.x+(i*this.tile),this.y+(j*this.tile),this.tile,this.tile);
                }
            }
        }
    }
    drawSimple()
    {
        context.drawImage(this.img,this.x,this.y);
    }
    getid(x,y)
    {
        let mx = x - this.x;
        let my = y - this.y;
        if(mx >= 0 && mx < this.tile*this.map[0].length &&
           my >= 0 && my < this.tile*this.map.length)
        {
            return this.map[Math.floor(my/this.tile)][Math.floor(mx/this.tile)];
        }
        return -1;
    }
    setid(x,y,id)
    {
        let mx = x - this.x;
        let my = y - this.y;
        if(mx >= 0 && mx < this.tile*this.map[0].length &&
           my >= 0 && my < this.tile*this.map.length)
        {
            this.map[Math.floor(my/this.tile)][Math.floor(mx/this.tile)]=id;
        }
    }
    getpos(x,y)
    {
        let pos={ 
            "x":this.x+(Math.floor((x-this.x)/this.tile))*this.tile,
            "y":this.y+(Math.floor((y-this.y)/this.tile))*this.tile
        }
        return pos;
    }
};
class Video
{
    constructor(source)
    {
        // use .webm
        this.v = ASSET["V"+source].v;
        this.x = ASSET["V"+source].x;
        this.y = ASSET["V"+source].y;

    }
    draw(x,y)
    {
        if(this.v.ended == false) 
        {
		if(x==null && y==null)
			context.drawImage(this.v,this.x,this.y);
		else 
			context.drawImage(this.v,x,y);
	}
    }
    play()
    {
        this.v.play();
    }
    pause()
    {
        this.v.pause();
    }
}
class vector
{
    constructor()
    {
        this.list = [];
    }
    push_back(element)
    {
        this.list.push(element);
    }
    length()
    {
        return this.list.length;
    }
}


function fill_Rect(x,y,w,h,color)
{
    //var ctx = Game.context;
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function line_Rect(x,y,w,h,color)
{  
    //var ctx = Game.context;
    context.strokeStyle = color;
    context.strokeRect(x, y, w, h);
}




class btnText
{
    constructor(x,y,text,size,color1,color2)
    {
        this.x = x;
        this.y = y;
        if(text.length > 6) this.w = ((text.length+1)*size/2);
        else this.w = ((text.length+1)*size/2)+size/2;
        this.h = size+(size*0.25);
        this.timer = Timer();
        this.size = size;
        this.color1 = color1;
        this.color2 = color2;
        this.text = text;
    }
    ispress()
    {
        let t = {"x":this.x,"y":this.y,"w":this.w,"h":this.h};
        if(this.timer.test() && collide(mouse,t)==1 && mouse.btnG == 1) 
        {
            this.timer.start(25);
            return true;
        }
            return false;
    }
    draw()
    {
        let t = {"x":this.x,"y":this.y,"w":this.w,"h":this.h};
        if(collide(mouse,t))
        {
            //line_Rect(this.x,this.y,this.w,this.h,this.color1);
            Text(this.text,this.x+this.size/5,this.y+this.size,this.color1,this.size);
        }
        else
        {
            //line_Rect(this.x,this.y,this.w,this.h,this.color2);
            Text(this.text,this.x+this.size/5,this.y+this.size,this.color2,this.size);
        }

    }

};
class btnImg
{
    constructor(x,y,w,h,pimg1,pimg2)
    {
      
        this.x = x;
        this.y = y;
        this.img1 = ASSET["I"+pimg1];//new Image(w,h);
        //this.img1.src = pimg1;
        this.w = w;
        this.h = h;
        this.img2 = ASSET["I"+pimg2];//new Image(w,h);
        //this.img2.src = pimg2;
    }
    ispress()
    {
        if(collide(mouse,this)==1 && mouse.btnG == 1) return true;
        return false;
    }
    draw()
    {
        if(collide(mouse,this))
        {
            // this.img2.draw();
            context.drawImage(this.img2,this.x,this.y);
        }
        else
        {
            //this.img1.draw();
            context.drawImage(this.img1,this.x,this.y);
        }
       
    }
    
};

//let keyboard = {
//	"key":"",
//	"input":"",
//	"inputo":"",
//	"on":false
//};
//class btninput
//{
//	// variable pour input et activation
//	
//	constructor()
//	{	
//		this.on = false;
//		this.str = "";
//	}
//	// fonction entrer clavier
//	input()
//	{
//		if(this.str == "" && this.on == true) {keyboard.on = true;}
//		if(this.on == true)
//		{
//			this.str += keyboard.inputo;
//			
//			if(this.str != "") 
//			{
//				if(keyboard.key == "Enter") keyboard.on = false;
//				this.on = false;
//			}
//		}
//	}
//	reset(){this.str = ""; keyboard.inputo = "";keyboard.input = "";this.on = true;keyboard.on = true;}
//	active(){if(this.on == false) this.on = true;}

//	notactive(){this.on = false;}
//	
//};
//requireJS("js/load",1);
newGame(800,480,"2d");
curant_color="black";
love = {
	update:undefined,
	draw:undefined,
	window:{
		setMode:function(width,height)
		{
			canvas.width = width;
			canvas.height = height;
		}
	},
	audio:{
		newSource:function(filename,type)
		{
			if(type=="static")
				return new Sound(filename);
			else if(type=="stream")
				return new Music(filename);
			else ;
		},
		play:function(clas)
		{
			clas.play();
			
		},
		stop:function(clas)
		{
			clas.stop();
		}
	},
	graphics:{
			newImage:function(filename)
			{
				return new Img(filename);
			},
			draw:function(clas,x,y,sx,sy)
			{
				clas.draw();
			},
			getColor:function()
			{
				return curant_color;
			},
			setColor:function(r,g,b,a)
			{
				if(a!=null) curant_color=rgbaTohex(r,g,b,a);
				else curant_color=rgbaTohex(r,g,b,255);
			},
			setFont:function(font)
			{
				Font(font);
			},

			print:function(text,x,y,size)
			{
				//context.rotate(0-(r*Math.PI /180));
				Text(text,x,y,curant_color,size);
				//context.rotate(0);
			},
			rectangle:function(mode,x,y,w,h)
			{
				if(mode=="fill") fill_Rect(x,y,w,h,curant_color);
				if(mode=="line") line_Rect(x,y,w,h,curant_color);
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
					return K_key("ArrowLeft");
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
		
	}
	
}
