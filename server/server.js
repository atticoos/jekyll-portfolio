'use strict';

import restify from 'restify';
import {contactFormHandler} from './contact-form';

var server = restify.createServer({
  name: 'atticus-portfolio',
  version: '1.0.0'
});

server.use(restify.CORS());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.urlEncodedBodyParser({mapParams: false}));

server.post('/contact-form', contactFormHandler);

server.listen(4050, () => {
  console.log('listening on', 4050);
});
