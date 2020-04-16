const { RichEmbed } = require("discord.js");
const beautify = require("beautify");
const { getMember, formatDate } = require("../../functions.js");

module.exports = {
  name: "eval",
  category: "dev",
  description: "Evaluates JavaScript.",
  run: async (client, message, args) => {
    let owners = process.env.DEVELOPER.split(",");
    if (!owners.includes(message.author.id)) {
      return message.reply("You do not have permission to use this command!");
    }

    if (!args[0]) {
      return message.reply("You need to evaluate ***something!***");
    }

    try {
      if (
        args
          .join(" ")
          .toLowerCase()
          .includes("token")
      ) {
        return;
      }

      const toEval = args.join(" ");
      const evaluated = eval(toEval);

      let embed = new RichEmbed()
        .setColor("#00FF00")
        .setTimestamp()
        .setFooter(client.user.username, client.user.displayAvatarURL)
        .setTitle("Eval")
        .addField(
          "To Evaluate:",
          `\`\`\`js\n${beautify(args.join(" "), { format: "js" })}\n\`\`\``
        )
        .addField("Evaluated:", evaluated)
        .addField("Type of:", typeof evaluated);
      message.reply(embed);
    } catch (e) {
      let embed = new RichEmbed()
        .setColor("#FF0000")
        .setTitle(":x: Error!")
        .setDescription(e)
        .setFooter(client.user.username, client.user.displayAvatarURL);
      message.reply(embed);
    }
  }
};
