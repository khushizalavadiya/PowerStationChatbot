// ChatPage.jsx
import React, { useEffect, useState } from 'react';
import './ChatPage.css'; // Import your CSS file
import axios from 'axios';

const ChatPage = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;
    const userMessage = { text: newMessage, sender: 'user' };
    setMessages([...messages, userMessage]); // Add user message to the chat
    setNewMessage('');

    try {
      const response = await axios.post('http://localhost:3001/process-input', {
        input: newMessage,
        username: user,
      });

      const aiResponse = response.data;
      console.log('AI Response:', aiResponse);
      const steps = aiResponse.split('\n'); 
      setTimeout(() => {
        console.log('Current Messages:', messages);
        steps.forEach((step, index) => {
          // Add each step as a separate message to the chat
          setTimeout(() => {
            setMessages(prevMessages => [
              ...prevMessages,
              { text: step, sender: 'ai' },
            ]);
          }, index * 1000); // Adjust timing for each step (e.g., 1000ms = 1 second)
        });
        console.log('Updated Messages:', messages);
      }, 500);

      await axios.post('http://localhost:3001/addmessages', {
        username: user,
        question: newMessage,
        answer: aiResponse,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKey = (event) => {
    if(event.key === 'Enter'){
      sendMessage();
    }
  }

  return (
    <div className="chat-container">
      {messages.length === 0 && (
        <div className="initial-background">
          <p className="help-text">HOW CAN I HELP U?</p>
        </div>
      )}
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          > 
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          onKeyDown={handleKey}
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ width: '300px' }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
