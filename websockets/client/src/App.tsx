import { useState, useEffect } from 'react'

//custom socket hook
function useSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/');
    
    socket.onopen = () => {
      console.log('Connected');
      setSocket(socket);
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
    
    socket.onclose = () => {
      console.log('Connection closed');
    };

    return () => {
      socket.close();
    };
  }, [])
  return socket;
}

function App() {
  const socket = useSocket();
  const [messages, setMessages] = useState<string[]>([]);
  const [sendMessage, setSendMessage] = useState<string>('');

  useEffect(() => {
    if (socket) {
      const handleMessage = (message: MessageEvent) => {
        console.log('Received Message::', message.data);
        setMessages((prevMessages) => [...prevMessages, message.data]);
      };

      socket.onmessage = handleMessage;

      return () => {
        socket.onmessage = null;
      };
    }
  }, [socket]);


  if (!socket) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h1> Websockets</h1>
      <div>
        <input type='text'
          placeholder='sendMessage'
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)} />

        <button onClick={() => {
          socket.send(sendMessage);
        }}>Send</button>
      </div>

      <div>
        <p>Messages::</p>
          {
           messages && messages.map((message, idx) => {
              return <li key={idx}>{message}</li>
            })
          }
      </div>

    </>
  )
}

export default App
