import * as fs from 'fs';
import * as yargs from 'yargs';

/**
 * Función que recibe por linea de comando con yargs el usuario y el directorio que se quiere analizar.
 * @param user carpeta que se quiere analizar
 * @param path camino donde se encuentra el directorio a analizar
 */

yargs.command({
  command: 'watch',
  describe: 'Specifies the path of the directory to watch',
  builder: {
    user: {
      describe: 'Nombre del usuario',
      demandOption: true,
      type: 'string',
    },
    path: {
      describe: 'ruta de la carpeta',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.path === 'string') {
      console.log(`todo va bien`);
      const fileroute: string = argv.path + '/' + argv.user;
      fs.access(fileroute, fs.constants.R_OK, (err)=>{
        if (err) {
          console.log(`El fichero ${fileroute} no existe.`);
        } else {
          console.log(`El fichero ./${argv.path}/${argv.user} si existe.`);
          const look = fs.watch(fileroute, (type, filename) => {
            const file = fileroute + '/' + filename;
            if (type === 'rename') {
              fs.access(file, fs.constants.F_OK, (err) => {
                if (err) {
                  console.log(`Se ha borrado el fichero con nombre' ${filename}' en ${fileroute}`);
                } else {
                  console.log(`Se ha creado el fichero con nombre' ${filename}' en ${fileroute}`);
                  fs.readFile(file, 'utf8', (err, data)=> {
                    if (err) {
                      console.log(`No se ha podido leer el fichero`);
                    } else {
                      console.log(`El fichero ${filename}: `);
                      console.log(data);
                    }
                  });
                }
              });
            } else if (type === 'change') {
              console.log(`Se ha modifiado el fichero ${file}`);
              fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                  console.log(`No se ha podido leer el fichero`);
                } else {
                  console.log(`El contenido del fichero ${filename} es: `);
                  console.log(data);
                }
              });
            }
          });
          look.on('close', ()=> {
            console.log(`Se ha cerrado el fichero`);
          });
        }
      });
    } else {
      console.log(`el valor de algun argumento no es de tipo string`);
    }
  },
});

yargs.parse();
