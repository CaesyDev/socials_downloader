const express = require('express');
const getTwitterMedia = require('get-twitter-media');
const ytdl = require('ytdl-core');



const app = express();
const port = 3000;

app.get('/', async (req, res) => {





    


    //YOUTUBE WORKING
    // const videoId = 'http://www.youtube.com/watch?v=aqz-KE-bpKQ';
    // const media = await ytdl.getInfo(videoId);
    // res.send(media);


    //TWITTER WORKING
    // let media = await getTwitterMedia("https://twitter.com/WhatsTrending/status/1757977223800230168", {buffer: true});

});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
