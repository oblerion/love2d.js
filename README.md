# love2d.js
## Description
love2d api for html5 game, not complete. 
look like love2d but have some differences.

## Table of content
- [Features](#features)

## features
 see [wiki](https://github.com/oblerion/love2d.js/wiki) for more info
 
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

		love.window.setMode(1000,500);
		love.graphics.setFont("ani");

		// update loop function
		love.update=function()
		{
			
		}
		// draw loop function
		love.draw =function()
		{
			let Mx = love.mouse.getY();
			//Text("hello",12,34,"blue",25);
			love.graphics.setColor(200,2,2);
			love.graphics.print("hello",200,250,65);
			love.graphics.setColor(0,200,0);
			love.graphics.rectangle("line",200,200,20,20);
			love.graphics.line(Mx,0,300,34);
			if(love.keyboard.isDown("up")) love.graphics.circle("line",230,340,25);
		}
		
	</script>
</body>
</html>
```
 
## How to Contribute
The [Contributor Covenant](https://www.contributor-covenant.org/) is an industry standard.
