const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const validator = require("validator");
const prisma = new PrismaClient();

async function init() {
  const apikeys = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  for (let index = 0; index < apikeys.length; index++) {
    const element = apikeys[index];
    try {
      await prisma.apikeys.create({
        data: {
          key: element,
          avaliable: true,
          nextAvaliable: nextAvaliable(),
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}

function convertSecondsToHMSFormatted(seconds) {
  if (typeof seconds !== "number" || seconds < 0) {
    return "unknown";
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
  return formattedTime.join(" "); // Use a space as the delimiter
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

  return formattedTime.join(" ");
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
  if (typeof contentLength !== "number" || contentLength < 0) {
    return "Unknown";
  }
  const fileSizeInMB = contentLength / (1024 * 1024);
  return fileSizeInMB === "NaN" ? "Unknown" : fileSizeInMB.toFixed(2);
}

function nextAvaliableOneDay() {
  const currentTime = new Date();
  const twentyFiveHoursFromNow = new Date(
    currentTime.getTime() + (24 + 1) * 60 * 60 * 1000
  );
  return twentyFiveHoursFromNow.toISOString();
}

function nextAvaliableOneMonth() {
  const currentTime = new Date();
  const twentyFiveHoursFromNow = new Date(
    currentTime.getTime() + (24 + 1) * 60 * 60 * 1000
  );
  return twentyFiveHoursFromNow.toISOString();
}

function matchYoutubeLinks(url) {
  const youtubeUrlRegex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|)([\w\-\_]+)(?:\?[^#]*#)?/;
  return youtubeUrlRegex.test(url);
}

function isValidNonYoutubeLink(url) {
  return validator.isURL(url) && !url.includes("youtube.com");
}

function extractYoutubeVideoId(url) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=)?([^\?&\s]+)/;
  const match = regex.exec(url);
  if (match) {
    return match[1];
  } else {
    return null;
  }
}

//500 daily limit request
async function youtubeWordSearch2(search, apiKey) {
  const options = {
    method: "GET",
    url: "https://youtube-search-and-download.p.rapidapi.com/search",
    params: {
      query: search,
      next: "EogDEgVoZWxsbxr-AlNCU0NBUXRaVVVoeldFMW5iRU01UVlJQkMyMUlUMDVPWTFwaWQwUlpnZ0VMWW1VeE1rSkROWEJSVEVXQ0FRdFZNMEZUYWpGTU5sOXpXWUlCQzJaaGVrMVRRMXBuTFcxM2dnRUxaV3hrWldGSlFYWmZkMFdDQVExU1JGbFJTSE5ZVFdkc1F6bEJnZ0VMT0hwRVUybHJRMmc1Tm1PQ0FRc3pOMFU1VjNORWJVUmxaNElCQzJGaFNXcHpPRXN6YjFsdmdnRUxaMmRvUkZKS1ZuaEdlRldDQVF0clN6UXlURnB4VHpCM1FZSUJDME42VHpOaFNXVXdVbkJ6Z2dFTFNVNHdUMk5WZGtkaU5qQ0NBUXRSYTJWbGFGRTRSRjlXVFlJQkMyWk9NVU41Y2pCYVN6bE5nZ0VMZEZac1kwdHdNMkpYU0RpQ0FRdGZSQzFGT1Rsa01XSk1TWUlCQzJoQlUwNVRSSFZOY2pGUmdnRUxkREEzTVZkdE5EVnhWMDAlM0QYgeDoGCILc2VhcmNoLWZlZWQ%3D",
      hl: "en",
      gl: "US",
      upload_date: "t",
      type: "v",
      duration: "s",
      features: "li;hd",
      sort: "v",
    },
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    let allSearchResults = [];
    const contents = response.data.contents;
    for (let index = 0; index < contents.length; index++) {
      const element = contents[index];
      let temp = {
        vidID: element.video.videoId,
        vidTitle: element.video.title,
        coverPicture:
          element.video.thumbnails[
            element.video.thumbnails.length > 1
              ? element.video.thumbnails.length - 1
              : 0
          ].url,
        viewCount: element.video.viewCountText,
        published: element.video.publishedTimeText,
        duration: element.video.lengthText,
      };
      allSearchResults.push(temp);
    }

    return {
      searchResult: allSearchResults,
      error: false,
    };
  } catch (error) {
    throw new Error("Api limit reached !");
  }
}

//500 daily limit - used along side with youtube downloader
async function youtubeWordSearch(search, apiKey) {

  const options = {
    method: "GET",
    url: "https://yt-api.p.rapidapi.com/search",
    params: { query: search },
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "yt-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const data = response.data.data;
    let allSearchResults = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.type === "shorts_listing" || element.type === "playlist") {
        continue;
      }

      let temp = {
        vidID: element.videoId,
        vidTitle: element.title,
        coverPicture:
          element.thumbnail !== undefined
            ? element.thumbnail[
                element.thumbnail.length > 1 ? element.thumbnail.length - 1 : 0
              ].url
            : "empty",
        viewCount: element.viewCount,
        published: element.publishedTimeText,
        duration: element.lengthText,
      };
      allSearchResults.push(temp);
    }

    return {
      searchResult: allSearchResults,
      error: false,
    };
  } catch (error) {
    throw new Error("Api limit reached !");
  }
}

// free 100 monthly request limit
async function allVideoDownloader(requestUrl, apiKey) {
  const options = {
    method: "POST",
    url: "https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "social-download-all-in-one.p.rapidapi.com",
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
    if (response.data.error) {
      return {
        status: 404,
        error: true,
        errMsg: response.data.message,
      };
    }

    const media = response.data.medias;
    for (let index = 0; index < media.length; index++) {
      const element = media[index];

      let temp = {
        downloadLink: element.url,
        quality: element.quality,
        size: "Unknown MB",
      };

      if (element.type === "video") {
        video.push(temp);
      } else if (element.type === "audio") {
        audio.push(temp);
      } else {
        other.push(temp);
      }
    }

    let setDuration = "";
    if (response.data.source === "twitter") {
      let rounded = parseInt(response.data.medias[0].duration);
      setDuration = secondsToHms(Number(rounded));
    } else {
      setDuration = response.data.duration
        ? isNaN(parseInt(response.data.duration))
          ? convertDurationString(response.data.duration)
          : convertSecondsToHMSFormatted(parseInt(response.data.duration))
        : "unknown";
    }

    return {
      title: response.data.title,
      duration: setDuration,
      coverPicture: response.data.thumbnail,
      audio: audio,
      video: video,
      other: other,
      error: false,
      status: 200,
    };
  } catch (error) {
    throw new Error("Api limit reached !");
  }
}

// free 500 monthly requests
async function youtubeDownloader(url, apiKey) {
  const ytID = extractYoutubeVideoId(url);
  const options = {
    method: "GET",
    url: "https://yt-api.p.rapidapi.com/dl",
    params: { id: ytID },
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "yt-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    if (response.data.status === "fail") {
      return {
        error: true,
        status: 404,
        errMsg: response.data.error,
      };
    }

    const format = response.data.formats;
    const adaptiveFormats = response.data.adaptiveFormats;

    let audio = [];
    let video = [];
    let other = [];

    for (let index = 0; index < format.length; index++) {
      const element = format[index];
      if (detectMediaType(element.mimeType) === "audio") {
        let temp = {
          downloadLink: element.url,
          quality: element.qualityLabel ?? "unknown",
          size: convertContentLengthToMB(element.contentLength),
        };
        audio.push(temp);
      } else if (detectMediaType(element.mimeType) === "video") {
        let size = convertContentLengthToMB(element.contentLength);
        let temp = {
          downloadLink: element.url,
          quality: element.qualityLabel,
          size: size == "NaN" ? "Unknown" : size,
        };
        video.push(temp);
      } else {
        let temp = {
          downloadLink: element.url,
          quality: element.qualityLabel ?? "unknown",
          size: convertContentLengthToMB(element.contentLength),
        };
        other.push(temp);
      }
    }

    for (let index = 0; index < adaptiveFormats.length; index++) {
      const element = adaptiveFormats[index];
      if (detectMediaType(element.mimeType) === "audio") {
        let temp = {
          downloadLink: element.url,
          quality: element.qualityLabel ?? "unknown",
          size: convertContentLengthToMB(element.contentLength),
        };
        audio.push(temp);
      } else if (detectMediaType(element.mimeType) === "video") {
        let size = convertContentLengthToMB(element.contentLength);
        let temp = {
          downloadLink: element.url,
          quality: element.qualityLabel,
          size: size == "NaN" ? "Unknown" : size,
        };
        video.push(temp);
      } else {
        let temp = {
          downloadLink: element.url,
          quality: element.qualityLabel ?? "unknown",
          size: convertContentLengthToMB(element.contentLength),
        };
        other.push(temp);
      }
    }

    return {
      duration: secondsToHms(parseInt(response.data.lengthSeconds)),
      coverPicture:
        response.data.thumbnail[response.data.thumbnail.length - 1].url ?? "",
      title: response.data.title,
      author: response.data.channelTitle,
      audio: audio,
      video: video,
      other: other,
      error: false,
      status: 200,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Api limit reached !");
  }
}

// increment API counter
async function incrementApiCounter(type, key, req) {
  if (type == "youtubewordsearch") {
    let searchKeys = await prisma.apirequestcount.findMany({
      where: {
        key: key,
        type: type,
      },
    });

    if (searchKeys.length > 0) {
      const element = searchKeys[0];
      await prisma.apirequestcount.updateMany({
        where: {
          key: {
            contains: key,
          },

          type: {
            contains: type,
          },
        },
        data: {
          count: element.count + 1,
        },
      });
    } else {
      //create new value
      await prisma.apirequestcount.create({
        data: {
          key: key,
          type: "youtubewordsearch",
          count: 1,
        },
      });
    }
  }

  if (type == "allvideodownloader") {
    let searchKeys = await prisma.apirequestcount.findMany({
      where: {
        key: key,
      },
    });

    if (searchKeys.length > 0) {
      const element = searchKeys[0];
      await prisma.apirequestcount.updateMany({
        where: {
          key: {
            contains: key,
          },
        },
        data: {
          count: element.count + 1,
        },
      });
    } else {
      //create new value
      await prisma.apirequestcount.create({
        data: {
          key: key,
          type: "allvideodownloader",
          count: 1,
        },
      });
    }
  }

  if (type == "youtubedownloader") {
    let searchKeys = await prisma.apirequestcount.findMany({
        where: {
            key: key,
            type: type,
          },
    });

    if (searchKeys.length > 0) {
      const element = searchKeys[0];
      await prisma.apirequestcount.updateMany({
        where: {
          key: {
            contains: key,
          },
        },
        data: {
          count: element.count + 1,
        },
      });
    } else {
      //create new value
      await prisma.apirequestcount.create({
        data: {
          key: key,
          type: "youtubedownloader",
          count: 1,
        },
      });
    }
  }

  const {userAgent, ipAddress, operatingSystem} = extractRequestDetails(req);
  const timeDate = getCurrentDateTimeAsString();
  await prisma.webvisit.create({
    data: {
        agent : userAgent,
        ipaddr : ipAddress,
        os : operatingSystem,
        dateTime: timeDate
    },
  });

}


function extractRequestDetails(req) {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const os = userAgent.match(/\(([^)]+)\)/);
    const operatingSystem = os ? os[1] : '';
    return {
      userAgent,
      ipAddress,
      operatingSystem
    };
}


function getCurrentDateTimeAsString() {
    const now = new Date();
    // Get date components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
    const day = String(now.getDate()).padStart(2, '0');
  
    // Get time components
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const dateTimeString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return dateTimeString;
  }


module.exports = {
  nextAvaliableOneDay,
  matchYoutubeLinks,
  isValidNonYoutubeLink,
  youtubeWordSearch,
  youtubeWordSearch2,
  allVideoDownloader,
  youtubeDownloader,
  nextAvaliableOneMonth,
  incrementApiCounter,
};
