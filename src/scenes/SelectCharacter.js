// To be implemented in Sprint 2
class SelectCharacter extends Phaser.Scene {
    constructor() {
        super("SelectCharacter");
    }

    preload() {
        // load player atlas 
        this.load.atlas('npc_atlas', './assets/player.png', './assets/player.json');
        // load monster spritesheet 
        this.load.spritesheet('monsterNPC', './assets/monsterNPC.png', {frameWidth: 150, frameHeight: 190, startFrame: 0, endFrame: 7});
    }

    create() {
        this.AVATAR_SCALE = 3;
        this.MONSTER_SCALE = 2;
        this.human = this.add.sprite(game.config.width/4, game.config.height/3, 'npc_atlas').setScale(this.AVATAR_SCALE).setOrigin(0, 0).setInteractive();
        this.monster = this.add.sprite(2.5*game.config.width/4, game.config.height/3, 'monsterNPC').setScale(this.MONSTER_SCALE).setOrigin(0, 0).setInteractive();

        // add menu text
        let menuConfig = {
            fontFamily: 'Arial',
            fontSize: '50px',
            backgroundColor: '#315c2b',
            color: '#220a07',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width/2, 60, 
            "Hider's Eyes Only", menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, 120, 
            "Pick your character!", menuConfig).setOrigin(0.5);

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