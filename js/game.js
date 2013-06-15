var Game = {};
Game.canvas = document.getElementById('canvas');
Game.ctx = Game.canvas.getContext('2d');
//Constants
Game.canvas.height = window.innerHeight;
Game.canvas.width = window.innerWidth;
Game.gameHeight = Game.canvas.height;
Game.gameWidth = Game.canvas.width;
//Set up game
Game.init = function() {
	Game.update();
	window.addEventListener('keydown',Game.movement.keyDown);
	window.addEventListener('keyup', Game.movement.keyUp);
};
//Draw the frames
Game.draw = function() {
	Game.ctx.fillStyle = "#002a2a";
	Game.ctx.fillRect(0,0,Game.gameWidth,Game.gameHeight);
	Game.movement.checkKeys();
	Game.player.paint();
	enemy.paint();
	for(var i = 0; i < Game.stars.length; i++){
		Game.ctx.globalAlpha = Game.stars[i].a;
		Game.ctx.fillStyle = "#ffffff";
		Game.ctx.fillRect(Game.stars[i].x,Game.stars[i].y,2,2);
	}
	//Reset alpha
	Game.ctx.globalAlpha = 1;
	Game.handleBullets.updateBullets();
	Game.handleBullets.collisionCheck();	
	Game.handleBullets.renderBullets();
};
//Player Object
Game.player = {
	x : 0,
	y : Game.gameHeight/2,
	right: false,
	left: false,
	up: false,
	down: false,
	hp : 100,
	W : 64,
	H : 64,
	speed: 10,
	img: new Image(),
	paint : function(){
		this.img.src = "imgs/player_ship.gif";
		Game.ctx.drawImage(this.img,this.x,this.y);
	},
};
//Empty bullet arrays
Game.bullets = [];
//Bullet constructor
Game.Bullet = function(x,y) {
	this.x = x + 50;
	this.y = y + 26;
	//Render
	this.render = function(){
		Game.ctx.fillStyle = '#81FZ6FF';
		Game.ctx.fillRect(this.x,this.y, 10, 4);
	};
	//Update
	this.update = function(){
		this.x += 20;
	};
};
//Handle updating and rendering of bullets
Game.handleBullets = {
	renderBullets: function() {
		//Loop through bullets and render them
		for(var i = 0; i<Game.bullets.length; i++){
			Game.bullets[i].render();
		}
	},
	updateBullets: function() {
		//Loop through bullets and update them
		for(var i = 0; i<Game.bullets.length; i++){
			Game.bullets[i].update();
		}
	},
	collisionCheck: function() {
		//For all the bullets check to see if they are 
		//at the same position as the enemy
		for(var i = 0; i<Game.bullets.length; i++){
			//If the bullets x pos is greater than the enemies
			//And the x pos is less than the x + the w aka inside the box
			//Check the same for y
			//Hit!
			if((Game.bullets[i].x > enemy.x) && (Game.bullets[i].x < enemy.x + enemy.W) 
				&& (Game.bullets[i].y > enemy.y) && (Game.bullets[i].y < enemy.y + enemy.H) ){
				console.log('hit');
				//Remove Bullet
				Game.bullets.splice(i,1);  
			}
		}
	}
};
//Enemy constructor
Game.Enemy = function() {
	this.x = Game.gameWidth - 64;
	this.y = Math.floor(Math.random()*Game.gameHeight);
	this.W = 58;
	this.H = 58;
	this.img = new Image();
	this.paint = function() {
		this.img.src = 'imgs/enemy_ship.gif';
		Game.ctx.drawImage(this.img,this.x,this.y);
	};
};
var enemy = new Game.Enemy();
//Movement logic
Game.movement = {
	keyDown: function(e) {
		//37 is left
		//38 is up
		//39 is right
		//40 is Down
		if(e.keyCode === 37){
			Game.player.left = true;
			//Hand handleing for player going beyond bounds
			Game.player.x -= Game.player.speed;
		}
		if(e.keyCode === 38){
			Game.player.up = true;
			Game.player.y -= Game.player.speed;
		}
		if(e.keyCode === 39){
			Game.player.right = true;	
			Game.player.x += Game.player.speed;
		}
		if(e.keyCode === 40){
			Game.player.down = true;
			Game.player.y += Game.player.speed;
		}
		//Space bar
		if(e.keyCode === 32){
			//create a new bullet at players x and y
			var bullet = new Game.Bullet(Game.player.x, Game.player.y);
			Game.bullets.push(bullet);
		}
	},
	keyUp: function(e){
		if(e.keyCode === 37){
			Game.player.left = false;
		}
		if(e.keyCode === 38){
			Game.player.up = false;
		}
		if(e.keyCode === 39){
			Game.player.right = false;
		}
		if(e.keyCode === 40){
			Game.player.down = false;
		}
	},
	checkKeys: function(){
		if(Game.player.left === true){
			Game.player.x -= Game.player.speed;
		}
		if(Game.player.up === true){
			Game.player.y -= Game.player.speed;
		}
		if(Game.player.right === true){
			Game.player.x += Game.player.speed;
		}
		if(Game.player.down === true){
			Game.player.y += Game.player.speed;
		}
	}
};
//Make empty array for stars
Game.stars = [];
//Create stars and put them in array. 
Game.createStar = function() {
	this.x = Math.floor(Math.random() * Game.gameWidth);
	this.y = Math.floor(Math.random() * Game.gameHeight);
	this.a = Math.random();
};
for (var i = 0; i < 50; i++){
	Game.stars.push(new Game.createStar());
}
Game.update = function() {
	setInterval(Game.draw,1000/60);
};
//Start it off
Game.init();
