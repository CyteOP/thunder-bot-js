const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage, mute } = require("../../functions.js");

module.exports = {
  name: "mute",
  category: "moderation",
  description: "Mutes the member",
  usage: "<id | mention> <duration | permanent> <reason>",
  guildOnly: true,
  run: async (client, message, args) => {
    const logChannel =
      message.guild.channels.find(c => c.name === "modlogs") || message.channel;

    if (message.deletable) message.delete();

    // No args
    if (!args[0]) {
      return message
        .reply("Please provide a person to mute.")
        .then(m => m.delete(5000));
    }

    // No Time
    if (!args[1]) {
      return message
        .reply("Please provide a duration to mute.")
        .then(m => m.delete(5000));
    }

    // No reason
    if (!args[2]) {
      return message
        .reply("Please provide a reason to mute.")
        .then(m => m.delete(5000));
    }

    // No author permissions
    if (
      !message.member.hasPermission("MANAGE_ROLES")
    ) {
      return message
        .reply(
          "❌ You do not have permissions to mute members. Please contact a staff member"
        )
        .then(m => m.delete(5000));
    }

    // No bot permissions
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
      return message
        .reply(
          "❌ I do not have permissions to mute members. Please contact a staff member"
        )
        .then(m => m.delete(5000));
    }

    const toKick =
      message.mentions.members.first() || message.guild.members.get(args[0]);

    // No member found
    if (!toKick) {
      return message
        .reply("Couldn't find that member, try again")
        .then(m => m.delete(5000));
    }

    // Can't kick urself
    if (toKick.id === message.author.id) {
      return message
        .reply("You can't mute yourself...")
        .then(m => m.delete(5000));
    }

    // Check if the user's kickable
    if (!toKick.kickable) {
      return message
        .reply("I can't mute that person due to role hierarchy, I suppose.")
        .then(m => m.delete(5000));
    }

    const embed = new RichEmbed()
      .setColor("#ff0000")
      .setThumbnail(toKick.user.displayAvatarURL)
      .setFooter(message.member.displayName, message.author.displayAvatarURL)
      .setTimestamp()
      .setDescription(stripIndents`**- Muted member:** ${toKick} (${toKick.id})
            **- Muted by:** ${message.member} (${message.member.id})
            **- Muted for:** ${args[1]} Minutes
            **- Reason:** ${args.slice(2).join(" ")}`);

    const promptEmbed = new RichEmbed()
      .setColor("GREEN")
      .setAuthor(`This verification becomes invalid after 30s.`)
      .setDescription(`Do you want to mute ${toKick}?`);

    // Send the message
    await message.channel.send(promptEmbed).then(async msg => {
      // Await the reactions and the reaction collector
      var emoji;
      if (!message.author.bot) {
        emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
      }
      // The verification stuffs
      if (emoji === "✅" || message.author.bot) {
        msg.delete();

        logChannel.send(embed);
        
        await mute(message, toKick, parseInt(args[1]) * 60 * 1000);

      } else if (emoji === "❌") {
        msg.delete();

        message.reply(`Mute canceled.`).then(m => m.delete(10000));
      }
    });
  }
};
