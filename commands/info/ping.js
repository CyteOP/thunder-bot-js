module.exports = {
  name: "ping",
  category: "info",
  description: "returns latency and API ping.",
  cooldown: 3,
  run: async (client, message, args) => {
    const msg = await message.reply(`Pinging...`);
    msg.edit(
      `Pong!\nLatency: ${Math.floor(
        msg.createdTimestamp - message.createdTimestamp
      )} ms\nAPI Latency: ${Math.round(client.ping)}`
    );
  }
};
