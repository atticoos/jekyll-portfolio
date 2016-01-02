'use strict';

import restify from 'restify';
import {contactFormHandler} from './contact-form';

var server = restify.createServer({
  name: 'atticus-portfolio',
  version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.urlEncodedBodyParser({mapParams: false}));

server.post('/contact-form', contactFormHandler);

server.listen(1234, () => {
  console.log('listening!');
});
