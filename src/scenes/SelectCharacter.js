// To be implemented in Sprint 2
class SelectCharacter extends Phaser.Scene {
    constructor() {
        super("SelectCharacter");
    }

    preload() {
        // load humanNPC atlas 
        this.load.atlas('npc_atlas', './assets/humanNPC.png', './assets/player.json');

        // load monster spritesheet 
        this.load.spritesheet('monsterNPC', './assets/monsterNPC.png', {frameWidth: 150, frameHeight: 190, startFrame: 0, endFrame: 7});

        // load spritesheets
        this.load.spritesheet('humanPlayer', './assets/humanPlayer.png', {frameWidth: 50, frameHeight: 120, startFrame: 0, endFrame: 7});
        this.load.spritesheet('monsterPlayer', './assets/monsterPlayer.png', {frameWidth: 150, frameHeight: 190, startFrame: 0, endFrame: 7});

        // load images
        this.load.image('hidersEyesText', "./assets/hidersEyesText.png");
        this.load.image('pickCharacterText', "./assets/pickCharacterText.png");
    }

    create() {
        // scales for human and monster
        this.AVATAR_SCALE = 3;
        this.MONSTER_SCALE = 1.75;

        // create human and monster sprite
        this.human = this.add.sprite(game.config.width/4, game.config.height/2.5, 'humanPlayer').setScale(this.AVATAR_SCALE).setOrigin(0, 0).setInteractive();
        this.monster = this.add.sprite(2.5*game.config.width/4, game.config.height/2.5, 'monsterPlayer').setScale(this.MONSTER_SCALE).setOrigin(0, 0).setInteractive();


        // text placement @ middle
        this.hidersEyes =  this.add.sprite(340, 30, 'hidersEyesText').setScale(.5).setOrigin(0, 0);
        this.pickCharacter =  this.add.sprite(410, 130, 'pickCharacterText').setScale(.35).setOrigin(0, 0);

        // add interactibility for human and monster
        this.human.on('pointerdown', ()=> {
            hiderIsHuman = true;
            this.scene.start('Spawn');
        });

        this.monster.on('pointerdown', ()=> {
            hiderIsHuman = false;
            this.scene.start('Spawn');
        });
    }

    update() {
        
    }

}