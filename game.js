var game = new Phaser.Game(256, 224, Phaser.AUTO, '', { preload: preload, create: create, update: update }, false, false, null);

var score = 0;
var scoreText;

function preload() {

	game.load.image('sky', 'assets/maps/yoshis-island-1/background.png');
	game.load.image('ground', 'assets/tutorial/platform.png');
	game.load.image('star', 'assets/tutorial/star.png');
	game.load.atlasJSONArray('mario', 'assets/sprites/spritesheets/mario.png', 'assets/sprites/spritesheets/mario.json');

	// game.load.atlasJSONArray('mario', 'assets/sprites/atlases/mario/mario.png', 'assets/sprites/atlases/mario/mario.json');

  // SCALING
  // scale the game 4x
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
  game.scale.setUserScale(3, 3);

  // enable crisp rendering
  game.renderer.renderSession.roundPixels = false;
  Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)

	// Music
	game.load.audio('Overworld Theme', 'assets/sound/music/2-53\ Overworld\ Theme\ (SMW).mp3')

	// Sound Effects
	game.load.audio('Jump Wav', 'assets/sound/effects/jump.wav');
}

function create() {
	// Enable physics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	// Sky background
	game.add.sprite(0,-200,'sky');

	// Platforms
	platforms = game.add.group();
	platforms.enableBody = true;

	// Ground
	var ground = platforms.create(0, game.world.height - 2, 'ground');
	ground.scale.setTo(2,2);
	ground.body.immovable = true;

	// Ledges
	// var ledge = platforms.create(400, 400, 'ground');
	// ledge.body.immovable = true;
	// ledge = platforms.create(-150, 250, 'ground');
	// ledge.body.immovable = true;

	// Music
	music = game.add.audio('Overworld Theme');
  music.play();

	// Sound effects
	jumpWav = game.add.audio('Jump Wav');

	/*
	********************************************
	PLAYER
	********************************************
	*/

	player = game.add.sprite(32, game.world.height - 150, 'mario');
	game.physics.arcade.enable(player);
	player.body.bounce.y = 0;
	player.body.gravity.y = 300;
	player.body.collideWorldBounds = true;

	// default direction
  player.direction = 'right';

	player.anchor.setTo(.5,1);
	player.animations.add('left', [1,0], 10, true);
  player.animations.add('right', [1,0], 10, true);
  // player.animations.play('down', [10], 10, true);
  // player.animations.add('up', [15], 1, true);

	/*
	********************************************
	STARS
	********************************************
	*/

	stars = game.add.group();

	stars.enableBody = true;

	for (var i = 0; i < 12; i++){
		var star = stars.create(i*70,0,'star');
		star.body.gravity.y = 6;
		star.body.bounce.y = 0.7 + Math.random() * 0.2;
	}

	/*
	*******************************************
	CONTROLS
	*******************************************
	*/
	// Load arrow key controls
	cursors = game.input.keyboard.createCursorKeys();

	/*
	*******************************************
	SCORE
	*******************************************
	*/
	scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000'});

}

function update() {
	var hitPlatform = game.physics.arcade.collide(player, platforms);

	if (player.direction === 'right'){
		player.scale.x = 1;
	} else if (player.direction === 'left'){
		player.scale.x = -1;
	}

	player.body.velocity.x = 0;
	if (cursors.left.isDown){
		player.body.velocity.x = -75;
		player.direction = 'left';
		player.animations.play('left');
	}
	else if (cursors.right.isDown)
	{
		player.body.velocity.x = 75;
		player.direction = 'right';
		player.animations.play('right');
	}
	else
	{
		player.animations.stop();
    if (player.direction === 'left'){
      player.frame = 0;
    } else if (player.direction === 'right'){
		  player.frame = 0;
    }
	}

	if (cursors.up.isDown && player.body.touching.down && hitPlatform)
	{
		player.body.velocity.y = -200;
		jumpWav.play();
    // if (player.direction === 'left'){
    //   player.frame = 12;
    // } else if (player.direction === 'right'){
		//   player.frame = 13;
    // }
	}

	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.overlap(player, stars, collectStar, null, this);

}

function collectStar(player, star) {
	star.kill();

	score += 10;
	scoreText.text = 'Score: ' + score;
}
