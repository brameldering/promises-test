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
      if (err) reject(`I could not find the file 😢 \n ${err.message}`);
      resolve(data);
    });
  });
};

const writeFilePromise = (fileName, payload) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, payload, (err) => {
      if (err) reject(`I could not write to file 😢 \n ${err.message}`);
      resolve("success");
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/../dog.txt`);
    console.log(`Breed: ${data}`);

    const res1promise = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const res2promise = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const res3promise = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

    const all = await Promise.all([res1promise, res2promise, res3promise]);

    const bodyMessages = all.map((el) => el.body.message);
    console.log(bodyMessages);
    const payload = bodyMessages.join("\n");
    await writeFilePromise("dog-img.txt", payload);
    console.log("Random img saved");
  } catch (error) {
    console.log("error " + error);
    throw error;
  }
  return "2 - Ready";
};

(async () => {
  try {
    console.log("1 - about to call getDogPic");
    const x = await getDogPic();
    console.log(x);
    console.log("3 - after call getDogPic");
  } catch (err) {
    console.log("error from getDogPic " + err);
  }
})();

// console.log("1 - about to call getDogPic");
// getDogPic()
//   .then((x) => {
//     console.log(x);
//     console.log("3 - after call getDogPic");
//   })
//   .catch((err) => {
//     console.log("error from getDogPic " + err);
//   });

// readFilePromise(`${__dirname}/../dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);

//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);
//     const payload = res.body.message + " - " + new Date();
//     return writeFilePromise("dog-img.txt", payload);
//   })
//   .then(console.log("Random img saved"))
//   .catch((err) => console.log("error " + err));
