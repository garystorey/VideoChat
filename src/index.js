import React from 'react';
import {render} from 'react-dom';
import App from './App';

import './index.css';

/* Original Source File
https://static.opentok.com/v2/js/opentok.min.js
*/

render(
    <App opentokClientUrl='https://vsv.corp.talbots.com/Style%20Library/opentok.min.js'/>,
    document.getElementById('root')
);

