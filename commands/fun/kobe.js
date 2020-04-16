const { RichEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");

module.exports = {
  name: "kobe",
  category: "fun",
  description: "Sends a Kobe pic",
  guildOnly: true,
  run: async (client, message, args) => {

    const img = await randomPuppy("KobeBryant24");
    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setImage(img)
      .setTitle(`KOBE`)
      .setURL(`https://reddit.com/r/${"KobeBryant24"}`);

    message.channel.send(embed);
  }
};
