// To be implemented in Sprint 2
class Credits extends Phaser.Scene {
    constructor() {
        super("Credits");
    }

    preload() {
        this.load.image('credits', './assets/credits.png');
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 1280, 960, 'credits').setOrigin(0, 0);
    }


    update() {
        
    }

}