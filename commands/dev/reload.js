const { RichEmbed } = require("discord.js");
const curl = require("curlrequest");

var admins;

curl.request(
  {
    url:
      "https://raw.githubusercontent.com/DuckLord25/discordbotquotes/master/adminIDs.txt"
  },
  function(err, stdout, meta) {
    admins = stdout.split(", ");
  }
);

module.exports = {
  name: "reload",
  category: "dev",
  description: "reload",
  guildOnly: true,
  run: (client, message, args) => {
    message.delete();

    if (!admins.includes(message.author.id))
      return message
        .reply("You don't have the required permissions to use this command.")
        .then(m => m.delete(5000));

    console.log("reloading");
    message.reply("Restarted.").then(() => {
      process.exit();

      return;
    });
  }
};
