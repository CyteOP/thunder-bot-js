const { Util } = require("discord.js");
const ytdl = require("ytdl-core");
const search = require("youtube-search");
const opts = {
  maxResults: 2,
  key: process.env.GOOGLEAPI,
  videoOnly: true
};

module.exports = {
  name: "play",
  category: "music",
  description: "Play some music!",
  usage: "<URL | Search String>",
  guildOnly: true,
  cooldown: 3,
  async run(client, message, args) {
    const queue = client.queue;
    const serverQueue = client.queue.get(message.guild.id);

    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }
    var songInfo;

    if (!isYTLink(args[0])) {
      var srchRes = await searchVid(args.join(" "));
      if (!isYTLink(`${srchRes}`.trim())) {
        return message.reply("No video found: " + srchRes + " " + typeof srchRes);
      }
      songInfo = await ytdl.getInfo(`${srchRes}`);
    } else {
      songInfo = await ytdl.getInfo(args[0]);
    }
    const song = {
      title: songInfo.title,
      url: songInfo.video_url
    };
    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };

      queue.set(message.guild.id, queueContruct);

      queueContruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        this.play(message, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  },

  play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .playStream(ytdl(song.url))
      .on("end", () => {
        console.log("Music ended!");
        serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
      })
      .on("error", error => {
        message.reply(error);
      });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  }
};

async function searchVid(prompt) {
  let results = await search(prompt, opts).catch(err => console.log(err));
  if (results) {
    let youtubeResults = results.results;

    let selected = youtubeResults[0];

    const url = {
      url: selected.link
    };
    return JSON.stringify(url);
  }
}

function isYTLink(input) {
  var YT_REG = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;

  return YT_REG.test(input);
}
