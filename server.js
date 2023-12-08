const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 2002;
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Chatbot', { useNewUrlParser: true, useUnifiedTopology: true });
// Define a schema
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
});

// Create a model
const Message = mongoose.model('Message', MessageSchema);

app.use(express.static(__dirname + '/public'));

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('User connected' + socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        
        // Create a new message and save it to the database
        const newMessage = new Message({ message: msg });
        newMessage.save();

        io.emit('chat message', msg);
    });  
});
