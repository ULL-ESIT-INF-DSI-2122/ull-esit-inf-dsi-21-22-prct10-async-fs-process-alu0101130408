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

La estructura que se ha adoptado en la raíz **src/** que contiene el código fuente de los diversos ejercicio es, tal y como se ha definido un conjunto de ficheros con nombre *ejercicio-n.ts*.
* **modificacion/**: Contiene la modificacion solicitada en el PE de los Lunes
  * **ejemplo.ts**: Fichero de ejemplo que se utizo para inicializar las diferentes actions al inicializar el respositorio
  * **modificacionLunes.ts**: Fichero que contiene la modificacion solicitada el lunes.

* **ejercicio-1.ts**: Contiene el programa que se nos solicita que analicemos y comentemos en el ejercicio 1
* **ejercicio-2.ts**: Contiene la solucion implementada para el ejercicio 2.
* **ejercicio-3.ts**: Contiene la solucion implementada para el ejercicio 3.
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
* **ejercicio-2.ts**
* **searchWord.ts**

```TypeScript


```

```TypeScript


```


<br/><br/>

### 2.3. Ejercicio 3. <a name="id23"></a>

```TypeScript

```
Para las pruebas unitarias

```TypeScript

```
<br/><br/>

### 2.4. Ejercicio 4. <a name="id24"></a>


```TypeScript

```

```TypeScript

```

<br/><br/>


## 3. Dificultades. <a name="id3"></a>

Dentro de las dificultades encontradas dentro de esta práctica, me gustaría resaltar:
* a
* a

## 4. Conclusión. <a name="id4"></a>

Los objetivos que se han propuesto y se han cumplido son:
* a
* a
* a

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