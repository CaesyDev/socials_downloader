const express = require("express");
const apiRouter = express.Router();
const axios = require("axios");
apiRouter.use(express.urlencoded({ extended: false }));
apiRouter.use(express.json());



apiRouter.post("/apiv1", async function (req, res) {
  //Social Download All In One : RAPID API Documentation
  const murl = req.body.url;
  const options = {
    method: "POST",
    url: "https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "660473502amsha3b31bbf2077b15p10a6b8jsn7626d7cff8e7",
      "X-RapidAPI-Host": "social-download-all-in-one.p.rapidapi.com",
    },
    data: {
      url: murl,
    },
  };

  try {
    const response = await axios.request(options);
    res.send(response.data);


  } catch (error) {
    res.send(error);
  }
});




apiRouter.post("/word-search", async (req, res) => {
  try {
    const search = req.body.search;
    // const result = await youtubesearchapi.GetListByKeyword(search, true, 12);
    // const data = JSON.parse(result);
    let formattedData = [];
    // for (let index = 0; index < data.length; index++) {
    //   const element = data[index];
    //   let temp = {
    //     videoIDentifier: element.id,
    //     coverPic : element.thumbnail.thumbnails[1].url ?? element.thumbnail.thumbnails[0].url,
    //     videoTitle : element.title,
    //     channel : element.channelTitle,
    //     length : element.length.simpleText
    //   }
    //   formattedData.push(temp);
    // }

    console.log(data);

    res.send(search);


  } catch (error) {
    res.send(error);
  }
});



apiRouter.post("/mine-yt-link", async (req, res) => {
  
    const videoId = req.body.ytid;
    const media = await ytdl.getInfo(videoId, );
    res.send({
      formats : media.formats,
      related_videos : media.related_videos,
      videoDetails :media.videoDetails
    });
});



module.exports = apiRouter;
