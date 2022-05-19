// NPC Prefab
class NPC extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, isHuman, scale) {
        super(scene, x, y, texture);
        scene.physics.add.existing(this); // add to physics
        scene.add.existing(this);   // add to existing scene
        this.texture = texture;
        this.frame = frame;
        this.isHuman = isHuman;
        this.scale = scale;
    }

    getTexture(){
        return this.texture;
    }

    getFrame(){
        return this.frame;
    }

    getIsHuman(){
        return this.isHuman;
    }

    getScale(){
        return this.scale;
    }
}