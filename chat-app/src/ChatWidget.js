import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './ChatWidget.css';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const subscription = supabase
        .channel('messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isOpen]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !username) return;

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          username,
          content: newMessage.trim(),
        },
      ]);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage('');
  };

  const setUsernameHandler = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSet(true);
    }
  };

  return (
    <div className="chat-widget">
      {!isOpen ? (
        <button className="chat-toggle-button" onClick={() => setIsOpen(true)}>
          Chat with Students
        </button>
      ) : (
        <div className="chat-widget-container">
          <div className="chat-widget-header">
            <h3>Student Chat Room</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          {!isUsernameSet ? (
            <div className="username-container">
              <h4>Enter your username to start chatting</h4>
              <form onSubmit={setUsernameHandler}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
                <button type="submit">Start Chatting</button>
              </form>
            </div>
          ) : (
            <>
              <div className="messages-container">
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.username === username ? 'own-message' : ''}`}>
                    <div className="message-username">{message.username}</div>
                    <div className="message-content">{message.content}</div>
                    <div className="message-time">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="message-form">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  required
                />
                <button type="submit">Send</button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatWidget; 