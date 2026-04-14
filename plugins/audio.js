const axios = require("axios");
const ytSearch = require("yt-search");
const { cmd } = require("../command");

cmd({
  pattern: "audio",
  alias: ["song", "ytmusic", "audio", "song"],
  react: "🫟",
  desc: "Download and send MP3 audio from YouTube or Spotify",
  category: "media",
  filename: __filename
}, async (client, message, details, context) => {
  const { from, q, reply } = context;

  if (!q) return reply("❌ *Which song should I fetch?* Please provide a song name or keywords.");

  reply("🎶 *zeze tech is processing your request...*\n🔍 Searching for your track...");

  try {
    const search = await ytSearch(q);
    const video = search.videos?.[0];
    if (!video) return reply("❌ *No matching songs found.* Try another title.");

    const link = video.url;
    const apis = [
      `https://apis.davidcyriltech.my.id/youtube/mp3?url=${link}`,
      `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${link}`
    ];

    let audioUrl, songTitle, artistName, thumbnail;

    for (const api of apis) {
      try {
        const { data } = await axios.get(api);
        if (data.status === 200 || data.success) {
          audioUrl = data.result?.downloadUrl || data.url;
          songTitle = data.result?.title || video.title;
          artistName = data.result?.author || video.author.name;
          thumbnail = data.result?.image || video.thumbnail;
          break;
        }
      } catch (e) {
        console.warn(`⚠️ Failed API: ${api}\n${e.message}`);
        continue;
      }
    }

    if (!audioUrl) return reply("⚠️ *All available servers failed to fetch your song.* Please try again later.");

    // Send song preview card
    await client.sendMessage(from, {
      image: { url: thumbnail },
      caption: `
🎧 *Now Playing:*
╭─────⊷
│ 🎶 *Title:* ${songTitle}
│ 🎤 *Artist:* ${artistName}
│ 🔗 *Source:* YouTube
╰─────⊷
🪄 _Delivered by Zeze Tech Bot_ ✨
      `.trim(),
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363295141350550@newsletter',
          newsletterName: 'Zeze Tech Audio Player 🎧',
          serverMessageId: 144
        }
      }
    });

    reply("📤 *Uploading high-quality MP3...*");

    // Send audio stream
    await client.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: "audio/mp4",
      ptt: false
    });

    // Send downloadable MP3 as a file
    await client.sendMessage(from, {
      document: { url: audioUrl },
      mimetype: "audio/mp3",
      fileName: `${songTitle.replace(/[^a-zA-Z0-9 ]/g, "")}.mp3`
    });

    reply("✅ *Zeze Tech just sent your requested song!* 🎶 Enjoy the vibes!");

  } catch (error) {
    console.error("❌ Audio Fetch Error:", error.message);
    reply(`🚫 *Oops!* Something went wrong.\n\n🛠 ${error.message}`);
  }
});
