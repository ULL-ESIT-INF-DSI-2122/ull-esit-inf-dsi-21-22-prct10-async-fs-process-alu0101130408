const low = require('lowdb');
const fs = require('fs');
import {spawn} from 'child_process';
const FileSync = require('lowdb/adapters/FileSync');

import {Note} from './note';

/**
 * Clase encargada de definir la Base de datos donde se almacenará tanto los usuarios como sus notas.
 * > El objetivo principal de esta clase es actualizar la informacion  que contiene, añadiendo notas y usuarios.
 */
export class Bdd {
  private dataBase: any;
  private fileName: string = '';
  /**
   * El constructor actua de forma que si el usuario no existe en el sistema, se crea un nuevo fichero con su nombre y se añade al usuario y se inicializa el lowDB.
   * En caso de que si exista simplemente se inicializa el lowDB y se carga las notas que contiene el usuario en el sistema.
   * @param userName string que corresponde al nombre del usuario de la base
   * @param Notes array de notas que tiene el usuario con "userName".
   */
  constructor(userName: string, Notes: Note[] = []) {
    if (fs.readdirSync(`./src/ejercicio-3/database/${userName}`).lenght === 0) {
      this.fileName = userName + ".json";
      // eslint-disable-next-line no-unused-vars
      const touch = spawn('touch', [this.fileName]);
      const adapter = new FileSync(`./src/ejercicio-3/database/${userName}/${this.fileName}`);
      this.dataBase = low(adapter);
    } else {
      this.fileName = userName + ".json";
      const adapter = new FileSync(`./src/ejercicio-3/database/${userName}/${this.fileName}`);
      this.dataBase = low(adapter);
    }

    if (!this.dataBase.get('User').find({name: userName}).value()) {
      this.addUser(userName);
    } else {
      const size: number = this.dataBase.get('User').find({name: userName}).get('notes').size().value();
      for (let i: number = 0; i < size; i++) {
        Notes.push(new Note(this.dataBase.get('User').find({name: userName}).get(`notes[${i}].title`).value(), this.dataBase.get('User').find({name: userName}).get(`notes[${i}].body`).value(), this.dataBase.get('User').find({name: userName}).get(`notes[${i}].color`).value()));
      }
    }
  }

  /**
   * Método de la clase encargado de añadir un nuevo usuario al sistema.
   * @param name nombre del usuario que se quiere añadir al sistema.
   */
  addUser(name: string) {
    this.dataBase.defaults({User: []}).write();
    this.dataBase.get('User').push({name: name, notes: [], id: this.getRandomArbitrary(100, 1)}). write();
  }

  /**
   * método que genera aleatoriamente un numero entre dos rangos
   * @param min valor del rango minimo
   * @param max valor del rango maximo
   * @returns devuelve un aleatorio generado entre estos rangos que sera asociado al ID del usuario
   */
  getRandomArbitrary(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * Método que actualiza el estado de la base de datos.
   * @param userName nombre del usuario que tiene notas en el sistema.
   * @param Notes Array de notas que tiene ese usuario.
   */
  updateDbb(userName: string, Notes: Note[]) {
    this.dataBase.get('User').find({name: userName}).get("notes").remove().write();
    Notes.forEach((item) => {
      this.dataBase.get('User').find({name: userName}).get('notes').push({title: item.geTitle(), body: item.getBody(), color: item.getColor()}).write();
    });
  }
}
