import {watchFile} from 'fs';
import {spawn} from 'child_process';

class EventFile {
  constructor(private camino:string) {
    this.camino = camino;
  }
  observar() {
    watchFile('../modif.txt', (curr, prev) => {
      console.log(`File was ${prev.size} bytes before it was modified.`);
      console.log(`Now file is ${curr.size} bytes.`);
      const cut = spawn('cut', ['-d', ',', '-f', '1', '../modif.txt']);
      const arrayCut: string[] = [];
      // cut.stdout.pipe(process.stdout);
      cut.stdout.on('data', (elemento) => arrayCut.push(elemento));
      console.log(`la salida es: ${arrayCut}`);
    });
  }
}

const prueba:EventFile = new EventFile('../modif.txt');
prueba.observar();
