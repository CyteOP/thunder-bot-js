const { RichEmbed } = require("discord.js");

module.exports = {
  name: "info",
  category: "info",
  description: "Shows Info About the Bot.",
  cooldown: 3,
  run: async (client, message, args) => {
    let embed = new RichEmbed()
      .setTitle("Information")
      .setColor("RANDOM")
      .setDescription("<@658067084344950794> is created as a project in order to learn Bot Development. It evolved into this, a huge overcomplicated bot!")
      .addField("Developer", "The developer of <@658067084344950794> is <@446127283384614914>", true)
      .addField("Commands", `Use "${client.prefix}help" to show commands.`, true)
      .addField("Version", "V0.1.1", true)
      .addField("Prefix", `My Prefix is ${client.prefix}`, true);

    message.channel.send(embed);
  }
};
