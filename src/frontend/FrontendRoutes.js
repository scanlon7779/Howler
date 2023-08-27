const express = require('express');
const frontendRouter = express.Router();


const html_dir = __dirname + '/templates/';

frontendRouter.get('/', (req, res) => {
  //res.send(`${html_dir}index.html`);
  res.sendFile(`${html_dir}login.html`);
});

frontendRouter.get('/feed', (req, res) => {
  res.sendFile(`${html_dir}feed.html`);
});

frontendRouter.get('/user', (req, res) => {
  res.sendFile(`${html_dir}user.html`);
});

module.exports = frontendRouter;