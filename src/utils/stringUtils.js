/**
 * Tronque une chaîne à une longueur maximale et ajoute '...' si nécessaire.
 * @param {string} str - La chaîne à tronquer.
 * @param {number} maxLength - La longueur maximale de la chaîne.
 * @returns {string} - La chaîne tronquée.
 */
export function truncateString(str, maxLength = 30) {
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}
