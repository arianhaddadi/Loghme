import {createRoot} from 'react-dom/client';
import App from './components/App.tsx';
import {Provider} from 'react-redux';
import store from './app/store.ts'
import "./styles/App.scss";


createRoot(document.getElementById("root")!)
    .render(<Provider store={store}>
        <App/>
    </Provider>)