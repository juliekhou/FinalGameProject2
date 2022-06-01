// To be implemented in Sprint 2
class Tutorial extends Phaser.Scene {
    constructor() {
        super("Tutorial");
    }

    preload() {
        this.load.image('tutorial', './assets/tutorial.png');
        this.load.image('rightArrow', './assets/rightArrow.png');
    }

    create() {
        // add background
        this.background = this.add.tileSprite(0, 0, 1280, 960, 'tutorial').setOrigin(0, 0);

        this.arrow = this.add.sprite(1100, 20, 'rightArrow').setScale(0.5).setOrigin(0, 0).setInteractive();

        this.arrow.on('pointerdown', ()=> {
            this.scene.start('Menu');
        })
    }


    update() {
        
    }

}