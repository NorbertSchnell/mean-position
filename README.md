# mean-position

In this example, multiple clients can send the position of a circle on screen (moved through touch or pointer) to a server via websockets. The server calculates the mean position of all conntected clients and sends it back to them.
A particular client page (`receiver.html`) can receive the mean position and output it into Cycling'74 Max using the *jweb* object.
By default the example uses an open web server which may be running – maybe not...

The follwing files are important:
- `index.html`/`client.js`: the web client allowing for sending positions to the server
- `receiver.html`/`receiver.js`:  the web client allowing for recieving the mean position in Cycling'74 Max
- `receiver.maxpat`: a Max patch receiving the data using a *jweb* object 
- `server.js`: the node.js server

 
