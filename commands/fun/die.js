const curl = require("curlrequest");
const { RichEmbed } = require("discord.js");
const { generateRandomColor } = require("../../functions.js");

var deaths;

curl.request(
  {
    url:
      "https://raw.githubusercontent.com/DuckLord25/discordbotquotes/master/die.txt"
  },
  function(err, stdout, meta) {
    deaths = stdout.split("\n");
  }
);

module.exports = {
  name: "die",
  category: "fun",
  description: "Try to survive this...",
  guildOnly: true,
  run: async (client, message, args) => {
    let index = Math.abs(Math.floor(Math.random() * deaths.length) - 1);

    let response = deaths[index].split(" | ");

    message.reply(response[0]);

    var embed = new RichEmbed()
      .setColor(generateRandomColor())
      .setTitle("**R.I.P.**")
      .setDescription(response[1]);

    return message.channel.send(embed);
  }
};
