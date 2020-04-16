const { RichEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");

module.exports = {
  name: "dog",
  category: "fun",
  description: "Sends a dog pic",
  guildOnly: true,
  run: async (client, message, args) => {

    const img = await randomPuppy("woof_irl");
    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setImage(img)
      .setTitle(`From /r/${"woof_irl"}`)
      .setURL(`https://reddit.com/r/${"woof_irl"}`);

    message.channel.send(embed);
  }
};
