var Game = {};
Game.canvas = document.getElementById('canvas');
Game.ctx = Game.canvas.getContext('2d');
//Constants
Game.gameHeight = Game.canvas.height;
Game.gameWidth = Game.canvas.width;
//Set up game
Game.init = function() {
	Game.update();
	Game.movement();
};
//Draw the frames
Game.draw = function() {
	Game.ctx.fillStyle = "#002a2a";
	Game.ctx.fillRect(0,0,Game.gameWidth,Game.gameHeight);
	Game.player.paint();
	for(var i = 0; i < Game.stars.length; i++){
		Game.ctx.globalAlpha = Game.stars[i].a;
		Game.ctx.fillStyle = "#ffffff";
		Game.ctx.fillRect(Game.stars[i].x,Game.stars[i].y,2,2);
	}
	//Reset alpha
	Game.ctx.globalAlpha = 1;

};
//Player Object
Game.player = {
	x : 0,
	y : 0,
	hp : 100,
	W : 64,
	H : 64,
	paint : function(){
		var img = new Image();
		img.src = "imgs/player_ship.gif";
		Game.ctx.drawImage(img,this.x,this.y);
	}
};
//Enemy object
Game.enemy = function() {
	this.x = Game.gameWidth - 40;
	this.y = Math.floor(Math.random()*Game.gameHeight);
	this.W = 40;
	this.H = 40;
	this.color = "#0b6a8e";
};
//Movement logic
Game.movement = function(){
	addEventListener('keydown',function(e) {
		//37 is left
		//38 is up
		//39 is right
		//40 is Down
		if(e.keyCode === 37){
			Game.player.x -= Game.player.W;
		}
		else if(e.keyCode === 38){
			Game.player.y -= Game.player.W;
		}
		else if(e.keyCode === 39){
			Game.player.x += Game.player.W;
		}
		else if(e.keyCode === 40){
			Game.player.y += Game.player.W;
		}
	});
};
//Make empty array for stars
Game.stars = [];
//Create stars and put them in array. 
Game.createStar = function() {
	this.x = Math.floor(Math.random() * Game.gameWidth);
	this.y = Math.floor(Math.random() * Game.gameHeight);
	this.a = Math.random();
}
for (var i = 0; i < 50; i++){
	Game.stars.push(new Game.createStar());
}
Game.update = function() {
	setInterval(Game.draw,33);
};
//Start it off
Game.init();
