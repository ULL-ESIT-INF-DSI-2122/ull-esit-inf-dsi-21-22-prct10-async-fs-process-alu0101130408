import * as fs from 'fs';
import * as yargs from 'yargs';
import {SearchWord} from './searchWord';

/**
 * Función principal que analiza los valores introducidos por el usuario a través del modulo yargs de node.js
 * @param file Nombre del fichero donde deseamos hacer la búsqueda
 * @param word Palabra que se desea buscar en el fichero
 * @param pipe Flag que se introduce para realizar la busqueda a través de pipe o no.
 */
function main() {
  yargs.command({
    command: 'search',
    describe: 'Comando que busca el numero de una palabra en un fichero',
    builder: {
      file: {
        describe: 'Nombre del fichero donde se desea buscar',
        demandOption: true,
        type: 'string',
      },
      word: {
        describe: 'Palabra que se quiere buscar',
        demandOption: true,
        type: 'string',
      },
      pipe: {
        describe: 'Flag que comprueba si se quiere a través de un pipe o no',
        demandOption: true,
        type: 'boolean',
      },
    },
    handler(argv) {
      if ((typeof argv.file === 'string') && (typeof argv.word === 'string')&& (typeof argv.pipe === 'boolean')) {
        const filename:string = argv.file;
        const wordToSearch:string = argv.word;
        const pipeFlag: boolean = argv.pipe;
        fs.access(filename, fs.constants.R_OK, (err) => {
          if (err) {
            console.log(`El fichero introducido no existe`);
          } else {
            console.log(`El fichero introducido si existe, su nombre es: ${filename}`);
            const objectSearchable: SearchWord = new SearchWord(filename, wordToSearch, pipeFlag);
            objectSearchable.flagTester();
          }
        });
      }
    },
  });

  yargs.parse();
}

/**
 * Llamada a la función principal
 */
main();
