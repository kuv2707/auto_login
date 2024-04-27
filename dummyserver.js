// make a dummy server which returns hello world on all endpoints 
const http = require('http');
const server = http.createServer((req, res) => {
    res.end('<a href="/keepalive">Login</a>');
    }
);
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})