const { RichEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");

module.exports = {
  name: "redpanda",
  category: "fun",
  description: "Sends a red panda pic",
  guildOnly: true,
  run: async (client, message, args) => {

    const img = await randomPuppy("redpandas");
    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setImage(img)
      .setTitle(`From /r/${"redpandas"}`)
      .setURL(`https://reddit.com/r/${"redpandas"}`);

    message.channel.send(embed);
  }
};
