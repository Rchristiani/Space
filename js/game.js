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
	Game.Player.paint();
	
	if(Game.enemies.length === 0){
		Game.makeEnemies.make();
	}
	Game.makeEnemies.paint();
	
	for(var i = 0; i < Game.stars.length; i++){
		Game.ctx.globalAlpha = Game.stars[i].a;
		Game.ctx.fillStyle = "#ffffff";
		Game.ctx.fillRect(Game.stars[i].x,Game.stars[i].y,2,2);
	}
	//Reset alpha
	Game.ctx.globalAlpha = 1;
	Game.Player.handleBullets.updateBullets();
	Game.Player.handleBullets.collisionCheck();	
	Game.Player.handleBullets.renderBullets();

	Game.EnemyBulletHandeler.updateBullets();
	Game.EnemyBulletHandeler.renderBullets();

	
	Game.enemyAttack();
};
//Player Object
Game.Player = {
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
		this.img.src = "imgs/Player_ship.gif";
		Game.ctx.drawImage(this.img,this.x,this.y);
	},
};
//Empty bullet arrays
Game.Player.bullets = [];
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
Game.Player.handleBullets = {
	renderBullets: function() {
		//Loop through bullets and render them
		for(var i = 0; i<Game.Player.bullets.length; i++){
			Game.Player.bullets[i].render();
		}
	},
	updateBullets: function() {
		//Loop through bullets and update them
		for(var i = 0; i<Game.Player.bullets.length; i++){
			Game.Player.bullets[i].update();
		}
	},
	collisionCheck: function() {
		//For all the bullets check to see if they are 
		//at the same position as the enemy
		for(var i = 0; i<Game.Player.bullets.length; i++){
			//If the bullets x pos is greater than the enemies
			//And the x pos is less than the x + the w aka inside the box
			//Check the same for y
			//Hit!
			for(var j = 0; j<Game.enemies.length; j++){
				if((Game.Player.bullets[i].x > Game.enemies[j].x) 
				&& (Game.Player.bullets[i].x < Game.enemies[j].x + Game.enemies[j].W) 
				&& (Game.Player.bullets[i].y > Game.enemies[j].y) 
				&& (Game.Player.bullets[i].y < Game.enemies[j].y + Game.enemies[j].H) ){
					Game.enemies[j].img.src = 'imgs/enemy_explosion.png';	
					//Remove Enemy
					Game.enemies.splice(j,1); 
					//Remove Bullet
					Game.Player.bullets.splice(i,1); 
				}
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
	this.img.src = 'imgs/enemy_ship.gif';
	this.paint = function() {
		Game.ctx.drawImage(this.img,this.x,this.y);
	};
	this.movement = function() {
		//Move across the screen?
	};
	this.attack = function(x,y) {
		var ranNum = Math.floor(Math.random()*100);
		//Fires at you if you are in their line of sight?
		if(ranNum < 10){
			this.bullets.push(new Game.EnemyBullet(x,y));
		}
	};
	this.bullets =[];
};
Game.enemies = [];
Game.makeEnemies ={
	make: function(){
		for (var i = 0; i < 6; i++) {
			Game.enemies.push(new Game.Enemy());
		}
	},
	paint: function(){
		for (var i = 0; i < Game.enemies.length; i++) {
			Game.enemies[i].paint();
		}
	}
};
Game.enemyAttack = function() {
	for(var i = 0; i < Game.enemies.length; i++) {
		if(Game.Player.y >= Game.enemies[i].y 
		&& Game.Player.y <= Game.enemies[i].y + Game.enemies[i].H){
			// Get range between Enemy Y and Y + enemie[i].H
			Game.enemies[i].attack(Game.enemies[i].x,Game.enemies[i].y);
		}
	}
};
Game.EnemyBullet = function(x,y) {
	this.x = x;
	this.y = y + 26;
	//Render
	this.render = function(){
		Game.ctx.fillStyle = '#81FZ6FF';
		Game.ctx.fillRect(this.x,this.y, 10, 4);
	};
	//Update
	this.update = function(){
		this.x -= 20;
	};
};
Game.EnemyBulletHandeler = {
	renderBullets: function() {
		//Loop through bullets and render them
		for(var i = 0; i < Game.enemies.length; i++){
			for(var j = 0; j<Game.enemies[i].bullets.length; j++){
				Game.enemies[i].bullets[j].render();
			}
		}
	},
	updateBullets: function() {
		//Loop through bullets and update them)
		for(var i = 0; i < Game.enemies.length; i++){
			for(var j = 0; j<Game.enemies[i].bullets.length; j++){
				Game.enemies[i].bullets[j].update();
			}
		}
	},
	collisionCheck: function() {
		//For all the bullets check to see if they are 
		//at the same position as the enemy
		for(var i = 0; i<Game.Player.bullets.length; i++){
			//If the bullets x pos is greater than the enemies
			//And the x pos is less than the x + the w aka inside the box
			//Check the same for y
			//Hit!
			for(var j = 0; j<Game.enemies.length; j++){
				if((Game.Player.bullets[i].x > Game.enemies[j].x) 
				&& (Game.Player.bullets[i].x < Game.enemies[j].x + Game.enemies[j].W) 
				&& (Game.Player.bullets[i].y > Game.enemies[j].y) 
				&& (Game.Player.bullets[i].y < Game.enemies[j].y + Game.enemies[j].H) ){
					Game.enemies[j].img.src = 'imgs/enemy_explosion.png';	
					//Remove Enemy
					Game.enemies.splice(j,1); 
					//Remove Bullet
					Game.Player.bullets.splice(i,1); 
				}
			}
		}
	}
};
//Movement logic
Game.movement = {
	keyDown: function(e) {
		//37 is left
		//38 is up
		//39 is right
		//40 is Down
		if(e.keyCode === 37){
			Game.Player.left = true;
			//Hand handleing for Player going beyond bounds
			Game.Player.x -= Game.Player.speed;
		}
		if(e.keyCode === 38){
			Game.Player.up = true;
			Game.Player.y -= Game.Player.speed;
		}
		if(e.keyCode === 39){
			Game.Player.right = true;	
			Game.Player.x += Game.Player.speed;
		}
		if(e.keyCode === 40){
			Game.Player.down = true;
			Game.Player.y += Game.Player.speed;
		}
		//Space bar
		if(e.keyCode === 32){
			//create a new bullet at Players x and y
			var bullet = new Game.Bullet(Game.Player.x, Game.Player.y);
			Game.Player.bullets.push(bullet);
		}
	},
	keyUp: function(e){
		if(e.keyCode === 37){
			Game.Player.left = false;
		}
		if(e.keyCode === 38){
			Game.Player.up = false;
		}
		if(e.keyCode === 39){
			Game.Player.right = false;
		}
		if(e.keyCode === 40){
			Game.Player.down = false;
		}
	},
	checkKeys: function(){
		if(Game.Player.left === true){
			Game.Player.x -= Game.Player.speed;
		}
		if(Game.Player.up === true){
			Game.Player.y -= Game.Player.speed;
		}
		if(Game.Player.right === true){
			Game.Player.x += Game.Player.speed;
		}
		if(Game.Player.down === true){
			Game.Player.y += Game.Player.speed;
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
