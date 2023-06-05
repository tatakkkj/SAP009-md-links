import fs from 'fs';

// Le o arquivo e extrai links
function identificaLink(texto, caminhoArquivo) {
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const capturas = [...texto.matchAll(regex)];
  const results = capturas.map((captura) => ({
  href: captura[2],
  text: captura[1],
  file: caminhoArquivo,
}));
return results;
}
function extraiLinks(caminhoArquivo) {
  const encoding = 'utf-8';
  return new Promise((resolve, reject) => {
    fs.readFile(caminhoArquivo, encoding, (err, texto) => {
      if (err) {
        reject(
          err,
        );
      } else {
        const results = identificaLink(texto, caminhoArquivo)
      resolve(results);
      }
    });
  });
}

function validate(linksList) {
  return Promise.all(linksList.map((link) => fetch(link.href)
  .then((response) => {
    const newLink = { ...link, status: response.status };
    if (response.ok) {
      newLink.ok = 'ok';
      return newLink;
    }
    newLink.ok = 'fail';
    return newLink;
  }) 
  .catch(() =>{
    const newLink = { ...link, status: 'Link Inexistente'};
     newLink.ok = 'fail';
     return newLink;
 }
  ))
  
  )};

function mdLinks(caminhoArquivo, options = { }) {
  if (!caminhoArquivo) throw new Error ('Esse caminho é invalido.');
  return new Promise((resolve, reject) => {
    extraiLinks(caminhoArquivo)
    .then((file) => {
      if (options.validate === false) {
        resolve(file);
      } else if (options.validate === true) {
        resolve(validate(file));
      }
    })
    .catch((error) => reject(error));
  });
}

  export {
    extraiLinks,
    mdLinks,
    identificaLink, 
    validate,
  };