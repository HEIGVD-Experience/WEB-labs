import { createServer } from 'http';

let html = `
<!doctype html>
<link rel="stylesheet" href="/style.css" />
<script src="script.js"></script>
<h1>Hello, World!</h1>
`

let css = `
h1 {color: red;}
`;

var javascript = `
alert("Hello, World!");
`;

createServer(function (req, res) {
    if (req.url == '/' || req.url === '/index.html') {
        res.write(html)
    } else if (req.url == '/style.css') {
              res.write(css);
    } else if (req.url == '/script.js') {
      res.write(javascript);
    }
    res.end();
}).listen(3000);
