// index.js
// This is our main server file

// include express
const express = require("express");
// create object to interface with express
const app = express();
const fetch = require("cross-fetch");

const bodyParser = require('body-parser');

// Code in this section sets up an express pipeline
const lakes = "SHA,ORO,CLE,NML,ONF,DNP,BER";

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

// app.get("/query/getList", async function(request, response, next) {
//   console.log("getting cost data");
//   // we will return an array of results
//   resData = [];
//   for (let i=0; i<1; i++) {
//     // lookup three schools
//     let answer = await   lookupLakeData(lakes[i]);
//     resData.push(answer);
//   }
//   response.json(resData);  
// });

app.use(bodyParser.json());

app.post("/query/askForData", 
  async function(req, res) {
    console.log("I am here");
    console.log(req.body);
    let answer = await   lookupLakeData(req.body.year,req.body.month);
    console.log(answer);
      res.send({curr : answer});

    
});

// No static server or /public because this server
// is only for AJAX requests

// respond to all AJAX querires with this message
app.use(function(req, res, next) {
  res.json({msg: "No such AJAX request"})
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});


async function lookupLakeData(year, month) {
  // const api_url =  `https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=${key}&school.name=${school}&fields=2020.cost`;

  const api_url =  `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=${lakes}&SensorNums=15&dur_code=M&Start=${year}-${month}-01&End=${year}-${month}-01`;

  // send it off
  let fetch_response = await fetch(api_url);
  let lakeData = await fetch_response.json();
  // lakeData = lakeData.results[0];
  return lakeData
}