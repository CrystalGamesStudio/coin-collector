export default class HowToPlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HowToPlayScene' });
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Tło
        this.add.rectangle(width/2, height/2, width, height, 0x000000);

        // Tytuł
        const titleText = this.add.text(width/2, height * 0.08, 'Jak Grać', {
            fontSize: Math.min(width/16, 48) + 'px',
            fill: '#fff',
            align: 'center'
        });
        titleText.setOrigin(0.5);

        // Instrukcje
        const instructions = [
            '🎮 Sterowanie:',
            '← Strzałka w lewo: ruch w lewo',
            '→ Strzałka w prawo: ruch w prawo',
            '',
            '🎯 Poziomy:',
            '• Gra ma 8 poziomów trudności',
            '• Każdy poziom jest trudniejszy',
            '• Przeszkody poruszają się szybciej',
            '',
            '💀 Cel gry:',
            '• Unikaj czerwonych przeszkód',
            '• Zdobywaj punkty (+10/sek)',
            '',
            '💀 Koniec gry:',
            '• Następuje po zderzeniu z przeszkodą',
            '• Możesz zacząć od nowa lub wrócić do menu'
        ];

        // Kontener dla instrukcji z tłem
        const instructionsBg = this.add.rectangle(
            width/2,
            height * 0.45,
            width * 0.8,
            height * 0.6,
            0x111111
        );
        instructionsBg.setAlpha(0.5);

        // Dodajemy instrukcje
        const instructionsText = this.add.text(width/2, height * 0.45, instructions, {
            fontSize: Math.min(width/40, 24) + 'px',
            fill: '#fff',
            align: 'left',
            lineSpacing: height * 0.02
        });
        instructionsText.setOrigin(0.5);

        // Przycisk powrotu
        const backButton = this.add.rectangle(
            width/2,
            height * 0.9,
            width * 0.25,
            height * 0.08,
            0x0000ff
        );
        backButton.setInteractive();

        const backText = this.add.text(width/2, height * 0.9, 'Powrót', {
            fontSize: Math.min(width/24, 32) + 'px',
            fill: '#fff'
        });
        backText.setOrigin(0.5);

        // Efekty hover dla przycisku
        backButton.on('pointerover', () => {
            backButton.setFillStyle(0x0000dd);
            backText.setScale(1.1);
        });

        backButton.on('pointerout', () => {
            backButton.setFillStyle(0x0000ff);
            backText.setScale(1);
        });

        // Powrót do menu
        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        // Dodajemy efekt wejścia
        const elements = [titleText, instructionsBg, instructionsText, backButton, backText];
        elements.forEach((element, index) => {
            element.setAlpha(0);
            this.tweens.add({
                targets: element,
                alpha: 1,
                duration: 500,
                delay: index * 100,
                ease: 'Power2'
            });
        });
    }
} 