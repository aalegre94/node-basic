const http = require("http"); //para trabajar con http
const fs = require("fs"); //para trabajar con archivos

const server = http.createServer((req, res) => {
  //req - requests and res - responses
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    //console.log(req.url, req.method, req.headers); -- para obtener info
    //process.exit();    -- con esto sales

    res.write("<html>");
    res.write("<head><title>Enter message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    //recibo los flujos de datos para el buffer
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    //con el buffer tranformo y escribo en el archivo
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      console.log(parsedBody);
      fs.writeFileSync("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My first page web</title></head>");
  res.write("<body><h1>Hello from Node.js Server</h1></body>");
  res.write("</html>");
  res.end();
});

server.listen(3000);
