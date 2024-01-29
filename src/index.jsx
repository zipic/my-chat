import React from 'react';
import { createRoot } from 'react-dom/client';
import Greeting from './components/greeting/greetins';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Chat } from './components/chat/Chat';
import './style.scss';
import './firebase';
import { Provider } from 'react-redux';
import store from './redux/store';


const element = document.querySelector('#root');

createRoot(element).render(
  <Provider store={store}>
  <HashRouter>
  <Routes>
      <Route path="/" element={<Greeting/>} />
      <Route path="/chat/:user" element={<Chat/>}/>
    </Routes>
  </HashRouter>
  </Provider>
);
