module.exports = {
  name: "guilds",
  category: "dev",
  description: "Get all guilds.",
  run: async (client, message, args) => {
    let owners = process.env.DEVELOPER.split(",");
    if (!owners.includes(message.author.id)) {
      return message.reply("You do not have permission to use this command!");
    }
    
    let guilds = client.guilds;
    guilds.forEach(element => message.channel.send(element.name + " owned by " + "<@" + element.owner.id + ">"));
  }
}