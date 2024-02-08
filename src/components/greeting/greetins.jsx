import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './style.scss';
import Loader from "../loader/Loader";

const Greeting = () => {
  const [user, setUser] = useState('');
  const [inputClear, setInputClear] = useState(true);
  const [userExist, setUserExist] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const value = event.target.value;
    setUser(value);
    setInputClear(value.trim() === '');
  };

  const handleSubmit = async () => {
    try {
      setIsLoaded(true);
      const response = await fetch('https://chat-backend-node-49q8.onrender.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: user }),
      });

      if (response.status === 201) {
        console.log('Username is available');
        navigate(`/chat/${user}`);
      } else {
        setUserExist(true);
        setUser('')
      }
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsLoaded(false);
    }
  }

  return (
    <div className="chat">
      <img className="logo" src="./icons/user-3296.svg" alt="login" />
      <div className="chat__border">
        <div>
          <input
            className={userExist ? "chat__input-exist" : "chat__input"}
            type="text"
            placeholder={userExist ? "User already exist" : "Enter your name"}
            value={user}
            onChange={handleInputChange}
          />
        </div>
        {isLoaded ? <Loader/> : 
        <button
          className={`chat__button ${inputClear ? 'disabled' : ''}`}
          onClick={handleSubmit}
        >
          Log in
        </button>
        }
      </div>
    </div>
  );
};

export default Greeting;
