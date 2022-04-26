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
  console.log('Esta es la última línea.');
}
```
Aqui va la explicacion de las colas de node.js

Como puede verse, la estructura de las colas es la siguiente

|Cabecera 1|Cabecera 2|Cabecera 3|
|----------|----------|----------|


<br/><br/>

### 2.2. Ejercicio 2. <a name="id22"></a>


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