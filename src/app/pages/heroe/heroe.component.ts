import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import Swal from 'sweetalert2';

import { HeroesService } from '../../services/heroes.service';
import { HeroeModel } from '../../models/heroe.model';

Swal;

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css'],
})
export class HeroeComponent implements OnInit {
  heroe = new HeroeModel();

  constructor(
    private HeroesService: HeroesService,
    private route: ActivatedRoute
  ) {} // como voy a escuchar una url por eso uso route: ActivatedRoute

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // esta es otra manera de suscribirme a los cambios de las url
    if (id !== 'nuevo') {
      this.HeroesService.getheroe(id).subscribe((resp: HeroeModel) => {
        this.heroe = resp;
        this.heroe.id = id;
        // lo q se hizo aca es escuchar el id q obtenemos con url, hacemos la peticion a firebase con ese id y luego llenamos lso campos del formulario
        //a actualizar con los datos del id, y como el id no viene pq antes se borro para q no quedara doble lo asignamos
      });
    }
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      console.log('form invalido');
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando informacion',
      icon: 'info',
      allowOutsideClick: false,
    });

    Swal.showLoading();

    let peticion: Observable<any>;

    // aca tenemos que si ya hay un id en el objeto utilizamos actualizarHeroe, si no lo creamos
    if (this.heroe.id) {
      peticion = this.HeroesService.actualizarHeroe(this.heroe);
    } else {
      peticion = this.HeroesService.crearHeroe(this.heroe);
    }
    // normalemte iria this.HeroesService.crearHeroe(this.heroe).suscribe y todo eso pero para no crear doble codigo del Swalfire lo guardamos en la variable
    // peticion y ya depende si usa actualizar o crear despues viene y utiliza el subscribe con al respuesta y muestra el alert,
    peticion.subscribe((resp) => {
      Swal.fire({
        title: this.heroe.nombre,
        text: 'Se actualizo correctamente',
        icon: 'success',
      });
    });
  }
}
