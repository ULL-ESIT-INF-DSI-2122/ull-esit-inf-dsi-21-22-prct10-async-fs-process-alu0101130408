import * as fs from 'fs';
import yargs = require('yargs');
import {spawn} from 'child_process';


/**
 * 1er Comando que analiza una ruta que introduce el usuario y determina si es un fichero o un directorio
 * @param path ruta que se debe introducir por linea de comando
 */
yargs.command( {
  command: 'analizePath',
  describe: 'Comprueba si la ruta especificada es un directorio o un fichero.',
  builder: {
    path: {
      describe: 'Ruta del directorio o fichero.',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === "string") {
      const valuePath = argv.path;
      fs.access(valuePath, (err) => {
        if (err) {
          console.log(`El directorio o fichero no existe`);
        } else {
          fs.open(valuePath, fs.constants.O_DIRECTORY, (err) => {
            if (err) {
              console.log(`La ruta ${valuePath}, se corresponde a un fichero`);
            } else {
              console.log(`La ruta ${valuePath}, se corresponde a un directorio`);
            }
          });
        }
      });
    } else {
      console.log(`El valor introducido no es válido`);
    }
  },
});


/**
 * 2do Comando que implementa la creacion de un fichero a partir de la ruta especificada por un usuario
 * @param path es la ruta donde se desea crear el nuevo directorio
 */

yargs.command( {
  command: 'mkdir',
  describe: 'Crea un directorio nuevo a partir de la ruta especificada.',
  builder: {
    path: {
      describe: 'Ruta del directorio y su nombre.',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === "string") {
      const createFile = argv.path;
      fs.access(createFile, (err) => {
        if (!err) {
          console.log(`Ya existe el directorio ${createFile}`);
        } else {
          fs.mkdir(createFile, (err) => {
            if (err) {
              console.log(`La ruta especificada no es válida`);
            } else {
              console.log(`Se ha creado el directorio en la ruta ${createFile}`);
            }
          });
        }
      });
    } else {
      console.log(`El valor introducido no es válido`);
    }
  },
});

/**
 * 3er Comando encargado de listar todos los ficheros dentro de una carpeta especificada por el usuario.
 * @param path ruta o directorio que se quiere analizar.
 */
yargs.command( {
  command: 'listFile',
  describe: 'Lista los ficheros que hay en el directorio que se especifica',
  builder: {
    path: {
      describe: 'Ruta del directorio que se analizará',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === "string") {
      const dirPath = argv.path;
      fs.access(dirPath, (err) => {
        if (err) {
          console.log(`El directorio ${dirPath} no existe`);
        } else {
          console.log(`listando los archivos dentro de: ${dirPath}`);
          const search = spawn('ls', [dirPath]);
          search.stdout.pipe(process.stdout);
        }
      });
    } else {
      console.log(`El valor introducido no es válido`);
    }
  },
});
/**
 * 4to Comando que muestra el contenido de un fichero que se introduce a través de una ruta
 * @param path ruta del fichero o directorio que se desea visualizar.
 */
yargs.command( {
  command: 'show',
  describe: 'Muestra el contenido de un fichero (similar al comando cat)',
  builder: {
    path: {
      describe: 'Ruta del fichero que se quiere mostrar',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === "string") {
      const showPath = argv.path;
      fs.access(showPath, (err) => {
        if (err) {
          console.log(`el fichero perteneciente a la ruta ${showPath} no existe o se ha introducido mal su ruta.`);
        } else {
          fs.open(showPath, fs.constants.O_DIRECTORY, (err) => {
            if (err) {
              console.log();
              const cat = spawn('cat', [showPath]);
              cat.stdout.pipe(process.stdout);
            } else {
              console.log(`La ruta  ${showPath} no es un fichero, puede corresponder a un directorio`);
            }
          });
        }
      });
    } else {
      console.log(`El valor introducido no es válido`);
    }
  },
});

/**
 * 5to Comando que elimina el fichero o directorio dado una ruta
 * @param path ruta del fichero o directorio que se desea borrar del sistema
 */
yargs.command( {
  command: 'delete',
  describe: 'Borrar ficheros y directorios introducido por el usuario',
  builder: {
    path: {
      describe: 'Ruta del directorio o fichero que se quiere eliminar',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === "string") {
      const deletePath = argv.path;
      fs.access(deletePath, (err) => {
        if (err) {
          console.log(`El directorio o fichero introducido ${deletePath} no existe`);
        } else {
          const deleteFile = spawn('rm', ['-rf', deletePath]);
          deleteFile.on('close', (err) => {
            if (err) {
              console.log(`No se ha podido eliminar el fichero que ha introducido en la ruta ${deletePath}`);
            } else {
              console.log(`El directorio o fichero ${deletePath} se ha eliminado permanentemente`);
            }
          });
        }
      });
    } else {
      console.log(`El valor introducido no es válido`);
    }
  },
});

/**
 * 6to Comando encargado de mover y copirar ficheros o directorios desde una ruta origen a una ruta destino
 * @param from ruta origen del directorio o fichero que se quiere mover y copiar a otra ubicación existente
 * @param to ruta destino donde se quiere copiar y guardar el directorio o fichero de la ruta origen
 */
yargs.command( {
  command: 'move',
  describe: 'Mover y copiar ficheros y/o directorios de una ruta a otra.',
  builder: {
    from: {
      describe: 'Ruta origen',
      demandOption: true,
      type: 'string',
    },
    to: {
      describe: 'Ruta destino',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.from === "string") && (typeof argv.to === "string")) {
      const originPath = argv.from;
      const destinationPath = argv.to;
      fs.access(`${argv.from}`, (err) => {
        if (err) {
          console.log(`El fichero o directorio situado en ${originPath} no existe`);
        } else {
          const moveFile = spawn('cp', ['-r', originPath, destinationPath]);
          moveFile.on('close', ()=> {
            console.log(`El fichero o directorio situado en ${originPath} se ha movido y copiado al directorio ${destinationPath}`);
          });
        }
      });
    } else {
      console.log(`El valor introducido no es válido`);
    }
  },
});

yargs.parse();
