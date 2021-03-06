import React from "react";
const io = require('socket.io-client')


// Connect to server
const socket = io.connect("localhost:5000", {
    // need to provide backend server endpoint 
    // (ws://localhost:5000) if ssl provided then
    // (wss://localhost:5000) 
    secure: true, 
    reconnection: true, 
    rejectUnauthorized: false,
    reconnectionAttempts: 10
});

// Add a connect listener
socket.on('connect', function(socket) { 
    console.log('Socket is connected!');

});

socket.on('disconnect', () => {
    console.log('Socket is disconnected!');
    socket.removeAllListeners();
});
socket.on('error', (err) => {
    console.log('Socket Error: ', err);
});
const SocketContext = React.createContext({});
export  {
    socket,
    SocketContext
}
