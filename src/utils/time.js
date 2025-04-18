/**
 * Convertit un temps en secondes au format minute.secondes à 3 décimales.
 * @param {number} seconds - Le temps en secondes.
 * @returns {string} - Le temps en minutes secondes au format 1.123
 */
export function convertTimeFromSecondsToFormatted(seconds) {
    const minutes = Math.floor(seconds / 60); // Nombre entier de minutes
    const remainingSeconds = (seconds % 60).toFixed(3).padStart(6, '0'); // Secondes restantes avec 3 décimales

    return `${minutes}.${remainingSeconds}`;
}

export function convertTimeFromMillisecondsToFormatted(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const milliseconds = String(ms % 1000).padStart(3, '0');

    return `${minutes}.${seconds}.${milliseconds}`;
}