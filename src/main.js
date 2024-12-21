import Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import HowToPlayScene from './scenes/HowToPlayScene';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game',
        width: '100%',
        height: '100%',
        min: {
            width: 480,
            height: 320
        },
        max: {
            width: 1920,
            height: 1080
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [PreloadScene, MenuScene, GameScene, HowToPlayScene]
};

// Nasłuchiwanie zmiany rozmiaru okna
window.addEventListener('resize', () => {
    game.scale.refresh();
});

const game = new Phaser.Game(config); 