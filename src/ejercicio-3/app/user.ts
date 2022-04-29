import {Note, ColorNotes} from './note';
import {Bdd} from './bdd';

const chalk = require('chalk');

/**
 * Clase encargada de especificar los usuarios y sus operaciones en el sistema.
 */
export class User {
  /**
   * Constructor de la clase encargado de definir un usuario en el sistema
   * @param userName Nombre del usuario del sistema
   * @param Notes Array de notas que inicialmente no tendrá ninguna
   * @param DataBase base de datos donde se obtendra los datos y se actualizaran
   */
  constructor(private userName: string, private Notes: Note[]= [], private DataBase:Bdd = new Bdd(userName, Notes)) {
  }

  /**
   * Método encargado de actualizar a un usuario en la base de datos
   */
  updateUser():void {
    this.DataBase.updateDbb(this.userName, this.Notes);
  }

  /**
   * Método que comprueba si una nota dentro del array de notas del usuario existe
   * @param title titulo de la nota que se quiere comprobar
   * @returns devuelve un par de elementos que es en caso de si se encuentra la nota u la nota en cuestion.
   */
  exist(title: string): [boolean, Note] {
    let found: boolean = false;
    let foundNote:Note = new Note('-', '-', 'Red');
    this.Notes.forEach((item) => {
      if (item.geTitle() === title) {
        found = true;
        foundNote = item;
      }
    });
    return [found, foundNote];
  }

  /**
   * Método encargado de añadir una nueva nueva nota al sistema
   * @param title titulo de la nota nueva
   * @param body contiene la informacion del cuerpo
   * @param Color color de la nota definida en modulo Chark
   * @returns devuelve un booleano que define true si se ha añadido o false si ha pasado algo mal.
   */
  addNote(title: string, body: string, Color: ColorNotes): boolean {
    let finish: boolean = false;
    const check: [boolean, Note] = this.exist(title);
    if (!check[0]) {
      this.Notes.push(new Note(title, body, Color));
      finish = true;
      console.log(chalk.green.bold.inverse('Se ha añadido la nueva nota'));
    } else {
      console.log(chalk.red.bold.inverse('Ya existe una nota igual'));
    }
    return finish;
  }

  /**
   * Método encargado de modificar el cuerpo de una nota
   * @param title Titulo de la nota en el sistema
   * @param bodyToModify nuevo cuerpo que se quiere modificar
   * @returns devuelve un flag que comprueba si se ha modificado o si hubo algun fallo
   */
  modifyNote(title: string, bodyToModify: string): boolean {
    let finish: boolean = false;
    const check: [boolean, Note] = this.exist(title);
    if (check[0]) {
      const index = this.Notes.indexOf(check[1]);
      this.Notes[index].setBody(bodyToModify);
      finish = true;
      console.log(chalk.green.bold.inverse('Se ha modificado el cuerpo de la nota'));
    } else {
      console.log(chalk.red.bold.inverse('No existe la nota a modificar'));
    }
    return finish;
  }


  /**
   * Método encargado de modificar el color de una nota
   * @param title Titulo de la nota que se quiere modificar en el sistema
   * @param colorToModify nuevo color al que se quiere cambiar
   * @returns devuelve un flag que comprueba si se ha modificado el color o hubo algun error
   */
  modifyNoteColor(title: string, colorToModify: ColorNotes): boolean {
    let finish: boolean = false;
    const check: [boolean, Note] = this.exist(title);
    if (check[0]) {
      const index = this.Notes.indexOf(check[1]);
      this.Notes[index].setColor(colorToModify);
      finish = true;
      console.log(chalk.green.bold.inverse('Se ha modificado el color de la nota'));
    } else {
      console.log(chalk.red.bold.inverse('No existe la nota a modificar'));
    }
    return finish;
  }

  /**
   * Método encargado de eliminar una nota del sistema
   * @param title titulo de la nota que se quiere eliminar
   * @returns devuelve un flag en caso de que se elimine la nota o no
   */
  deleteNote(title: string): boolean {
    let finish: boolean = false;
    const check: [boolean, Note] = this.exist(title);
    if (check[0]) {
      const index = this.Notes.indexOf(check[1]);
      if (index > -1) {
        this.Notes.splice(index, 1);
        finish = true;
        console.log(chalk.green.bold.inverse(`Se ha eliminado la nota con titulo ${title}`));
      }
    } else {
      console.log(chalk.red.bold.inverse('Ha introducido mal el titulo o no existe la nota con ese titulo'));
    }
    return finish;
  }
  /**
   * Método que muestra una lista con las notas de un usuario
   */
  printTitles(): void {
    console.log(">> Notas de " + this.userName + ":");
    this.Notes.forEach((item) => {
      item.printTitle();
    });
  }

  /**
   * Método encargado de mostrar toda la información de una nota dado un titulo concreto
   * @param title titulo de la nota que se desea leer
   */
  printNotes(title : string): void {
    const check: [boolean, Note] = this.exist(title);
    if (check[0]) {
      console.log(`────────────────────────────────`);
      check[1].printTitle();
      check[1].printBody();
      console.log(`────────────────────────────────`);
    } else {
      console.log(chalk.red.bold.inverse('Ha introducido mal el titulo o no existe la nota con ese titulo'));
    }
  }
}
