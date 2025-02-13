import { translations, getCurrentLanguage } from '../translations';

export default class HowToPlayScene extends Phaser.Scene {
    constructor() {
        super('HowToPlayScene');
    }

    init() {
        this.currentLang = getCurrentLanguage();
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Tło
        this.add.rectangle(0, 0, width, height, 0x000033).setOrigin(0);

        // Tytuł
        const titleText = this.add.text(
            width / 2,
            height / 6,
            translations[this.currentLang].howToPlay,
            {
                fontSize: '1000px',
                fill: '#FFD700',
                fontFamily: 'Press Start 2P',
                stroke: '#000',
                strokeThickness: 20,
                shadow: { color: '#FFD700', blur: 40, fill: true }
            }
        ).setOrigin(0.5);

        // Animacja tytułu
        this.tweens.add({
            targets: titleText,
            y: titleText.y + 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        // Kontener dla instrukcji
        const menuContainer = this.add.container(width / 2, height / 2);
        
        // Tło menu z większą szerokością
        const menuBg = this.add.graphics();
        const menuWidth = 600;
        const menuHeight = 400;
        const cornerRadius = 20;
        
        // Efekt świecenia dla tła
        for (let i = 0; i < 3; i++) {
            menuBg.lineStyle(2, 0x3498db, 0.3 - (i * 0.1));
            menuBg.fillStyle(0x000066, 0.7 - (i * 0.1));
            menuBg.fillRoundedRect(
                -menuWidth/2 - (i * 2), 
                -menuHeight/2 - (i * 2), 
                menuWidth + (i * 4), 
                menuHeight + (i * 4), 
                cornerRadius + (i * 2)
            );
        }

        menuContainer.add(menuBg);

        // Instrukcje - wyrównane do lewej strony
        const instructions = translations[this.currentLang].instructions;
        const startX = -menuWidth/2 + 50;
        
        instructions.forEach((instruction, index) => {
            const instructionContainer = this.add.container(startX, -100 + (index * 60));
            
            // Ikonka punktu
            const bullet = this.add.graphics();
            bullet.fillStyle(0xFFD700, 1);
            bullet.fillCircle(0, 0, 6);
            
            // Tekst instrukcji
            const text = this.add.text(20, 0, instruction, {
                fontSize: '28px',
                fill: '#ffffff',
                fontFamily: 'Righteous',
                shadow: { color: '#000000', blur: 2, fill: true }
            }).setOrigin(0, 0.5);

            instructionContainer.add([bullet, text]);
            
            // Efekt hover na całej szerokości
            const hitArea = new Phaser.Geom.Rectangle(
                -20, 
                -25, 
                menuWidth - 60,
                50
            );
            
            instructionContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
            
            instructionContainer.on('pointerover', () => {
                text.setStyle({ fill: '#FFD700' });
                this.tweens.add({
                    targets: instructionContainer,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 100
                });
            });

            instructionContainer.on('pointerout', () => {
                text.setStyle({ fill: '#ffffff' });
                this.tweens.add({
                    targets: instructionContainer,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100
                });
            });

            menuContainer.add(instructionContainer);
        });

        // Przycisk powrotu
        const backButton = this.createButton(0, 150, translations[this.currentLang].back, () => {
            this.scene.start('MenuScene');
        });
        menuContainer.add(backButton);

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

    createButton(x, y, text, callback) {
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
} 