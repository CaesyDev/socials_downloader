const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port = 3000;


app.get('/', function (req, res) {
  res.send('Welcome');
})

//WORKING

//FOR ALL VIDEO DOWNLOAD INCLUDING YOUTUBE
//LIMITS: doesnt not provide media download size : 100 free monthly api calls
app.post("/apiv1", async function (req, res) {
  //Social Download All In One : RAPID API Documentation : $2 monthly all videos links
  const requestUrl = req.body.url;
  const options = {
    method: "POST",
    url: "https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": process.env.RAPID_API_HOST,
    },
    data: {
      url: requestUrl,
    },
  };


  let video = [];
  let audio = [];
  let other = [];


  try {
    const response = await axios.request(options);
    //check for eror first
    if(response.data.error){
      return res.send({
        error : true,
        errMsg : response.data.message
      });
    }

    //handle api limit error throws an error of 429, handle with try catch
    {
      
    }

    const media = response.data.medias;
    for (let index = 0; index < media.length; index++) {
      const element = media[index];

      let temp = {
        downloadLink : element.url,
        quality : element.quality,
        size : "Unknown MB"
      };
      
      if(element.type === 'video'){
        video.push(temp);
      }else if(element.type === 'audio'){
        audio.push(temp);
      }else{
        other.push(temp);
      }
    }

    let setDuration = '';
    if(response.data.source === "twitter"){
      let rounded = parseInt(response.data.medias[0].duration);
      setDuration = secondsToHms(Number(rounded));
    }else {
      setDuration = response.data.duration ? isNaN(parseInt(response.data.duration)) ? convertDurationString(response.data.duration) : convertSecondsToHMSFormatted(parseInt(response.data.duration)) : "unknown";
    }

    res.send({
      title : response.data.title,
      duration :  setDuration,
      coverPicture : response.data.thumbnail,
      audio: audio,
      video: video,
      other : other,
      error :false,
      status : 200
    });

  } catch (error) {
    res.send({
      error : true,
      status : 500,
      errMsg : "Something went wrong ! " + error
    });
  }
});





//FOR ONLY YOUTUBE DOWNLOAD : CREATE 10 
//USE WHEN A VALID YOUTUBE LINK ONLY IS PASTED
app.post("/apiv2", async function (req, res) {
 //RAPID API: YT-API -  $40 monthly API : 4,000,000 : 500 limit daily 
  const ytID = req.body.id;
  const options = {
    method: 'GET',
    url: 'https://yt-api.p.rapidapi.com/dl',
    params: {id: ytID},
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    if(response.data.status === "fail") {
      return res.send({
        error : true,
        status : 404,
        errMsg : response.data.error
      });
    }

    //handle api limit error
    {
      
    }

    const format = response.data.formats;
    const adaptiveFormats = response.data.adaptiveFormats;
    // return res.send(response.data);

    let audio = [];
    let video = [];
    let other = [];

    for (let index = 0; index < format.length; index++) {
      const element = format[index];
      if(detectMediaType(element.mimeType) === "audio"){
        let temp = {
          downloadLink: element.url,
          quality : element.qualityLabel ?? "unknown",
          size : convertContentLengthToMB(element.contentLength)
        };
        audio.push(temp);
      }else if(detectMediaType(element.mimeType) === "video"){

        let size = convertContentLengthToMB(element.contentLength);
        let temp = {
          downloadLink: element.url,
          quality : element.qualityLabel,
          size : size == "NaN" ? "Unknown" : size
        };
        video.push(temp);
      }else {
        let temp = {
          downloadLink: element.url,
          quality : element.qualityLabel ?? "unknown",
          size : convertContentLengthToMB(element.contentLength)
        };
        other.push(temp);
      }
    }

    for (let index = 0; index < adaptiveFormats.length; index++) {
      const element = adaptiveFormats[index];
      if(detectMediaType(element.mimeType) === "audio"){
        let temp = {
          downloadLink: element.url,
          quality : element.qualityLabel ?? "unknown",
          size : convertContentLengthToMB(element.contentLength)
        };
        audio.push(temp);
      }else if(detectMediaType(element.mimeType) === "video"){

        let size = convertContentLengthToMB(element.contentLength);
        let temp = {
          downloadLink: element.url,
          quality : element.qualityLabel,
          size : size == "NaN" ? "Unknown" : size
        };
        video.push(temp);
      }else {
        let temp = {
          downloadLink: element.url,
          quality : element.qualityLabel ?? "unknown",
          size : convertContentLengthToMB(element.contentLength)
        };
        other.push(temp);
      }
    }

    res.send({
      duration : secondsToHms(parseInt(response.data.lengthSeconds)),
      coverPicture : response.data.thumbnail[response.data.thumbnail.length - 1].url ?? "",
      title : response.data.title,
      author : response.data.channelTitle,
      audio: audio,
      video: video,
      other: other,
      error :false,
      status : 200,
    });

  } catch (error) {

    res.send({
      error : true,
      status : 500,
      errMsg : "Something went wrong ! " + error
    });
  }
});






