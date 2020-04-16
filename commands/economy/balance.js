const mongoose = require("mongoose");

const uri =
  "mongodb+srv://bot:botpw@discordbot-nleos.mongodb.net/DiscordBot?retryWrites=true&w=majority";
const dbClient = mongoose.connect(uri, { useNewUrlParser: true });

const Money = require("../../models/money.js");

module.exports = {
  name: "balance",
  category: "economy",
  description: "Shows Your Balance.",
  aliases: ["bal", "coins"],
  cooldown: 3,
  run: async (client, message, args) => {
    Money.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      (err, money) => {
        if (err) {
          console.log(err);
        }

        if (!money) {
          return message.reply(`You have no coins... ☹️`);
        } else {
          return message.reply(`You have ${money.money} coins! 💰`);
        }
      }
    );
  }
};
