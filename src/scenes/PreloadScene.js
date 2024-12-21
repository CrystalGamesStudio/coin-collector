export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Tło ekranu ładowania
        this.add.rectangle(width/2, height/2, width, height, 0x000000);

        // Tekst "Ładowanie"
        const loadingText = this.add.text(width/2, height * 0.45, 'Ładowanie...', {
            fontSize: Math.min(width/20, 32) + 'px',
            fill: '#fff',
            align: 'center'
        });
        loadingText.setOrigin(0.5);

        // Pasek postępu
        const progressBox = this.add.rectangle(
            width/2,
            height * 0.55,
            width * 0.5,
            height * 0.05,
            0x222222
        );

        const progressBar = this.add.rectangle(
            width/2 - (width * 0.5)/2,
            height * 0.55,
            0,
            height * 0.05,
            0x00ff00
        );
        progressBar.setOrigin(0, 0.5);

        // Nasłuchiwanie postępu ładowania
        this.load.on('progress', (value) => {
            progressBar.width = (width * 0.5) * value;
        });

        // Po zakończeniu ładowania
        this.load.on('complete', () => {
            // Efekt znikania elementów ładowania
            this.tweens.add({
                targets: [loadingText, progressBox, progressBar],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    this.createTempTextures();
                    this.createAnimations();
                    this.scene.start('MenuScene');
                }
            });
        });

        // Ładowanie assetów
        try {
            this.load.spritesheet('player', 'assets/player.png', {
                frameWidth: 64,
                frameHeight: 64
            });

            this.load.spritesheet('obstacle', 'assets/obstacle.png', {
                frameWidth: 64,
                frameHeight: 64
            });

            this.load.spritesheet('explosion', 'assets/explosion.png', {
                frameWidth: 64,
                frameHeight: 64
            });
        } catch (error) {
            console.log('Nie można załadować sprite\'ów, używam tekstur tymczasowych');
        }
    }

    createTempTextures() {
        // Tworzymy tymczasową teksturę dla gracza
        const graphics = this.add.graphics();
        
        // Tekstura gracza (zielony kwadrat)
        graphics.fillStyle(0x00ff00);
        graphics.fillRect(0, 0, 64, 64);
        graphics.generateTexture('player', 64, 64);
        graphics.clear();

        // Tekstura przeszkody (czerwony kwadrat)
        graphics.fillStyle(0xff0000);
        graphics.fillRect(0, 0, 64, 64);
        graphics.generateTexture('obstacle', 64, 64);
        graphics.clear();

        // Tekstura eksplozji (żółty kwadrat)
        graphics.fillStyle(0xffff00);
        graphics.fillRect(0, 0, 64, 64);
        graphics.generateTexture('explosion', 64, 64);
        graphics.clear();

        graphics.destroy();
    }

    createAnimations() {
        // Przenosimy tworzenie animacji do osobnej metody
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'move',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'obstacle-anim',
            frames: [{ key: 'obstacle', frame: 0 }],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'explode',
            frames: [{ key: 'explosion', frame: 0 }],
            frameRate: 10,
            repeat: 0
        });
    }
} 