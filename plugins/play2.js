const { cmd } = require('../command')
const axios = require('axios')
const yts = require('yt-search')
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path

ffmpeg.setFfmpegPath(ffmpegPath)

cmd({
    pattern: "song2",
    alias: ["play2"],
    desc: "Download YouTube song (Alt method)",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, reply, text }) => {
    try {
        if (!text) {
            return reply("❌ Song name likho\nExample:\n.song2 la la la")
        }

        // 🔍 YouTube search
        const search = await yts(text)
        if (!search.videos || !search.videos.length) {
            return reply("❌ Song nahi mila")
        }

        const vid = search.videos[0]

        // 🎨 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓 STYLE BOX
        const caption = `
*╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
*│ ╌─̇─̣⊰ 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓 ⊱┈─̇─̣╌*
*│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣*
*│❀ 🎵 𝐓𝐢𝐭𝐥𝐞:* ${vid.title}
*│❀ 📀 𝐐𝐮𝐚𝐥𝐢𝐭𝐲:* 128kbps
*│❀ 📁 𝐅𝐨𝐫𝐦𝐚𝐭:* mp3
*│❀ ⚙️ 𝐒𝐭𝐚𝐭𝐮𝐬:* Converting...
*╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*

> 📌 ᴘᴏᴡᴇʀ ʙʏ 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇
`

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption
        }, { quoted: mek })

        // 🎥 Arslan VIDEO API
        const api = `https://apiskeith.top/download/ytmp4?url=${encodeURIComponent(vid.url)}`
        const res = await axios.get(api, { timeout: 60000 })

        if (!res.data?.status || !res.data?.result?.download?.url) {
            return reply("❌ Song download error, thori dair baad try karo")
        }

        const videoUrl = res.data.result.download.url

        // 📂 Temp files
        const tempDir = path.join(__dirname, '../temp')
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

        const videoPath = path.join(tempDir, `song2_${Date.now()}.mp4`)
        const audioPath = path.join(tempDir, `song2_${Date.now()}.mp3`)

        // ⬇ Download video
        const stream = await axios({
            url: videoUrl,
            method: "GET",
            responseType: "stream",
            timeout: 120000
        })

        await new Promise((resolve, reject) => {
            const w = fs.createWriteStream(videoPath)
            stream.data.pipe(w)
            w.on('finish', resolve)
            w.on('error', reject)
        })

        // 🎧 FFmpeg → MP3
        await new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .noVideo()
                .audioCodec('libmp3lame')
                .audioBitrate('128k')
                .format('mp3')
                .on('end', resolve)
                .on('error', reject)
                .save(audioPath)
        })

        // 📤 Send Audio
        await conn.sendMessage(from, {
            audio: fs.readFileSync(audioPath),
            mimetype: "audio/mpeg",
            fileName: `${vid.title}.mp3`,
            ptt: false
        }, { quoted: mek })

        // 🧹 Cleanup
        fs.unlinkSync(videoPath)
        fs.unlinkSync(audioPath)

    } catch (err) {
        console.error("SONG2 ERROR:", err)
        reply("❌ Song download / convert error, thori dair baad try karo")
    }
})
