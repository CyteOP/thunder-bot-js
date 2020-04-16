const { RichEmbed } = require("discord.js");

module.exports = {
  name: "info",
  category: "info",
  description: "Shows Info About the Bot.",
  cooldown: 3,
  run: async (client, message, args) => {
    let embed = new RichEmbed()
      .setTitle("Information")
      .setColor(0xff45ff)
      .setDescription(
        "<@658067084344950794> is created as a project in order to learn Bot Development. It evolved into this, a huge overcomplicated bot!"
      )
      .addField(
        "Developer",
        "The developer of <@658067084344950794> is <@446127283384614914>"
      )
      .addField("Commands", 'Use "!help" to show commands.')
      .addField(
        "Version",
        "V0.1.1"
      );

    message.channel.send(embed);
  }
};
