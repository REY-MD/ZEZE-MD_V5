const axios = require("axios");
const yts = require("yt-search");
const { youtube } = require("btch-downloader");
const { cmd } = require('../command');

cmd({
  pattern: 'audio1',
  alias: ['spotify', "ytmusic", "music"],
  react: '🎵',
  desc: "Fetch audio from Spotify or YouTube",
  category: "media",
  filename: __filename
}, async (client, message, details, context) => {
  const { q, from, reply } = context;

  if (!q) {
    return reply("Please provide a title or link (Spotify/YouTube)!");
  }

  reply("> 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓🫅ɪs ғᴇᴛᴄʜɪɴɢ ᴀᴜᴅɪᴏ... 🎧");

  let spotifySent = false;
  let youtubeSent = false;

  try {
    // Fetch from Spotify
    const spotifyResponse = await axios.get(
      `https://apis-keith.vercel.app/download/spotify?q=${encodeURIComponent(q)}`
    );
    const spotifyTrack = spotifyResponse.data?.[0]; // Safely access first track

    if (spotifyTrack) {
      const trackStream = await axios({
        url: `https://apis-keith.vercel.app/download/spotify?q=${encodeURIComponent(spotifyTrack.url)}`,
        method: "GET",
        responseType: 'stream'
      });

      if (trackStream.headers["content-type"]?.includes("audio/mpeg")) {
        await client.sendMessage(from, {
          audio: trackStream.data,
          mimetype: "audio/mpeg",
          contextInfo: {
            externalAdReply: {
              title: spotifyTrack.title,
              body: "𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓💖: sᴘᴏᴛɪғʏ",
              mediaType: 1,
              sourceUrl: spotifyTrack.url,
              renderLargerThumbnail: true
            }
          }
        });
        spotifySent = true;
      } else {
        console.log("Spotify stream not in audio/mpeg format.");
      }
    } else {
      console.log("No Spotify track found.");
    }
  } catch (error) {
    console.error("Spotify Error:", error.message);
  }

  try {
    // Fetch from YouTube
    const youtubeSearchResults = await yts(q);
    const youtubeVideo = youtubeSearchResults.videos[0];

    if (youtubeVideo && youtubeVideo.seconds < 3600) { // Video duration < 1 hour
      const youtubeAudio = await youtube(youtubeVideo.url);

      if (youtubeAudio?.mp3) {
        await client.sendMessage(from, {
          audio: { url: youtubeAudio.mp3 },
          mimetype: "audio/mpeg",
          contextInfo: {
            externalAdReply: {
              title: youtubeVideo.title,
              body: "𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓🫅🥰: ʏᴏᴜᴛᴜʙᴇ",
              mediaType: 1,
              sourceUrl: youtubeVideo.url,
              renderLargerThumbnail: true
            }
          }
        });
        youtubeSent = true;
      } else {
        console.log("Failed to fetch YouTube audio.");
      }
    } else {
      console.log("No suitable YouTube results found.");
    }
  } catch (error) {
    console.error("YouTube Error:", error.message);
  }

  if (!spotifySent && !youtubeSent) {
    reply("Failed to fetch audio from both Spotify and YouTube.");
  } else if (spotifySent && youtubeSent) {
    reply("Both Spotify and YouTube audio sent successfully.");
  } else if (spotifySent) {
    reply("𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇🫅: sᴘᴏᴛɪғʏ ᴀᴜᴅɪᴏ sᴇɴᴛ sᴜᴄᴄᴇsғᴜʟʟʏ.");
  } else if (youtubeSent) {
    reply("𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇: ʏᴏᴜᴛᴜʙᴇ ᴀᴜᴅɪᴏ sᴇɴᴛ sᴜᴄᴄᴇsғᴜʟʟʏ.");
  }
});