//YOUTUBE SEARCH ALTERNATIVE : WILL REFRAIN FROM USING THIS OFTEN SINCE 
//IT WILL BE MORE FOR GENERATING DOWNLOAD LINKS FOR YOUTUBE
app.post('/word-search-api1/', async function(req, res){
  //RAPID API: YT-API -  $40 monthly API : 4,000,000 : 500 limit daily
  const search = req.body.search;
  const options = {
    method: 'GET',
    url: 'https://yt-api.p.rapidapi.com/search',
    params: {query: search},
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    //handle api limit error
    {

    }
    const data  = response.data.data;
    let allSearchResults = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if(element.type === "shorts_listing" || element.type === "playlist"){
        continue;
      }

      let temp = {
        vidID : element.videoId,
        vidTitle : element.title,
        coverPicture : element.thumbnail !== undefined ? element.thumbnail[element.thumbnail.length > 1 ? element.thumbnail.length - 1 : 0].url : "empty",
        viewCount : element.viewCount,
        published : element.publishedTimeText,
        duration : element.lengthText
      }
      allSearchResults.push(temp);
    }
    return res.send(allSearchResults);

  } catch (error) {
    console.error(error);
  }
});





//USE THIS ONLY FOR YOUTUBE WORD SEARCH
app.post('/word-search-api2/', async function(req, res){
  //RAPID API: Youtube Search and Download : $5 monthly API : 1,000,000 : 500 free limit daily
  const search = req.body.search;
  const options = {
    method: 'GET',
    url: 'https://youtube-search-and-download.p.rapidapi.com/search',
    params: {
      query: search,
      next : 'EogDEgVoZWxsbxr-AlNCU0NBUXRaVVVoeldFMW5iRU01UVlJQkMyMUlUMDVPWTFwaWQwUlpnZ0VMWW1VeE1rSkROWEJSVEVXQ0FRdFZNMEZUYWpGTU5sOXpXWUlCQzJaaGVrMVRRMXBuTFcxM2dnRUxaV3hrWldGSlFYWmZkMFdDQVExU1JGbFJTSE5ZVFdkc1F6bEJnZ0VMT0hwRVUybHJRMmc1Tm1PQ0FRc3pOMFU1VjNORWJVUmxaNElCQzJGaFNXcHpPRXN6YjFsdmdnRUxaMmRvUkZKS1ZuaEdlRldDQVF0clN6UXlURnB4VHpCM1FZSUJDME42VHpOaFNXVXdVbkJ6Z2dFTFNVNHdUMk5WZGtkaU5qQ0NBUXRSYTJWbGFGRTRSRjlXVFlJQkMyWk9NVU41Y2pCYVN6bE5nZ0VMZEZac1kwdHdNMkpYU0RpQ0FRdGZSQzFGT1Rsa01XSk1TWUlCQzJoQlUwNVRSSFZOY2pGUmdnRUxkREEzTVZkdE5EVnhWMDAlM0QYgeDoGCILc2VhcmNoLWZlZWQ%3D',
      hl: 'en',
      gl: 'US',
      upload_date: 't',
      type: 'v',
      duration: 's',
      features: 'li;hd',
      sort: 'v'
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    //handle api limit error
    {
      
    }

    let allSearchResults = [];
    const contents = response.data.contents;
    for (let index = 0; index < contents.length; index++) {
      const element = contents[index];
      let temp = {
        vidID : element.video.videoId,
        vidTitle : element.video.title,
        coverPicture : element.video.thumbnails[element.video.thumbnails.length > 1 ? element.video.thumbnails.length - 1 : 0].url,
        viewCount : element.video.viewCountText,
        published : element.video.publishedTimeText,
        duration : element.video.lengthText
      }
      allSearchResults.push(temp);
    }
    res.send(allSearchResults);

  } catch (error) {
    return res.send({
      error : true,
      errMsg : response.data.message ?? "Something went wrong !"
    });
  }
});







app.post("/weather", async (req, res) => {
  const apiUrl = "https://api.tomorrow.io/v4/weather/forecast";
  const location = req.body.location;
  const apiKey = process.env.WEATHER_API_KEY;
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






//FOR GETTING TRENDING YOUTUBE LINKS FOR BBT
app.post('/api/yt-trending', async(req, res) => {
  const regions = ['CA', 'IN', 'US', 'NG', 'GH', 'FR', 'ES', 'GB']
  const baseUrl = 'https://www.youtube.com/watch?v=';
  try {
    let allTrending = [];
    while (true) {
      const randNum = Math.round(Math.random() * regions.length);
      const randomRegion = regions[randNum];

      const options = {
        method: 'GET',
        url: 'https://yt-api.p.rapidapi.com/trending',
        params: {geo: randomRegion},
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_API_KEY,
          'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
        }
      };
      const response = await axios.request(options);
      if(response.data.error){
        continue;
      }
      const allPayload  = response.data.data;
      for (let index = 0; index < allPayload.length; index++) {
        const element = allPayload[index];
        element.videoId == undefined ? '' : allTrending.push(`${baseUrl}${element.videoId}`)
      }
      break;
    }

    res.send(allTrending);

  } catch (error) {
    console.error(error);
  }

});






app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});








