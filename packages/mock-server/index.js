const fs = require('node:fs/promises');

const express = require('express');
const httpProxy = require('http-proxy');

const host = 'localhost';
const port = process.env.PORT ?? '8080';

const app = express();
function renderTemplate(filePath, options, callback) {
  fs.readFile(filePath, {encoding: 'utf8'})
    .then(content => {
      const replacedContent = Object.entries(options)
        .filter(([token]) => token.startsWith('__') && token.endsWith('__'))
        .reduce((content, [token, value]) => content.replaceAll(token, JSON.stringify(value)), content);
      callback(null, replacedContent);
    })
    .catch(error => {
      callback(error);
    });
}
app.engine('html', renderTemplate);
app.engine('js', renderTemplate);

function allowCORS(_req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
  });
  next();
}

app.options('*.js', allowCORS, (_req, res) => {
  res.sendStatus(204);
});
app.get('*.js', allowCORS, (req, res) => {
  res.set({'Content-Type': 'application/javascript'});
  res.render(`${__dirname}/../toolbar-core/dist/${req.url}`);
});

app.listen(port, host);