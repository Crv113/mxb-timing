/**
 * Retourne un header de requête avec le XSRF-TOKEN
 */
export function getXsrfHeader() {
    return {"X-XSRF-TOKEN": decodeURIComponent(getXsrfToken())}
}

/**
 * Récupère le XSRF TOKEN dans les cookies
 * @returns string - Le token
 */
export function getXsrfToken() {

    return document.cookie.split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

}