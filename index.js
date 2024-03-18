const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
dotenv.config();
const {
  matchYoutubeLinks,
  isValidNonYoutubeLink,
  nextAvaliableOneDay,
  nextAvaliableOneMonth,
  youtubeWordSearch,
  allVideoDownloader,
  youtubeDownloader,
  incrementApiCounter
} = require("./utils");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port = 3000;

app.get("/", function (req, res) {
  res.send("Welcome");
});

app.post("/query", async function (req, res) {
  const reqString = req.body.reqString;

  if (matchYoutubeLinks(reqString)) {
    const youtubeApiKeys = await prisma.youtubedownloader.findMany();
    let apiStatus = false;
    let apiResponse;

    for (let index = 0; index < youtubeApiKeys.length; index++) {
      const element = youtubeApiKeys[index];
      try {
        //simulate api calls using this api key: break on success
        const givenDate = new Date(element.nextAvaliable);
        const now = new Date();
        if (element.avaliable) {
          apiResponse = await youtubeDownloader(reqString, element.key);
          if (!apiResponse.error) {
            apiStatus = true;
            //increment counter just before breaking out of loop
            await incrementApiCounter("youtubedownloader", element.key, req);
            break;
          } else if (apiResponse.error) {
            apiStatus = true;
            //increment counter just before breaking out of loop
            await incrementApiCounter("youtubedownloader", element.key, req);
            break;
          }
        } else if (now.getTime() > givenDate.getTime()) {
          //check if date now exceeds nextAvaliableDate
          await prisma.youtubedownloader.updateMany({
            where: {
              key:{
                contains: element.key,
              },
            },
            data: {
              avaliable: true,
            },
          });

          // should attempt api call with this api key
          apiResponse = await youtubeDownloader(reqString, element.key);
          if (!apiResponse.error) {
            //increment counter just before breaking out of loop
            await incrementApiCounter("youtubedownloader", element.key, req);
            apiStatus = true;
            break;
          } else if (apiResponse.error) {
            //increment counter just before breaking out of loop
            await incrementApiCounter("youtubedownloader", element.key, req);
            apiStatus = true;
            break;
          }
        } else {
          continue;
        }
      } catch (error) {
        //turn off avaliability for the api key
        const element = youtubeApiKeys[index];
        const apiKey = element.key;
        await prisma.youtubedownloader.updateMany({
          where: {
            key: {
              contains: apiKey,
            },
          },
          data: {
            avaliable: false,
            nextAvaliable: nextAvaliableOneDay(),
          },
        });
      }
    }

    //if loop ends without setting success variable, then return service busy
    //TO LISTEN FOR 3 STATUS ON THE FRONT END: SUCCESS - 200, FAIL - 404, SERVER BUSY - 429
    if (apiStatus) {
      //success: whether the api failed or not
      res.json(apiResponse);
    } else if (!apiStatus) {
      //ALL APIs HAS BEEN EXHAUSTED
      res.json({
        error: true,
        status: 429,
        errMsg: "Too many requests received",
      });
    }
  } else if (isValidNonYoutubeLink(reqString)) {
    const allVideoApiKeys = await prisma.allvideodownloader.findMany();
    let apiStatus = false;
    let apiResponse;

    for (let index = 0; index < allVideoApiKeys.length; index++) {
      const element = allVideoApiKeys[index];
      try {
        //simulate api calls using this api key: break on success
        const givenDate = new Date(element.nextAvaliable);
        const now = new Date();
        if (element.avaliable) {
          apiResponse = await allVideoDownloader(reqString, element.key);
          if (!apiResponse.error) {
            apiStatus = true;
            //increment counter just before breaking out of loop
            await incrementApiCounter("allvideodownloader", element.key, req);
            break;
          } else if (apiResponse.error) {
            apiStatus = true;
            //increment counter just before breaking out of loop
            await incrementApiCounter("allvideodownloader", element.key, req);
            break;
          }
        } else if (now.getTime() > givenDate.getTime()) {
          //check if date now exceeds nextAvaliableDate
          await prisma.allVideoApiKeys.updateMany({
            where:{
              key: {
                contains: element.key,
              },
            },
            data: {
              avaliable: true,
            },
          });

          // should attempt api call with this api key
          apiResponse = await allVideoDownloader(reqString, element.key);
          if (!apiResponse.error) {
            apiStatus = true;
            //increment counter just before breaking out of loop
            await incrementApiCounter("allvideodownloader", element.key, req);
            break;
          } else if (apiResponse.error) {
            apiStatus = true;
            //increment counter just before breaking out of loop
            await incrementApiCounter("allvideodownloader", element.key, req);
            break;
          }
        } else {
          continue;
        }
      } catch (error) {
        //turn off avaliability for the api key
        const element = allVideoApiKeys[index];
        const apiKey = element.key;
        await prisma.allvideodownloader.updateMany({
          where:{
            key: {
              contains: apiKey,
            },
          },
          data: {
            avaliable: false,
            nextAvaliable: nextAvaliableOneMonth(),
          },
        });
      }
    }

    //if loop ends without setting success variable, then return service busy
    //TO LISTEN FOR 3 STATUS ON THE FRONT END: SUCCESS - 200, FAIL - 404, SERVER BUSY - 429
    if (apiStatus) {
      //success: whether the api failed or not
      res.json(apiResponse);
    } else if (!apiStatus) {
      //ALL APIs HAS BEEN EXHAUSTED
      res.json({
        error: true,
        status: 429,
        errMsg: "Too many requests received",
      });
    }
  } else {
    // YOUTUBE WORD SEARCH
    const youtubeSearchApiKeys = await prisma.youtubewordsearch.findMany();
    let apiStatus = false;
    let apiResponse;

    for (let index = 0; index < youtubeSearchApiKeys.length; index++) {
      const element = youtubeSearchApiKeys[index];
      try {
        //simulate api calls using this api key: break on success
        const givenDate = new Date(element.nextAvaliable);
        const now = new Date();
        if(element.avaliable){
          apiResponse = await youtubeWordSearch(reqString, element.key);
          if (!apiResponse.error) {
            apiStatus = true;
            //increment counter just before breaking out of loop
            await incrementApiCounter("youtubewordsearch", element.key, req);
            break;
          }
        } else if (now.getTime() > givenDate.getTime()) {
          //check if date now exceeds nextAvaliableDate
          await prisma.youtubewordsearch.updateMany({
            where:{
              key: {
                contains: element.key,
              },
            },
            data: {
              avaliable: true,
            },
          });

          // should attempt api call with this api key
          apiResponse = await youtubeWordSearch(reqString, element.key);
          if (!apiResponse.error) {
              apiStatus = true;
              //increment counter just before breaking out of loop
              await incrementApiCounter("youtubewordsearch", element.key, req);
              break;
          }
        } else {
          continue;
        }
      } catch (error) {
        //turn off avaliability for the api key
        const element = youtubeSearchApiKeys[index];
        const apiKey = element.key;
        await prisma.youtubewordsearch.updateMany({
          where:{
            key: {
              contains: apiKey,
            },
          },
          data: {
            avaliable: false,
            nextAvaliable: nextAvaliableOneDay(),
          },
        });
      }
    }

    //if loop ends without setting success variable, then return service busy
    //TO LISTEN FOR 3 STATUS ON THE FRONT END: SUCCESS - 200, FAIL - 404, SERVER BUSY - 429
    if (apiStatus) {
      //success: whether the api failed or not
      res.json(apiResponse);
    } else if (!apiStatus) {
      //ALL APIs HAS BEEN EXHAUSTED
      res.json({
        error: true,
        status: 429,
        errMsg: "Too many requests received",
      });
    }
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
      res.json({
        status: "ok",
        message: response.data,
      });
    })
    .catch((error) => {
      res.json({
        status: "error",
        message: error,
      });
    });
});



