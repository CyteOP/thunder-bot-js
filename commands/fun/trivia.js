const { RichEmbed } = require("discord.js");
const { promptMessage } = require("../../functions.js");
const { stripIndents } = require("common-tags");
const quiz = require("../../quiz.json");

const mongoose = require("mongoose");

const uri =
  "mongodb+srv://bot:botpw@discordbot-nleos.mongodb.net/DiscordBot?retryWrites=true&w=majority";
const dbClient = mongoose.connect(uri, { useNewUrlParser: true });

const Money = require("../../models/money.js");

const qs = quiz.QS;

module.exports = {
  name: "trivia",
  category: "fun",
  description: "Trivia Game. React to one of the emojis to play the game.",
  usage: "trivia",
  guildOnly: true,
  run: async (client, message, args) => {
    const chooseArr = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];

    const question = qs[Math.floor(Math.random() * qs.length)];

    const answer = question.A;
    var options = [question.X, question.Y, question.Z];

    var promptArr = ["u", "u", "u", "u"];
    promptArr[Math.floor(Math.random() * promptArr.length)] = answer;

    for (let i = 0; i < promptArr.length; i++) {
      if (promptArr[i] === "u") {
        promptArr[i] = options.pop();
      }
    }

    const embed = new RichEmbed()
      .setColor("#ffffff")
      .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
      .setDescription(
        stripIndents`Q: **${question.Q}**
                                  1: *${promptArr[0]}*
                                  2: *${promptArr[1]}*
                                  3: *${promptArr[2]}*
                                  4: *${promptArr[3]}*`
      )
      .setTimestamp();

    const m = await message.channel.send(embed);
    const reacted = await promptMessage(m, message.author, 30, chooseArr);

    const result = await getResult(reacted);
    embed.setDescription(result);
    await m.clearReactions();

    m.edit(embed);

    function getResult(choice) {
      var coinAmount = Math.floor(Math.random() * 10) + 10;
      if (promptArr[chooseArr.indexOf(choice)] === answer) {
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
            const newMoney = new Money({
              userID: message.author.id,
              serverID: message.guild.id,
              money: coinAmount
            });
            newMoney.save().catch(err => console.log(err));
          } else {
            money.money = money.money + coinAmount;
            money.save().catch(err => console.log(err));
          }
        }
      );
        return "Correct! You got " + coinAmount + " coins!";
      } else {
        return "Nope!";
      }
    }
  }
};
