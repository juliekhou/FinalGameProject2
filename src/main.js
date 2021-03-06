/**
 * Collaborator Names: Anika Mahajan, Julie Khou, Justin Beedle
 * Project Name: Fright Night
 * Date: 06/03/2022
*/

// object containing game configuration options
let gameConfig = {
    type: Phaser.WEBGL,
    width: 1280,
    height: 720,
    scene: [Menu, Tutorial, Credits, SelectCharacter, Spawn, Play, GameOver],
    backgroundColor: 0x444444,

    // physics settings
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                x: 0,
                y: 0
            }
        }
    }
}

// create new game
let game = new Phaser.Game(gameConfig);

// global variables
let cursors;
// player score declaration
let timeLeft;
// state variable declaration
let hiderWin, seekerWin;
// light variable declaration
let light;
// hider character variable declaration
let hiderIsHuman;
// hider spawn point variable declaration
let hiderX, hiderY;
// hider miss sound
let missSound;
let missSoundConfig;
// hider hit sound
let hitSound;
let hitSoundConfig;