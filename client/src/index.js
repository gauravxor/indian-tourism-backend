import React from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from  'react-router-dom';
import axios from 'axios';

import App from './App' ;
import { AppContextProvider } from './AppContext.js';
import './index.css';


axios.defaults.withCredentials = true

const root = createRoot(document.getElementById("root"));
root.render(
	<AppContextProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</AppContextProvider>
);
