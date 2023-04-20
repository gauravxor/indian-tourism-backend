import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from  'react-router-dom';
import App from './App' ;
import axios from 'axios';
import { AppContextProvider } from './AppContext.js';
axios.defaults.withCredentials = true;

ReactDOM.render(
	<AppContextProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</AppContextProvider>,
	document.getElementById('root')
);
