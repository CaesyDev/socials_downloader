const express = require("express");
const app = express.Router();
const youtubesearchapi = require("youtube-search-api");


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
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "User-Agent": "PostmanRuntime/7.26.8",
          "Remote-Address": req.ip
        },
      });
  
      // Handle the response as needed
      res.status(response.status).send(response.data);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  });





  app.post("/word-search", async (req, res) => {
    try {
      const search = req.body.search;
      const result = await youtubesearchapi.GetListByKeyword(search, true, 12);
      const data = result.items
      let formattedData = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let temp = {
          videoIDentifier: element.id,
          coverPic : element.thumbnail.thumbnails[1].url ?? element.thumbnail.thumbnails[0].url,
          videoTitle : element.title,
          channel : element.channelTitle,
          length : element.length.simpleText
        }
        formattedData.push(temp);
      }
  
      res.send({
        status : 200,
        data : formattedData,
        error : false
      });
  
    } catch (error) {
      res.send({
        status : 500,
        error : true,
        errMsg : error
      });
    }
  });




  app.post("/mine-yt-link", async (req, res) => {
  
    const videoId = req.body.ytid;
    const media = await ytdl.getInfo(videoId, );
    res.send({
      formats : media.formats,
      related_videos : media.related_videos,
      videoDetails :media.videoDetails
    });
});