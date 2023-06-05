import { identificaLink, mdLinks, validate} from "../src/md-links";
import fs from 'fs';

jest.mock('fs');

describe('identificaLink', () => {
  it('deve ser uma função', () => {
    expect(typeof identificaLink).toBe('function');
  });
});


it('deve extrair corretamente os links', () => {
  const texto = `[Teste](https://httpstat.us/404).
  [Daiki](http://meugatodaiki.com.br/).`

  const resultadoEsperado = [{ href: 'https://httpstat.us/404', text: 'Teste', file: 'rota'}, { href: 'http://meugatodaiki.com.br/', text: 'Daiki', file: 'rota'}]
  const caminhoArquivo = 'rota';
  const result = identificaLink(texto, caminhoArquivo);
 expect(result).toEqual(resultadoEsperado);
});

describe('validate', () => {
  it('deve validar os links válidos', async () => {
    global.fetch = jest.fn().mockResolvedValue(
     { ok: 'ok'}
    );
    const listaLinks = [
      { href: 'https://www.google.com', nome: 'Google' },
      { href: 'https://www.twitter.com', nome: 'Twitter' }];

    const listaEsperada = [
      { href: 'https://www.google.com', nome: 'Google', ok: 'ok' },
      { href: 'https://www.twitter.com', nome: 'Twitter', ok: 'ok' }];

    const listaValidos = await validate(listaLinks);
    expect(listaValidos).toEqual(listaEsperada);
  });
});

describe('validate', () => {
  it('deve validar os links quebrados', async () => {
    global.fetch = jest.fn().mockResolvedValue(
     { ok: false },
    );
    const listaLinks = [
      { href: 'https://www.google.com', nome: 'Google' },
      { href: 'https://www.twitter.com', nome: 'Twitter' }];

    const listaEsperada = [
      { href: 'https://www.google.com', nome: 'Google', ok: 'fail' },
      { href: 'https://www.twitter.com', nome: 'Twitter', ok: 'fail' }];

    const listaQuebrados = await validate(listaLinks);
    expect(listaQuebrados).toEqual(listaEsperada);
  });
});

describe('validate', () => {
  it('deve validar os links quebrados', async () => {
    global.fetch = jest.fn().mockRejectedValue(
    );
    const listaLinks = [
      { href: 'http://meugatodaiki.com.br/', nome: 'Daiki' },
      { href: 'http://www.kira.com.br/', nome: 'Kira' }];

    const listaEsperada = [
      { href: 'http://meugatodaiki.com.br/', nome: 'Daiki', ok: 'fail', status: 'Link Inexistente' },
      { href: 'http://www.kira.com.br/', nome: 'Kira', ok: 'fail', status: 'Link Inexistente' }];

    const listaQuebrados = await validate(listaLinks);
    expect(listaQuebrados).toEqual(listaEsperada);
  });
});

describe('mdLinks', () => {
  it("Deve retornar uma promessa", () => {
    const file = "doc/texto.md";
    const promise = mdLinks(file);

    expect(promise).toBeInstanceOf(Promise);
  });
});

describe('mdLinks', () => {
it("deveria mostrar erro", () => {
const caminhoArquivo = ''
const options = {};
try { 
  mdLinks (caminhoArquivo, options);
} catch (err) {
  expect(err.message).toEqual('Esse caminho é invalido.')}
});
});