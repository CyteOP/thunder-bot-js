const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
  name: "unmute",
  category: "moderation",
  description: "Unmutes the member",
  usage: "<id | mention>",
  guildOnly: true,
  run: async (client, message, args) => {
    const logChannel =
      message.guild.channels.find(c => c.name === "modlogs") || message.channel;

    if (message.deletable) message.delete();

    // No args
    if (!args[0]) {
      return message
        .reply("Please provide a person to unmute.")
        .then(m => m.delete(5000));
    }

    // No author permissions
    if (
      !message.member.hasPermission("MANAGE_ROLES")
    ) {
      return message
        .reply(
          "❌ You do not have permissions to unmute members. Please contact a staff member"
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
        .reply("You can't unmute yourself...")
        .then(m => m.delete(5000));
    }

    const embed = new RichEmbed()
      .setColor("#ff0000")
      .setThumbnail(toKick.user.displayAvatarURL)
      .setFooter(message.member.displayName, message.author.displayAvatarURL)
      .setTimestamp()
      .setDescription(stripIndents`**- Unmuted member:** ${toKick} (${toKick.id})
            **- Unmuted by:** ${message.member} (${message.member.id})`);

    const promptEmbed = new RichEmbed()
      .setColor("GREEN")
      .setAuthor(`This verification becomes invalid after 30s.`)
      .setDescription(`Do you want to unmute ${toKick}?`);

    
    
    // Send the message
    await message.channel.send(promptEmbed).then(async msg => {
      var emoji;
      
      // Await the reactions and the reaction collector
      if(!message.author.bot)
      {
        emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
      }
      
      // The verification stuffs
      if (emoji === "✅" || message.author.bot) {
        msg.delete();

        var role = message.guild.roles.find(role => role.name === "Muted");
        toKick.removeRole(role).catch(err => {
          if (err)
            return message.channel.send(
              `Well.... the unmute didn't work out. Here's the error ${err}`
            );
        });

        logChannel.send(embed);
      } else if (emoji === "❌") {
        msg.delete();

        message.reply(`Unmute canceled.`).then(m => m.delete(10000));
      }
    });
  }
};
