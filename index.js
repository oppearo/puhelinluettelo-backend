require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const Person = require("./models/person");

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  let numberOfPersons = persons.length;
  let date = new Date().toString();
  console.log(date);
  console.log(`numberOfPersons: ${numberOfPersons}`);
  res.send(
    `<p>Phonebook has info for ${numberOfPersons} people<br>${date}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(`id of GET: ${id}`);
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(`id to DELETE: ${req.params.id}`);

  persons = persons.find((person) => person.id !== id);

  res.status(204).end();
});

const getRandomId = () => {
  return Math.floor(Math.random() * 1000);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({ error: "name missing" });
  } else if (!body.number) {
    return res.status(400).json({ error: "number missing" });
  }

  const listOfNames = persons.map((person) => person.name);
  if (listOfNames.includes(body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const person = new Person({
    id: getRandomId(),
    name: body.name,
    number: body.number,
  });

  console.log(JSON.stringify(person));

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
