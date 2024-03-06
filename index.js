const express = require("express");
const axios = require("axios");
const ytdl = require("ytdl-core");
const youtubesearchapi = require("youtube-search-api");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port = 3000;


const apiRouter = require('./myApi');
app.use(apiRouter);


app.get('/', function (req, res) {
  res.send('Welcome');
})

//WORKING
app.post("/vidsight", async (req, res) => {
  try {
    const remoteUrl = "https://www.y2mate.com/mates/en912/analyzeV2/ajax";
    const requestUrl = req.body.url;
    let dataResponse = {};

    const formData = {
      k_query: requestUrl,
      k_page: "home",
      // hl: "en",
      // q_auto: 0
    };
    // Make the HTTP POST request using axios
    const response = await axios.post(remoteUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "User-Agent": "PostmanRuntime/7.26.8",
      },
    });


    if (response.data.hasOwnProperty("page") && response.data.page === "search") {
      return res.status(200).send({
        code : 200,
        vidsource : "search",
        searchKeyword : response.data.keyword,
        searchResult : transformArrayKeys(response.data.vitems)
      });
    }



    if (response.data.hasOwnProperty("c_status") && response.data.c_status === "FAILED") {
      if (response.data.mess.trim().length > 0) {
        return res.status(404).send({
          code: 404,
          error: "Oops! Something went wrong with that search query",
        });
      }
    }


    if (response.data.extractor === "youtube") {
      dataResponse = {
        code: 200,
        status: response.data.status,
        error: response.data.mess,
        vidsource: response.data.extractor,
        reqUrl: response.data.keyword,
        vidtitle: response.data.title,
        vidID: response.data.vid,
        coverpic: `https://i.ytimg.com/vi/${response.data.vid}/0.jpg`,
        author: response.data.a ?? "null",

        audio: transformKeys(response.data.links.mp3) ?? [],
        video: transformKeys(response.data.links.mp4) ?? [],
        other: transformKeys(response.data.links.other) ?? [],
        similar: transformArrayKeys(response.data?.related[0].contents) ?? [],
      };

    } else {
      
      dataResponse = {
        code: 200,
        status: response.data.status,
        error: response.data.mess,
        vidsource: response.data.extractor,
        reqUrl: response.data.keyword,
        vidtitle: response.data.title,
        coverpic: response.data.thumbnail,

        audio: otherArrayKeys(response.data.links.audio) ?? [],
        video: otherArrayKeys(response.data.links.video) ?? [],
        other: response.data.links.other ?? otherArrayKeys(response.data.links.other),
        similar: [],
      };
    }
    // build new response parameters
    // res.status(200).send(response.data); //
    res.status(200).send(dataResponse); 

  } catch (error) {
    console.log(error);
    let errorResponse = {
      code: 500,
      message: "An internal error occurred. Try again later",
    };
    res.status(500).send(errorResponse);
  }
});




app.post("/ytsight", async (req, res) => {
  try {
    const remoteUrl = "https://www.y2mate.com/mates/convertV2/index";
    const vid_ID = req.body.vid;
    const k_ID = req.body.k;

    const formData = {
      vid: vid_ID,
      k: k_ID,
    };

    // Make the HTTP POST request using axios
    const response = await axios.post(remoteUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "User-Agent": "PostmanRuntime/7.26.8",
      },
    });

    // Handle the response as needed
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});







app.post("/weather", async (req, res) => {
  const apiUrl = "https://api.tomorrow.io/v4/weather/forecast";
  const location = req.body.location;
  const apiKey = "pqXCB0DMgCsXZcTcYXCre572ne3VKpe0";
  const url = `${apiUrl}?location=${encodeURIComponent(
    location
  )}&apikey=${apiKey}`;
  const headers = {
    Accept: "application/json",
  };

  axios
    .get(url, { headers })
    .then((response) => {
      res.send({
        status: "ok",
        message: response.data
      });
    })
    .catch((error) => {
      res.send({
        status : "error",
        message : error
      });
    });
});




app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});




function transformKeys(audioObject) {
  const transformedObject = {};

  for (const key in audioObject) {
    if (audioObject.hasOwnProperty(key)) {
      const originalNestedObject = audioObject[key];
      const transformedNestedObject = {
        format: originalNestedObject.f,
        quality: originalNestedObject.q,
        qualityText: originalNestedObject.q_text,
        resourceKey: originalNestedObject.k,
        resourceSize : originalNestedObject.size
      };

      transformedObject[key] = transformedNestedObject;
    }
  }
  return transformedObject;
}




function transformArrayKeys(videoArray) {
  return videoArray.map(video => ({
    vidKey: video.v,
    vidText: video.t
  }));
}



function otherArrayKeys(resourceArray) {

  if(resourceArray !== undefined) {
    return resourceArray.map(resource => ({
      resourceText: resource.q_text,
      resourceUrl: resource.url,
      resourceSize: resource.size,
    }));
  }else{
    return [];
  }
  
}


module.exports = app;