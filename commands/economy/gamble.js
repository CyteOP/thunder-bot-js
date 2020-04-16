const { RichEmbed } = require("discord.js");
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://bot:botpw@discordbot-nleos.mongodb.net/DiscordBot?retryWrites=true&w=majority";
const dbClient = mongoose.connect(uri, { useNewUrlParser: true });

const Money = require("../../models/money.js");

module.exports = {
  name: "gamble",
  category: "economy",
  description: "Gamble.",
  usage: "<Amount>",
  cooldown: 3,
  run: async (client, message, args) => {
    if (message.channel.name != "gambling") {
      return message.reply(
        "You can only gamble in the designated gambling channel!"
      );
    }

    if (!args[0]) {
      return message.reply("Please provide an amount to gamble.");
    }

    var cash = parseInt(args[0]);

    var earned = Math.ceil(Math.random() * (cash * 2));

    var netGain = earned - cash;

    var curMoney = 0;

    var work = true;

    await Money.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      (err, money) => {
        if (err) {
          return message.reply("Something went wrong...");
          console.log(err);
        }

        if (money) {
          curMoney = money.money;

          if (curMoney < cash) {
            return message.reply("You don't have that many coins!");
          } else {
            money.money += netGain;
            money.save().catch(err => console.log(err));

            message.reply(`Rolling with ${cash} coins...`);

            let embed = new RichEmbed();

            if (netGain > 0) {
              embed.setDescription(`Awesome! You earned ${netGain}!`);
            } else if (netGain < 0) {
              embed.setDescription(`Aw man... You lost ${Math.abs(netGain)}!`);
            } else {
              embed.setDescription(`Whew! You broke even.`);
            }

            return message.channel.send(embed);
          }
        } else {
          return message.reply(
            "You have no money! Collect coins before gambling!"
          );
        }
      }
    );
  }
};
