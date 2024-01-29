import React from 'react';
import { createRoot } from 'react-dom/client';
import Greeting from './components/greeting/greetins';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Chat } from './components/chat/Chat';
import './style.scss';

const element = document.querySelector('#root');

createRoot(element).render(
  <HashRouter>
  <Routes>
      <Route path="/" element={<Greeting/>} />
      <Route path="/chat/:user" element={<Chat/>}/>
    </Routes>
  </HashRouter>
);
