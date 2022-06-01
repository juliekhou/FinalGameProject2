class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }

    preload() {
        // load background audio
        this.load.audio('backgroundChatter', './assets/backgroundChatter.m4a');

        // load hit sounds
        this.load.audio('hitSound1', './assets/hitSound1.m4a');
        this.load.audio('hitSound2', './assets/hitSound2.m4a');
        this.load.audio('hitSound3', './assets/hitSound3.m4a');
        this.load.audio('hitSound4', './assets/hitSound4.m4a');
        this.load.audio('hitSound5', './assets/hitSound5.m4a');

        // load miss sounds
        this.load.audio('missSound1', './assets/missSound1.m4a');
        this.load.audio('missSound2', './assets/missSound2.m4a');
        this.load.audio('missSound3', './assets/missSound3.m4a');

        // load sprite sheet
        // animations to come in Sprint 2
        // this.load.spritesheet('title', './assets/title.png', {frameWidth: 700, frameHeight: 700, startFrame: 0, endFrame: 5});
        // this.load.spritesheet('tutorial', './assets/tutorial.png', {frameWidth: 500, frameHeight: 110, startFrame: 0, endFrame: 5});
        this.load.image('play', './assets/play.png');
        this.load.image('background', './assets/titleBackground.png');
        this.load.spritesheet('playAgain', './assets/playAgain.png', {frameWidth: 700, frameHeight: 200, startFrame: 0, endFrame: 13});
        // load sprite sheets for text
        this.load.spritesheet('seekerWon', './assets/seekerWon.png', {frameWidth: 570, frameHeight: 370, startFrame: 0, endFrame: 19});
        this.load.spritesheet('hiderWon', './assets/hiderWon.png', {frameWidth: 570, frameHeight: 400, startFrame: 0, endFrame: 17});

        // load taco sheet
        this.load.spritesheet('taco', './assets/taco.png', {frameWidth: 780, frameHeight: 475, startFrame: 0, endFrame: 6});
        this.load.image('flashlight', './assets/flashlight.png');
        this.load.image('flashlightSprite', './assets/flashlightSprite.png');
    }

    create() {
        // title - sprint 2
        // this.title = this.add.sprite(290, 20, 'title').setOrigin(0, 0);

        // background
        this.background = this.add.tileSprite(0, 0, 1280, 960, 'background').setOrigin(0, 0);
        
        // tutorial and play buttons
        //this.tutorial = this.physics.add.sprite(390, 450, 'tutorial').setOrigin(0, 0).setInteractive();
        this.play = this.add.sprite(480, 440, 'play').setOrigin(0, 0).setInteractive();
        this.tutorial = this.add.sprite(480, 640, 'play').setScale(.35).setOrigin(0, 0).setInteractive();
        this.credits = this.add.sprite(680, 645, 'play').setScale(.35).setOrigin(0, 0).setInteractive();

        // for Sprint 2
        // adding animations
        // this.anims.create({
        //     key: 'titleAnimation',
        //     frames: this.anims.generateFrameNumbers('title', { start: 0, end: 5, first: 0}),
        //     frameRate: 6
        // });
        // this.anims.create({
        //     key: 'tutorialAnimation',
        //     frames: this.anims.generateFrameNumbers('tutorial', { start: 0, end: 4, first: 0}),
        //     frameRate: 6
        // });
        // this.anims.create({
        //     key: 'playAnimation',
        //     frames: this.anims.generateFrameNumbers('play', { start: 0, end: 4, first: 0}),
        //     frameRate: 6
        // });

        // load background audio 
        this.backgroundChatter = this.sound.add('backgroundChatter');
        this.backgroundChatter.setLoop(true);
        let chatterConfig = {
            mute: false,
            volume: 0.25,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.backgroundChatter.play(chatterConfig);
        
        // interactibility for buttons - Sprint 2
        // this.tutorial.on('pointerdown', ()=> {
        //     this.scene.start('Tutorial');
        // });
        this.play.on('pointerdown', ()=> {
            this.backgroundChatter.stop();
            this.scene.start('SelectCharacter');
        });

        this.credits.on('pointerdown', ()=> {
            this.backgroundChatter.stop();
            this.scene.start('Credits');
        });

        this.tutorial.on('pointerdown', ()=> {
            this.backgroundChatter.stop();
            this.scene.start('Tutorial');
        });
    }


    update() {
        // game settings
        game.settings = {
            // gameTimer: 30000    
            gameTimer: 33000
        }

        // change cursor to flashlight
        this.input.setDefaultCursor('url(./assets/flashlight.png), pointer');

        // play animations - Sprint 2
        // this.title.anims.play('titleAnimation', true);
        //this.tutorial.anims.play('tutorialAnimation', true);
        // this.play.anims.play('playAnimation', true);
    }
}