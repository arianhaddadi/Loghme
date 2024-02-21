import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {thunk} from 'redux-thunk';
import reducers from "./reducers";
import "./styles/App.scss";


const store = createStore(reducers, applyMiddleware(thunk));

createRoot(document.getElementById("root"))
    .render( <Provider store={store}>
                <App/>
            </Provider>)