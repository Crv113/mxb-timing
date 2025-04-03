/**
 * Convertit un temps en secondes au format minute.secondes à 3 décimales.
 * @param {number} seconds - Le temps en secondes.
 * @returns {string} - Le temps en minutes secondes au format 1.123
 */
export function convertTime(seconds) {
    const minutes = Math.floor(seconds / 60); // Nombre entier de minutes
    const remainingSeconds = (seconds % 60).toFixed(3); // Secondes restantes avec 3 décimales

    return `${minutes}.${remainingSeconds}`;
}