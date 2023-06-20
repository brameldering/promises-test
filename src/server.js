import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import superagent from "superagent";
import express from "express";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.readFile(`${__dirname}/../dog.txt`, (err, data) => {
  if (err) return console.log("error " + err.message);
  console.log(`Breed: ${data}`);

  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err, res) => {
    if (err) return console.log("error " + err.message);
    console.log(res.body.message);
    fs.writeFile("dog-img.txt", res.body.message, (err) => {
      if (err) return console.log("error " + err.message);
      console.log("Random img saved");
    });
  });
});

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}!`);
// });