function convertSecondsToHMSFormatted(seconds) {
  if (typeof seconds !== 'number' || seconds < 0) {
    return "unknown"
  }

  // Get hours
  const hours = Math.trunc(seconds / 3600);
  seconds %= 3600;

  // Get minutes
  const minutes = Math.trunc(seconds / 60);
  seconds %= 60;

  // Format the time string
  const formattedTime = [];
  if (hours > 0) {
    formattedTime.push(`${hours}h`);
  }
  if (minutes > 0) {
    formattedTime.push(`${minutes}m`);
  }
  formattedTime.push(`${seconds}s`);
  return formattedTime.join(' '); // Use a space as the delimiter
}





function convertDurationString(durationString) {

  const match = durationString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) {
    return "unknown";
  }

  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  const formattedTime = [];
  if (hours > 0) {
    formattedTime.push(`${hours}h`);
  }
  if (minutes > 0) {
    formattedTime.push(`${minutes}m`);
  }
  if (seconds > 0) {
    formattedTime.push(`${seconds}s`);
  }

  return formattedTime.join(' ');
}



function secondsToHms(seconds) {
  // Ensure seconds is a valid number
  if (isNaN(seconds) || seconds < 0) {
    return "unknown";
  }

  // Extract hours, minutes, and seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;

  // Format the output string with leading zeros for consistency
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = secondsLeft.toString().padStart(2, "0");

  return `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
}






function detectMediaType(input) {
  const videoPattern = /video\/.+;/;
  const audioPattern = /audio\/.+;/;
  // Check if the input matches the video pattern
  if (videoPattern.test(input)) {
      return "video";
  }
  if (audioPattern.test(input)) {
      return "audio";
  }
  return "other";
}



function convertContentLengthToMB(contentLength) {
  contentLength = parseInt(contentLength);
  if (typeof contentLength !== 'number' || contentLength < 0) {
    return "Unknown";
  }
  const fileSizeInMB = contentLength / (1024 * 1024);
  return fileSizeInMB === "NaN" ? "Unknown" :  fileSizeInMB.toFixed(2);
}



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