const { RichEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");

module.exports = {
  name: "hedgy",
  category: "fun",
  description: "Sends a hedgehog pic",
  guildOnly: true,
  run: async (client, message, args) => {

    const img = await randomPuppy("Hedgehogifs");
    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setImage(img)
      .setTitle(`From /r/${"Hedgehogifs"}`)
      .setURL(`https://reddit.com/r/${"Hedgehogifs"}`);

    message.channel.send(embed);
  }
};
