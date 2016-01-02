'use strict';

import restify from 'restify';

var server = restify.createServer({
  name: 'atticus-portfolio',
  version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/contact-form', (req, res, next) => {
  res.send('foobar');
  return next();
});

server.listen(1234, () => {
  console.log('listening!');
});
