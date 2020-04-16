const { RichEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");

module.exports = {
  name: "cat",
  category: "fun",
  description: "Sends a cat pic",
  guildOnly: true,
  run: async (client, message, args) => {

    const img = await randomPuppy("MEOW_IRL");
    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setImage(img)
      .setTitle(`From /r/${"MEOW_IRL"}`)
      .setURL(`https://reddit.com/r/${"MEOW_IRL"}`);

    message.channel.send(embed);
  }
};
