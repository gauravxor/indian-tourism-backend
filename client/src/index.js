import React from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from  'react-router-dom';
import App from './App' ;
import axios from 'axios';
import { AppContextProvider } from './AppContext.js';
axios.defaults.withCredentials = true;


const root = createRoot(document.getElementById("root"));
root.render(
		<AppContextProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</AppContextProvider>
);
