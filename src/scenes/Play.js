class Play extends Phaser.Scene{
    constructor(){
        super("Play");
    }

    preload(){
         
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

        // from https://phaser.io/examples/v3/view/actions/place-on-triangle
        this.triangle = new Phaser.Geom.Triangle.BuildRight(1300, -10, -490, -610);

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
            this.player = this.physics.add.sprite(hiderX, hiderY, 'npc_atlas').setScale(this.AVATAR_SCALE).setOrigin(0, 0).setInteractive();
        } else {
            this.player = this.physics.add.sprite(hiderX, hiderY, 'monsterNPC').setScale(this.MONSTER_SCALE).setOrigin(0, 0).setInteractive();
        }
        
        // add hider interactibility 
        this.player.on('pointerdown', () => {this.clickHider()});
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
        for(let x = 0; x < 40; x++){
            this.addNPC("npc_atlas", "player1", true, this.AVATAR_SCALE);
        }
        
        // adding monster NPCs
        for(let y = 0; y < 40; y++){
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

        // adding collisions 
        this.physics.add.collider(this.npcHumanGroup, this.player, (npc)=> {this.collide(npc)});
        this.physics.add.collider(this.npcHumanGroup);
        this.physics.add.collider(this.npcMonsterGroup, this.player, (npc)=> {this.collide(npc)});
        this.physics.add.collider(this.npcMonsterGroup);
        this.physics.add.collider(this.npcHumanGroup, this.npcMonsterGroup);

        // display clock
        let clockConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#A9DEF9',
            color: '#EDE7B1',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        // clock
        this.clockRight = this.add.text(0, 50, 0, clockConfig);
        // 30-second play clock
        this.timer = game.settings.gameTimer;
        this.clock = this.time.addEvent({delay: 1000, callback: () => {this.timer -= 1000;}, callbackScope: this, loop: true});

        // lighting
        // ambient lighting
        this.lights.enable().setAmbientColor(0x161616);

        // point light that follows cursor
        light = this.lights.addLight(0, 0, 200);
        this.input.on('pointermove', function (pointer) {
            light.x = pointer.x;
            light.y = pointer.y;
        });
    }

    // function for adding NPC with randomized velocity and start position
    addNPC(texture, frame, isHuman, scale){
        // set random starting x and y positions for NPC
        let xPosition = Math.ceil(Math.random() * 1270);
        let yPosition = Math.ceil(Math.random() * 710);

        while(Phaser.Geom.Triangle.Contains(this.triangle, xPosition, yPosition)){
            xPosition = Math.ceil(Math.random() * 1270);
            yPosition = Math.ceil(Math.random() * 710);
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

    update(){
        // display timer and check if it is done
        if(!(this.timer < 0)){
            this.clockRight.setText(this.timer/1000);
        } else {
            // set hider win to true
            hiderWin = true;
            // load miss sound1
            this.missSound1 = this.sound.add('missSound1');
            let missSoundConfig = {
                mute: false,
                volume: 0.25,
                rate: 1,
                detune: 0,
                seek: 0,
                loop: false,
                delay: 0
            }
            this.backgroundChatter.stop();
            this.missSound1.play(missSoundConfig);
            this.scene.start('GameOver');
        }

        // check keyboard input
        if(cursors.left.isDown) {
            this.player.body.setVelocityX(-this.VELOCITY);
            this.player.flipX = true;
            if(hiderIsHuman){
                this.player.anims.play('walk', true);
            } else {
                this.player.anims.play('idle', true);
            }
        } else if(cursors.right.isDown) {
            this.player.body.setVelocityX(this.VELOCITY);
            this.player.flipX = false;
            if(hiderIsHuman){
                this.player.anims.play('walk', true);
            } else {
                this.player.anims.play('idle', true);
            }
        } else if(cursors.up.isDown) {
            this.player.body.setVelocityY(-this.VELOCITY);
            if(hiderIsHuman){
                this.player.anims.play('walk', true);
            } else {
                this.player.anims.play('idle', true);
            }    
        } else if(cursors.down.isDown) {
            this.player.body.setVelocityY(this.VELOCITY);
            if(hiderIsHuman){
                this.player.anims.play('walk', true);
            } else {
                this.player.anims.play('idle', true);
            }
        } else if (!cursors.right.isDown && !cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            this.player.body.setVelocityX(0);
            this.player.body.setVelocityY(0);
            if(hiderIsHuman){
                this.player.anims.play('walk', false);
            } else {
                this.player.anims.play('idle', false);
            }
        }

        // iterate through NPCs and check their direction and play animation
        this.npcHumanGroup.getChildren().forEach(function(npc){
            if(npc.body.velocity.x < 0) {
                npc.flipX = true;
            } else {
                npc.flipX = false;
            }
            npc.anims.play('walk', true);
            npc.body.collideWorldBounds = true;
            if(Phaser.Geom.Triangle.Contains(this.triangle, npc.x, npc.y)){
                // npc.setVelocity(-1*npc.body.velocity.x, -1*npc.body.velocity.y).setBounce(1,1);
                
                //console.log(npc.getFrame());
                npc.destroy();
                //this.addNPC('npc_atlas', 'player1', true, this.AVATAR_SCALE);
            }
            
        }, this);

        this.npcMonsterGroup.getChildren().forEach(function(npc){
            if(npc.body.velocity.x < 0) {
                npc.flipX = true;
            } else {
                npc.flipX = false;
            }
            npc.anims.play('idle', true);
            npc.body.collideWorldBounds = true;
            if(Phaser.Geom.Triangle.Contains(this.triangle, npc.x, npc.y)){
                //console.log(npc.getFrame());
                npc.destroy();
                //this.addNPC('monsterNPC', 0, false, this.MONSTER_SCALE);
            }
            
        }, this);

        // if(Phaser.Geom.Triangle.Contains(this.triangle, this.player.x, this.player.y)){
        //     this.player.x = 10;
        // }

        // make all characters wrap when they hit the edge of the screen
        // this.physics.world.wrap(this.player, 0);
        // this.physics.world.wrap(this.npcHumanGroup, 0);
        // this.physics.world.wrap(this.npcMonsterGroup, 0);
        this.player.body.collideWorldBounds = true;
        
    }

    // function for clicking the hider
    clickHider(){
        // load hit sound1
        this.hitSound1 = this.sound.add('hitSound1');
        let hitSoundConfig = {
            mute: false,
            volume: 0.25,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        this.backgroundChatter.stop();
        this.hitSound1.play(hitSoundConfig);
        this.scene.start('GameOver');
        // set seeker win to true
        seekerWin = true;
    }

    // function for clicking other than the hider
    clickElse(pointer){
        this.missSound1 = this.sound.add('missSound1');
        let missSoundConfig = {
                mute: false,
                volume: 0.25,
                rate: 1,
                detune: 0,
                seek: 0,
                loop: false,
                delay: 0
        }
        // before playing sound, check if the pointer is on the hider
        if(!(this.player.getBounds().contains(pointer.x, pointer.y))){
            this.missSound1.play(missSoundConfig);
        }
    }
};

