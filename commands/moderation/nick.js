module.exports = {
  name: "nick",
  category: "moderation",
  description: "Nicknames the bot.",
  guildOnly: true,
  cooldown: 30,
  run: async (client, message, args) => {
    if (message.deletable) {
      message.delete();
    }
    
    if (
      !message.member.hasPermission("MANAGE_NICKNAMES")
    ) {
      return message
        .reply("You can't change nicknames...")
        .then(m => m.delete(5000));
    }
    message.guild.members.get(client.user.id).setNickname(args.join());
  }
};
