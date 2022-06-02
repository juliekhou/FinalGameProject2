

class Play extends Phaser.Scene{
    constructor(){
        super("Play");
    }

    preload(){
        this.load.spritesheet('numbers', './assets/nums.png', {frameWidth: 350, frameHeight: 230, startFrame: 0, endFrame: 30});
    }

    create(){
        // load background
        this.background = this.add.tileSprite(0, 0, 1280, 960, 'playBackground').setOrigin(0, 0);
        // set background lighting
        this.background.setPipeline('Light2D');

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

        // load hit sounds
        this.hitSound1 = this.sound.add('hitSound1');
        this.hitSound2 = this.sound.add('hitSound2');
        this.hitSound3 = this.sound.add('hitSound3');
        this.hitSound4 = this.sound.add('hitSound4');
        this.hitSound5 = this.sound.add('hitSound5');

        hitSoundConfig = {
            mute: false,
            volume: 0.25,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        hitSound = this.hitSound1;

        // load miss sounds
        this.missSound1 = this.sound.add('missSound1');
        this.missSound2 = this.sound.add('missSound2');
        this.missSound3 = this.sound.add('missSound3');
        missSoundConfig = {
            mute: false,
            volume: 0.10,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        missSound = this.missSound1;

        // timer so seeker can't click on hider right away
        this.startTimer = 0;
        this.startCountdown = 3;
        this.startClock = this.time.addEvent({delay: 1000, callback: this.counter, callbackScope: this, loop: true});

        // from https://phaser.io/examples/v3/view/actions/place-on-triangle
        this.triangle = new Phaser.Geom.Triangle.BuildRight(1300, -10, -490, -610);

        // background obstacles 
        this.obstacle1 = this.physics.add.sprite(-30, 100, 'vampire').setScale(0.6).setOrigin(0, 0).setInteractive();
        this.obstacle1.flipX = true;
        this.obstacle1.setImmovable(true);
        this.obstacle1.setPipeline('Light2D');

        this.obstacle2 = this.physics.add.sprite(800, 400, 'dots').setScale(0.5).setOrigin(0, 0).setInteractive();
        this.obstacle2.setImmovable(true);
        this.obstacle2.setPipeline('Light2D');

        // variable for hider winning state (time runs out)
        hiderWin = false;

        // variable for seeker winning state (seeker clicks hider)
        seekerWin = false;

        // variables and settings
        this.VELOCITY = 400;
        this.DRAG = 800;    // DRAG < ACCELERATION = icy slide
        this.GROUND_HEIGHT = 35;
        this.AVATAR_SCALE = 0.75;
        this.MONSTER_SCALE = 0.35;

        // make player avatar 🧍
        if(hiderIsHuman){
            this.player = this.physics.add.sprite(hiderX, hiderY, 'humanPlayer').setScale(this.AVATAR_SCALE).setOrigin(0, 0).setInteractive();
        } else {
            this.player = this.physics.add.sprite(hiderX, hiderY, 'monsterPlayer').setScale(this.MONSTER_SCALE).setOrigin(0, 0).setInteractive();
        }
        
        // add hider interactibility
        
        // add lighting to player
        this.player.setPipeline('Light2D');

        // miss sound for clicking not the player
        this.input.on('pointerdown', (pointer) => {this.clickElse(pointer)});

        // Use Phaser-provided cursor key creation function
        cursors = this.input.keyboard.createCursorKeys();

        // adding the NPCs
        this.npcHumanGroup = this.add.group({});
        this.npcMonsterGroup = this.add.group({});

        // adding human NPCs
        for(let x = 0; x < 35; x++){
            this.addNPC("npc_atlas", "player1", true, this.AVATAR_SCALE);
        }
        
        // adding monster NPCs
        for(let y = 0; y < 35; y++){
            this.addNPC('monsterNPC', 0, false, this.MONSTER_SCALE);
        }
        
        // walk animation for human NPC
        this.anims.create({ 
            key: 'walk', 
            frames: this.anims.generateFrameNames('npc_atlas', {      
                prefix: 'player',
                start: 1,
                end: 8,
                suffix: '',
            }), 
            frameRate: 10,
            repeat: -1 
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('monsterNPC', { start: 0, end: 7, first: 0}),
            frameRate: 10
        });

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

        // adding collisions 
        this.humanPlayerCollider = this.physics.add.collider(this.npcHumanGroup, this.player, (npc)=> {this.collide(npc)});
        this.humanCollider = this.physics.add.collider(this.npcHumanGroup);
        this.monsterPlayerCollider = this.physics.add.collider(this.npcMonsterGroup, this.player, (npc)=> {this.collide(npc)});
        this.monsterCollider = this.physics.add.collider(this.npcMonsterGroup);
        this.humanMonsterCollider = this.physics.add.collider(this.npcHumanGroup, this.npcMonsterGroup);
        this.obstacle1HumanCollider = this.physics.add.collider(this.obstacle1, this.npcHumanGroup);
        this.obstacle1MonsterCollider = this.physics.add.collider(this.obstacle1, this.npcMonsterGroup);
        this.obstacle2HumanCollider = this.physics.add.collider(this.obstacle2, this.npcHumanGroup);
        this.obstacle2MonsterCollider = this.physics.add.collider(this.obstacle2, this.npcMonsterGroup);
        this.obstacle1PlayerCollider = this.physics.add.collider(this.obstacle1, this.player, ()=> {this.collideObstacle(1)});
        this.obstacle2PlayerCollider = this.physics.add.collider(this.obstacle2, this.player, ()=> {this.collideObstacle(2)});

        // // display clock
        // let clockConfig = {
        //     fontFamily: 'Courier',
        //     fontSize: '28px',
        //     backgroundColor: '#A9DEF9',
        //     color: '#EDE7B1',
        //     align: 'right',
        //     padding: {
        //     top: 5,
        //     bottom: 5,
        //     },
        //     fixedWidth: 100
        // }
        // // clock
        // this.clockRight = this.add.text(0, 50, 0, clockConfig);
        // 30-second play clock
        this.timer = game.settings.gameTimer;
        this.clock;
        this.numbers = this.add.sprite(0, 20, 'numbers').setFrame([0]).setScale(.5).setOrigin(0,0);
        this.clock = this.time.addEvent({delay: 1000, callback: () => {
                this.timer -= 1000; 
                if(this.timer >= 0 && this.timer < 31000){
                    this.numbers.setFrame([30 - (this.timer/1000)]);
                }
            }, callbackScope: this, loop: true});

        //this.numbers = this.add.sprite(0, 50, 'numbers').setFrame([0]).setScale(.5).setOrigin(0,0);


        // lighting
        // ambient lighting
        this.lights.enable().setAmbientColor(0x161616);
        // this.lights.enable().setAmbientColor(0xFFFFFF);

        this.obstacleLight1 = this.lights.addLight(120, 250, 200);;
        this.obstacleLight1.visible = false;
        this.obstacleLight2 = this.lights.addLight(920, 500, 120);
        this.obstacleLight2.visible = false;

        // point light that follows cursor
        this.lightRadius = 200;
        this.lightColor = 0xffffff;
        // begin on the player
        light = this.lights.addLight(this.player.x, this.player.y, this.lightRadius, this.lightColor);

        this.input.on('pointermove', (pointer)=> {
            if(!seekerWin && !hiderWin){
                light.x = pointer.x;
                light.y = pointer.y;
    
                // Change to red
                if(Phaser.Math.Distance.Between(light.x, light.y, this.player.x, this.player.y) < 100){
                    this.lights.removeLight(light);
                    this.lightColor = 0xFFFFFF; // 0xEEA764
                    light = this.lights.addLight(pointer.x, pointer.y, this.lightRadius, this.lightColor);
                // Change to yellow
                } else if(Phaser.Math.Distance.Between(light.x, light.y, this.player.x, this.player.y) < 250){
                    this.lights.removeLight(light);
                    this.lightColor = 0xF0DD82; //0xF0DD82
                    light = this.lights.addLight(pointer.x, pointer.y, this.lightRadius, this.lightColor);
                // Change back to white
                } else{
                    this.lights.removeLight(light);
                    this.lightColor = 0xEEA764;
                    light = this.lights.addLight(pointer.x, pointer.y, this.lightRadius, this.lightColor);
                }
            }
        });

        this.played = false;
        this.hitPlayed = false;
    }

    // function for adding NPC with randomized velocity and start position
    addNPC(texture, frame, isHuman, scale){
        // set random starting x and y positions for NPC
        let xPosition = Math.ceil(Math.random() * 1270);
        let yPosition = Math.ceil(Math.random() * 710);

        let spawnCheck;
        if(this.obstacle1.getBounds().contains(xPosition, yPosition) || this.obstacle2.getBounds().contains(xPosition, yPosition)
                || Phaser.Geom.Triangle.Contains(this.triangle, xPosition, yPosition)){
            spawnCheck = true;
        } else {
            spawnCheck = false;
        }
        while(spawnCheck){
            xPosition = Math.ceil(Math.random() * 1270);
            yPosition = Math.ceil(Math.random() * 710);
            if(this.obstacle1.getBounds().contains(xPosition, yPosition) || this.obstacle2.getBounds().contains(xPosition, yPosition)
                    || Phaser.Geom.Triangle.Contains(this.triangle, xPosition, yPosition)){
                spawnCheck = true;
            } else {
                spawnCheck = false;
            }
        }

        
        // initialize NPC with lighting
        let npc = new NPC(this, xPosition, yPosition, texture, frame, isHuman, scale).setScale(scale);
        // add lighting to NPC
        npc.setPipeline('Light2D');

        // add NPC to group
        if(isHuman) {
            this.npcHumanGroup.add(npc);
        } else {
            this.npcMonsterGroup.add(npc);
        }

        // randomly set velocity
        let xVelocity = (Math.ceil(Math.random() * 300) + 0) * (Math.round(Math.random()) ? 1 : -1);
        let yVelocity = (Math.ceil(Math.random() * 225) + 75) * (Math.round(Math.random()) ? 1 : -1);
        npc.setVelocity(xVelocity, yVelocity).setBounce(1,1);
        npc.setMaxVelocity(300, 300);
    }

    // function to handle collision between hider and NPCs
    collide(npc){
        // randomly set velocity after collision
        let xVelocity = (Math.ceil(Math.random() * 300) + 0) * (Math.round(Math.random()) ? 1 : -1);
        let yVelocity = (Math.ceil(Math.random() * 225) + 75) * (Math.round(Math.random()) ? 1 : -1);
        npc.setVelocity(xVelocity, yVelocity).setBounce(1,1);
    }

    collideObstacle(obstacle){
        if(obstacle == 1){
            this.obstacleLight1.visible = true;
            let timer = this.time.delayedCall(2000, () => {this.obstacleLight1.visible = false}, null, this);
        } else {
            this.obstacleLight2.visible = true;
            let timer = this.time.delayedCall(2000, () => {this.obstacleLight2.visible = false}, null, this);
        }
    }

    update(){
        
        // display timer and check if it is done
        if (this.startCountdown <= 0){
            if(!(this.timer < 0)){
                // this.clockRight.setText((this.timer/1000));
            } else {
                // set hider win to true
                hiderWin = true;
    
                this.backgroundChatter.stop();
                if(!this.played){
                    missSound.play(missSoundConfig);
                    this.played = true;
                }
            
                this.npcHumanGroup.getChildren().forEach(function(npc){
                    npc.setVelocity(0,0);
                }, this);
        
                this.npcMonsterGroup.getChildren().forEach(function(npc){
                    npc.setVelocity(0,0);
                }, this);
    
                light.x = this.player.x;
                light.y = this.player.y;
    
                let timer = this.time.delayedCall(5000, () => {this.scene.start('GameOver')}, null, this);
            }
        } else {
            // this.clockRight.setText("30");
        }

        // check keyboard input
        if(cursors.left.isDown) {
            this.player.body.setVelocityX(-this.VELOCITY);
            this.player.flipX = true;
            if(hiderIsHuman){
                this.player.anims.play('humanWalk', true);
            } else {
                this.player.anims.play('monsterWalk', true);
            }
        } else if(cursors.right.isDown) {
            this.player.body.setVelocityX(this.VELOCITY);
            this.player.flipX = false;
            if(hiderIsHuman){
                this.player.anims.play('humanWalk', true);
            } else {
                this.player.anims.play('monsterWalk', true);
            }
        } else if(cursors.up.isDown) {
            this.player.body.setVelocityY(-this.VELOCITY);
            if(hiderIsHuman){
                this.player.anims.play('humanWalk', true);
            } else {
                this.player.anims.play('monsterWalk', true);
            }    
        } else if(cursors.down.isDown) {
            this.player.body.setVelocityY(this.VELOCITY);
            if(hiderIsHuman){
                this.player.anims.play('humanWalk', true);
            } else {
                this.player.anims.play('monsterWalk', true);
            }
        } else if (!cursors.right.isDown && !cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            this.player.body.setVelocityX(0);
            this.player.body.setVelocityY(0);
            if(hiderIsHuman){
                this.player.anims.play('humanWalk', false);
            } else {
                this.player.anims.play('monsterWalk', false);
            }
        }

        // iterate through NPCs and check their direction and play animation
        this.npcHumanGroup.getChildren().forEach(function(npc){
            if(!seekerWin && !hiderWin){
                if(npc.body.velocity.x < 0) {
                    npc.flipX = true;
                } else {
                    npc.flipX = false;
                }
                npc.anims.play('walk', true);
                npc.body.collideWorldBounds = true;
                if(Phaser.Geom.Triangle.Contains(this.triangle, npc.x, npc.y)){
                    npc.destroy();
                }
            }
        }, this);

        this.npcMonsterGroup.getChildren().forEach(function(npc){
            if(!seekerWin && !hiderWin){
                if(npc.body.velocity.x < 0) {
                    npc.flipX = true;
                } else {
                    npc.flipX = false;
                }
                npc.anims.play('idle', true);
                npc.body.collideWorldBounds = true;
                if(Phaser.Geom.Triangle.Contains(this.triangle, npc.x, npc.y)){
                    npc.destroy();
                }
            }
        }, this);

        if(Phaser.Geom.Triangle.Contains(this.triangle, this.player.x, this.player.y)){
            this.player.body.setVelocity(0, 0);
            if(cursors.left.isDown) {
                this.player.body.setVelocityX(-this.VELOCITY);
                this.player.flipX = true;
                if(hiderIsHuman){
                    this.player.anims.play('humanWalk', true);
                } else {
                    this.player.anims.play('monsterWalk', true);
                }
            } else if(cursors.down.isDown) {
                this.player.body.setVelocityY(this.VELOCITY);
                if(hiderIsHuman){
                    this.player.anims.play('humanWalk', true);
                } else {
                    this.player.anims.play('monsterWalk', true);
                }
            }
        }

        // if(this.player.x < 780){
        //     if(this.player.y < 10){
        //         this.player.y = game.config.height - 10;
        //     }
        //     if(this.player.y > game.config.height - 9){
        //         this.player.y = 10;
        //     }
        // }

        // only if the startCountdown is zero, the seeker can click on the hider
        if (this.startCountdown == 0){
            this.player.on('pointerdown', () => {this.clickHider()});
        }

        // make all characters wrap when they hit the edge of the screen
        // this.physics.world.wrap(this.player, 0);
        // this.physics.world.wrap(this.npcHumanGroup, 0);
        // this.physics.world.wrap(this.npcMonsterGroup, 0);
        this.player.body.collideWorldBounds = true;
    }

    // function for clicking the hider
    clickHider(){
        if(!hiderWin){
            this.hitSoundChance = Phaser.Math.Between(0,6);
            if (this.hitSoundChance == 1){
                hitSound = this.hitSound1;
            } else if (this.hitSoundChance == 2){
                hitSound = this.hitSound2;
            } else if (this.hitSoundChance == 3){
                hitSound = this.hitSound3;
            } else if (this.hitSoundChance == 4){
                hitSound = this.hitSound4;
            } else {
                hitSound = this.hitSound5;
            }
            this.backgroundChatter.stop();
            if(!this.hitPlayed){
                hitSound.play(hitSoundConfig);
                this.hitPlayed = true;
            }
            
            
            // set seeker win to true
            seekerWin = true;

            // turn off lighting
            this.lights.removeLight(light);
            light = this.lights.addLight(0, 0, 0, this.lightColor);
            this.lights.enable().setAmbientColor(0xFFFFFF);

            this.npcHumanGroup.getChildren().forEach(function(npc){
                npc.body.collideWorldBounds = false;
                npc.setGravityY(250);
            }, this);

            this.npcMonsterGroup.getChildren().forEach(function(npc){
                npc.body.collideWorldBounds = false;
                npc.setGravityY(250);
            }, this);
            
            this.humanPlayerCollider.active = false;
            this.humanCollider.active = false;
            this.monsterPlayerCollider.active = false;
            this.monsterCollider.active = false;
            this.humanMonsterCollider.active = false;
            this.obstacle1MonsterCollider.active = false;
            this.obstacle2HumanCollider.active = false;
            this.obstacle2MonsterCollider.active = false;
            this.obstacle1PlayerCollider.active = false;
            this.obstacle2PlayerCollider.active = false;

            this.time.removeEvent(this.clock);
            // after 5 seconds, show game over screen
            let timer = this.time.delayedCall(5000, () => {this.scene.start('GameOver')}, null, this);
        }
    }

    // function for clicking other than the hider
    clickElse(pointer){
        // this.missSound1 = this.sound.add('missSound1');
        
        // let missSoundConfig = {
        //         mute: false,
        //         volume: 0.25,
        //         rate: 1,
        //         detune: 0,
        //         seek: 0,
        //         loop: false,
        //         delay: 0
        // }
        // this.soundChance = Math.ceil(Math.random() * 3);
        this.soundChance = Phaser.Math.Between(0,4);
        if (this.soundChance == 1){
            missSound = this.missSound1;
            // this.missSound1.play(missSoundConfig);
        } else if (this.soundChance == 2){
            missSound = this.missSound2;
            // this.missSound2.play(missSoundConfig);
        } else {
            missSound = this.missSound3;
            // this.missSound3.play(missSoundConfig);
        }
        // before playing sound, check if the pointer is on the hider
        if(!(this.player.getBounds().contains(pointer.x, pointer.y))){
            this.lights.removeLight(light);
            this.lightRadius -= 7;
            light = this.lights.addLight(pointer.x, pointer.y, this.lightRadius, this.lightColor);
            missSound.play(missSoundConfig);
        }
    }

    counter(){
        this.startTimer++;
        this.startCountdown--;
    }
};

