import React from 'react'; 
import ReactDOM from 'react-dom/client';
import App from './App';
import AppWrapper from './pages/AppWrapper';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store'; // make sure this path is correct

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <AppWrapper>
        <App />
      </AppWrapper>
    </BrowserRouter>
  </Provider>
)