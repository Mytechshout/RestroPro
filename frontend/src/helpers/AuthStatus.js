export function isRestroUserAuthenticated() {
    const restroAuthenticated = document.cookie.includes("oneospos__authenticated=");
    return restroAuthenticated;
}