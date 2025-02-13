import { translations, getCurrentLanguage } from '../translations';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.score = 0;
        this.coins = 0;
        this.level = 1;
        this.playerPosition = 1; // 0-lewa, 1-środek, 2-prawa
        this.isGameOver = false; // Dodajemy flagę game over
        this.isMoving = false; // Flaga do kontroli ruchu
    }

    create() {
        this.isGameOver = false; // Resetujemy flagę przy starcie gry
        this.currentLang = getCurrentLanguage();
        
        // Definiujemy pozycje torów
        this.lanes = [200, 400, 600];
        
        // Tworzymy gracza
        this.player = this.add.sprite(this.lanes[1], 500, 'player0');
        this.player.setScale(0.8);
        
        // Dodajemy fizykę do gracza
        this.physics.add.existing(this.player);
        
        // Tworzymy animację postaci
        this.anims.create({
            key: 'run',
            frames: [
                { key: 'player0' },
                { key: 'player1' },
                { key: 'player2' },
                { key: 'player1' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // Uruchamiamy animację biegu
        this.player.play('run');
        
        // Dodajemy teksty
        this.scoreText = this.add.text(16, 16, `${translations[this.currentLang].score}: ${this.score}`, {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        });

        this.coinsText = this.add.text(16, 56, `${translations[this.currentLang].coins}: ${this.coins}`, {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        });

        this.levelText = this.add.text(16, 96, `${translations[this.currentLang].level}: ${this.level}`, {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        });

        // Dodajemy obsługę klawiatury
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Tworzymy grupę dla przeszkód
        this.obstacles = this.physics.add.group();
        
        // Tworzymy grupę dla monet
        this.coinGroup = this.physics.add.group();
        
        // Dodajemy kolizje
        this.physics.add.overlap(this.player, this.obstacles, this.gameOver, null, this);
        this.physics.add.overlap(this.player, this.coinGroup, this.collectCoin, null, this);
        
        // Timer do generowania przeszkód
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });
        
        // Timer do generowania monet
        this.time.addEvent({
            delay: 3000,
            callback: this.spawnCoin,
            callbackScope: this,
            loop: true
        });
        
        // Timer do aktualizacji wyniku
        this.time.addEvent({
            delay: 1000,
            callback: this.updateScore,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (!this.isMoving) {
            // Obsługa ruchu gracza
            if (Phaser.Input.Keyboard.JustDown(this.cursors.left) && this.playerPosition > 0) {
                this.movePlayer('left');
            }
            else if (Phaser.Input.Keyboard.JustDown(this.cursors.right) && this.playerPosition < 2) {
                this.movePlayer('right');
            }
        }
        
        // Usuwanie obiektów poza ekranem
        this.obstacles.getChildren().forEach(obstacle => {
            if (obstacle.y > 600) {
                obstacle.destroy();
            }
        });
        
        this.coinGroup.getChildren().forEach(coin => {
            if (coin.y > 600) {
                coin.destroy();
            }
        });
    }

    spawnObstacle() {
        const lane = Phaser.Math.Between(0, 2);
        const obstacle = this.obstacles.create(this.lanes[lane], -50, 'obstacle');
        obstacle.setVelocityY(200 + (this.level * 20));
    }

    spawnCoin() {
        const lane = Phaser.Math.Between(0, 2);
        const coin = this.coinGroup.create(this.lanes[lane], -50, 'coin');
        coin.setVelocityY(150 + (this.level * 10));
    }

    collectCoin(player, coin) {
        coin.destroy();
        this.coins++;
        this.coinsText.setText(`${translations[this.currentLang].coins}: ${this.coins}`);
    }

    updateScore() {
        if (this.isGameOver) return; // Przerywamy aktualizację jeśli gra skończona
        
        this.score += 10;
        this.scoreText.setText(`${translations[this.currentLang].score}: ${this.score}`);
        
        // Aktualizacja poziomu
        const newLevel = Math.floor(this.score / 100) + 1;
        if (newLevel !== this.level) {
            this.level = newLevel;
            this.levelText.setText(`${translations[this.currentLang].level}: ${this.level}`);
        }
    }

    gameOver() {
        if (this.isGameOver) return;
        
        this.isGameOver = true;
        this.physics.pause();
        this.time.removeAllEvents();

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Przyciemnienie tła
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

        // Kontener dla menu game over
        const menuContainer = this.add.container(width / 2, height / 2 - 50);
        
        // Tło menu (zaokrąglony prostokąt)
        const menuBg = this.add.graphics();
        const menuWidth = 400;
        const menuHeight = 400;
        const cornerRadius = 20;
        
        // Efekt świecenia dla tła
        for (let i = 0; i < 3; i++) {
            menuBg.lineStyle(2, 0xff0000, 0.3 - (i * 0.1));
            menuBg.fillStyle(0x000066, 0.7 - (i * 0.1));
            menuBg.fillRoundedRect(
                -menuWidth/2 - (i * 2), 
                -menuHeight/2 - (i * 2), 
                menuWidth + (i * 4), 
                menuHeight + (i * 4), 
                cornerRadius + (i * 2)
            );
            menuBg.strokeRoundedRect(
                -menuWidth/2 - (i * 2), 
                -menuHeight/2 - (i * 2), 
                menuWidth + (i * 4), 
                menuHeight + (i * 4), 
                cornerRadius + (i * 2)
            );
        }

        menuContainer.add(menuBg);

        // Tekst GAME OVER z efektem
        const gameOverText = this.add.text(0, -120, translations[this.currentLang].gameOver, {
            fontSize: '64px',
            fill: '#ff0000',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Dodajmy też animację pulsowania dla tekstu GAME OVER
        this.tweens.add({
            targets: gameOverText,
            y: gameOverText.y + 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut'
        });
        
        // Wynik końcowy
        const finalScoreText = this.add.text(0, -20, `${translations[this.currentLang].score}: ${this.score}`, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Righteous'
        }).setOrigin(0.5);

        // Zebrane monety
        const finalCoinsText = this.add.text(0, 30, `${translations[this.currentLang].coins}: ${this.coins}`, {
            fontSize: '32px',
            fill: '#FFD700',
            fontFamily: 'Righteous'
        }).setOrigin(0.5);

        menuContainer.add([gameOverText, finalScoreText, finalCoinsText]);

        // Przyciski
        const buttonConfigs = [
            { text: translations[this.currentLang].restart, y: 100, action: () => this.scene.restart() },
            { text: translations[this.currentLang].menu, y: 170, action: () => this.scene.start('MenuScene') }
        ];

        buttonConfigs.forEach(config => {
            const button = this.createGameOverButton(0, config.y, config.text, config.action);
            menuContainer.add(button);
        });

        // Animacja wejścia menu
        menuContainer.setScale(0.8);
        menuContainer.alpha = 0;
        this.tweens.add({
            targets: menuContainer,
            scale: 1,
            alpha: 1,
            duration: 500,
            ease: 'Back.out'
        });
    }

    createGameOverButton(x, y, text, callback) {
        const buttonWidth = 240;
        const buttonHeight = 50;
        const button = this.add.container(x, y);

        // Tło przycisku
        const buttonBg = this.add.graphics();
        const buttonColor = 0x3498db;
        const fillColor = 0x000099;

        // Efekt świecenia
        for (let i = 0; i < 3; i++) {
            buttonBg.lineStyle(2, buttonColor, 0.3 - (i * 0.1));
            buttonBg.fillStyle(fillColor, 0.7 - (i * 0.1));
            buttonBg.fillRoundedRect(
                -buttonWidth/2 - (i * 2),
                -buttonHeight/2 - (i * 2),
                buttonWidth + (i * 4),
                buttonHeight + (i * 4),
                10 + (i * 2)
            );
        }

        // Główne tło przycisku
        buttonBg.lineStyle(2, buttonColor);
        buttonBg.fillStyle(fillColor, 0.8);
        buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 10);
        buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 10);

        // Tekst przycisku
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Righteous'
        }).setOrigin(0.5);

        button.add([buttonBg, buttonText]);
        button.setInteractive(new Phaser.Geom.Rectangle(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

        // Efekty hover
        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
            buttonText.setStyle({ fill: '#FFD700' });
        });

        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
            buttonText.setStyle({ fill: '#ffffff' });
        });

        button.on('pointerdown', callback);

        return button;
    }

    movePlayer(direction) {
        if (this.isMoving || this.isGameOver) return;

        this.isMoving = true;
        const newPosition = direction === 'left' ? this.playerPosition - 1 : this.playerPosition + 1;
        const targetX = this.lanes[newPosition];

        // Obracamy postać w kierunku ruchu
        this.player.scaleX = direction === 'left' ? -0.8 : 0.8;

        // Animacja przejścia
        this.tweens.add({
            targets: this.player,
            x: targetX,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                this.isMoving = false;
                this.player.scaleX = 0.8; // Przywracamy normalną orientację
                this.playerPosition = newPosition;
            }
        });
    }
} 