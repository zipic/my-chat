import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import io from "socket.io-client";
import './style.scss';
import EmojiPicker from "@emoji-mart/react";

export const Chat = () => {
  const { user } = useParams();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [messages, setMessages] = useState(() => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages'));
    return savedMessages || [];
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const pickEmoji = (emoji) => {
    setMessage(prev => prev + emoji.native);
  };

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = io("http://localhost:3005");
    socket.on("message", (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const socket = io("http://localhost:3005");
      socket.emit("message", { user, message });
      setMessage("");
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="box">
      <div className="room">
        <div className="room__back">
          <Link to="/"> <img className="back" src="./icons/back.svg" alt="back" /></Link>
        </div>
        <div className="room__box">
          {messages.map((msg, index) => (
            <div key={index} className={`room__box-element ${msg.user === user ? 'sent' : ''}`}>
              <strong className={`room__box-name ${msg.user === user ? 'sent' : ''}`}>{msg.user}: </strong>
              <strong className="room__box-msg">{msg.message}</strong>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <form className="room__form" onSubmit={sendMessage}>
          <input
            className="room__input"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="room__emoji-button" 
            type="button" 
            onClick={toggleEmojiPicker}
          >
            <img className="smile" src="./icons/smile.svg" alt="smile" />
          </button>
          {showEmojiPicker && (
            <EmojiPicker onEmojiSelect={pickEmoji}/>
          )}
          <button 
            className="room__button" 
            type="submit"
            onClick={sendMessage}
          >
            <img className="send" src="./icons/send.svg" alt="send" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
