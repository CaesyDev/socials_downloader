const dotenv = require("dotenv");
dotenv.config();
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();


async function init() {
  
    const apikeys = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j"
    ];

    for (let index = 0; index < apikeys.length; index++) {
        const element = apikeys[index];
        try {
            await prisma.apikeys.create({
                data:{
                    key : element,
                    avaliable : true,
                    nextAvaliable : nextAvaliable()
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}




function nextAvaliable(){
    const currentTime = new Date();
    const twentyFiveHoursFromNow = new Date(currentTime.getTime() + ((24 + 1) * 60 * 60 * 1000));
    return twentyFiveHoursFromNow.toISOString();
}




const currentTime = new Date();
const dateString = new Date(currentTime.getTime() + ((24 - 25) * 60 * 60 * 1000)).toISOString();
const givenDate = new Date(dateString);
const now = new Date();
console.log(now.getTime() > givenDate.getTime());


module.exports = {
    nextAvaliable,
}