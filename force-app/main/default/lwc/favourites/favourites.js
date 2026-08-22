import { LightningElement, track } from 'lwc';

const GENRE_MAP = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV",
    53: "Thriller",
    10752: "War",
    37: "Western",
};

export default class Favourites extends LightningElement {
    @track movies = [];
    @track genres = [];
    @track currGenre = 'All Genre';
    @track searchQuery = '';
    @track limit = 5;
    @track currentPage = 1;

    connectedCallback() {
        this.loadFavourites();
    }

    loadFavourites() {
        try {
            const storedFavs = JSON.parse(localStorage.getItem('movies_fav') || '[]');
            this.movies = storedFavs;
            this.extractGenres(storedFavs);
        } catch (e) {
            this.movies = [];
            this.genres = ['All Genre'];
        }
    }

    saveFavourites() {
        try {
            localStorage.setItem('movies_fav', JSON.stringify(this.movies));
            this.dispatchEvent(new CustomEvent('favouriteschange', {
                detail: { favourites: this.movies },
                bubbles: true,
                composed: true
            }));
        } catch (e) {
            console.error('Failed to save favourites', e);
        }
    }

    extractGenres(movieList) {
        const allGenreSet = new Set();
        movieList.forEach(movie => {
            if (movie.genre_ids && movie.genre_ids.length > 0) {
                const mainGenre = GENRE_MAP[movie.genre_ids[0]];
                if (mainGenre) {
                    allGenreSet.add(mainGenre);
                }
            }
        });
        this.genres = ['All Genre', ...Array.from(allGenreSet)];
    }

    get genreList() {
        return this.genres.map(g => {
            const isActive = this.currGenre === g;
            return {
                name: g,
                buttonClass: isActive
                    ? 'slds-button slds-button_brand slds-full-width slds-m-bottom_x-small'
                    : 'slds-button slds-button_neutral slds-full-width slds-m-bottom_x-small'
            };
        });
    }

    handleGenreClick(event) {
        const genre = event.currentTarget.dataset.genre;
        if (genre) {
            this.currGenre = genre;
            this.currentPage = 1;
        }
    }

    handleSearchChange(event) {
        this.searchQuery = event.target.value;
        this.currentPage = 1;
    }

    handleLimitChange(event) {
        const val = parseInt(event.target.value, 10);
        this.limit = val > 0 ? val : 5;
        this.currentPage = 1;
    }

    handleDelete(event) {
        const id = event.currentTarget.dataset.id;
        this.movies = this.movies.filter(m => String(m.id) !== String(id));
        this.extractGenres(this.movies);
        this.saveFavourites();
    }

    get filteredMovies() {
        let result = this.movies;

        if (this.currGenre !== 'All Genre') {
            result = result.filter(m => {
                const genreName = GENRE_MAP[m.genre_ids && m.genre_ids[0]];
                return genreName === this.currGenre;
            });
        }

        if (this.searchQuery.trim() !== '') {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(m => {
                const title = (m.original_title || m.title || '').toLowerCase();
                return title.includes(query);
            });
        }

        return result.map(m => {
            const genreName = (m.genre_ids && GENRE_MAP[m.genre_ids[0]]) ? GENRE_MAP[m.genre_ids[0]] : 'Other';
            return {
                ...m,
                genreName: genreName,
                imageUrl: `https://image.tmdb.org/t/p/original/${m.backdrop_path}`
            };
        });
    }

    get totalFilteredItems() {
        return this.filteredMovies.length;
    }

    get totalPages() {
        const total = Math.ceil(this.totalFilteredItems / this.limit);
        return total > 0 ? total : 1;
    }

    get isFirstPage() {
        return this.currentPage <= 1;
    }

    get isLastPage() {
        return this.currentPage >= this.totalPages;
    }

    get hasFavourites() {
        return this.pagedMovies && this.pagedMovies.length > 0;
    }

    get pagedMovies() {
        const filtered = this.filteredMovies;
        const start = (this.currentPage - 1) * this.limit;
        return filtered.slice(start, start + this.limit);
    }

    handlePrevPage() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
        }
    }

    handleNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage += 1;
        }
    }
}
