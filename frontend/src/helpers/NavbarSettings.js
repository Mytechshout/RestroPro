const NAVBAR_SIZE_KEY = 'ONEOSPOS__NAVBAR';

export function setNavbarCollapsed(isCollapsed) {
    localStorage.setItem(NAVBAR_SIZE_KEY, String(isCollapsed));
    return isCollapsed;
}

/**
 * @returns {boolean} - 
 *  */  
export function toggleNavbar() {
    const isNavbarCollapsed = localStorage.getItem(NAVBAR_SIZE_KEY);
    if(isNavbarCollapsed == true || isNavbarCollapsed == "true") {
        return setNavbarCollapsed(false);
    } else {
        return setNavbarCollapsed(true);
    }
}
export function getIsNavbarCollapsed() {
    const isNavbarCollapsed = localStorage.getItem(NAVBAR_SIZE_KEY);
    return isNavbarCollapsed == "true" ? true : false;
}
