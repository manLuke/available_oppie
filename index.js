const player = require("play-sound")((opts = {}));
const axios = require("axios");

const filename = "alarm.wav";
const audioDuration = 6;
const alarmDuration = 20;
const checkEvery = 500;

require("dotenv").config();

const url = "https://www.cinemacity.cz/cz/data-api-service/v1/quickbook/10101/dates/in-cinema/1052/until/2024-08-21?attr=&lang=cs_CZ";
// date that should be available at the cinema when new tickets are issued
const searchDate = "2023-08-31";

async function checkDate(date) {
  const response = await axios.get(url);
  return response.data.body.dates.includes(date);
}

async function playAlarm(name, times) {
  if (times <= 0) {
    return;
  }
  player.play(name, function (err) {
    if (err) throw err;
  });
  await new Promise((resolve) => setTimeout(resolve, audioDuration * 1000));
  playAlarm(name, times - 1);
}

async function main(dots = 0) {
  const included = await checkDate(searchDate);
  if (included) {
    console.log("'Now I am become Death, the destroyer of worlds'")
    playAlarm(filename, alarmDuration / audioDuration);
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, checkEvery));
  console.clear();
  console.log("Checking..." + ".".repeat(dots) + " ".repeat(15 - dots));
  dots = (dots + 1) % 15;
  main(dots);
}

main();
