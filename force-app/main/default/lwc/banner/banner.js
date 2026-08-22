import { LightningElement, track } from 'lwc';
import getPopularMovies from '@salesforce/apex/MovieController.getPopularMovies';

const FALLBACK_MOVIES = [
    {
        adult: false,
        backdrop_path: "/6EdKBYkB1ssgGjc249ud1L55o8d.jpg",
        genre_ids: [28, 878, 53],
        id: 848278,
        original_language: "en",
        original_title: "Jurassic Hunt",
        overview: "Female adventurer Parker joins a crew of male trophy hunters in a remote wilderness park. Their goal: slaughter genetically recreated dinosaurs for sport using rifles, arrows, and grenades.",
        popularity: 4475.053,
        poster_path: "/Czhr00kB8awffakEcQS5ON1ELm.jpg",
        release_date: "2021-08-23",
        title: "Jurassic Hunt",
        video: false,
        vote_average: 4.7,
        vote_count: 50
    }
];

export default class Banner extends LightningElement {
    @track movies = [];
    @track isLoading = true;

    get bannerMovie() {
        if (this.movies && this.movies.length > 0) {
            const firstMovie = this.movies[0];
            return {
                ...firstMovie,
                imageUrl: `https://image.tmdb.org/t/p/original/${firstMovie.backdrop_path}`
            };
        }
        return null;
    }

    connectedCallback() {
        this.fetchMovies();
    }

    async fetchMovies() {
        try {
            const resultStr = await getPopularMovies({ page: 1 });
            const data = JSON.parse(resultStr);
            this.movies = data.results || [];
        } catch (error) {
            console.error('Apex call error, falling back to direct fetch or mock data:', error);
            try {
                const response = await fetch(
                    'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1'
                );
                if (response.ok) {
                    const data = await response.json();
                    this.movies = data.results || [];
                } else {
                    this.movies = FALLBACK_MOVIES;
                }
            } catch (e) {
                this.movies = FALLBACK_MOVIES;
            }
        } finally {
            this.isLoading = false;
        }
    }
}