//FOR GETTING TRENDING YOUTUBE LINKS FOR BBT
app.post("/api/yt-trending", async (req, res) => {
  const regions = ["CA", "IN", "US", "NG", "GH", "FR", "ES", "GB"];
  const baseUrl = "https://www.youtube.com/watch?v=";
  const youtubeApiKeys = await prisma.youtubedownloader.findMany();
  let allTrending = [];
  for (let index = 0; index < youtubeApiKeys.length; index++) {
    const element = youtubeApiKeys[index];
    try {  
        const randNum = Math.round(Math.random() * regions.length);
        const randomRegion = regions[randNum];
        const options = {
          method: "GET",
          url: "https://yt-api.p.rapidapi.com/trending",
          params: { geo: randomRegion },
          headers: {
            "X-RapidAPI-Key": element.key,
            "X-RapidAPI-Host": "yt-api.p.rapidapi.com",
          },
        };

        const response = await axios.request(options);
        if (response.data.error) {
          continue;
        }

        const allPayload = response.data.data;
        for (let index = 0; index < allPayload.length; index++) {
          const element = allPayload[index];
          element.videoId == undefined ? "" : allTrending.push(`${baseUrl}${element.videoId}`);
        }

    } catch (error) {
      continue;
    }
  }

  res.json(allTrending);
  //the bbt will check for empty array before proceeding
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
