// Couleurs principales
const goldAccent = '#FFD700';     // Or vif pour les éléments importants
const goldPastel = '#E6C068';     // Or pastel pour les éléments secondaires
const darkBackground = '#121212';  // Fond très sombre
const darkerGrey = '#1E1E1E';     // Gris foncé pour les cartes et conteneurs
const lightText = '#F5F5F5';      // Blanc cassé pour le texte principal
const greyText = '#B3B3B3';       // Gris clair pour le texte secondaire

export default {
  dark: {
    text: lightText,
    secondaryText: greyText,
    background: darkBackground,
    card: darkerGrey,
    tint: goldAccent,
    chart: goldPastel,
    tabIconDefault: greyText,
    tabIconSelected: goldAccent,
    border: '#2C2C2C',
  },
  // On garde light pour éviter les erreurs, mais l'app sera principalement en dark mode
  light: {
    text: lightText,
    secondaryText: greyText,
    background: darkBackground,
    card: darkerGrey,
    tint: goldAccent,
    chart: goldPastel,
    tabIconDefault: greyText,
    tabIconSelected: goldAccent,
    border: '#2C2C2C',
  }
};
