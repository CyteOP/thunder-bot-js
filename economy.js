const mongoose = require("mongoose");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

const uri =
  "mongodb+srv://bot:botpw@discordbot-nleos.mongodb.net/DiscordBot?retryWrites=true&w=majority";
const dbClient = mongoose.connect(uri, { useNewUrlParser: true });

// Models
const Level = require("./models/level.js");
const Money = require("./models/money.js");
const Inv = require("./models/inventory.js");

// Jobs
const jobs = [
  "Unemployed",
  "Fisherman",
  "Lumberjack",
  "Miner",
  "Farmer",
  "Hunter"
];

module.exports = {
  gainXP: async function(message, amount) {
    Level.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      async (err, level) => {
        if (err) {
          console.log(err);
        }

        if (!level) {
          const newLevel = new Level({
            userID: message.author.id,
            serverID: message.guild.id,
            xp: amount,
            level: 1
          });
          newLevel.save().catch(err => console.log(err));
        } else {
          level.xp = level.xp + amount;
          let toNextLevel = Math.pow(level.level, 2) * 50;
          if (level.xp >= toNextLevel) {
            level.level = level.level + 1;
            message.reply(
              `Congrats! You have leveled up! You are now level ${level.level}!`
            );
            await Inv.findOne(
              { userID: message.author.id, serverID: message.guild.id },
              (err, inv) => {
                if (err) {
                  console.log(err);
                }

                if (inv) {
                  inv.jobEff = level.level;
                }
              }
            );
          }
          level.save().catch(err => console.log(err));
        }
      }
    );
  },
  gainMoney: async function(message, amount) {
    Money.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      (err, level) => {
        if (err) {
          console.log(err);
        }

        if (!level) {
          const newLevel = new Money({
            userID: message.author.id,
            serverID: message.guild.id,
            money: amount
          });
          newLevel.save().catch(err => console.log(err));
        } else {
          level.money = level.money + amount;
          level.save().catch(err => console.log(err));
        }
      }
    );
  },
  spendMoney: async function(message, amount) {
    Money.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      (err, level) => {
        if (err) {
          console.log(err);
        }

        if (!level) {
          throw "You don't have enough money!";
        } else {
          if (level.money - amount < 0) {
            throw "You don't have enough money!";
          } else {
            level.money = level.money - amount;
            level.save().catch(err => console.log(err));
          }
        }
      }
    );
  },
  moreEfficient: async function(message, amount) {
    Inv.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      (err, level) => {
        if (err) {
          console.log(err);
        }

        if (!level) {
          throw "You need to go gather some stuff first!";
        } else {
          level.baseEff = level.baseEff + amount;
          level.save().catch(err => console.log(err));
        }
      }
    );
  },
  getLevel: async function(message) {
    var lvl = 0;
    await Level.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      (err, level) => {
        if (err) {
          console.log(err);
        }

        if (level) {
          lvl = level.level;
        }
      }
    );

    return lvl;
  },
  getWood: async function(message) {
    await Inv.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      (err, inv) => {
        if (err) {
          console.log(err);
        }

        var size = Math.round(Math.random() * 2);

        if (inv) {
          inv.wood = inv.wood + size;
          inv.save().catch(err => console.log(err));
        } else {
          const newInv = new Inv({
            userID: message.author.id,
            serverID: message.guild.id,
            fish: 0,
            gems: 0,
            wood: size,
            grain: 0,
            meat: 0,
            baseEff: 1,
            jobMult: 1,
            job: 0
          });
          newInv.save().catch(err => console.log(err));
        }

        message.reply(`You chopped ${size} logs of wood!`);
      }
    );
  },
  sell: async function(message, option) {
    Inv.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      (err, inv) => {
        if (err) {
          console.log(err);
        }

        var size = Math.round((Math.random() * 5 + 1) * 100) / 100;

        var amount = 0;
        var response = "";

        if (inv) {
          switch (option) {
            case "fish":
              amount =
                ((inv.job === 1 ? inv.jobMult * inv.baseEff : inv.baseEff) *
                  inv.fish) /
                5;
              response = `You sold ${inv.fish} pounds of fish for ${Math.floor(
                amount
              )} coins!`;
              inv.fish = 0;
              break;
            case "wood":
              amount =
                (inv.job === 2 ? inv.jobMult * inv.baseEff : inv.baseEff) *
                inv.wood;
              response = `You sold ${inv.wood} logs of wood for ${Math.floor(
                amount
              )} coins!`;
              inv.wood = 0;
              break;
            case "gems":
              amount = gems =
                (inv.job === 3 ? inv.jobMult * inv.baseEff : inv.baseEff) *
                inv.gems *
                5;
              response = `You sold ${inv.gem} gems for ${Math.floor(
                amount
              )} coins!`;
              inv.gems = 0;
              break;
            case "grain":
              amount =
                ((inv.job === 4 ? inv.jobMult * inv.baseEff : inv.baseEff) *
                  inv.grain) /
                10;
              response = `You sold ${
                inv.grain
              } pounds of grain for ${Math.floor(amount)} coins!`;
              inv.grain = 0;
              break;
            case "meat":
              amount =
                ((inv.job === 5 ? inv.jobMult * inv.baseEff : inv.baseEff) *
                  inv.meat) /
                50;
              response = `You sold ${inv.meat} pounds of meat for ${Math.floor(
                amount
              )} coins!`;
              inv.meat = 0;
              break;
            case "all":
              var meat =
                ((inv.job === 5 ? inv.jobMult * inv.baseEff : inv.baseEff) *
                  inv.meat) /
                50;
              var grain =
                ((inv.job === 4 ? inv.jobMult * inv.baseEff : inv.baseEff) *
                  inv.grain) /
                10;
              var gems =
                (inv.job === 3 ? inv.jobMult * inv.baseEff : inv.baseEff) *
                inv.gems *
                5;
              var wood =
                (inv.job === 2 ? inv.jobMult * inv.baseEff : inv.baseEff) *
                inv.wood;
              var fish =
                ((inv.job === 1 ? inv.jobMult * inv.baseEff : inv.baseEff) *
                  inv.fish) /
                5;
              amount = meat + grain + gems + wood + fish;

              response = `You sold ${inv.fish} pounds of fish, ${
                inv.wood
              } logs, ${inv.gems} gems, ${inv.grain} pounds of grain, and ${
                inv.meat
              } pounds of meat for ${Math.floor(amount)} coins!`;
              inv.meat = 0;
              inv.grain = 0;
              inv.fish = 0;
              inv.gems = 0;
              inv.wood = 0;
              break;
          }
          inv.save().catch(err => console.log(err));
          module.exports.gainMoney(message, Math.floor(amount));
        } else {
          response = "Go collect some stuff before you sell anything!";
        }

        message.reply(response);
      }
    );
  },
  pay: async function(senderID, receiver, cash, serverID) {
    var work = true;
    var m = await Money.findOne(
      {
        userID: senderID,
        serverID: serverID
      },
      (err, money) => {
        if (err) {
          console.log(err);
        }

        if (money) {
          if (money.money < cash) {
            work = false;
            console.log(work);
            return false;
          } else {
            money.money -= cash;
            money.save().catch(err => console.log(err));
          }
        }
      }
    );

    if (work === false) {
      return "You don't have that much cash!";
    } else {
      Money.findOne(
        {
          userID: receiver.id,
          serverID: serverID
        },
        (err, money) => {
          if (err) {
            console.log(err);
          }

          if (money) {
            money.money += cash;
            money.save().catch(err => console.log(err));
          } else {
            const newMoney = new Money({
              userID: receiver.id,
              serverID: serverID,
              money: cash
            });
            newMoney.save().catch(err => console.log(err));
          }
        }
      );

      return `Sending ${cash} coins to ${receiver.displayName}!`;
    }
  },
  mine: async function(message) {
    Inv.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      (err, inv) => {
        if (err) {
          console.log(err);
        }

        var size = Math.round(Math.random() * 3) + 1;

        if (inv) {
          inv.gems = inv.gems + size;
          inv.save().catch(err => console.log(err));
        } else {
          const newInv = new Inv({
            userID: message.author.id,
            serverID: message.guild.id,
            fish: 0,
            gems: size,
            wood: 0,
            grain: 0,
            meat: 0,
            baseEff: 1,
            jobMult: 1,
            job: 0
          });
          newInv.save().catch(err => console.log(err));
        }

        message.reply(`You got ${size} gems!`);
      }
    );
  },
  getLevel: async function(message, sendMsg) {
    var level = 0;
    await Level.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      (err, money) => {
        if (err) {
          console.log(err);
        }

        if (!money) {
          if (sendMsg === true) {
            return message.reply(
              `You are at level 0... ☹️  Start talking to gain XP!`
            );
          }
          level = 0;
        } else {
          let toNextLevel = Math.pow(money.level, 2) * 50 - money.xp;
          if (sendMsg === true) {
            return message.reply(
              `You have ${money.xp} XP, you are at level ${money.level}. Gain ${toNextLevel} more XP to Level Up!`
            );
          }
          level = money.level;
        }
      }
    );

    return level;
  },
  selectJob: async function(message, option) {
    var selected = 0;
    await Inv.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      async (err, inv) => {
        if (err) {
          console.log(err);
        }

        if (inv) {
          if (inv.job !== 0) {
            return message.reply("You already have a job!");
          } else {
            switch (option) {
              case "hunter":
                selected = 5;
                message.reply("You are now a hunter!");
                break;
              case "fisherman":
                selected = 1;
                message.reply("You are now a fisherman!");
                break;
              case "farmer":
                selected = 4;
                message.reply("You are now a farmer!");
                break;
              case "lumberjack":
                selected = 2;
                message.reply("You are now a lumberjack!");
                break;
              case "miner":
                selected = 3;
                message.reply("You are now a miner!");
                break;
              default:
                return message.reply(
                  "That is not a valid job! Please select one of these jobs: Fisherman, Lumberjack, Miner, Farmer, Hunter"
                );
            }
            inv.job = selected;

            inv.save().catch(err => console.log(err));
          }
        } else {
          var eff = 1;
          await Level.findOne(
            {
              userID: message.author.id,
              serverID: message.guild.id
            },
            (err, lvl) => {
              if (err) {
                console.log(err);
              }
              if (lvl) {
                eff = lvl.level;
              }
            }
          );
          switch (option) {
            case "hunter":
              selected = 5;
              message.reply("You are now a hunter!");
              break;
            case "fisherman":
              selected = 1;
              message.reply("You are now a fisherman!");
              break;
            case "farmer":
              selected = 4;
              message.reply("You are now a farmer!");
              break;
            case "lumberjack":
              selected = 2;
              message.reply("You are now a lumberjack!");
              break;
            case "miner":
              selected = 3;
              message.reply("You are now a miner!");
              break;
            default:
              return message.reply(
                "That is not a valid job! Please select one of these jobs: Fisherman, Lumberjack, Miner, Farmer, Hunter"
              );
          }
          const newInv = new Inv({
            userID: message.author.id,
            serverID: message.guild.id,
            fish: 0,
            gems: 0,
            wood: 0,
            grain: 0,
            meat: 0,
            baseEff: 1,
            jobMult: eff,
            job: selected
          });
          newInv.save().catch(err => console.log(err));
        }
      }
    );
  },
  getInv: async function(message) {
    Inv.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      (err, inv) => {
        if (err) {
          console.log(err);
        }

        if (!inv) {
          return message.reply(`You have no stuff... ☹️`);
        } else {
          var meat =
            ((inv.job === 5 ? inv.jobMult * inv.baseEff : inv.baseEff) *
              inv.meat) /
            50;
          var grain =
            ((inv.job === 4 ? inv.jobMult * inv.baseEff : inv.baseEff) *
              inv.grain) /
            10;
          var gems =
            (inv.job === 3 ? inv.jobMult * inv.baseEff : inv.baseEff) *
            inv.gems *
            5;
          var wood =
            (inv.job === 2 ? inv.jobMult * inv.baseEff : inv.baseEff) *
            inv.wood;
          var fish =
            ((inv.job === 1 ? inv.jobMult * inv.baseEff : inv.baseEff) *
              inv.fish) /
            5;
          let amount = meat + grain + gems + wood + fish;
          let embed = new RichEmbed()
            .setTitle(`Job: ${jobs[inv.job]} Efficiency: ${inv.baseEff}`)
            .addField("Fish", `${inv.fish} lbs.`, true)
            .addField("Gems", `${inv.gems} gems.`, true)
            .addField("Wood", `${inv.wood} logs.`, true)
            .addField("Grain", `${inv.grain} lbs.`, true)
            .addField("Meat", `${inv.meat} lbs.`, true)
            .setFooter(
              `Use '!sell all' to sell all your materials for ${Math.floor(
                amount
              )} coins!`
            );
          return message.channel.send(embed);
        }
      }
    );
  },
  leaderboard: async function(message) {
    Level.find({ serverID: message.guild.id })
      .sort([["xp", "descending"]])
      .exec(async (err, res) => {
        if (err) {
          return console.log(err);
        }

        let embed = new RichEmbed().setTitle(message.guild.name + " Leaderboard");

        if (res.length === 0) {
          embed.setColor("RED");
          embed.addField("No Data Found", "Please type in chat to gain XP.");
        } else if (res.length <= 10) {
          embed.setColor("PURPLE");
          for (let i = 0; i < res.length; i++) {
            let member =
              message.guild.members.get(res[i].userID) || "User Left";
            if (member === "User Left") {
              continue;
            } else {
              var field = stripIndents`**Level**: ${res[i].level}
                                       **XP**: ${res[i].xp}`;

              embed.addField(`${i + 1}. ${member.user.username}`, field);
            }
          }
        } else {
          embed.setColor("PURPLE");
          for (let i = 0; i < 10; i++) {
            let member =
              message.guild.members.get(res[i].userID) || "User Left";

            if (member === "User Left") {
              continue;
            } else {
              var field = stripIndents`**Level**: ${res[i].level}
                                       **XP**: ${res[i].xp}`;

              embed.addField(`${i + 1}. ${member.user.username}`, field);
            }
          }
        }

        message.channel.send(embed);
      });
    
  },
  hunt: async function(message) {
    Inv.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      (err, inv) => {
        if (err) {
          console.log(err);
        }

        var size = Math.round((Math.random() * 300 + 150) * 100) / 100;

        if (inv) {
          inv.meat = inv.meat + size;
          inv.save().catch(err => console.log(err));
        } else {
          const newInv = new Inv({
            userID: message.author.id,
            serverID: message.guild.id,
            fish: 0,
            gems: 0,
            wood: 0,
            grain: 0,
            meat: size,
            baseEff: 1,
            jobMult: 1,
            job: 0
          });
          newInv.save().catch(err => console.log(err));
        }

        message.reply(`You shot a ${size} pound hog!`);
      }
    );
  },
  harvest: async function(message) {
    Inv.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      (err, inv) => {
        if (err) {
          console.log(err);
        }

        var size = Math.floor((Math.random() * 10) * 100) / 100;
        
        if (inv) {
          inv.grain = inv.grain + size;
          inv.save().catch(err => console.log(err));
        } else {
          const newInv = new Inv({
            userID: message.author.id,
            serverID: message.guild.id,
            fish: 0,
            gems: 0,
            wood: 0,
            grain: size,
            meat: 0,
            baseEff: 1,
            jobMult: 1,
            job: 0
          });
          newInv.save().catch(err => console.log(err));
        }
        
        message.reply(`You harvested ${size} pounds of grain!`);
      }
    );
  },
  fish: async function(message) {
    Inv.findOne(
      {
        userID: message.author.id,
        serverID: message.guild.id
      },
      (err, inv) => {
        if (err) {
          console.log(err);
        }

        var size = Math.floor((Math.random() * 3) * 100) / 100;
        
        if (inv) {
          inv.fish = inv.fish + size;
          inv.save().catch(err => console.log(err));
        } else {
          const newInv = new Inv({
            userID: message.author.id,
            serverID: message.guild.id,
            fish: size,
            gems: 0,
            wood: 0,
            grain: 0,
            meat: 0,
            baseEff: 1,
            jobMult: 1,
            job: 0
          });
          newInv.save().catch(err => console.log(err));
        }
        
        message.reply(`You harvested ${size} pounds of fish!`);
      }
    );
  }
};
