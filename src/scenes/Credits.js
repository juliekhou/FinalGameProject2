// To be implemented in Sprint 2
class Credits extends Phaser.Scene {
    constructor() {
        super("Credits");
    }

    preload() {
        // load images
        this.load.image('credits', './assets/credits.png');
        this.load.image('rightArrow', './assets/rightArrow.png');
    }

    create() {
        // add background
        this.background = this.add.tileSprite(0, 0, 1280, 960, 'credits').setOrigin(0, 0);

        // add arrow and button functionality
        this.arrow = this.add.sprite(1100, 20, 'rightArrow').setScale(0.5).setOrigin(0, 0).setInteractive();
        this.arrow.on('pointerdown', ()=> {
            this.scene.start('Menu');
        })
    }


    update() {
        
    }

}