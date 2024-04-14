import express from "express";
import eventsCache from "./events.mjs";
import bookingCache from "./bookings.mjs";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// add a book - request body should contain a title, status and an author
app.post("/digiket/events/:uuid/register", (req, res) => {
  const { date, amount, seat } = req.body;
  const uuid = req.params.uuid;
  if (amount < 1) {
    return res.status(400).json({
      error: "Amount is invalid",
    });
  }
  if (!date || !amount || !seat) {
    return res.status(400).json({ error: "Date of booking, amount and seat preference should be provided." });
  }
  const event = eventsCache.get(uuid);

  const bookingId = uuidv4();
  const value = { bookingId, date, amount, seat };

  let bookings = bookingCache.get(event.uuid) || [];
  bookings.push(value);
  bookingCache.set(event.uuid, [], 86400);
  
  return res.status(201).json({ uuid, amount, seat });
});


// get the list of events
app.get("/digiket/events", (_, res) => {
  const keys = eventsCache.keys();
  const allData = {};
  for (const key of keys) {
    allData[key] = eventsCache.get(key);
  }
  return res.json(allData);
});

// get a book by uuid
app.get("/digiket/events/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  if (!uuid || typeof uuid !== "string") {
    return res.status(400).json({ error: "missing or invalid UUID" });
  }
  if (!eventsCache.has(uuid)) {
    return res.status(404).json({ error: "UUID does not exist" });
  }
  const value = eventsCache.get(uuid);
  return res.json(value);
});

// health check
app.get("/healthz", (_, res) => {
  return res.sendStatus(200);
});

app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(500);
  res.json({ error: err.message });
});

app.use("*", (_, res) => {
  return res
    .status(404)
    .json({ error: "the requested resource does not exist on this server" });
});

export default app;