import express from "express";
import json from "body-parser";
import cors from "cors";

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors());
app.use(express.json());

app.get("/status", (request, response) =>
  response.json({ clients: clients.length })
);

let clients = [];
let coins = [];

app.listen(process.env.PORT || 5000, () => {
  console.log(`server is listening`);
});

// ...

function eventsHandler(request, response, next) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(coins)}\n\n`;

  response.write(data);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response,
  };

  clients.push(newClient);

  request.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

app.get("/events", eventsHandler);

// ...

function sendEventsToAll(newFact) {
  clients.forEach((client) =>
    client.response.write(`data: ${JSON.stringify(newFact)}\n\n`)
  );
}

async function addCoin(request, respsonse, next) {
  const newCoin = request.body;
  coins.push(newCoin);
  respsonse.json(newCoin);
  return sendEventsToAll(newCoin);
}

app.post("/coin", addCoin);

app.get("/", (req, res) => {
  res.send("hello world");
});
