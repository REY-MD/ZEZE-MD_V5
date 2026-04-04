const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

ffmpeg.setFfmpegPath(ffmpegPath);

cmd({
    pattern: "play",
    alias: ["song", "audio"],
    react: "🎵",
    desc: "Play song with MSELA-CHUI Xmd style (FFmpeg fixed)",
    category: "download",
    use: ".play <song name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply(
                "❌ *Song name likho*\n\nExample:\n.play pal pal"
            );
        }

        // ⏳ react
        await conn.sendMessage(from, {
            react: { text: "⏳", key: m.key }
        });

        // 🔍 YouTube search
        const search = await yts(query);
        if (!search.videos || !search.videos.length) {
            return reply("❌ *Song nahi mila*");
        }

        const video = search.videos[0];

        // 🎧 INFO BOX (ZEZE STYLE)
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: `
𝚳𝐒𝚵𝐋𝚫-𝐂𝚮𝐔𝚰-𝚾𝚳𝐃 

╭───────────────────
│ 🎧 *SONG FOUND*
│
│ 🎵 *Title:* ${video.title}
│ ⏱️ *Duration:* ${video.timestamp}
│ 👁️ *Views:* ${video.views}
│
│ ⏳ *Converting to MP3...*
╰───────────────────
- _📌 ᴘᴏᴡᴇʀ ʙʏ ZEZE TECH
`
        }, { quoted: mek });

        // 🎼 API (same jo tum use kar rahe ho)
        const apiUrl = `https://arslan-apis.vercel.app/download/ytmp3?url=${encodeURIComponent(video.url)}`;
        const res = await axios.get(apiUrl, { timeout: 60000 });

        if (
            !res.data ||
            res.data.status !== true ||
            !res.data.result ||
            !res.data.result.download ||
            !res.data.result.download.url
        ) {
            return reply(
                "❌ Song download / convert error, thori dair baad try karo"
            );
        }

        const audioUrl = res.data.result.download.url;

        // 📁 temp folder
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const inputPath = path.join(tempDir, `input_${Date.now()}.mp3`);
        const outputPath = path.join(tempDir, `output_${Date.now()}.mp3`);

        // 📥 download audio
        const audioData = await axios.get(audioUrl, {
            responseType: 'arraybuffer'
        });
        fs.writeFileSync(inputPath, audioData.data);

        // 🔥 FFMPEG FIX (WHATSAPP COMPATIBLE)
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .audioCodec('libmp3lame')
                .audioBitrate('128k')
                .audioChannels(2)
                .audioFrequency(44100)
                .format('mp3')
                .on('end', resolve)
                .on('error', reject)
                .save(outputPath);
        });

        // 🎵 SEND AUDIO
        await conn.sendMessage(from, {
            audio: fs.readFileSync(outputPath),
            mimetype: "audio/mpeg",
            fileName: `${video.title}.mp3`,
            caption: `
🎶 *${video.title}*

> © *ᗩᗪᗴᗴᒪ-᙭ᗰᗪ*
`
        }, { quoted: mek });

        // 🧹 cleanup
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);

        // ✅ react
        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (err) {
        console.error("PLAY ERROR:", err);
        reply(
            "❌ Song download / convert error, thori dair baad try karo"
        );
        await conn.sendMessage(from, {
            react: { text: "❌", key: m.key }
        });
    }
});
