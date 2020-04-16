const { RichEmbed } = require("discord.js");
const fs = require("fs");
const readline = require("readline");
const curl = require("curlrequest");

var quotes = [];

curl.request(
  {
    url:
      "https://raw.githubusercontent.com/DuckLord25/discordbotquotes/master/datingadvice.txt"
  },
  function(err, stdout, meta) {
    quotes = stdout.split("\n");
  }
);

module.exports = {
  name: "dating-advice",
  category: "fun",
  description: "Gives Dating Advice.",
  guildOnly: true,
  run: async (client, message, args) => {

    let index = Math.abs(Math.floor(Math.random() * quotes.length));

    if (args[0] !== undefined) {
      index = parseInt(args[0]) - 1;
    }

    let embed = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(quotes[index]);

    message.channel.send(embed);
  }
};