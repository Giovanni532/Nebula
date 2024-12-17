// Mise à jour des couleurs pour correspondre à l'image
const gradientStart = '#1F2466';    // Bleu foncé du haut
const gradientEnd = '#121212';      // Noir du bas
const primaryBlue = '#2C5BFF';      // Bouton bleu central
const darkBg = '#0A0B0F';           // Fond très sombre
const cardBg = '#1A1D2E';           // Fond des cartes
const lightText = '#FFFFFF';        // Texte principal
const greyText = '#8E8E8E';         // Texte secondaire
const successGreen = '#00FFA3';     // Pour les variations positives
const errorRed = '#FF4D4D';         // Pour les variations négatives

export default {
  dark: {
    text: lightText,
    secondaryText: greyText,
    background: darkBg,
    card: cardBg,
    gradientStart,
    gradientEnd,
    primary: primaryBlue,
    success: successGreen,
    error: errorRed,
    tabIconDefault: greyText,
    tabIconSelected: primaryBlue,
    border: '#1F2330',
  },
  light: {
    text: lightText,
    secondaryText: greyText,
    background: darkBg,
    card: cardBg,
    gradientStart,
    gradientEnd,
    primary: primaryBlue,
    success: successGreen,
    error: errorRed,
    tabIconDefault: greyText,
    tabIconSelected: primaryBlue,
    border: '#1F2330',
  }
};
