const { RichEmbed } = require("discord.js");
const fs = require("fs");
const { generateRandomColor } = require("../../functions.js");
const readline = require("readline");
const curl = require("curlrequest");

var quotes;

curl.request(
  {
    url:
      "https://raw.githubusercontent.com/DuckLord25/discordbotquotes/master/randomfacts.txt"
  },
  function(err, stdout, meta) {
    if (err) {
      console.log(err);
    }
    quotes = stdout.split("~\n");
  }
);

module.exports = {
  name: "randomfact",
  category: "fun",
  description: "Says a random fact.",
  aliases: ["fact", "funfact"],
  guildOnly: true,
  run: async (client, message, args) => {
    if (message.deletable) {
      message.delete();
    }

    let index = Math.abs(Math.floor(Math.random() * quotes.length) - 1);

    let embed = new RichEmbed()
      .setColor(generateRandomColor())
      .setDescription(quotes[index]);

    message.channel.send(embed);
  }
};
