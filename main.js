const dotenv = require("dotenv");
dotenv.config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    const allVideoApiKeys = await prisma.allvideodownloader.findMany();
    if (allVideoApiKeys.length == 0) {

      await prisma.youtubewordsearch.createMany({
        data: [
          {
            key: "660473502amsha3b31bbf2077b15p10a6b8jsn7626d7cff8e7",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "dcee779f9amsh99baadd6aba228dp12ae8ejsn286be95e6a0b",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "20ed41ded8mshfd757c5fabf567ap116da5jsn6c1176927135",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "c5e94a91f4mshc0957267ed7d88cp16bd4cjsn838c2916da7f",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "685ce38666msh2fef10d153b8e55p1c000djsnb1bbff17b1cf",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "e86b49f6fbmsh4438bcd0bc0665bp101d11jsn8d2254a46899",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "83ed25539emsh61abeea759aab94p101c15jsn217ab73207c6",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "5cd1fa3439msh5c3786f712fd9a4p14c60cjsn5d344958f7cd",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "2ef0429f59msh6a50049c6edb236p1085fbjsnf9ec19019df9",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "dd6a371c0dmsh308bd595243d808p1d0bfdjsn8b1200565d56",
            avaliable: true,
            nextAvaliable: "",
          },
        ],
      });

      await prisma.allvideodownloader.createMany({
        data: [
          {
            key: "660473502amsha3b31bbf2077b15p10a6b8jsn7626d7cff8e7",
            avaliable: false,
            nextAvaliable: "",
          },

          {
            key: "dcee779f9amsh99baadd6aba228dp12ae8ejsn286be95e6a0b",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "20ed41ded8mshfd757c5fabf567ap116da5jsn6c1176927135",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "c5e94a91f4mshc0957267ed7d88cp16bd4cjsn838c2916da7f",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "685ce38666msh2fef10d153b8e55p1c000djsnb1bbff17b1cf",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "e86b49f6fbmsh4438bcd0bc0665bp101d11jsn8d2254a46899",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "83ed25539emsh61abeea759aab94p101c15jsn217ab73207c6",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "5cd1fa3439msh5c3786f712fd9a4p14c60cjsn5d344958f7cd",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "2ef0429f59msh6a50049c6edb236p1085fbjsnf9ec19019df9",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "dd6a371c0dmsh308bd595243d808p1d0bfdjsn8b1200565d56",
            avaliable: true,
            nextAvaliable: "",
          },
        ],
      });

      await prisma.youtubedownloader.createMany({
        data: [
          {
            key: "660473502amsha3b31bbf2077b15p10a6b8jsn7626d7cff8e7",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "dcee779f9amsh99baadd6aba228dp12ae8ejsn286be95e6a0b",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "20ed41ded8mshfd757c5fabf567ap116da5jsn6c1176927135",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "c5e94a91f4mshc0957267ed7d88cp16bd4cjsn838c2916da7f",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "685ce38666msh2fef10d153b8e55p1c000djsnb1bbff17b1cf",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "e86b49f6fbmsh4438bcd0bc0665bp101d11jsn8d2254a46899",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "83ed25539emsh61abeea759aab94p101c15jsn217ab73207c6",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "5cd1fa3439msh5c3786f712fd9a4p14c60cjsn5d344958f7cd",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "2ef0429f59msh6a50049c6edb236p1085fbjsnf9ec19019df9",
            avaliable: true,
            nextAvaliable: "",
          },

          {
            key: "dd6a371c0dmsh308bd595243d808p1d0bfdjsn8b1200565d56",
            avaliable: true,
            nextAvaliable: "",
          },
        ],
      });
    }
  } catch (error) {
    console.log(error);
  }
})();
