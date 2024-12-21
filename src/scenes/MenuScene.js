export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Pobieramy wymiary gry
        const width = this.scale.width;
        const height = this.scale.height;

        // Tło
        this.add.rectangle(width/2, height/2, width, height, 0x000000);

        // Tytuł gry
        const titleText = this.add.text(width/2, height * 0.25, 'Coin Collector', {
            fontSize: Math.min(width/12, 64) + 'px',
            fill: '#fff',
            align: 'center'
        });
        titleText.setOrigin(0.5);

        // Przyciski menu
        const buttonConfigs = [
            { y: 0.55, text: 'START', color: 0x00ff00, scene: 'GameScene' },
            { y: 0.70, text: 'JAK GRAĆ', color: 0x0000ff, scene: 'HowToPlayScene' }
        ];

        buttonConfigs.forEach(config => {
            const button = this.add.rectangle(
                width/2, 
                height * config.y, 
                width * 0.25, 
                height * 0.08, 
                config.color
            );
            button.setInteractive();

            const text = this.add.text(width/2, height * config.y, config.text, {
                fontSize: Math.min(width/24, 32) + 'px',
                fill: config.color === 0x00ff00 ? '#000' : '#fff',
                align: 'center'
            });
            text.setOrigin(0.5);

            // Efekty hover
            button.on('pointerover', () => {
                button.setFillStyle(config.color === 0x00ff00 ? 0x00dd00 : 0x0000dd);
                text.setScale(1.1);
            });

            button.on('pointerout', () => {
                button.setFillStyle(config.color);
                text.setScale(1);
            });

            button.on('pointerdown', () => {
                this.scene.start(config.scene);
            });
        });
    }
} 