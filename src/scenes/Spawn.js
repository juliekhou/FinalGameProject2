// To be implemented in Sprint 2
class Spawn extends Phaser.Scene {
    constructor() {
        super("Spawn");
    }

    preload() {
        // load background image
        this.load.image('playBackground', "./assets/playBackground.png");
        this.load.image('vampire', './assets/vampire.png');
        this.load.image('dots', './assets/dots.png');
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
        this.instruction = this.add.text(game.config.width/2, 120, 
            "Choose where to hide at the start!", menuConfig).setOrigin(0.5);
        // this.add.text(game.config.width/2, 120, 
        //     "As soon as the you click, the game begins", menuConfig).setOrigin(0.5);

        this.timer = 0;
        this.countdown = 5;
        this.clock = this.time.addEvent({delay: 1000, callback: this.counter, callbackScope: this, loop: true});

        this.clicked = false; 

        this.input.on('pointerdown', (pointer) => {
            if(!(Phaser.Geom.Triangle.Contains(this.triangle, pointer.x, pointer.y) || this.obstacle1.getBounds().contains(pointer.x, pointer.y)
                    || this.obstacle2.getBounds().contains(pointer.x, pointer.y)) && !this.clicked){
                hiderX = pointer.x;
                hiderY = pointer.y;

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
                this.light = this.lights.addLight(hiderX, hiderY, 200, 0xFFFFFF);

                // display countdown 
                this.countdown = 5;
                this.instruction.destroy();
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
                this.instruction = this.add.text(game.config.width/2, 120, "Game starts in " + this.countdown, menuConfig).setOrigin(0.5);
                this.clicked = true;
            }
        });
    }


    update() {
        if(this.clicked){
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
            this.instruction = this.add.text(game.config.width/2, 120, "Game starts in " + this.countdown, menuConfig).setOrigin(0.5);
        }
        if(this.countdown == 0){
            this.scene.start('Play');
        }
        if(this.lightColor > 0x161616){
            this.lightColor -= 0x010101;
            this.lights.enable().setAmbientColor(this.lightColor);
        }
    }

    counter(){
        this.timer++;
        if(this.clicked){
            this.countdown--;
        }
    }

}