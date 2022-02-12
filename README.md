# daten_frontend
The client side of my dating web app - a web app just like Tinder but allows users to chat privately & post daily activities

## Tech stacks: 
- MERN stack
- Redis cache
- SocketIO

I will discuss about technologies and how I implement each features in future commits.

## Features:
- [x] Authentication (Auth, OAuth2)
- [x] Profile
- [x] Matching
- [x] Chatting (developing socket)
- [ ] Private Chatting
- [ ] Video Call
- [ ] Post Activities


## How implement these features:
### Video call (PeerJS, Socket.io)
- Server manage peerID for each connected user
- Listen call request of other users by peer.on("call", ...)
- When need to call someone: 
 - socket.emit("call", {user_id, target_user_id})
 - socket.on("call-info", {target_peer_id} => {// call this peer id})
 - If the target user is calling someone, just ignore the call and socket.emit("reject-call", {target_user, user_id})
