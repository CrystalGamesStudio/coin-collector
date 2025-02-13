import { translations, getCurrentLanguage, setLanguage } from '../translations';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.currentLang = getCurrentLanguage();
        const width = this.scale.width;
        const height = this.scale.height;

        // Tło
        this.add.rectangle(0, 0, width, height, 0x000033).setOrigin(0);

        // Tytuł
        const titleText = this.add.text(
            width / 2,
            height / 6,
            'COIN COLLECTOR',
            {
                fontSize: '64px',
                fill: '#FFD700',
                fontFamily: 'Arial Black'
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

        // Kontener menu z tłem
        const menuContainer = this.add.container(width / 2, height / 2 + 50);
        
        // Tło menu (zaokrąglony prostokąt)
        const menuBg = this.add.graphics();
        menuBg.fillStyle(0x000066, 0.7); // Kolor tła
        menuBg.lineStyle(2, 0x3498db); // Obramowanie
        const menuWidth = 300;
        const menuHeight = 350;
        const cornerRadius = 20;
        
        // Rysujemy tło z efektem świecenia
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
            menuBg.strokeRoundedRect(
                -menuWidth/2 - (i * 2), 
                -menuHeight/2 - (i * 2), 
                menuWidth + (i * 4), 
                menuHeight + (i * 4), 
                cornerRadius + (i * 2)
            );
        }

        menuContainer.add(menuBg);

        // Przyciski menu
        const buttonConfigs = [
            { text: translations[this.currentLang].play, y: -100, scene: 'GameScene' },
            { text: translations[this.currentLang].howToPlay, y: -20, scene: 'HowToPlayScene' },
            { text: translations[this.currentLang].settings, y: 60, scene: 'SettingsScene' },
            { text: translations[this.currentLang].shop, y: 140, disabled: true }
        ];

        buttonConfigs.forEach(config => {
            const button = this.createButton(config.text, config.y, config.disabled);
            menuContainer.add(button);

            if (!config.disabled) {
                button.setInteractive();
                button.on('pointerdown', () => {
                    this.scene.start(config.scene);
                });
            }
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

    createButton(text, yOffset, disabled = false) {
        const buttonWidth = 240;
        const buttonHeight = 50;
        const button = this.add.container(0, yOffset);

        // Tło przycisku
        const buttonBg = this.add.graphics();
        const buttonColor = disabled ? 0x666666 : 0x3498db;
        const fillColor = disabled ? 0x333333 : 0x000099;

        // Efekt świecenia dla aktywnych przycisków
        if (!disabled) {
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
        }

        // Główne tło przycisku
        buttonBg.lineStyle(2, buttonColor);
        buttonBg.fillStyle(fillColor, 0.8);
        buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 10);
        buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 10);

        // Tekst przycisku
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '24px',
            fill: disabled ? '#666666' : '#ffffff',
            fontFamily: 'Righteous'
        }).setOrigin(0.5);

        button.add([buttonBg, buttonText]);

        if (!disabled) {
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
        } else {
            // Dodaj ikonę kłódki dla wyłączonego przycisku
            const lockIcon = this.add.text(buttonWidth/2 - 30, 0, '🔒', {
                fontSize: '20px'
            }).setOrigin(0.5);
            button.add(lockIcon);
        }

        return button;
    }

    createLanguageButton(x, y) {
        const langButton = this.add.container(x, y);
        const buttonWidth = 60;
        const buttonHeight = 40;

        // Tło przycisku języka
        const langBg = this.add.graphics();
        langBg.lineStyle(2, 0x3498db);
        langBg.fillStyle(0x000099, 0.8);
        langBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 10);
        langBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 10);

        const langText = this.add.text(0, 0, this.currentLang.toUpperCase(), {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Righteous'
        }).setOrigin(0.5);

        langButton.add([langBg, langText]);
        langButton.setInteractive(new Phaser.Geom.Rectangle(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

        // Efekty hover dla przycisku języka
        langButton.on('pointerover', () => {
            this.tweens.add({
                targets: langButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
            langText.setStyle({ fill: '#FFD700' });
        });

        langButton.on('pointerout', () => {
            this.tweens.add({
                targets: langButton,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
            langText.setStyle({ fill: '#ffffff' });
        });

        langButton.on('pointerdown', () => {
            this.currentLang = this.currentLang === 'en' ? 'pl' : 'en';
            setLanguage(this.currentLang);
            this.scene.restart();
        });

        return langButton;
    }
} 