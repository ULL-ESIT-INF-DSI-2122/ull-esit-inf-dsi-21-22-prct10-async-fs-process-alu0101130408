import * as yargs from 'yargs';

import {ColorNotes} from './note';
import {User} from './user';

/**
 * Función principal encargada de analizar lo que el usuario pasa a través de yargs y ejecuta una de la operaciones.
 */
function main(): void {
  /**
   * Añadir Nota: en caso de que se seleccione la opcion add se deberá pasar diversos strings que recogerán usuario, titulo, cuerpo y color de la nota
   * @param user nombre del usuario al que se añadira esta nota
   * @param title titulo de la nueva nota que se quiere añadir
   * @param body Cuerpo que contendra la informacion de la nota
   * @param color Color de la nueva nota que se añade.
   */
  yargs.command({
    command: 'add',
    describe: 'Añadir una nueva nota al sistema',
    builder: {
      user: {
        describe: 'Usuario',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Titulo',
        demandOption: true,
        type: 'string',
      },
      body: {
        describe: 'Cuerpo',
        demandOption: true,
        type: 'string',
      },
      color: {
        describe: 'Color',
        demandOption: true,
        type: 'string',
      },

    },
    handler(argv) {
      if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
        const usuario: User = new User(argv.user);
        const color: ColorNotes = colorGetter(argv.color);
        if (usuario.addNote(argv.title, argv.body, color)) {
          usuario.updateUser();
        }
      }
    },
  });

  /**
   * modificar por defecto una Nota: en caso de que se seleccione la opcion modify
   * se pasaran diversos strings que recogerán usuario, titulo y nuevo cuerpo de la nota
   * @param user nombre del usuario al que pertenece la nota a modificar
   * @param title titulo de la nueva nota que se quiere modificar
   * @param body Nuevo cuerpo que se quiere añadir
   */
  yargs.command({
    command: 'modify',
    describe: 'Modificar del cuerpo de nota del sistema',
    builder: {
      user: {
        describe: 'Usuario',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Titulo',
        demandOption: true,
        type: 'string',
      },
      body: {
        describe: 'Cuerpo',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string') {
        const usuario: User = new User(argv.user);

        if (usuario.modifyNote(argv.title, argv.body)) {
          usuario.updateUser();
        }
      }
    },
  });

  /**
   * Eliminar una Nota: en caso de que se seleccione la opcion delete
   * se pasaran diversos strings que recogerán usuario y titulo
   * @param user nombre del usuario al que pertenece la nota a eliminar
   * @param title titulo de la nota que se quiere eliminar
   */
  yargs.command({
    command: 'delete',
    describe: 'Elimina una nota del sistema',
    builder: {
      user: {
        describe: 'Usuario',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Titulo',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string' && typeof argv.title === 'string') {
        const usuario: User = new User(argv.user);
        if (usuario.deleteNote(argv.title)) {
          usuario.updateUser();
        }
      }
    },
  });

  /**
   * Modificar color de una Nota: en caso de que se seleccione la opcion changeColor
   * se pasaran diversos strings que recogerán usuario, titulo y color.
   * @param user nombre del usuario al que pertenece la nota a cambiar el color
   * @param title titulo de la nota que se quiere cambiar el color
   * @param color nuevo color que se quiere cambiar
   */
  yargs.command({
    command: 'changeColor',
    describe: 'cambiar el color de una nota del sistema',
    builder: {
      user: {
        describe: 'Usuario',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Titulo',
        demandOption: true,
        type: 'string',
      },
      color: {
        describe: 'Color',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.color === 'string') {
        const usuario: User = new User(argv.user);
        const color: ColorNotes = colorGetter(argv.color);
        if (usuario.modifyNoteColor(argv.title, color)) {
          usuario.updateUser();
        }
      }
    },
  });

  /**
   * Leer una nota: en caso de que se seleccione la opcion read
   * se pasaran diversos strings que recogerán usuario y titulo
   * @param user nombre del usuario al que pertenece la nota que se quiere leer
   * @param title titulo de la nota que se quiere leer
   */
  yargs.command({
    command: 'read',
    describe: 'Lee una nota del sistema',
    builder: {
      user: {
        describe: 'Usuario',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Titulo',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string' && typeof argv.title === 'string') {
        const usuario: User = new User(argv.user);
        usuario.printNotes(argv.title);
      }
    },
  });

  /**
   * Listar todas las notas de un usuario: en caso de que se seleccione la opcion list
   * se pasara un string que será el usuario
   * @param user nombre del usuario al que se quiera listar
   */
  yargs.command({
    command: 'list',
    describe: 'Lista las notas del usuario',
    builder: {
      user: {
        describe: 'Usuario',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string') {
        const usuario: User = new User(argv.user);
        usuario.printTitles();
      }
    },
  });

  yargs.parse();
}

/**
 * Función que dado un color en string lo transforma a un color recogido dentro del objeto colorNotes.
 * @param colorName string con el nombre del color
 * @returns devuelve el color en formato ColorNotes
 */
function colorGetter(colorName: string): ColorNotes {
  let formatColor: ColorNotes = "Green";
  switch (colorName) {
    case "Blue":
      formatColor = "Blue";
      break;
    case "Red":
      formatColor = "Red";
      break;
    case "Yellow":
      formatColor = "Yellow";
      break;
    case "Green":
      formatColor = "Green";
      break;
    default:
      console.log("Color no valido, asigado Verde como predeterminado");
      break;
  }
  return formatColor;
}

// Llamada a la función principal
main();
