const { RichEmbed } = require("discord.js");
const { gainXP, spendMoney, moreEfficient } = require("../../economy.js");
const { stripIndents } = require("common-tags");

const items = require("../../shop.json");

module.exports = {
  name: "shop",
  category: "economy",
  description: "Buy stuff.",
  aliases: ["buy"],
  cooldown: 3,
  run: async (client, message, args) => {
    if (!args[0]) {
      let embed = new RichEmbed().setTitle("Available Items");
      items.forEach(function(item) {
        embed.addField(
          `${item["name"]}`,
          `Cost: ${item["cost"]}\nUsage: !shop ${item["usage"]}`
        );
      });

      return message.channel.send(embed);
    }

    var key = args[0].toLowerCase();

    var msg = "";

    switch (key) {
      case "xp":
        if (!args[1]) {
          msg = "Please specify the amount of XP to buy!";
          break;
        } else {
          var cash = parseInt(args[1]);

          try {
            spendMoney(message, cash);
          } catch (e) {
            msg = e;
            break;
          }

          var bonus = Math.pow(Math.floor(cash / 1000), 2);
          msg = `You bought ${cash} XP!`;
          if (bonus > 0) {
            msg = `You bought ${cash} XP! You got a bonus ${bonus} XP!`;
          }
          gainXP(message, cash + bonus);
        }
        break;
      case "strength":
        if (!args[1]) {
          msg = "Please specify the amount of Strength Syrum to buy!";
          break;
        } else {
          var amount = parseInt(args[1]);

          try {
            spendMoney(message, amount * 10000);
          } catch (e) {
            msg = e;
            break;
          }

          msg = `You bought Strength Syrum! Efficiency +${amount}`;
          moreEfficient(message, amount);
        }
        break;
      default:
        msg = "That item is not for sale!";
    }

    message.reply(msg).then(m => m.delete(5000));
  }
};
