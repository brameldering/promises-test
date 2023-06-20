import fs from "fs";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import superagent from "superagent";
import express from "express";
import { clearScreenDown } from "readline";
import { CLIENT_RENEG_LIMIT } from "tls";
import { rejects } from "assert";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFilePromise = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) reject(`I could not find the file 😢 ${err.message}`);
      resolve(data);
    });
  });
};

const writeFilePromise = (fileName, payload) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, payload, (err) => {
      if (err) reject(`I could not write to file 😢 ${err.message}`);
      resolve("success");
    });
  });
};

readFilePromise(`${__dirname}/../dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);

    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).then((res) => {
      console.log(res.body.message);
      const payload = res.body.message + " - " + new Date();
      writeFilePromise("dog-img.txt", payload).then(console.log("Random img saved"));
    });
  })
  .catch((err) => console.log("error " + err.message));

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}!`);
// });
