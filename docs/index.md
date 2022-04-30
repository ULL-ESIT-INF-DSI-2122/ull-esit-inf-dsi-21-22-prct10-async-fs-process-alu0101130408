# Práctica 10 - Sistema de ficheros y creación de procesos en Node.js
# Desarrollo de Sistemas Informáticos
# Universidad de la Laguna

### Autor:  
  * Joel Francisco Escobar Socas - alu0101130408@ull.edu.es


### Índice:

1. [Introducción y objetivos.](#id1)

2. [Desarrollo.](#id2)
      
      2.1. [Ejercicio 1.](#id21)

      2.2. [Ejercicio 2.](#id22)

      2.3. [Ejercicio 3.](#id23)
      
      2.4. [Ejercicio 4.](#id24)

3. [Dificultades.](#id3)

4. [Conclusión.](#id4)

5. [Referencias.](#id5)

<br/><br/>

## 1. Introducción y objetivos. <a name="id1"></a>

El Objetivo de esta práctica es implementar diversas soluciones para resolver una serie de ejercicios que se nos propone haciendo uso de TypeScript y diversos modulos que hemos visto como chalk y yargs además de utilizar las APIs proporcionadas por Node.js para interacturar con el sistema de ficheros y callbacks. 

<br/><br/>

## 2. Desarrollo. <a name="id2"></a>

La estructura que se ha adoptado en la raíz **src/** que contiene el código fuente de los diversos ejercicio es, tal y como se ha definido un conjunto de directorios con el nombre del ejercicios y dentro de este los diversos ficheros que implementan su funcionalidad con nombre *ejercicio-n.ts*.
* **modificacion/**: Contiene la modificacion solicitada en el PE de los Lunes
  * **ejemplo.ts**: Fichero de ejemplo que se utizo para inicializar las diferentes actions al inicializar el respositorio
  * **modificacionLunes.ts**: Fichero que contiene la modificacion solicitada el lunes.


* **ejercicio-1/**: directorio que contiene las soluciones al enunciado 1
  * **ejercicio-1.ts**: Contiene el programa que se nos solicita que analicemos y comentemos en el ejercicio 1

* **ejercicio-2/**: directorio que contiene las soluciones al enunciado 2
  * **ejercicio-2.ts**: Contiene la solucion implementada para el ejercicio 2.
  * **searchWord.ts**: Contiene la clase que se encarga de buscar.

* **ejercicio-3/**: directorio que contiene las soluciones al enunciado 3
  * **ejercicio-3.ts/**: Contiene la solucion implementada para el ejercicio 3.
  * **app**: contiene los fichero que implementa la práctica 9
  * **database**: contiene los ficheros que implementa la base de datos

* **ejercicio-4/**: directorio que contiene las soluciones al enunciado 4
  * **ejercicio-4.ts**: Contiene la solucion implementada para el ejercicio 4.

A continuación vamos a explicar de forma más detallada las soluciones que he implementado:

### 2.1.  Ejercicio 1. <a name="id21"></a>

Este primer ejercicio consiste en analizar y entender la ejecución del siguiente código que se nos ha facitilidado en el [guión](https://ull-esit-inf-dsi-2122.github.io/prct10-async-fs-process/) de esta práctica. Este programa es el siguiente:

```TypeScript
import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```
Tal y como se nos pide, se realizará una traza de la ejecución del programa. Pero primero ¿Qué hace la función access? La función `access` del módulo *fs* de Node.js es una función que permite comprobar los permisos que tiene un usuario sobre un archivo, que ejecuta en nuestro caso el programa y ¿Para qué sirve el objeto constants? es un objeto que recoge distintos flags para la funcion access de fs. Basicamente fs.access recibe como parámetro un objeto constants y dependiendo de este flag comprueba el permiso que se especifica. En el ejemplo que tenemos, se utiliza **F_OK** para comprobar que el usuario pueda visualizar el fichero otras alternativas que recoge este objeto son: **R_OK**, **W_OK**, **X_OK** que permiten analizar los permisos de lectura, escritura y ejecucion.

En cuanto a la ejecución del programa, hay que ejecutarlo como se ha visto en la asignatura y se le pasa el nombre del fichero que se quiere ejecutar, en este caso, el fichero `helloWorld.txt`. una vez ejecutado este programa se podra observar como su ejecución es asincrona esto es ocacionado por la función fs.watch y por todos los objetos de clase EventEmitterse que se ejecutan cuando se cumple una condición. Pero, ¿Y si se cumplen diversas condiciones a la vez? para manejar esto, node.js implementa diversas pilas de las cuales va haciendo uso. Más concretamente en nuestro programa el funcionamiento es el siguiente:

* Inicialmente están vacías.

| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK| CONSOLA |  
|------------------|-------------------|-----------------|---------|
|                  |                   |                 |         |

* Tras ejecutar el programa, la función main entra en la pila de llamada.

| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK| CONSOLA |  
|------------------|-------------------|-----------------|---------|
|main()            |                   |                 |         |

* A continuación puede ocacionarse dos posibles casos.Se analiza la condicion de que `process.argv.lenght` sea distinto de 3 argumentos que se pasan por linea de comando, en caso de cumplirse, entra el console.log a la pila de llamadas:

| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK| CONSOLA |  
|------------------|-------------------|-----------------|---------|
|main()            |                   |                 |         |
|console.log('...')|                   |                 |         |           

* Se saca de la pila de llamadas el console.log correspondiente y se imprime por pantalla su mensaje

| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK| CONSOLA                        |  
|------------------|-------------------|-----------------|--------------------------------|
|main()            |                    |                 | console.log('Please, specify') |
       
* el main acaba y se saca de la pila de llamadas y el programa finalizada

| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK| CONSOLA                        |  
|------------------|-------------------|-----------------|--------------------------------|
|                  |                   |                 | console.log('Please, specify') |

* En caso de no cumplirse, la comprobación y se pasen los argumentos correctos. Entra `access` a la pila de llamadas:

| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK| CONSOLA |  
|------------------|-------------------|-----------------|---------|
|main()            |                   |                 |         |
|access(...)       |                   |                 |         |          

* A continuación access sale de la pila de llamadas y entra en el registo de eventos la API de Node.js. y Posteriormente sale la función main de la pila de llamadas.

| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK| CONSOLA |  
|------------------|-------------------|-----------------|---------|
|                  |access(...)        |                 |         |

* `access` pasa a la cola de Manejadores (cola de Callback). 

| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK| CONSOLA |  
|------------------|-------------------|-----------------|---------|
|anonymous(access) |                   |access(...)      |         |

* Pero como esta vacía la pila de llamadas. entra access a la pila de llamadas, se ejecuta y entra el `console.log`:

| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK| CONSOLA |  
|------------------|-------------------|-----------------|---------|
|access(...)       |                   |                 |         |
|console.log(...)  |                   |                 |         |

* se ejecuta `console.log` y se muestra por pantalla su contenido

| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK| CONSOLA                        |  
|------------------|-------------------|-----------------|--------------------------------|
|acces(...)        |                   |                 | console.log('Starting watch')  |

* Se ejecuta La función `watch(process.argv[2])`  y como no es un bucle iterado, sale de la pila de llamadas. Más tarde entra en la pilla de llamadas la funcion `watcher.on`:

| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK| CONSOLA                        |  
|------------------|-------------------|-----------------|--------------------------------|
|acces(...)        |                   |                 | console.log('Starting watch')  |
|watcher.on(...)   |                   |                 |                                |

* La función watcher.on() sale de la pila de llamadas y entra al registro de eventos de la API de Node.js

| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK| CONSOLA                        |  
|------------------|-------------------|-----------------|--------------------------------|
|acces(...)        |watcher.on(...)    |                 | console.log('Starting watch')  |

* La función watcher.on() esperará a que se produzca algún cambio en ese fichero, así que ahora entra a la pila de llamadas el console.log(File ${filename} is no longer watched) correspondiente.

| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK| CONSOLA                        |  
|------------------|-------------------|-----------------|--------------------------------|
|acces(...)        |watcher.on(...)    |                 | console.log('Starting watch')  |
|console.log(File) |                   |                 |                                |

* Se ejecuta el console.log que ha entrado, sale de la pila de llamadas y se muestra por consola su mensaje:


| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK| CONSOLA                        |  
|------------------|-------------------|-----------------|--------------------------------|
|acces(...)        |watcher.on(...)    |                 | console.log('Starting watch')  |
|                  |                   |                 | console.log(File is no watched)|

* Con esto ya se ha recorrido todo el codigo, por lo que sale `access ` de la pila de llamadas y el programa se queda esperando. Ahora realizaremos una modificación en el fichero `helloWorld.txt` que es el archivo que estamos analizando. Por lo que se detectará con la función **watcher.on** que estaba esperando y se mandara a la cola de manejadores de node.js el console.log con el mensaje *has been modified somehow*.


| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK    | CONSOLA                        |  
|------------------|-------------------|---------------------|--------------------------------|
|                  |watcher.on(...)    |console.log(modified)| console.log('Starting watch')  |
|                  |                   |                     | console.log(File is no watched)|

* Se detecta el console.log y se manda a la pila de llamadas:


| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK    | CONSOLA                        |  
|------------------|-------------------|---------------------|--------------------------------|
|console.log(modif)|watcher.on(...)    |                     | console.log('Starting watch')  |
|                  |                   |                     | console.log(File is no watched)|

* Se ejecuta el console.log saliendo de la pila de llamadas u mostrando por consola su contenido

| Pila de llamadas |REGISTRO DE EVENTOS| COLA DE CALLBACK    | CONSOLA                        |  
|------------------|-------------------|---------------------|--------------------------------|
|                  |watcher.on(...)    |                     | console.log('Starting watch')  |
|                  |                   |                     | console.log(File is no watched)|
|                  |                   |                     | console.log(modified)          |

* De esta forma por cada cambio mostrará un respectivo mensaje por consola. Así funciona las pilas de node.js para el programa especifico que se nos ha solicitado. 

Debido a que solo se nos solicita en el enunciado que realizemos las respuestas a las preguntas planteadad y que se haga la traza de la ejecución del programa, no se ha podido realizar las pruebas unitarias puesto que los test con mocha solo se pueden realizar sobre variables y estructuras de datos.


<br/><br/>

### 2.2. Ejercicio 2. <a name="id22"></a>

Para ejecutar el ejercicio es necesario conocer acerca de su funcionamiento. Para ello tras ejecutar el comando `tsc` en la linea de comandos se generará la carpeta dist que contendrá la interpretación de los ficheros en Javascript. Posteriormente si queremos ejecutar el programa referente al ejercicio numero dos, se deberá añadir en el campo **file** la ruta o el nombre del fichero donde realizar la búsqueda, en el campo **word** la palabra que se desea buscar en el fichero y en el campo **pipe** *false* en caso de querer realizar las búsquedas con los manejadores que se han implementado para esta operación o *true* si se desea buscar a través del método pipe de un Stream proporcionado por Node.js. Un ejemplo de la ejecución del programa en la bash de linux sería el siguiente:

```
$ node dist/ejercicio-2/ejercicio-2.js search --file="prueba.txt" --word="Hola" --pipe=true
```
De esta forma con search indicamos que queremos buscar en el fichero `prueba.txt` la palabra `Hola` a través del método pipe de los Streams de Node.js.  Y este devolverá por consola un mensaje en caso de que el fichero exista y un mensaje con el número de palabras que se ha encontrado. En caso de introducir valores que no existen el programa los reconocerá y visualizará mensajes de error. La salida del ejemplo anterior sería:

```
El fichero introducido si existe, su nombre es: prueba.txt
Se ha encontrado 3 palabras que coinciden con Hola
```

Toda esta funcionalidad la hemos desarrollado en el la carpeta src/ejercicio-2/*. Dentro podemos notar que se han creados dos ficheros.

* **ejercicio-2.ts**: implementa la función principal que se encarga de utilizar yargs para implementar el comando que se encarga de buscar. Para ello, como se hizo en la práctica anterior se usa `yargs`y se solicitan de forma obligatoria 3 parámetros para ejecutar la búsqueda. El primero es el nombre del fichero donde se desea buscar, el segundo es la palabra que se desea buscar dentro de ese fichero y la tercera es un flag (boolean) que determina si se desea realizar con pipe(true) o sin pipe (false). a continuación en el handler o el manejador lo que hacer es analizar si los tipos introducidos son correctos y posteriormente almacenamos los valores que se introdujo en variables y despues comprobamos que se puede acceder al fichero con el método acces de fs de node.js, en caso de que no podamos mostramos un mensaje y en caso de poder acceder al fichero que especifico el usuario creamos un objeto de tipo búsqueda al que le pasamos estos tres parámetros que puso el usuario y llamamos al método encargado de analizar el método con el que quiso buscar el usuario (si se desea que sea con pipe o no).

```TypeScript
import * as fs from 'fs';
import * as yargs from 'yargs';
import {SearchWord} from './searchWord';

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

main();

```

* **searchWord.ts**: Que implementa la Clase encargada de realizar la busqueda a través del comando cat y grep del sistema Linux y que implementa diversos métodos que permiten buscar dentro de un fichero a través del uso de pipe o sin el uso de pipe. para ello se solicitan 3 objetos dentro del constructor, que serán los que se solicitan al usuario a través de linea de comando, para ello se inicializan estos atributos privados y posteriormente se crean 2 métodos privados y 1 publico. El publico es el **flagTester** que se encarga de analizar el pipe que introdujo el usuario en caso de ser false se llama al método privado de la clase que realiza la búsqueda sin pipe, en caso contrario se realiza la búsqueda utilizando pipe. Dentro de este método se inicializa con cat y grep los dos comandos de linuexcon la opcion de la ruta para el caso de cat y de la palabra para el caso de grep posteriormente se hace uso de la opcion *stdout.pipe* que se encarga de aplicar pipe dentro de estos dos comandos. Posteriormente declaramos dos variables una que se encargará de contar el numero de palabras y otra que ira alamacenando las palabras dentro del fichero. por lo que introducimos cada valor y lo covnertimos a strign una vez cerrado el fichero separamos por comas cada palabra recogida y analizamos en caso de que coincida esta palabra del fichero con la palabra que introdujo el usuario, sumamos 1 ocurrencia al contador y al finalizar analizamos el contador, en caso de ser 0 esque no se ha encontrado la palabra y en caso de que sea mayor estricto que 0 mostramos el numero de ocurrencias.

El funcionamiento del método sin pipe es similar al anterior. la diferencia radica en como accedemos a los comandos en este caso como no utilizamos pipe lo que hago es declarar una variable que se encargará de ejecutar con spawn el comando cat y dentro de las opciones de cat añadimos que haga grep de la palabra que queremos buscar en el archivo y posteriormente operamos de la misma forma que se hizo en el caso anterior, es decir, declaramos las variables y analizamos tras sustituir todos los espacios por comas buscamos si la palabra se corresponde a la que el usuario introdujo en caso afirmativo sumamos +1 al contador y visualizamos al final el resultado de ocurrencias.

```TypeScript
import {spawn} from 'child_process';

export class SearchWord {

  constructor(private path: string, private word: string, private pipe: boolean) {
    this.path = path;
    this.word = word;
    this.pipe = pipe;
  }

  flagTester() {
    if (this.pipe == false) {
      this.sinPipe();
    } else {
      this.conPipe();
    }
  }

  private conPipe() {
    const cat = spawn('cat', [this.path]);
    const grep = spawn('grep', [this.word]);
    cat.stdout.pipe(grep.stdin);
    let count: number = 0;
    let value: string = '';
    grep.stdout.on('data', (item)=> {
      value = item.toString();
    });
    grep.on('close', ()=> {
      const result = value.split(/\s+/);
      result.forEach((item) => {
        if ((item == this.word) || item == this.word+'.') {
          count = count + 1;
        }
      });
      if (count == 0) {
        console.log(`No se ha encontrado ninguna palabra que coincida con ${this.word}`);
      } else {
        console.log(`Se ha encontrado ${count} palabras que coinciden con ${this.word}`);
      }
    });
  }

  private sinPipe() {
    const catAndGrep = spawn('cat', [this.path, 'grep', this.word]);
    let count: number = 0;
    let value: string = '';
    catAndGrep.stdout.on('data', (item)=> {
      value = item.toString();
    });
    catAndGrep.on('close', ()=> {
      const result = value.split(/\s+/);
      result.forEach((item) => {
        if ((item == this.word) || item == this.word+'.') {
          count = count + 1;
        }
      });
      if (count == 0) {
        console.log(`No se ha encontrado ninguna palabra que coincida con ${this.word}`);
      } else {
        console.log(`Se ha encontrado ${count} palabras que coinciden con ${this.word}`);
      }
    });
  }
}

```

No se ha podido realizar pruebas por lo comentado con anterioridad.

<br/><br/>

### 2.3. Ejercicio 3. <a name="id23"></a>

En el ejercicio 3 nos solicitan a través del ejercicio realizado en la práctica anterior (práctica 9), correspondiente a implementar un sistema que permita la manipulación de notas por parte de diferentes usuarios. A partir de este ejercicio, se solicita realizar un programa que permita controlar los cambios realizados sobre todo el directorio especificado al mismo tiempo que dicho usuario interactúa con la aplicación de procesamiento de notas. De esta forma se espera que esta aplicación muestre un mensaje en caso de que añada, elimine o modifique alguna nota dentro del sistema.

Por lo que para ejecutarla a través de línea de comando he decicido hacer uso de la herramienta `yargs` que permite analizar a través de línea de comando las opciones que el usuario introdusca. Tras importar en la carpeta toda la aplicación de la práctica anterior para comprobar el funcionamiento de esta se ha creado el fichero **ejercicio-3.ts** que se encarga de realizar la funcionalizad para analizar la base de datos del sistema de notas.

Para ello con yargs implementamos el comando `watch` y esperamos que el usuario introduzca de forma obligatoria dos opciones. user, que será el usuario que se desea analizar y path que será la ruta de la carpeta a analizar (que se espera que sea la ruta de la base de datos). Una vez introducido estos valores entramos al manejador de yargs que será  *handler* y analizamos si el tipo recogido en las dos opciones son string es decir cadenas de caracteres en caso de que asi sea entonces creamos la ruta del fichero en un variable añadiendole *'./ ruta/usuario', posteriormente se comprueba si se puede acceder a este ruta usando `fs.access`, en caso afirmativo, utilizamos `fs.watch()` para crear un objeto watcher que dará la información sobre los cambios que ocurran en el directorio. Para conseguir esto hacemos uso de un **Callback** en el cual se declaran dos variables, **type** y **filename** que indica que tipo de accion ha sucedido y sobre que carpeta. A continuación se crea la ruta absoluta del fichero y se analizan los posibles cambios que pudo haber sucedido. 

Para analizar estos cambios, **type** solo puede recoger dos posibles valores, por un lado *rename* que en caso de aparecer significa que se ha añadido o borrado un fichero dentro del directorio tal y como figura en la documentación y por otro lado *change* que indica si ha habido alguna modificacion dentro del fichero de un directorio.

en el primer caso, en el de rename, comprobamos que se pueda acceder a través de `fs.access` a la ruta absoluta que se creo con anterioridad. En caso de que al acceder al fichero surja un error, esto implica que el fichero ha sido borrado, mientras que si se puede acceder a el sin problemas significa que el fichero se ha creado. En caso de crearse aprovecho y muestro a través de `fs.readFile` el contenido del fichero que se ha creado.

En caso de que el typo de evento que surja sea `change` significa que se ha producido algun cambio sobre el fichero. Por lo que si **type** obtiene este valor, entonces lo comunicamos a través de consola y mostramos el contenido actual del fichero modificado con `fs.readFile`. Y comprobamos finalmente si el fichero ha sido cerrado. Entonces mostramos el mensaje correspondiente.


```TypeScript
import * as fs from 'fs';
import * as yargs from 'yargs';

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

```
Para las pruebas unitarias no hemos podido realizar ninguna debido a que hacemos uso de yargs y no de estructuras de datos para poder analizar con el frame de `mocha`.

Preguntas planteadas en este ejercicio:

* ¿Qué evento emite el objeto Watcher cuando se crea un nuevo fichero en el directorio observado? ¿Y cuando se elimina un fichero existente? ¿Y cuando se modifica?

Un objeto Watcher emite un evento rename cuando un elemento aparece o desaparece de un directorio y cuando se modifica emite un evento change.

* ¿Cómo haría para mostrar, no solo el nombre, sino también el contenido del fichero, en el caso de que haya sido creado o modificado?
  
  En este caso, lo he implementando, primero nos aseguramos que se pueda acceder al fichero con `fs.access` y posteriormente hago uso del método `fs.readFile` el cual recibe la ruta absoluta del fichero, la codificacion y un callback que determina si ha habido algún error o no. En caso de que no haya sucedido algun error, simplemente mostramos por consola el valor que contiene el fichero.

* ¿Cómo haría para que no solo se observase el directorio de un único usuario sino todos los directorios correspondientes a los diferentes usuarios de la aplicación de notas?

Para observar los cambios no solo de un fichero sino de todos los ficheros de los diferentes usuarios tendriamos que leer el contenido de todo el directorio con `fs.readdir`y almacenar en una variable sus contenidos para posteriormente recorrerlo y obtener las carpetas de cada usuario, es decir argv.user, y solo quedaría crear diversos objetos de tipo `watcher` por cada usuario que hay en el directorio.


> Nota: Hay que tener en cuenta que tuve un problema a la hora de implementar este ejercicio que se comentará de forma más extensa en el apartado 3, dedicado a las dificultades que he tenido a lo largo de la implementacion de la práctica.

<br/><br/>

### 2.4. Ejercicio 4. <a name="id24"></a>

En el ejercicio 4 nos solicitan:

```
Desarrollar una aplicación que permita hacer de wrapper de los distintos comandos empleados en Linux para el manejo de ficheros y directorios. En concreto, la aplicación deberá permitir:
  1. Dada una ruta concreta, mostrar si es un directorio o un fichero.
  2. Crear un nuevo directorio a partir de una nueva ruta que recibe como parámetro.
  3. istar los ficheros dentro de un directorio.
  4. Mostrar el contenido de un fichero (similar a ejecutar el comando cat).
  5.Borrar ficheros y directorios.
  6. Mover y copiar ficheros y/o directorios de una ruta a otra. Para este caso, la aplicación recibirá una ruta origen y una ruta destino. En caso de que la ruta origen represente un directorio, se debe copiar dicho directorio y todo su contenido a la ruta destino.

```

Para implementar estos 6 comandos de linux referentes al manejo de fichero y directorios he decidido utilizar la herramiento `yargs` y crear 1 comando por cada especificación que nos solicitan. 

De esta forma, para el primero encargado de analizar una ruta que introduce el usuario y determinar si es un fichero o un directorio hago uso de `spawn` de chil_process de node.js. por lo que recibimos de forma obligatoria una ruta por línea de comandos y en el manejador, comprobamos a través de un **callback** si se puede acceder a la ruta a través de fs.access, en caso de poder acceder, es decir, la ruta existe. Entonces intentamos abrir el fichero especificado en la ruta a través de `fs.open` en caso de que se pueda abrir, entonces la ruta corresponde a un fichero y si no se pudo abrir corresponde a un directorio. Y dependiendo de si se pudo abrir o no muestro un mensaje o otro.

```TypeScript
import * as fs from 'fs';
import yargs = require('yargs');
import {spawn} from 'child_process';

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

```

Para el segundo comando, nos piden crear un nuevo directorio o fichero a través de una ruta dada por el usuario, por lo que al igual que se hizo anterior se solicita al usuario una ruta, en el manejador guardamos esta ruta en una variable que denominamos como *createFile*  y comprobamos que no exista ya un fichero con ese nombre o un directorio en esa ruta, despues hacemos uso de `fs.mkdir`que crea un directorio con la ruta dada.

```TypeScript
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
```

Para el tercer comando nos solicitan listar todos los ficheros que hay en un directorio dado por el usuario a través de una ruta. Por lo que operamos de forma igual a como se ha hecho hasta ahora, la diferencia esque ahora en el manejador tras guardar la ruta en una variable y comprobar que se pueda acceder a esta ruta hacemos uso de `fs.ls` que nos da `spawn` de chil_proccess, y de esta forma visualizamos el contenido de esta ruta que ha introducido el usuario.

```TypeScript
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
```

Para el cuarto comando, nos piden mostrar el contenido de un fichero, dada a una ruta, similar a como funciona el comando `cat` por lo que se opera como se ha hecho hasta ahora una vez analizado el valor introducido en el manejador y guardada la ruta en la variable hacemos uso de spawn con el comando cat al que le pasamos la rita y mostramos todo el contenido del fichero con pipe `process.stdout`.

```TypeScript
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
```
Para el quinto comando nos piden dada una ruta eliminar el fichero o el directorio de forma recursiva,Por lo que realizamos lo mismo que se ha hecho en el resto de los comandos y ahora hacemos uso de spawn pero como el comando de linux `rm` con la opcion *-rf* que elimina un directorio o fichero de forma recursiva y sin preguntar por lo que al borrar algo importante  puede ser un error catastrofico. 

```TypeScript
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
```

Para el último comando se pide mover un fichero desde una ruta hacia otra. Para esto, se recoge a través de `yargs` dos opciones obligatorias, la ruta origen (from), que es aquella ruta donde se encuentra el fichero o directorio a mover y la ruta destino (to), que es la ruta donde se desea mover el fichero o directorio y guardar este mismo. Dentro del manejador comprobamos que se hayan introducido string y no otros valores y luego guardamos estos valores en dos variables y comprobamos que el fichero en la direccion origen exista a través de `fs.access` si existe el ficher y se ha podido acceder a el entonces usamos spawn pero con el comando `cp` que permite copiar un archivo de una ruta a otra. de esta forma con la opcion -r especificamos que se haga una copia del archivo de la direccion origen  en la direccion destino y le pasamos estas dos direcciones. Y tras cerrar el fichero o directorio abierto e ir todo bn mostramos un mensaje de exito.

```TypeScript
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

```

De forma resumida los comandos implementados y su funcionamiento se resumen en:

```
  1. analizePath -> Dada una ruta concreta, mostrar si es un directorio o un fichero.
  2. mkdir -> Crear un nuevo directorio a partir de una nueva ruta que recibe como parámetro.
  3. listFile -> listar los ficheros dentro de un directorio.
  4. show -> Mostrar el contenido de un fichero (similar a ejecutar el comando cat).
  5. delete -> Borrar ficheros y directorios.
  6. move -> Mover y copiar ficheros y/o directorios de una ruta a otra. Para este caso, la aplicación recibirá una ruta origen y una ruta destino. En caso de que la ruta origen represente un directorio, se debe copiar dicho directorio y todo su contenido a la ruta destino.
```

Para las pruebas unitarias no hemos podido realizar ninguna debido a que hacemos uso de yargs y no de estructuras de datos para poder analizar con el frame de `mocha`.

<br/><br/>


## 3. Dificultades. <a name="id3"></a>

Dentro de las dificultades encontradas dentro de esta práctica, me gustaría resaltar: 

* la principal dificultad que he tenido a la hora de implementar el ejercicio numero 3, correspondiente a analizar los ficheros de la base de datos de un usuario para analizar si se añade, elimina o modifica una nota. En mi caso, tuve un problema debido a que tal y como implementé en la práctica anterior la base de datos, que está situada en el directorio **database**, para lo que hago es crear un fichero de tipo *JSON* con el nombre del usuairo y dentro alamaceno todas las notas correspondiente a este usuario. Sin embargo, el metodo watch de fs mira un directorio y mi base de datos no esta compuesta por directorios con el nombre del usuario y dentro el fichero. Por lo que he tenido que adaptar la estructura de la base de datos a la comentada anteriormente para analizar el correcto funcionamiento.

* Otro problema que he tenido es la ejecución de los test puesto que no he podido crear pruebas de test con `mocha` debido a que solo funcionan los test con estructuras de datos. Cosa que no estamos utilizando Node.js para la solución de estos ejercicios planteados.

## 4. Conclusión. <a name="id4"></a>

Se han cumplido todos los objetivos propuestos realizando los 4 ejercicios tal y como se plantearon a excepcion del problema comentado en el apartado anterior, pero pese a este inconveniente, el programa funciona correctamente tal y como se espera. De esta forma hemos realizado un ejercicio que explica el funcionamiento de la cola y las pilas de `Node.js` y la gestion por parte del sistema de las mismas, también se ha implementado un programa que permite buscar en un archivo de texto el número total de ocurrencias dentro de un fichero de texto, también se ha reutilizado el código de la práctica anterior y se ha creado un fichero que permite implementar un comando que observa para esta base de datos si se añade, elimina o modifica algun fichero y por último se ha realizado una serie de comandos que implementan un wrapper de tal manera que permite simular diversos comandos de linux tal y como se especificaba en el guión de la práctica.

## 5. Referencias. <a name="id5"></a>
1. [Github](http://github.com)
2. [Repositorio de la Pŕactica](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-alu0101130408.git)
3. [Guión de la Pŕactica 10](https://ull-esit-inf-dsi-2122.github.io/prct10-async-fs-process/)
4. [Documentación GitHub Actions](https://docs.github.com/en/actions)
5. [Documentación Istanbul](https://istanbul.js.org/)
6. [Documentación Coveralls](https://coveralls.io/)
7. [Documentación de TypeDoc.](https://typedoc.org/)
8. [Documentación de Mocha.](https://mochajs.org/)
9. [Documentación de Chai.](https://www.chaijs.com/)
10. [Documentacion sobre el modulo LowDB](https://www.npmjs.com/package/lowdb)
11. [Documentacion sobre el modulo Yargs](https://www.npmjs.com/package/yargs)
12. [Documentacion sobre el modulo Chark](https://www.npmjs.com/package/chalk)
13. [Documentacion sobre el uso de filesystem de node.js](https://nodejs.org/dist/latest-v17.x/docs/api/fs.html#synchronous-api)
14. [Documentacion de child process](https://nodejs.org/api/child_process.html)
15. [Documentacion de la libreria Math](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
16. [Documentacion sobre el uso de fylesync](https://www.geeksforgeeks.org/node-js-fs-readdirsync-method/)
17. [Documentacion sobre como crear tablas en Markdown](https://limni.net/crear-tablas-markdown-tableflip/)
18. [APIs de CallBacks para interactuar con el sistema de ficheros](https://nodejs.org/dist/latest-v18.x/docs/api/fs.html#callback-api)
19. [APIs asincrona para crear procesos](https://nodejs.org/dist/latest-v18.x/docs/api/child_process.html#asynchronous-process-creation)
20. [Funcion access de fs ](https://es.acervolima.com/node-js-metodo-fs-access/)
21. [Objeto constat](https://www.geeksforgeeks.org/node-js-fs-access-method/)
22. [Expresiones regulares en JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_Expressions)
23. [Pipe en Node.JS](https://guru99.es/node-js-streams-filestream-pipes/)
24. [Documentacion de Stream en Node.js](https://nodejs.org/api/stream.html)
25. [Documentacion de Callbacks](https://nodejs.org/dist/latest/docs/api/fs.html#fs_callback_api)