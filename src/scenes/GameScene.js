export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.level = 1;
        this.gameTime = 0;
        this.isGameOver = false;
        this.playerSpeed = 400; // Prędkość poruszania się gracza
        
        // Definiujemy progi punktowe dla kolejnych poziomów
        this.levelThresholds = [
            0, 50, 100, 200, 350, 550, 800, 1000
        ];
    }

    create() {
        // Resetujemy stan gry
        this.isGameOver = false;
        this.score = 0;
        this.level = 1;
        this.gameTime = 0;
        
        const width = this.scale.width;
        const height = this.scale.height;

        // Ustawiamy granice świata gry
        this.physics.world.setBounds(0, 0, width, height);

        // Tło
        this.add.rectangle(width/2, height/2, width, height, 0x000000);

        // Gracz
        this.player = this.add.sprite(width/2, height * 0.8, 'player');
        this.player.setScale(Math.min(width/800, height/600) * 0.6);
        this.physics.add.existing(this.player, false);
        
        // Ustawiamy granice dla gracza
        this.player.body.setCollideWorldBounds(true);

        // Grupa dla przeszkód
        this.obstacles = this.physics.add.group();

        // Tekst wyników
        this.scoreText = this.add.text(width * 0.05, height * 0.05, 'Wynik: 0', { 
            fontSize: Math.min(width/20, 32) + 'px',
            fill: '#fff' 
        });
        
        this.levelText = this.add.text(width * 0.05, height * 0.1, 'Poziom: 1', { 
            fontSize: Math.min(width/20, 32) + 'px',
            fill: '#fff' 
        });

        // Obsługa klawiszy
        this.cursors = this.input.keyboard.createCursorKeys();

        // Timer do generowania przeszkód
        this.obstacleTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });

        // Timer do aktualizacji poziomu
        this.levelTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateGameTime,
            callbackScope: this,
            loop: true
        });

        // Dodajemy kolizję między graczem a przeszkodami
        this.physics.add.overlap(
            this.player,
            this.obstacles,
            this.handleCollision,
            null,
            this
        );

        // Tekst Game Over (początkowo niewidoczny)
        this.gameOverText = this.add.text(400, 200, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            align: 'center'
        });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setAlpha(0);
        this.gameOverText.setVisible(false);
        this.gameOverText.setDepth(2);

        // Wynik końcowy
        this.finalScoreText = this.add.text(400, 280, '', {
            fontSize: '32px',
            fill: '#fff',
            align: 'center'
        });
        this.finalScoreText.setOrigin(0.5);
        this.finalScoreText.setAlpha(0);
        this.finalScoreText.setVisible(false);
        this.finalScoreText.setDepth(2);

        // Przyciski menu
        this.restartButton = this.add.rectangle(400, 360, 200, 50, 0x00ff00);
        this.restartButton.setInteractive();
        this.restartButton.setAlpha(0);
        this.restartButton.setVisible(false);
        this.restartButton.setDepth(2);

        this.restartText = this.add.text(400, 360, 'Zacznij od nowa', {
            fontSize: '24px',
            fill: '#000'
        });
        this.restartText.setOrigin(0.5);
        this.restartText.setAlpha(0);
        this.restartText.setVisible(false);
        this.restartText.setDepth(2);
        
        this.menuButton = this.add.rectangle(400, 430, 200, 50, 0x0000ff);
        this.menuButton.setInteractive();
        this.menuButton.setAlpha(0);
        this.menuButton.setVisible(false);
        this.menuButton.setDepth(2);

        this.menuText = this.add.text(400, 430, 'Ekran główny', {
            fontSize: '24px',
            fill: '#fff'
        });
        this.menuText.setOrigin(0.5);
        this.menuText.setAlpha(0);
        this.menuText.setVisible(false);
        this.menuText.setDepth(2);

        // Dodajemy efekty hover dla przycisków
        this.restartButton.on('pointerover', () => {
            this.restartButton.setFillStyle(0x00dd00);
        });
        this.restartButton.on('pointerout', () => {
            this.restartButton.setFillStyle(0x00ff00);
        });

        this.menuButton.on('pointerover', () => {
            this.menuButton.setFillStyle(0x0000dd);
        });
        this.menuButton.on('pointerout', () => {
            this.menuButton.setFillStyle(0x0000ff);
        });

        // Dodajemy obsługę kliknięć
        this.restartButton.on('pointerdown', () => {
            this.scene.restart();
        });

        this.menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    handleCollision(player, obstacle) {
        if (!this.isGameOver) {
            this.isGameOver = true;
            
            const width = this.scale.width;
            const height = this.scale.height;

            // Zatrzymujemy timery
            this.obstacleTimer.remove();
            this.levelTimer.remove();

            // Zatrzymujemy wszystkie przeszkody
            this.obstacles.children.each(function(obstacle) {
                obstacle.body.setVelocity(0);
            });

            // Efekt eksplozji
            const explosion = this.add.sprite(player.x, player.y, 'explosion');
            explosion.play('explode');
            
            // Ukrywamy gracza
            player.setVisible(false);

            // Dodajemy efekt przyciemnienia tła
            const overlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.7);
            overlay.setDepth(1);

            // Aktualizujemy pozycje i rozmiary elementów game over
            this.gameOverText.setPosition(width/2, height * 0.3);
            this.gameOverText.setFontSize(Math.min(width/12, 64) + 'px');
            this.gameOverText.setDepth(2);
            this.gameOverText.setVisible(true);

            this.finalScoreText.setPosition(width/2, height * 0.4);
            this.finalScoreText.setFontSize(Math.min(width/20, 32) + 'px');
            this.finalScoreText.setText(`Wynik końcowy: ${this.score}`);
            this.finalScoreText.setDepth(2);
            this.finalScoreText.setVisible(true);

            // Przyciski
            const buttonWidth = width * 0.25;
            const buttonHeight = height * 0.08;

            // Przycisk restartu
            this.restartButton.setPosition(width/2, height * 0.55);
            this.restartButton.setSize(buttonWidth, buttonHeight);
            this.restartButton.setDepth(2);
            this.restartButton.setVisible(true);

            this.restartText.setPosition(width/2, height * 0.55);
            this.restartText.setFontSize(Math.min(width/24, 32) + 'px');
            this.restartText.setDepth(2);
            this.restartText.setVisible(true);

            // Przycisk menu
            this.menuButton.setPosition(width/2, height * 0.7);
            this.menuButton.setSize(buttonWidth, buttonHeight);
            this.menuButton.setDepth(2);
            this.menuButton.setVisible(true);

            this.menuText.setPosition(width/2, height * 0.7);
            this.menuText.setFontSize(Math.min(width/24, 32) + 'px');
            this.menuText.setDepth(2);
            this.menuText.setVisible(true);

            // Animacje wejścia
            this.tweens.add({
                targets: [this.gameOverText, this.finalScoreText],
                y: '-=50',
                alpha: { from: 0, to: 1 },
                duration: 1000,
                ease: 'Power2'
            });

            this.tweens.add({
                targets: [this.restartButton, this.restartText, this.menuButton, this.menuText],
                y: '-=50',
                alpha: { from: 0, to: 1 },
                duration: 1000,
                delay: 500,
                ease: 'Power2'
            });
        }
    }

    update() {
        if (this.isGameOver) return;

        // Obsługa ruchu gracza
        const speed = this.playerSpeed + (this.level * 50); // Zwiększamy prędkość z poziomem

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-speed);
            this.player.setFlipX(true);
            if (!this.player.anims.isPlaying) this.player.play('move');
        }
        else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
            this.player.setFlipX(false);
            if (!this.player.anims.isPlaying) this.player.play('move');
        }
        else {
            this.player.body.setVelocityX(0);
            if (this.player.anims.getName() !== 'idle') this.player.play('idle');
        }

        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-speed);
            if (!this.player.anims.isPlaying) this.player.play('move');
        }
        else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(speed);
            if (!this.player.anims.isPlaying) this.player.play('move');
        }
        else {
            this.player.body.setVelocityY(0);
        }

        // Normalizacja prędkości przy ruchu po przekątnej
        this.player.body.velocity.normalize().scale(speed);
    }

    spawnObstacle() {
        const width = this.scale.width;
        const height = this.scale.height;
        
        // Losowa pozycja startowa na górze ekranu
        const randomX = Phaser.Math.Between(width * 0.1, width * 0.9);
        const obstacle = this.add.sprite(randomX, -height * 0.05, 'obstacle');
        
        // Skalowanie przeszkody
        const scale = Math.min(width/800, height/600) * (0.5 + (this.level * 0.05));
        obstacle.setScale(Math.min(scale, 0.9));
        
        this.physics.add.existing(obstacle);
        this.obstacles.add(obstacle);

        // Animacja przeszkody
        obstacle.play('obstacle-anim');

        // Prędkość zależna od poziomu - tylko w dół
        const speed = height * 0.3 + (this.level * height * 0.05);
        obstacle.body.setVelocityY(speed);

        // Efekt wejścia
        obstacle.setAlpha(0);
        this.tweens.add({
            targets: obstacle,
            alpha: 1,
            duration: 200
        });

        // Automatyczne zniszczenie po wyjściu poza ekran
        this.time.delayedCall(10000, () => {
            if (obstacle && !obstacle.destroyed) {
                obstacle.destroy();
            }
        });
    }

    updateGameTime() {
        if (this.isGameOver) return;
        
        this.gameTime++;
        this.score += 10;
        
        // Sprawdzamy czy należy zwiększyć poziom
        const newLevel = this.calculateLevel(this.score);
        
        if (newLevel !== this.level) {
            this.level = newLevel;
            this.handleLevelUp();
        }
        
        this.levelText.setText('Poziom: ' + this.level);
        this.scoreText.setText('Wynik: ' + this.score);
    }

    calculateLevel(score) {
        for (let i = this.levelThresholds.length - 1; i >= 0; i--) {
            if (score >= this.levelThresholds[i]) {
                return i + 1;
            }
        }
        return 1;
    }

    handleLevelUp() {
        // Efekt wizualny przy wbiciu nowego poziomu
        const levelUpText = this.add.text(400, 300, 'Poziom ' + this.level + '!', {
            fontSize: '64px',
            fill: '#ffff00',
            align: 'center'
        });
        levelUpText.setOrigin(0.5);

        // Animacja tekstu
        this.tweens.add({
            targets: levelUpText,
            y: 200,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                levelUpText.destroy();
            }
        });

        // Dostosowujemy parametry gry dla nowego poziomu
        this.adjustGameDifficulty();
    }

    adjustGameDifficulty() {
        // Dostosowujemy częstotliwość pojawiania się przeszkód
        this.obstacleTimer.remove();
        
        const newDelay = Math.max(2000 - (this.level * 200), 500); // Min 500ms
        
        this.obstacleTimer = this.time.addEvent({
            delay: newDelay,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });
    }
} 