const express = require('express');
const getTwitterMedia = require('get-twitter-media');
const ytdl = require('ytdl-core');
const tiktokDl = require("@sasmeee/tkdl");



const snapsave  = require("snapsave-downloader2")



const app = express();
const port = 3000;

app.get('/', async (req, res) => {


    

    //INSTAGRAM AND FACEBOOK: VALIDATE URLS
    //CHECK FOR HOW TO RENAME FILES BEFORE DOWNLOADS

    const link = "https://www.instagram.com/p/Ctv11DiPfV5/?igshid=NTc4MTIwNjQ2YQ%3D%3D&img_index=1";
    const link2 = "https://www.instagram.com/tv/CdmYaq3LAYo/";


    let URL = await snapsave("https://fb.watch/qkv1w4vj1S/");
    console.log(URL)
    res.send(URL);

   



    //TIKTOK DOWNLOADER WORKING: RETURNS 2 FORMATS with cover image: must ensure validation of the link in this pattern
    // const url = "https://www.tiktok.com/@kelvinaigbekelvin/video/7237595412713049349";
    // const dataList = await tiktokDl(url);
    // res.send(dataList);




    //YOUTUBE WORKING
    // const videoId = 'http://www.youtube.com/watch?v=aqz-KE-bpKQ';
    // const media = await ytdl.getInfo(videoId);
    // res.send(media);



    //TWITTER WORKING: returns only stream link,  will have to trigger a download from the server
    // let media = await getTwitterMedia("https://twitter.com/WhatsTrending/status/1757977223800230168", {buffer: true});
    // res.send(media);

});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
