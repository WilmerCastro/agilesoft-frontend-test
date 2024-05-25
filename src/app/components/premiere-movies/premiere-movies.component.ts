import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { MoviesService } from 'src/app/services/movies.service';


@Component({
  selector: 'app-premiere-movies',
  templateUrl: './premiere-movies.component.html',
  styleUrls: ['./premiere-movies.component.scss']
})
export class PremiereMoviesComponent implements OnInit {
  carousel!: Bootstrap.Carousel;

  // se usa para controlar el index de la imagen que se está mostrando
  idInView = 0;

  constructor(
    public moviesService: MoviesService
  ) { }

  // https://getbootstrap.com/docs/5.0/components/carousel
  ngOnInit(): void {
    const myCarousel = document.querySelector('#myCarousel');
    if (myCarousel) {
      this.carousel = new bootstrap.Carousel(myCarousel, {
        interval: 8000,
        wrap: true,
        touch: true,
        keyboard: true,
        slide: 'carousel',
        pause: 'hover'
      });
      myCarousel.addEventListener('slide.bs.carousel', (event: any) => {
        this.idInView = Number((event?.relatedTarget as HTMLElement).getAttribute('carousel-id'));
        if (this.idInView >= (this.moviesService.premiereMovies.length - 2)) {
          this.moviesService.premierePage = this.moviesService.premierePage + 1;
          this.moviesService.getPremiereMovies().subscribe(data => {
            this.moviesService.premiereMovies = this.moviesService.premiereMovies.concat(data);
          });
        }
      });
    }
  }

}
