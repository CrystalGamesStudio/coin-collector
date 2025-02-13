import { translations, getCurrentLanguage, setLanguage } from '../translations';

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
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
            translations[this.currentLang].settings,
            {
                fontSize: '64px',
                fill: '#FFD700',
                fontFamily: 'Arial Black'
            }
        ).setOrigin(0.5);

        // Kontener menu
        const menuContainer = this.add.container(width / 2, height / 2 + 50);
        
        // Tło menu
        const menuBg = this.add.graphics();
        const menuWidth = 500;
        const menuHeight = 300;
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

        // Etykieta języka z przyciskiem rozwijania
        const langContainer = this.add.container(0, -80);

        // Tło przycisku języka
        const langBg = this.add.graphics();
        const langButtonWidth = 300;
        const langButtonHeight = 40;
        langBg.lineStyle(2, 0x3498db);
        langBg.fillStyle(0x000099, 0.8);
        langBg.fillRoundedRect(-langButtonWidth/2, -langButtonHeight/2, langButtonWidth, langButtonHeight, 10);
        langBg.strokeRoundedRect(-langButtonWidth/2, -langButtonHeight/2, langButtonWidth, langButtonHeight, 10);

        // Tekst aktualnego języka
        const currentLangText = this.add.text(
            -langButtonWidth/2 + 20,
            0,
            translations[this.currentLang].language + ': ' + translations[this.currentLang].languageOptions[this.currentLang],
            {
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }
        ).setOrigin(0, 0.5);

        // Strzałka rozwijania
        const arrow = this.add.text(
            langButtonWidth/2 - 30,
            0,
            '▼',
            {
                fontSize: '20px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        langContainer.add([langBg, currentLangText, arrow]);
        menuContainer.add(langContainer);

        // Kontener dla rozwijanego menu
        const dropdownContainer = this.add.container(0, -60);
        dropdownContainer.setVisible(false);

        // Tło rozwijanego menu
        const dropdownBg = this.add.graphics();
        dropdownBg.lineStyle(2, 0x3498db);
        dropdownBg.fillStyle(0x4477ff, 0.95);
        dropdownBg.fillRoundedRect(-langButtonWidth/2, 0, langButtonWidth, 100, 10);
        dropdownBg.strokeRoundedRect(-langButtonWidth/2, 0, langButtonWidth, 100, 10);
        dropdownContainer.add(dropdownBg);

        const languages = [
            { code: 'en', name: 'English', y: 20 },
            { code: 'pl', name: 'Polski', y: 60 }
        ];

        languages.forEach(lang => {
            // Tło opcji
            const optionBg = this.add.graphics();
            optionBg.fillStyle(0x5588ff, 0.5);
            optionBg.fillRect(-langButtonWidth/2, lang.y - 15, langButtonWidth, 30);
            optionBg.setVisible(false);
            dropdownContainer.add(optionBg);

            // Tekst opcji
            const option = this.add.text(
                -langButtonWidth/2 + 20,
                lang.y,
                translations[this.currentLang].languageOptions[lang.code],
                {
                    fontSize: '24px',
                    fill: '#000000',
                    fontFamily: 'Arial'
                }
            ).setOrigin(0, 0.5)
             .setInteractive()
             .setDepth(2);

            option.on('pointerover', () => {
                optionBg.setVisible(true);
                option.setStyle({ fill: '#000000' });
            });

            option.on('pointerout', () => {
                optionBg.setVisible(false);
                option.setStyle({ fill: '#000000' });
            });

            option.on('pointerdown', () => {
                if (this.currentLang !== lang.code) {
                    setLanguage(lang.code);
                    this.scene.restart();
                }
            });

            dropdownContainer.add(option);
        });

        dropdownContainer.add(dropdownBg);
        dropdownContainer.list.forEach(child => child.setDepth(1));
        menuContainer.add(dropdownContainer);

        // Interakcja z przyciskiem języka
        langContainer.setInteractive(new Phaser.Geom.Rectangle(-langButtonWidth/2, -langButtonHeight/2, langButtonWidth, langButtonHeight), Phaser.Geom.Rectangle.Contains);

        langContainer.on('pointerover', () => {
            arrow.setStyle({ fill: '#FFD700' });
            currentLangText.setStyle({ fill: '#FFD700' });
        });

        langContainer.on('pointerout', () => {
            if (!dropdownContainer.visible) {
                arrow.setStyle({ fill: '#ffffff' });
                currentLangText.setStyle({ fill: '#ffffff' });
            }
        });

        langContainer.on('pointerdown', () => {
            dropdownContainer.setVisible(!dropdownContainer.visible);
            arrow.setText(dropdownContainer.visible ? '▲' : '▼');
        });

        // Zamykanie menu po kliknięciu poza nim
        this.input.on('pointerdown', (pointer) => {
            const bounds = new Phaser.Geom.Rectangle(
                menuContainer.x + langContainer.x - langButtonWidth/2,
                menuContainer.y + langContainer.y - langButtonHeight/2,
                langButtonWidth,
                langButtonHeight + (dropdownContainer.visible ? 100 : 0)
            );

            if (!bounds.contains(pointer.x, pointer.y) && dropdownContainer.visible) {
                dropdownContainer.setVisible(false);
                arrow.setText('▼');
                arrow.setStyle({ fill: '#ffffff' });
                currentLangText.setStyle({ fill: '#ffffff' });
            }
        });

        // Przycisk powrotu
        const backButton = this.createButton(0, 120, translations[this.currentLang].back, () => {
            this.scene.start('MenuScene');
        });
        menuContainer.add(backButton);
    }

    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);
        const buttonWidth = 200;
        const buttonHeight = 50;

        // Tło przycisku
        const buttonBg = this.add.graphics();
        const buttonColor = 0x3498db;
        const fillColor = 0x000099;

        buttonBg.lineStyle(2, buttonColor);
        buttonBg.fillStyle(fillColor, 0.8);
        buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 10);
        buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 10);

        const buttonText = this.add.text(0, 0, text, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
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