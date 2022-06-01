# love2d.js

## Table of content
- [Description](#description)
- [Features](#features)
- [example](#example)

## description
[love2d](https://love2d.org) api for html5 game, not using emscripten, made with equivalent of lua functions written in javascript

## features
- print text, rectangle, cercle , line
- load image, song ,video and use it
- keyboard and mouse (touch basic) input
- setting window and icon 
 <br>see [wiki](https://github.com/oblerion/love2d.js/wiki) for more info
 
## example
```html
<!DOCTYPE html>
<html id="html" lang="fr">
<title> simple test </title>
<head>
	<meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1.0"/>	
</head>

<body>
	<script src="love2d.js"></script>
	<script>
		player = {x:10,y:100};	
		love.load=function()
		{
			// set width ans height of game
			love.window.setMode(1000,500);
			// set font 
			love.graphics.setFont("arial");
			// load image
			pic= love.graphics.newImage("test.png");
			q = love.graphics.newQuad(0,0,16,16);
			// set icone
			love.window.setIcon(pic);
			// loading loop song
			song = love.audio.newSource("test.wav","stream");
			love.audio.setVolume(0.2);
			//video loading
			vid = love.graphics.newVideo("test.webm");
			// start video
			vid.play();
		}
		// update loop function
		
		love.update=function(dt)
		{
			if(love.keyboard.isDown("left")) 
			{
				player.x -= 20*dt;
				love.audio.play(song);
			}
			if(love.keyboard.isDown("right")) 
			{
				player.x += 20*dt;
				love.audio.stop(song);
			}
			//print(player.x,player.y);
		}
		// draw loop function
		love.draw =function()
		{
			let Mx = love.mouse.getX();	
			let My = love.mouse.getY();
			love.graphics.print("left for start music  right for stop",12,34,"blue",25);
			love.graphics.setColor(200,2,2,125);
			love.graphics.print("hello ",200,250,0,25);
			love.graphics.setColor(0,200,0,125);
			love.graphics.draw(pic,player.x,player.y,0,64,64);
			love.graphics.setColor(200,2,2);
			love.graphics.line(Mx,0,300,34);
			love.graphics.draw(pic,150,50,0,64,64);
			love.graphics.draw(vid,23,23);
		
		}
		
	</script>
</body>
</html>
