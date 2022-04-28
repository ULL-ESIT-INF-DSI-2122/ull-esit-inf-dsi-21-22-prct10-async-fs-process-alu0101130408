import {spawn} from 'child_process';

/**
 * Clase encargada de realizar la busqueda a través del comando cat y grep de Linux, esta busqueda se hará a través del metodo pipe de un stream en caso de que el usuario lo active.
 */
export class SearchWord {
  /**
   * Constructor de la clase que realiza la busqueda.
   * @param path ruta del fichero donde se desea realizar la busqueda
   * @param word palabra que se desea buscar en el fichero
   * @param pipe flag que determina si se quiere realizar con pipe o sin pipe
   */
  constructor(private path: string, private word: string, private pipe: boolean) {
    this.path = path;
    this.word = word;
    this.pipe = pipe;
  }

  /**
   * Método encargado de analizar el flag del pipe, en caso de ser negativo este flag (false) se ejecuta sin el metodo pipe-
   */
  flagTester() {
    if (this.pipe == false) {
      this.sinPipe();
    } else {
      this.conPipe();
    }
  }

  /**
   * Método privado encargado de realizar la busqueda a través del método pipe de un Stream en Node.js
   */
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
  /**
   * Método privado encargado de realizar la busqueda de la palabra en el fichero  usando los subprocesos y manejadores necesarios
   */
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
