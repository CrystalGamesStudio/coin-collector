export const translations = {
    en: {
        play: 'Play',
        howToPlay: 'How to play',
        title: 'Coin collector',
        back: 'Back',
        score: 'Score',
        coins: 'Coins',
        level: 'Level',
        gameOver: 'Game over',
        victory: 'Victory!',
        restart: 'Play again',
        menu: 'Menu',
        shop: 'Shop',
        settings: 'Settings',
        language: 'Language',
        languageOptions: {
            en: 'English',
            pl: 'Polski'
        },
        instructions: [
            'Use arrow keys to move',
            'Collect all coins',
            'Avoid obstacles',
            'Reach the exit'
        ]
    },
    pl: {
        play: 'Graj',
        howToPlay: 'Jak grać',
        title: 'Coin collector',
        back: 'Powrót',
        score: 'Wynik',
        coins: 'Monety',
        level: 'Poziom',
        gameOver: 'Koniec gry',
        victory: 'Zwycięstwo!',
        restart: 'Zagraj ponownie',
        menu: 'Menu',
        shop: 'Sklep',
        settings: 'Ustawienia',
        language: 'Język',
        languageOptions: {
            en: 'English',
            pl: 'Polski'
        },
        instructions: [
            'Użyj strzałek do poruszania się',
            'Zbierz wszystkie monety',
            'Unikaj przeszkód',
            'Dotrzyj do mety'
        ]
    }
};

let currentLanguage = localStorage.getItem('gameLanguage') || 'en';

export const getCurrentLanguage = () => currentLanguage;

export const setLanguage = (lang) => {
    currentLanguage = lang;
    localStorage.setItem('gameLanguage', lang);
}; 