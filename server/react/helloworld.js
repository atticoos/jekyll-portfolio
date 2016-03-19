'use strict';

import React, {DOM} from 'react';
const {
  div,
  span,
  a
} = DOM;

export default function HelloWorld (props) {
  return (
    div(null,
      p(null, 'hello world!')
    )
  );
}
