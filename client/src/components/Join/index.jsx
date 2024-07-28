import React, {useRef} from "react";
import io from 'socket.io-client'

export default function Join({setSocket, setChatVisibility}) {
    
    const usernameRef = useRef()

    const handleSubmit = async () => {
        const username = usernameRef.current.value
        if (!username.trim()) return

        const socket = await io.connect('http://localhost:3001')
        socket.emit('set_username', username) // emitting event to backend
        setChatVisibility(true)
        setSocket(socket)
    }

    return (
        <div>
            <h1>Join</h1>
            <input type="text" placeholder="Mensagem" ref={usernameRef}/>
            <button onClick={()=>handleSubmit()}>Enviar</button>
        </div>
    )
}