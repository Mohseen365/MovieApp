import { LightningElement, track } from 'lwc';
import getPopularMovies from '@salesforce/apex/MovieController.getPopularMovies';

export default class MovieList extends LightningElement {
    @track hoverId = '';
    @track movies = [];
    @track currPage = 1;
    @track isLoading = true;
    @track favourites = [];

    get isFirstPage() {
        return this.currPage <= 1;
    }

    get currPageString() {
        return `Page ${this.currPage}`;
    }

    get formattedMovies() {
        return this.movies.map(movie => {
            const isFav = this.favourites.some(f => String(f.id) === String(movie.id));
            return {
                ...movie,
                imageUrl: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
                isHovered: String(this.hoverId) === String(movie.id),
                buttonLabel: isFav ? 'Remove Favourite' : 'Add to Favourites',
                buttonVariant: isFav ? 'destructive' : 'brand',
                buttonIcon: isFav ? 'utility:favorite' : 'utility:add'
            };
        });
    }

    connectedCallback() {
        this.loadFavourites();
        this.getUpdatedMovies();
    }

    loadFavourites() {
        try {
            const storedFavs = JSON.parse(localStorage.getItem('movies_fav') || '[]');
            this.favourites = storedFavs;
        } catch (e) {
            this.favourites = [];
        }
    }

    saveFavourites() {
        try {
            localStorage.setItem('movies_fav', JSON.stringify(this.favourites));
            this.dispatchEvent(new CustomEvent('favouriteschange', {
                detail: { favourites: this.favourites },
                bubbles: true,
                composed: true
            }));
        } catch (e) {
            console.error('Failed to save favourites', e);
        }
    }

    handleEnter(event) {
        const id = event.currentTarget.dataset.id;
        this.hoverId = id;
    }

    handleLeave() {
        this.hoverId = '';
    }

    async getUpdatedMovies() {
        this.isLoading = true;
        try {
            const resultStr = await getPopularMovies({ page: this.currPage });
            const data = JSON.parse(resultStr);
            this.movies = data.results || [];
        } catch (error) {
            console.error('Apex call error, falling back to direct fetch:', error);
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${this.currPage}`
                );
                if (response.ok) {
                    const data = await response.json();
                    this.movies = data.results || [];
                }
            } catch (e) {
                console.error('Fallback fetch error:', e);
            }
        } finally {
            this.isLoading = false;
        }
    }

    handlePrevPage() {
        if (this.currPage > 1) {
            this.currPage -= 1;
            this.getUpdatedMovies();
        }
    }

    handleNextPage() {
        this.currPage += 1;
        this.getUpdatedMovies();
    }

    toggleFavourite(event) {
        const movieId = event.currentTarget.dataset.id;
        const movieObj = this.movies.find(m => String(m.id) === String(movieId));
        if (!movieObj) return;

        const index = this.favourites.findIndex(f => String(f.id) === String(movieId));
        if (index !== -1) {
            this.favourites.splice(index, 1);
        } else {
            this.favourites.push(movieObj);
        }
        this.favourites = [...this.favourites];
        this.saveFavourites();
    }
}
