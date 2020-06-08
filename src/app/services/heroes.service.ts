import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private url = 'https://crud-angular-866a9.firebaseio.com';

  constructor(private http: HttpClient) {}

  crearHeroe(heroe: HeroeModel) {
    return this.http.post(`${this.url}/heroes.json`, heroe).pipe(
      map((resp: any) => {
        heroe.id = resp.name;
        // decimos q el id q es el input y no se puede maniipular es la resp q nos da firebase con un id guardado en resp.name
        return heroe;
        // aca ya me regresa todo el heroe pero con el id q nos da firebase
      })
    );
  }

  actualizarHeroe(heroe: HeroeModel) {
    // aca tenemos q coger el heroe y transformarlo, osea quitarle el id ya q firebase al momento de actualizar me manda otro id y no queremos eso
    const heroeTemp = {
      ...heroe,
      // hacer esto es lo mismo q crear un objeto igual a heroe, osea nombre, poder, estado, id etc para no volverlo a crear, y abajo quitamos el id para q no
      // vuelva a pasar
    };

    delete heroeTemp.id;
    // ahora con el objeto temporal le borramos el id, y lo pasamos como parametro en el put, ya pasaria sin el id y no guaradria otra vez al momento de actualizar

    return this.http.put(`${this.url}/heroes/${heroe.id}.json`, heroeTemp);
  }

  borrarHeroe(id: string) {
    return this.http.delete(`${this.url}/heroes/${id}.json`);
  }

  // con esta funcion cargamos los datos de la tabla al formulario cuando lo vayamos a actualizar o borrar
  getheroe(id: string) {
    return this.http.get(`${this.url}/heroes/${id}.json`);
  }

  getHeroes() {
    return this.http.get(`${this.url}/heroes.json`).pipe(
      map((resp) => {
        return this.crearArreglo(resp);
      })
    );
  }

  private crearArreglo(heroesObj: object) {
    const heroes: HeroeModel[] = [];

    if (heroesObj === null) {
      return [];
    }
    Object.keys(heroesObj).forEach((key) => {
      const heroe: HeroeModel = heroesObj[key];
      heroe.id = key;

      heroes.push(heroe);
    });

    return heroes;
  }
}
