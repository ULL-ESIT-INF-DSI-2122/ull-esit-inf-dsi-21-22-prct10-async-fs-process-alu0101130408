import 'mocha';
import {expect} from 'chai';
import {hello} from '../src/ejemplo';

describe('pruebas unitarias de ejemplo', ()=> {
  it('Prueba de hello', () =>{
    expect(hello()).to.be.eql('Hola Mundo');
  });
});
