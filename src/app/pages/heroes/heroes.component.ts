import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { HeroeModel } from '../../models/heroe.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: HeroeModel[] = [];

  cargando = false;

  constructor(private heroesService: HeroesService) {}

  ngOnInit(): void {
    this.cargando = true; // asi llamamos el apinet de cargando antes q se cargue la info de las tablas
    // asi cargamos la tabla de heroes cada vez q iniciamos la pagina
    this.heroesService.getHeroes().subscribe((resp) => {
      console.log(resp);
      this.heroes = resp;
      this.cargando = false;
    });
  }
  // confirmaicon de pregunta para borrar un heroe, me retrna una promesa y segun la respuesta hacmeos algo
  borrarHeroe(heroe: HeroeModel, i: number) {
    Swal.fire({
      title: 'Estas seguro?',
      text: `Esta seguro que desea borrar a ${heroe.nombre}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((resp) => {
      if (resp.value) {
        // osea q si le doy click a confirmar me lo borra si no no pasa nada
        this.heroes.splice(i, 1);
        this.heroesService.borrarHeroe(heroe.id).subscribe();
      }
    });
  }
}
