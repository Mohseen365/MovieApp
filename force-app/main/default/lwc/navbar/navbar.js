import { LightningElement } from 'lwc';

export default class Navbar extends LightningElement {
    handleHomeClick(event) {
        if (event) {
            event.preventDefault();
        }
        this.dispatchEvent(new CustomEvent('navchange', {
            detail: { page: 'home' },
            bubbles: true,
            composed: true
        }));
    }

    handleFavClick(event) {
        if (event) {
            event.preventDefault();
        }
        this.dispatchEvent(new CustomEvent('navchange', {
            detail: { page: 'favourites' },
            bubbles: true,
            composed: true
        }));
    }
}
