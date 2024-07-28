import { useState } from 'react'
import './App.css'

import Join from './components/Join'
import Chat from './components/Chat'

function App() {
  const [chatVisibility, setChatVisibility] = useState(false)
  const [socket, setSocket] = useState(null) 
  // get the socket from the backend/server through the join component to forward to the chat

  return (
    <>
      {
        chatVisibility ? <Chat socket={socket} /> : <Join setSocket={setSocket} setChatVisibility={setChatVisibility}/> 
      }
    </>
  )
}

export default App
