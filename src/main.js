import Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import HowToPlayScene from './scenes/HowToPlayScene';
import SettingsScene from './scenes/SettingsScene';

window.addEventListener('load', () => {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game',
        backgroundColor: '#000033',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [PreloadScene, MenuScene, GameScene, HowToPlayScene, SettingsScene]
    };

    try {
        const game = new Phaser.Game(config);
        console.log('Gra została zainicjalizowana');
    } catch (error) {
        console.error('Błąd podczas inicjalizacji gry:', error);
    }
}); 