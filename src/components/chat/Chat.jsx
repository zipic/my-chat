import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import './style.scss';
import EmojiPicker from "@emoji-mart/react";

export const Chat = () => {
  const { user } = useParams();
  const [message, setMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
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
    setMessage((prev) => prev + emoji.native);
  };

  useEffect(() => {
    fetch('https://chat-backend-node-49q8.onrender.com')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = io("https://chat-backend-node-49q8.onrender.com");

    socket.emit('join', { name: user });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setTypingUsers((prevTypingUsers) => prevTypingUsers.filter((u) => u !== message.user));
    });

    socket.on("typing", ({ user: typingUser, isTyping }) => {
      setTypingUsers((prevTypingUsers) => {
        if (isTyping && !prevTypingUsers.includes(typingUser)) {
          return [...prevTypingUsers, typingUser];
        } else if (!isTyping && prevTypingUsers.includes(typingUser)) {
          return prevTypingUsers.filter((u) => u !== typingUser);
        }
        return prevTypingUsers;
      });
    });

    socket.on("updated", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const socket = io("https://chat-backend-node-49q8.onrender.com");
      socket.emit("message", { user, message });
      setMessage("");
      setShowEmojiPicker(false);
      socket.emit("typing", { user, isTyping: false });
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setMessage(value);
    if (!typingUsers.includes(user)) {
      const socket = io("https://chat-backend-node-49q8.onrender.com");
      socket.emit("typing", { user, isTyping: true });
    }
  };

  const close = async (name) => {
    try {
      const response = await fetch(`https://chat-backend-node-49q8.onrender.com/${name}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('User deleted successfully');
        navigate('/');
      } else if (response.status === 404) {
        console.log('User not found');
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="box">
      <div className="room">
        <div className="room__back">
          <button className="back-button">
            <img className="back" src="./icons/back.svg" alt="back" onClick={() => close(user)} />
          </button>
          <p className="room__online-title">Online:</p>
          {users.map(user =>
            <section className="room__online" key={user.id}> {user.name}</section>
          )}
        </div>
        <div className="room__box">
          {messages.map((msg, index) => (
            <div key={index} className={`room__box-element ${msg.user === user ? 'sent' : ''}`}>
              <strong className={`room__box-name ${msg.user === user ? 'sent' : ''}`}>
                {msg.user}:
              </strong>
              <strong className="room__box-msg">{msg.message}</strong>
            </div>
          ))}
          {typingUsers.map((typingUser) => (
            typingUser !== user ? (
              <div key={typingUser} className="room__box-element">
                <strong className="room__box-name">
                  {typingUser}:
                </strong>
                <strong className="room__box-msg">
                  <img className="room__box-img" src="./icons/typing.svg" alt="typing" />
                </strong>
              </div>
            ) : null
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <form className="room__form" onSubmit={sendMessage}>
          <input
            className="room__input"
            type="text"
            value={message}
            onChange={handleInputChange}
          />
          <button
            className="room__emoji-button"
            type="button"
            onClick={toggleEmojiPicker}
          >
            <img className="smile" src="./icons/smile.svg" alt="smile" />
          </button>
          {showEmojiPicker && (
            <EmojiPicker onEmojiSelect={pickEmoji} />
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
