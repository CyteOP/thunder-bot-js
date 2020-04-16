const { RichEmbed } = require("discord.js");

module.exports = {
  name: "queue",
  category: "music",
  description: "Get the song queue.",
  guildOnly: true,
  cooldown: 3,
  run(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("There is nothing playing.");
    
    var embed = new RichEmbed().setColor("RANDOM");
    
    serverQueue.songs.forEach(function(entry) {
      embed.addField("Song", entry.title);
    });

    return message.channel.send(embed);
  }
};
