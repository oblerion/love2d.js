# love2d.js

## Table of content
- [Description](#description)
- [Features](#features)
- [example](#example)

## description
[love2d](https://love2d.org) api for html5 game, not using emscripten, made with equivalent of lua functions written in javascript

## features
- draw : text, rectangle, cercle , line
- load image, song ,video and use it
- input : keyboard, mouse and touch
- setting window and icon 
 <br>see [wiki](https://github.com/oblerion/love2d.js/wiki) for more info
 
## example
```html
<!DOCTYPE html>
<html id="html" lang="fr">
<title> simple test </title>
<head>
	<meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1.0"/>	
	<script nomodule>
		document.write("your old browser don't support module type : need update it");
	</script>
</head>

<body>
	<script type="module" src="love2d.js"></script>
	<script type="module">
		import Love from "./love2d.js";
		let love = new Love();
		player = {x:10,y:100};	
		love.load=function()
		{
			// set width ans height of game
			love.window_setMode(1000,500);
			// set font 
			love.graphics_setFont("arial");
			// load image
			pic= love.graphics_newImage("test.png");
			q = love.graphics_newQuad(0,0,16,16);
			// set icone
			love.window_setIcon(pic);
			// loading loop song
			song = love.audio_newSource("test.wav","stream");
			love.audio_setVolume(0.2);
			//video loading
			vid = love.graphics_newVideo("test.webm");
			// start video
			vid.play();
		}
		// update loop function
		
		love.update=function(dt)
		{
			if(love.keyboard_isDown("left")) 
			{
				player.x -= 20*dt;
				love.audio_play(song);
			}
			if(love.keyboard_isDown("right")) 
			{
				player.x += 20*dt;
				love.audio_stop(song);
			}
			//print(player.x,player.y);
		}
		// draw loop function
		love.draw =function()
		{
			let Mx = love.mouse_getX();	
			let My = love.mouse_getY();
			love.graphics_print("left for start music  right for stop",12,34,"blue",25);
			love.graphics_setColor(200,2,2,125);
			love.graphics_print("hello ",200,250,0,25);
			love.graphics_setColor(0,200,0,125);
			love.graphics_draw(pic,player.x,player.y,0,64,64);
			love.graphics_setColor(200,2,2);
			love.graphics_line(Mx,0,300,34);
			love.graphics_draw(pic,150,50,0,64,64);
			love.graphics_draw(vid,23,23);
		}
		
	</script>
</body>
</html>
