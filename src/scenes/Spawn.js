// To be implemented in Sprint 2
class Spawn extends Phaser.Scene {
    constructor() {
        super("Spawn");
    }

    preload() {
        // load images
        this.load.image('playBackground', "./assets/playBackground.png");
        this.load.image('chooseSpawnText', "./assets/chooseSpawnText.png");
        this.load.image('hidersEyesText', "./assets/hidersEyesText.png");
        this.load.image('vampire', './assets/vampire.png');
        this.load.image('dots', './assets/dots.png');
        this.load.image('gameStartsIn', './assets/gameStartsIn.png');

        // load spritesheet
        this.load.spritesheet('3to0', './assets/3to0.png', {frameWidth: 350, frameHeight: 230, startFrame: 0, endFrame: 4});
    }

    create() {
        // load background
        this.background = this.add.tileSprite(0, 0, 1280, 960, 'playBackground').setOrigin(0, 0);

        // background obstacles 
        this.obstacle1 = this.physics.add.sprite(-30, 100, 'vampire').setScale(0.6).setOrigin(0, 0).setInteractive();
        this.obstacle1.flipX = true;

        this.obstacle2 = this.physics.add.sprite(800, 400, 'dots').setScale(0.5).setOrigin(0, 0).setInteractive();

        // from https://phaser.io/examples/v3/view/actions/place-on-triangle
        this.triangle = new Phaser.Geom.Triangle.BuildRight(1300, -10, -490, -610);

        // countdown animation
        this.anims.create({
            key: '3to0',
            frames: this.anims.generateFrameNumbers('3to0', { start: 0, end: 4, first: 0}),
            frameRate: 1
        });

        // add text
        this.hidersEyes =  this.add.sprite(30, 20, 'hidersEyesText').setScale(.5).setOrigin(0, 0);
        this.chooseSpawn =  this.add.sprite(190, 120, 'chooseSpawnText').setScale(.35).setOrigin(0, 0);

        // start countdown
        this.timer = 0;
        this.countdown = 3;
        this.clock = this.time.addEvent({delay: 1000, callback: this.counter, callbackScope: this, loop: true});

        // variable to see if player clicked yet
        this.clicked = false; 

        // checks if player click was in a valid spot
        this.input.on('pointerdown', (pointer) => {
            if(!(Phaser.Geom.Triangle.Contains(this.triangle, pointer.x, pointer.y) || this.obstacle1.getBounds().contains(pointer.x, pointer.y)
                    || this.obstacle2.getBounds().contains(pointer.x, pointer.y)) && !this.clicked){
                // sets spawn position of hider
                hiderX = pointer.x;
                hiderY = pointer.y;

                // sets the appropriate sprite and scale
                this.AVATAR_SCALE = 0.75;
                this.MONSTER_SCALE = 0.35;
                if(hiderIsHuman){
                    this.player = this.physics.add.sprite(hiderX, hiderY, 'humanPlayer').setScale(this.AVATAR_SCALE).setOrigin(0, 0).setInteractive();
                } else {
                    this.player = this.physics.add.sprite(hiderX, hiderY, 'monsterPlayer').setScale(this.MONSTER_SCALE).setOrigin(0, 0).setInteractive();
                }

                // set lighting
                this.background.setPipeline('Light2D');
                this.obstacle1.setPipeline('Light2D');
                this.obstacle2.setPipeline('Light2D');
                this.player.setPipeline('Light2D');
                this.lightColor = 0xFFFFFF;
                this.lights.enable().setAmbientColor(this.lightColor);
                this.light = this.lights.addLight(hiderX, hiderY, 200, 0x000000);

                // display countdown 
                this.countdown = 3;
                this.hidersEyes.destroy();
                this.chooseSpawn.destroy();
                
                // add countdown text
                this.gameStartsIn =  this.add.sprite(390, 50, 'gameStartsIn').setScale(.5).setOrigin(0.5);
                this.countdownText = this.physics.add.sprite(675, 20, '3to0').setScale(.30).setOrigin(0, 0);
                this.countdownText.anims.play('3to0', true);

                // set clicked to true
                this.clicked = true;
            }
        });
    }


    update() {
        // once countdown is over, start game
        if(this.countdown == 0){
            this.scene.start('Play');
        }
        
        // gradient the light
        if(this.lightColor > 0x161616){
            this.lightColor -= 0x010101;
            this.lights.enable().setAmbientColor(this.lightColor);
        }
    }

    // function to keep track of timer and countdown
    counter(){
        this.timer++;
        if(this.clicked){
            this.countdown--;
        }
    }

}