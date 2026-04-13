const { cmd } = require('../command')
const axios = require('axios')
const yts = require('yt-search')
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path

ffmpeg.setFfmpegPath(ffmpegPath)

// ── GiftedTech API ──
const GiftedTechApi = "https://apis.davidcyriltech.my.id"
const GiftedApiKey = "gifted-md"

cmd({
    pattern: "video",
    alias: ["vid", "playvideo"],
    desc: "YouTube video downloader",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) {
            return reply("❌ Video ka naam ya link likho\nExample:\n.video la la la song")
        }

        // 🔍 YouTube search
        const search = await yts(text)
        if (!search.videos.length) {
            return reply("❌ Video nahi mila")
        }

        const vid = search.videos[0]

        // 🎨 Info message
        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `
╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭
│ ╌─̇─̣⊰ 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓 ⊱┈─̇─̣╌
│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣
│❀ 🎬 𝐓𝐢𝐭𝐥𝐞: ${vid.title}
│❀ ⏱️ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧: ${vid.timestamp}
│❀ ⏳ 𝐒𝐭𝐚𝐭𝐮𝐬: Processing video...
╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭

> 📌 ᴘᴏᴡᴇʀ ʙʏ 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇
`
        }, { quoted: mek })

        let dlUrl = null
        let title = vid.title
        let quality = "360p"

        // ── HATUA 1: Arslan API ──
        try {
            console.log("🔄 Trying Arslan API...")
            const res = await axios.get(
                `https://arslan-apis.vercel.app/download/ytmp4?url=${encodeURIComponent(vid.url)}`,
                { timeout: 30000 }
            )
            if (res.data?.status && res.data?.result?.download?.url) {
                dlUrl = res.data.result.download.url
                title = res.data.result.metadata?.title || title
                quality = res.data.result.download?.quality || quality
                console.log("✅ Arslan API ikafanikiwa!")
            }
        } catch (e) {
            console.log("❌ Arslan API imefail:", e.message)
        }

        // ── HATUA 2: GiftedTech API (backup) ──
        if (!dlUrl) {
            try {
                console.log("🔄 Trying GiftedTech API...")
                const res = await axios.get(
                    `${GiftedTechApi}/api/download/ytmp4?apikey=${GiftedApiKey}&url=${encodeURIComponent(vid.url)}`,
                    { timeout: 30000 }
                )
                const d = res.data
                const link =
                    d?.result?.download?.url ||
                    d?.result?.download_url ||
                    d?.result?.link ||
                    d?.link ||
                    d?.url
                if (link) {
                    dlUrl = link
                    title = d?.result?.metadata?.title || d?.result?.title || d?.title || title
                    quality = d?.result?.download?.quality || quality
                    console.log("✅ GiftedTech API ikafanikiwa!")
                }
            } catch (e) {
                console.log("❌ GiftedTech API imefail:", e.message)
            }
        }

        // ── Zote zimefail ──
        if (!dlUrl) return reply("❌ Video download error, thori dair baad try karo")

        // 📂 temp folder
        const tempDir = path.join(__dirname, '../temp')
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

        const rawPath = path.join(tempDir, `raw_${Date.now()}.mp4`)
        const finalPath = path.join(tempDir, `final_${Date.now()}.mp4`)

        // ⬇ Download raw video
        const stream = await axios({
            url: dlUrl,
            method: "GET",
            responseType: "stream",
            timeout: 120000
        })

        await new Promise((resolve, reject) => {
            const w = fs.createWriteStream(rawPath)
            stream.data.pipe(w)
            w.on("finish", resolve)
            w.on("error", reject)
        })

        // 🛠️ FFMPEG
        await new Promise((resolve, reject) => {
            ffmpeg(rawPath)
                .outputOptions([
                    "-map 0:v:0",
                    "-map 0:a:0?",
                    "-movflags +faststart",
                    "-pix_fmt yuv420p",
                    "-vf scale=trunc(iw/2)*2:trunc(ih/2)*2",
                    "-profile:v baseline",
                    "-level 3.0"
                ])
                .videoCodec("libx264")
                .audioCodec("aac")
                .audioBitrate("128k")
                .format("mp4")
                .on("end", resolve)
                .on("error", reject)
                .save(finalPath)
        })

        // 📤 Send final video
        await conn.sendMessage(from, {
            video: fs.readFileSync(finalPath),
            mimetype: "video/mp4",
            caption: `
╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭
│❀ 🎬 𝐓𝐢𝐭𝐥𝐞: ${title}
│❀ 📀 𝐐𝐮𝐚𝐥𝐢𝐭𝐲: ${quality}
│❀ 📁 𝐅𝐨𝐫𝐦𝐚𝐭: MP4
╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭

> 📌 ᴘᴏᴡᴇʀ ʙʏ 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇
`
        }, { quoted: mek })

        // 🧹 cleanup
        fs.unlinkSync(rawPath)
        fs.unlinkSync(finalPath)

    } catch (err) {
        console.error("VIDEO ERROR:", err)
        reply("❌ Video processing error, thori dair baad try karo")
    }
})

