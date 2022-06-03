class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    preload() {
        // load human and monster player spritesheets
        this.load.spritesheet('humanPlayer', './assets/humanPlayer.png', {frameWidth: 50, frameHeight: 120, startFrame: 0, endFrame: 7}); 
        this.load.spritesheet('monsterPlayer', './assets/monsterPlayer.png', {frameWidth: 150, frameHeight: 190, startFrame: 0, endFrame: 7});
    }

    create() {
        this.AVATAR_SCALE = 3;
        this.MONSTER_SCALE = 1.75;

        // human walk animation
        this.anims.create({
            key: 'humanWalk',
            frames: this.anims.generateFrameNumbers('humanPlayer', { start: 0, end: 7, first: 0}),
            frameRate: 10
        });

        // monster walk animation
        this.anims.create({
            key: 'monsterWalk',
            frames: this.anims.generateFrameNumbers('monsterPlayer', { start: 0, end: 7, first: 0}),
            frameRate: 10
        });

        // play again animation and button functionality
        this.playAgain = this.physics.add.sprite(300, 450, 'playAgain').setOrigin(0,0).setInteractive();
        this.anims.create({
            key: 'playAgainAnimation',
            frames: this.anims.generateFrameNumbers('playAgain', { start: 0, end: 13, first: 0}),
            frameRate: 6
        });
        // adding interactibility for play again
        this.playAgain.on('pointerdown', ()=> {
            this.scene.start('Menu');
        });

        // determine winner
        if(seekerWin){
            // seeker won animation
            this.anims.create({
                key: 'seekerAnim',
                frames: this.anims.generateFrameNumbers('seekerWon', { start: 0, end: 19, first: 0}),
                frameRate: 9
            });
            // add title and flashlight sprites
            this.seekerWins = this.add.sprite(375, 45, 'seekerAnim').setOrigin(0, 0);
            this.flashlight = this.add.sprite(920, 125, 'flashlightSprite').setOrigin(0,0);
        } else {
            // hider won animation
            this.anims.create({
                key: 'hiderAnim',
                frames: this.anims.generateFrameNumbers('hiderWon', { start: 0, end: 17, first: 0}),
                frameRate: 9
            });
            // add title
            this.hiderWins = this.add.sprite(375, 45, 'hiderAnim').setOrigin(0, 0);
            // adds either human or monster player sprite 
            if(hiderIsHuman == true){
                this.human = this.add.sprite(1050, 125, 'humanPlayer').setScale(this.AVATAR_SCALE).setOrigin(0, 0).setInteractive();
                this.human.flipX = true;
            } if(hiderIsHuman != true) {
                this.monster = this.add.sprite(950, 150, 'monsterPlayer').setScale(this.MONSTER_SCALE).setOrigin(0, 0).setInteractive();
                this.monster.flipX = true;
            }
        }

        // variable for current taco spritesheet frame
        this.frameNum = 0;
        this.taco = this.physics.add.sprite(20, 250, 'taco').setFrame([0]).setScale(.5).setOrigin(0,0).setInteractive();
        // on each click, iterate through taco spritesheet frames
        this.taco.on('pointerdown', ()=> {
            this.frameNum++;
            if(this.frameNum < 7){
                this.taco.setFrame([this.frameNum]);
            }
        });
    }


    update() {
        // play again animation
        this.playAgain.anims.play('playAgainAnimation', true);

        // play animation for appropriate sprite
        if (seekerWin){
            this.seekerWins.anims.play('seekerAnim', true);
        } else {
            this.hiderWins.anims.play('hiderAnim', true);
            if(hiderIsHuman){
                this.human.anims.play('humanWalk', true);
            } else{
                this.monster.anims.play('monsterWalk', true);
            }
        }
    }
}