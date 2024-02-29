const express = require('express');
const axios = require('axios');
const getTwitterMedia = require('get-twitter-media');
const ytdl = require('ytdl-core');
const tiktokDl = require("@sasmeee/tkdl");
const snapsave  = require("snapsave-downloader2");



const app = express();
const port = 3000;



app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));





app.get('/youtube', async (req, res) => {

    const snapchat = "https://www.snapchat.com/p/3896afd7-3972-4000-8829-576649e2dc58/2264226073329664";
    const snapchat2 = "https://www.snapchat.com/p/2157578b-389d-4055-a5ca-928b150b52ea/938215224948736"

    //INSTAGRAM AND FACEBOOK: VALIDATE URLS
    //CHECK FOR HOW TO RENAME FILES BEFORE DOWNLOADS

    //instagram links is for direct and instant download, but returns video thumbnails
    //facebook links: use data whose shouldRender status is false

    const link = "https://www.instagram.com/p/Ctv11DiPfV5/?igshid=NTc4MTIwNjQ2YQ%3D%3D&img_index=1";
    const link2 = "https://www.instagram.com/tv/CdmYaq3LAYo/";
    const fb = "https://web.facebook.com/watch/?v=1415010655628072"


    // let URL = await snapsave(fb);
    // console.log(URL)
    // res.send(URL);

   
    //TIKTOK DOWNLOADER WORKING: RETURNS 2 FORMATS with cover image: must ensure validation of the link in this pattern
    // const url = "https://www.tiktok.com/@kelvinaigbekelvin/video/7237595412713049349";
    // const dataList = await tiktokDl(url);
    // res.send(dataList);


    //YOUTUBE WORKING
    const videoId = req.query.url;
    const media = await ytdl.getInfo(videoId);
    res.send(media);


    //TWITTER WORKING: returns only stream link,  will have to trigger a download from the server
    // let media = await getTwitterMedia("https://twitter.com/elonmusk/status/1762265469195886878", {buffer: true, image:true, text:true});
    // res.send(media);
});






app.post('/vidsight', async (req, res) => {

  try {
    const remoteUrl = 'https://www.y2mate.com/mates/en912/analyzeV2/ajax';
    const requestUrl = req.body.url;

    const formData = {
      k_query: requestUrl
    };
    // Make the HTTP POST request using axios
    const response = await axios.post(remoteUrl, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'User-Agent': 'PostmanRuntime/7.26.8',
      },
    });


    if(response.data.mess.trim().length > 0) {
      return res.status(404).send({
        code: 404,
        error: "Oops! Something went wrong with that link"
      })
    }


    let dataResponse = {};

    if(response.data.extractor === "youtube"){

      dataResponse = {
        code:200,
        status : response.data.status,
        error: response.data.mess,
        vidsource : response.data.extractor,
        reqUrl : response.data.keyword,
        vidtitle : response.data.title,
        vidID: response.data.vid,
        coverpic : `https://i.ytimg.com/vi/${response.data.vid}/0.jpg`,
        audio : response.data.links.mp3 ?? [],
        video : response.data.links.mp4 ?? [],
        other : response.data.links.other ?? [],
        author : response.data.a ?? "null",
        similar : response.data?.related[0].contents ?? []
      }

    }else{

      dataResponse = {
        code:200,
        status : response.data.status,
        error: response.data.mess,
        vidsource : response.data.extractor,
        reqUrl : response.data.keyword,
        vidtitle : response.data.title,
        coverpic : response.data.thumbnail,
        audio : response.data.links.audio ?? [],
        video : response.data.links.video ?? [],
        other : response.data.links.other ?? [],
        similar : []
      }
    }


    // build new response parameters
    res.status(200).send(dataResponse);

  } catch (error) {
    let errorResponse = {
      code: 500,
      message : "An internal error occurred. Try again later"
    }
    res.status(500).send(errorResponse);
  }
});







app.post('/ytsight', async (req, res) => {

  try {
    const remoteUrl = 'https://www.y2mate.com/mates/convertV2/index';
    const vid_ID = req.query.vid;
    const k_ID = req.query.k

    const formData = {
      vid: vid_ID,
      k: k_ID
    };


    // Make the HTTP POST request using axios
    const response = await axios.post(remoteUrl, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'User-Agent': 'PostmanRuntime/7.26.8',
      },
    });

    // Handle the response as needed
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});






app.get('/mine', async (req, res) => {

  const options = {
    method: 'POST',
    url: 'https://all-media-downloader-v2.p.rapidapi.com/dl',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '660473502amsha3b31bbf2077b15p10a6b8jsn7626d7cff8e7',
      'X-RapidAPI-Host': 'all-media-downloader-v2.p.rapidapi.com'
    },
    data: {
      url: 'https://www.youtube.com/watch?v=oxFr7we3LC8'
    }
  };

  try {
    const response = await axios.request(options);
    res.send(response.data);  //.requested_formats

  } catch (error) {
    res.send(error);
  }
})



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
