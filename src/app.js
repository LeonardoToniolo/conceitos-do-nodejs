const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repository = { id: uuid(), title, url, techs, likes: 0 }
  console.log(repository);
  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: "Repository not found."});
  }

  const repositoryOld = repositories[repositoryIndex];

  const repository = {
    id,
    title, 
    url, 
    techs,
    likes: repositoryOld.likes
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: "Repository not found."})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: "Repository not found."});
  }

  const repositoryOld = repositories[repositoryIndex];

  const repository = {
    id: repositoryOld.id,
    title: repositoryOld.title, 
    url: repositoryOld.url,
    techs: repositoryOld.techs,
    likes: (repositoryOld.likes+1)
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);

});

module.exports = app;
