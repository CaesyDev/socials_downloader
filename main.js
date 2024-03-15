const dotenv = require("dotenv");
dotenv.config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { nextAvaliable } = require("./utils");


// 24 hours max timeout apis
async function checkAvaliability() {
  const apikeys = await prisma.apikeys.findMany();
  let apiStatus = false;
  let apiResponse;

  for (let index = 0; index < apikeys.length; index++) {
    const element = apikeys[index];

    try {
      //simulate api calls using this api key: break on success
      const givenDate = new Date(element.nextAvaliable);
      const now = new Date();
      if(element.avaliable){

        //CASES FOR DIFFERENT FUNCTION CALLS
        //1. YOUTUBE WORD SEARCH :   word-search-api2
        //2. YOUTUBE VIDEO LINK : apiv2
        //3. OTHER VIDEO PLATFORM LINK : apiv1


        //if successful, set return and success variable and break out of the loop.
        apiStatus = true;


      }else if(now.getTime() > givenDate.getTime()){
        //check if date now exceeds nextAvaliableDate
        await prisma.apikeys.update({
            where: { key: element.key },
            data: {
              avaliable: true,
            },
          });
      }else{
        continue;
      }

    } catch (error) {
      //turn off avaliability for the api key
      const element = apikeys[index];
      const apiKey = element.key;
      await prisma.apikeys.update({
        where: { key: apiKey },
        data: {
          avaliable: false,
          nextAvaliable: nextAvaliable(),
        },
      });
    }
  }

  //if loop ends without setting success variable, then return service busy 
  if(apiStatus){
    //success
  }else{
    //error
  }

}

checkAvaliability();