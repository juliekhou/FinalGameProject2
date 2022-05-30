class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    preload() {
        // this.load.spritesheet('humanPlayer', './assets/humanPlayer.png', {frameWidth: 50, frameHeight: 120, startFrame: 0, endFrame: 7});        // load monster spritesheet 
        // this.load.spritesheet('monsterPlayer', './assets/monsterPlayer.png', {frameWidth: 150, frameHeight: 190, startFrame: 0, endFrame: 7});
        this.load.spritesheet('humanPlayer', './assets/humanPlayer.png', {frameWidth: 50, frameHeight: 120, startFrame: 0, endFrame: 7});        // load monster spritesheet 
        this.load.spritesheet('monsterPlayer', './assets/monsterPlayer.png', {frameWidth: 150, frameHeight: 190, startFrame: 0, endFrame: 7});
    
    }

    create() {
        this.AVATAR_SCALE = 3;
        this.MONSTER_SCALE = 1.75;
        // this.human = this.add.sprite(game.config.width/4, game.config.height/3, 'humanPlayer').setScale(this.AVATAR_SCALE).setOrigin(0, 0).setInteractive();
        // this.monster = this.add.sprite(2.5*game.config.width/4, game.config.height/3, 'monsterPlayer').setScale(this.MONSTER_SCALE).setOrigin(0, 0).setInteractive();

        // human walk
        this.anims.create({
            key: 'humanWalk',
            frames: this.anims.generateFrameNumbers('humanPlayer', { start: 0, end: 7, first: 0}),
            frameRate: 10
        });

        // monster walk
        this.anims.create({
            key: 'monsterWalk',
            frames: this.anims.generateFrameNumbers('monsterPlayer', { start: 0, end: 7, first: 0}),
            frameRate: 10
        });

        this.frameNum = 0;

        this.playAgain = this.physics.add.sprite(300, 450, 'playAgain').setOrigin(0,0).setInteractive();

        this.anims.create({
            key: 'playAgainAnimation',
            frames: this.anims.generateFrameNumbers('playAgain', { start: 0, end: 13, first: 0}),
            frameRate: 6
        });

        this.anims.create({
            key: 'tacoAnimation',
            frames: this.anims.generateFrameNumbers('taco', { start: 0, end: 6, first: 0}),
            frameRate: 6
        });

        this.taco = this.physics.add.sprite(20, 250, 'taco').setFrame([0]).setScale(.5).setOrigin(0,0).setInteractive();

        // this.taco.anims.stop();

        // adding interactibility for play again
        this.playAgain.on('pointerdown', ()=> {
            this.scene.start('Menu');
        });

    //     // determine winner
        if(seekerWin){
            // seeker won animation
            this.anims.create({
                key: 'seekerAnim',
                frames: this.anims.generateFrameNumbers('seekerWon', { start: 0, end: 19, first: 0}),
                frameRate: 9
            });
            // this.anims.play('seekerAnim', true);
            this.seekerWins = this.add.sprite(375, 45, 'seekerAnim').setOrigin(0, 0);

            this.flashlight = this.add.sprite(920, 125, 'flashlight').setOrigin(0,0);

        } else {
            // hider won animation
            this.anims.create({
                key: 'hiderAnim',
                frames: this.anims.generateFrameNumbers('hiderWon', { start: 0, end: 17, first: 0}),
                frameRate: 9
            });
            // this.anims.play('hiderAnim', true);
            this.hiderWins = this.add.sprite(375, 45, 'hiderAnim').setOrigin(0, 0);

            if(hiderIsHuman == true){
                this.human = this.add.sprite(1050, 125, 'humanPlayer').setScale(this.AVATAR_SCALE).setOrigin(0, 0).setInteractive();
                this.human.flipX = true;
            } if(hiderIsHuman != true) {
                this.monster = this.add.sprite(950, 150, 'monsterPlayer').setScale(this.MONSTER_SCALE).setOrigin(0, 0).setInteractive();
                this.monster.flipX = true;
            }
        }

        this.taco.on('pointerdown', ()=> {
            this.frameNum ++;
            // console.log(this.frameNum);
            if(this.frameNum < 7){
                // this.taco.destroy();
                // this.taco = this.physics.add.sprite(200, 250, 'taco').setFrame([this.frameNum]).setOrigin(0,0).setInteractive();
                this.taco.setFrame([this.frameNum]);
            }
        });
    }


    update() {
        // play again animation
        this.playAgain.anims.play('playAgainAnimation', true);
        // this.taco.anims.play('tacoAnimation', true);
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