import { translations, getCurrentLanguage } from '../translations';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
        this.loadingText = null;
        this.errorText = null;
        this.retryButton = null;
        this.progress = 0;
    }

    init() {
        this.currentLang = getCurrentLanguage();
    }

    preload() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Tło ekranu ładowania
        this.add.rectangle(0, 0, width, height, 0x000033).setOrigin(0);

        // Tekst ładowania
        this.loadingText = this.add.text(width / 2, height / 2, 'Initializing game...', {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Righteous',
            shadow: { color: '#000000', blur: 2, fill: true }
        }).setOrigin(0.5);

        // Kontener paska postępu
        this.progressBox = this.add.graphics();
        this.progressBar = this.add.graphics();
        
        // Tło paska postępu
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRoundedRect(width / 4, height / 2 + 40, width / 2, 30, 15);

        // Lista zadań do załadowania
        const tasks = [
            { name: 'Initializing engine...', duration: 500 },
            { name: 'Loading textures...', duration: 800 },
            { name: 'Preparing sounds...', duration: 600 },
            { name: 'Game configuration...', duration: 700 },
            { name: 'Finalizing...', duration: 400 }
        ];

        this.startLoading(tasks);
    }

    startLoading(tasks) {
        let currentTask = 0;
        const totalTasks = tasks.length;
        
        const processTask = () => {
            if (currentTask >= totalTasks) {
                this.finishLoading();
                return;
            }

            const task = tasks[currentTask];
            this.loadingText.setText(task.name);

            // Symulacja postępu dla bieżącego zadania
            let taskProgress = 0;
            const taskInterval = 50; // Zwiększamy interwał dla lepszej widoczności
            const taskSteps = task.duration / taskInterval;
            const progressPerStep = (1 / totalTasks) / taskSteps;

            const taskTimer = this.time.addEvent({
                delay: taskInterval,
                callback: () => {
                    taskProgress++;
                    this.progress += progressPerStep;
                    this.updateProgressBar();

                    if (taskProgress >= taskSteps) {
                        currentTask++;
                        processTask();
                    }
                },
                repeat: taskSteps - 1
            });
        };

        processTask();
    }

    updateProgressBar() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Czyścimy poprzedni stan paska
        this.progressBar.clear();

        // Główny pasek postępu
        this.progressBar.fillStyle(0x00ff00, 1);
        this.progressBar.fillRoundedRect(
            width / 4 + 5,
            height / 2 + 45,
            (width / 2 - 10) * this.progress,
            20,
            10
        );

        // Efekt świecenia na końcu paska
        if (this.progress > 0) {
            const progressEndX = width / 4 + 5 + (width / 2 - 10) * this.progress;
            
            // Jasny punkt na końcu paska
            this.progressBar.fillStyle(0xffffff, 0.5);
            this.progressBar.fillCircle(
                progressEndX,
                height / 2 + 55,
                10
            );

            // Dodatkowy efekt świecenia
            for (let i = 0; i < 3; i++) {
                const alpha = 0.2 - (i * 0.05);
                this.progressBar.fillStyle(0x00ff00, alpha);
                this.progressBar.fillCircle(
                    progressEndX,
                    height / 2 + 55,
                    12 + (i * 4)
                );
            }
        }

        // Aktualizacja procentów
        const percent = Math.floor(this.progress * 100);
        if (this.percentText) {
            this.percentText.destroy();
        }
        this.percentText = this.add.text(
            width / 2,
            height / 2 + 100,
            `${percent}%`,
            {
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Righteous'
            }
        ).setOrigin(0.5);
    }

    finishLoading() {
        try {
            this.createGameTextures();
            this.loadingText.setText('Game ready!');
            this.loadingText.setStyle({ fill: '#00ff00' });
            
            // Animacja pulsowania tekstu "Game ready!" bez efektu błysku
            this.tweens.add({
                targets: this.loadingText,
                scale: 1.2,
                duration: 200,
                yoyo: true,
                repeat: 2,
                ease: 'Quad.easeInOut',
                onComplete: () => {
                    this.time.delayedCall(500, () => {
                        this.scene.start('MenuScene');
                    });
                }
            });
        } catch (error) {
            console.error('Error during initialization:', error);
            this.showError('Failed to load the game. Please try again.');
        }
    }

    createGameTextures() {
        const graphics = this.add.graphics();
        
        try {
            // Gracz - klatki animacji
            const frames = [];
            const colors = [0x3498db, 0x2980b9, 0x2471a3]; // Różne odcienie niebieskiego
            
            // Tworzymy 3 klatki animacji
            for (let i = 0; i < 3; i++) {
                graphics.clear();
                graphics.fillStyle(colors[i]);
                graphics.fillRect(0, 0, 64, 64);
                graphics.lineStyle(2, 0x2980b9);
                graphics.strokeRect(0, 0, 64, 64);
                
                // Dodajemy efekt "świecenia"
                graphics.fillStyle(0xffffff, 0.3);
                graphics.fillRect(4, 4, 56, 10);
                
                // Dodajemy detale postaci
                graphics.lineStyle(2, 0xffffff);
                graphics.beginPath();
                // Linia w środku
                graphics.moveTo(32, 15);
                graphics.lineTo(32, 49);
                // Górny trójkąt
                graphics.moveTo(32, 15);
                graphics.lineTo(22, 30);
                graphics.lineTo(42, 30);
                graphics.lineTo(32, 15);
                // Dolny trójkąt
                graphics.moveTo(32, 49);
                graphics.lineTo(22, 34);
                graphics.lineTo(42, 34);
                graphics.lineTo(32, 49);
                graphics.closePath();
                graphics.stroke();
                
                graphics.generateTexture('player' + i, 64, 64);
            }

            // Moneta
            graphics.clear();
            graphics.lineStyle(2, 0xf1c40f);
            graphics.fillStyle(0xf39c12);
            graphics.beginPath();
            graphics.arc(32, 32, 25, 0, Math.PI * 2);
            graphics.closePath();
            graphics.fill();
            graphics.stroke();

            // Dodajemy znak dolara na monecie
            graphics.lineStyle(2, 0xffd700);
            graphics.beginPath();
            // Pionowa linia znaku $
            graphics.moveTo(32, 22);
            graphics.lineTo(32, 42);
            // Górna część S
            graphics.moveTo(37, 24);
            graphics.lineTo(32, 22);
            graphics.lineTo(27, 24);
            graphics.lineTo(27, 29);
            graphics.lineTo(37, 35);
            // Dolna część S
            graphics.lineTo(37, 40);
            graphics.lineTo(32, 42);
            graphics.lineTo(27, 40);
            graphics.stroke();

            graphics.generateTexture('coin', 64, 64);
            graphics.clear();

            // Przeszkoda
            graphics.lineStyle(2, 0xc0392b);
            graphics.fillStyle(0xe74c3c);
            graphics.beginPath();
            graphics.moveTo(32, 5);
            graphics.lineTo(59, 59);
            graphics.lineTo(5, 59);
            graphics.closePath();
            graphics.fill();
            graphics.stroke();
            graphics.generateTexture('obstacle', 64, 64);
            graphics.clear();

            graphics.destroy();
            return true;
        } catch (error) {
            graphics.destroy();
            throw new Error('Failed to create textures: ' + error.message);
        }
    }

    showError(message) {
        const width = this.scale.width;
        const height = this.scale.height;

        if (this.loadingText) {
            this.loadingText.destroy();
        }

        // Stylowy komunikat błędu
        this.errorText = this.add.text(width / 2, height / 2, message, {
            fontSize: '28px',
            fill: '#ff0000',
            fontFamily: 'Righteous',
            align: 'center',
            wordWrap: { width: width - 100 },
            shadow: { color: '#000000', blur: 2, fill: true }
        }).setOrigin(0.5);

        // Atrakcyjny przycisk ponownej próby
        this.retryButton = this.add.text(width / 2, height / 2 + 60, 'Try again', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Rubik',
            backgroundColor: '#222222',
            padding: { x: 20, y: 10 },
            shadow: { color: '#000000', blur: 2, fill: true }
        }).setOrigin(0.5)
          .setInteractive();

        // Efekty hover na przycisku
        this.retryButton.on('pointerover', () => {
            this.retryButton.setStyle({ fill: '#00ff00' });
            this.retryButton.setScale(1.1);
        });

        this.retryButton.on('pointerout', () => {
            this.retryButton.setStyle({ fill: '#ffffff' });
            this.retryButton.setScale(1);
        });

        this.retryButton.on('pointerdown', () => {
            this.scene.restart();
        });
    }
} 