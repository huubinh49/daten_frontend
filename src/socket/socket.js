import React from "react";
const io = require('socket.io-client')
console.log('1');

// Connect to server
const socket = io.connect(process.env.SOCKET_URL, {reconnect: true});

console.log('2');

// Add a connect listener
socket.on('connect', function(socket) { 
    console.log('Connected!');
});

console.log('3');
const SocketContext = React.createContext({});
export  {
    socket,
    SocketContext
}
