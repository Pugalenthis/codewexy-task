import express from "express";
import json from "body-parser";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/status", (request, response) =>
  response.json({ clients: clients.length })
);

const PORT = 8000;

let clients = [];
let coins = [];

app.listen(PORT, () => {
  console.log(`coins Events service listening at http://localhost:${PORT}`);
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