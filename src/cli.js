#!/usr/bin/env	node

import { mdLinks } from './md-links.js';

const argument = process.argv[2];

const options = {
  validate: process.argv.includes('--validate'),
};

function validacao(resultado) {
  console.log(resultado.map((item) => `${item.file} | ${item.href} | ${item.text} | ${item.ok}`));
}


mdLinks(argument, options)
.then((result) => validacao(result));
  