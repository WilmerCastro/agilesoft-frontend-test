import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { Actor } from '../models/actor.model';
import { Movie } from '../models/movie.model';
import { User } from '../models/user.model';
import { ApiUrl } from './api-url';
import { DataSharedService } from './data-shared.service';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  URL = new ApiUrl().URL;

  popularMovies!: Movie[];
  popularPage = 1;

  premiereMovies!: Movie[];
  premierePage = 1;

  movieDetail!: Movie;

  constructor(
    private http: HttpClient,
    private dataShared: DataSharedService,
    private router: Router
    ) { }

  users(): Observable<{data: User}> {
    return this.http.get<{data: User}>(this.URL + '/user/me');
  }
  getPopularMovies(): Observable<Movie[]> {
    return this.http.get<{data: Array<Movie>, imageBaseUrl: string}>(this.URL + '/movies/popular?page=' + this.popularPage)
    .pipe(
      map(data => data.data.map(
        movie => Object.assign(
          movie, {url: (data.imageBaseUrl + movie.backdrop_path), poster_path: (data.imageBaseUrl + movie.poster_path)}
        )
      ))
    );
  }
  getPremiereMovies(): Observable<Movie[]> {
    return this.http.get<{data: Array<Movie>, imageBaseUrl: string}>(this.URL + '/movies/now_playing?page=' + this.premierePage)
    .pipe(
      map(data => data.data.map(
        movie => Object.assign(
          movie, {url: (data.imageBaseUrl + movie.backdrop_path), poster_path: (data.imageBaseUrl + movie.poster_path)}
        )
      ))
    );
  }

  getAllData(): Observable<void> {
    return forkJoin([
      this.users(),
      this.getPopularMovies(),
      this.getPremiereMovies()
    ]).pipe(
      map(data => {

        // reinicio la paginación
        this.popularPage = 1;

        if (!this.dataShared.user) {
          this.dataShared.user = data[0].data;
        } else {
          Object.assign(this.dataShared.user, data[0].data);
        }


        this.popularMovies = data[1];
        this.premiereMovies = data[2];
      })
    );
  }

  getMovieById(movieId: number): Observable<any> {
    return this.http.get<{data: Array<Actor>, imageBaseUrl: string}>(this.URL + `/movies/${movieId}/actors`)
    .pipe(
      map(data => data.data.map(actor => Object.assign(actor, {url: (data.imageBaseUrl + actor.profile_path)})))
    );
  }

  clickPicture(movie: Movie): void {
    this.movieDetail = movie;
    this.router.navigate(['/movie', movie.id]);
  }

}
