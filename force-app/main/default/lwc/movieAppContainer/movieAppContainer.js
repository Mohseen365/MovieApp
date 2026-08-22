import { LightningElement, track } from 'lwc';

export default class MovieAppContainer extends LightningElement {
    @track currentPage = 'home';

    get isHomePage() {
        return this.currentPage === 'home';
    }

    get isFavPage() {
        return this.currentPage === 'favourites';
    }

    handleNavChange(event) {
        if (event.detail && event.detail.page) {
            this.currentPage = event.detail.page;
        }
    }
}
