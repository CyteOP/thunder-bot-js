const { RichEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");

module.exports = {
  name: "meme",
  category: "fun",
  aliases: ["memey", "plsmeme", "epicc", "memelord"],
  description: "Sends an epic meme",
  guildOnly: true,
  run: async (client, message, args) => {
    if (message.deletable) {
      message.delete();
    }
    
    const subreddits = ["dank_meme", "dankmemes"]
    
    let index = Math.abs(Math.floor(Math.random() * subreddits.length) - 1);
    
    let pick = subreddits[index];
    
    if (args[0] !== undefined) {
      pick = parseInt(args[0]) - 1;
    }

    const img = await randomPuppy(pick);
    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setImage(img)
      .setTitle(`From /r/${pick}`)
      .setURL(`https://reddit.com/r/${pick}`);

    message.channel.send(embed);
  }
};
