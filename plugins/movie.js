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
    pattern: "movie",
    alias: ["film", "gtmovie", "mvdl"],
    desc: "Movie info + trailer",
    category: "search",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) {
            return reply("❌ Movie ka naam likho\nExample:\n.movie Avengers")
        }

        await reply("🔍 Movie dhoondh raha hoon...")

        const apiKey = "38f19ae1"

        // ── Tafuta movie kwenye OMDB ──
        const searchRes = await axios.get(
            `http://www.omdbapi.com/?s=${encodeURIComponent(text)}&apikey=${apiKey}`,
            { timeout: 10000 }
        )

        if (searchRes.data.Response === "False")
            return reply(`❌ Movie nahi mili: ${searchRes.data.Error}`)

        const movieID = searchRes.data.Search[0].imdbID
        const detailsRes = await axios.get(
            `http://www.omdbapi.com/?i=${movieID}&apikey=${apiKey}`,
            { timeout: 10000 }
        )

        const movie = detailsRes.data
        if (movie.Response === "False")
            return reply(`❌ Error: ${movie.Error}`)

        // ── Tuma maelezo mafupi + poster ──
        const poster = movie.Poster !== "N/A" ? movie.Poster : null

        await conn.sendMessage(from, {
            ...(poster
                ? { image: { url: poster } }
                : {}),
            text: !poster ? `
╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭
│ ╌─̇─̣⊰ 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓 ⊱┈─̇─̣╌
│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣
│❀ 🎬 𝐓𝐢𝐭𝐥𝐞: ${movie.Title} (${movie.Year})
│❀ ⭐ 𝐈𝐌𝐃𝐛: ${movie.imdbRating}/10
│❀ 🎭 𝐆𝐞𝐧𝐫𝐞: ${movie.Genre}
│❀ ⏱️ 𝐑𝐮𝐧𝐭𝐢𝐦𝐞: ${movie.Runtime}
│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣
│❀ 📖 ${movie.Plot}
╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭

> 📌 ᴘᴏᴡᴇʀ ʙʏ 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇
` : undefined,
            caption: poster ? `
╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭
│ ╌─̇─̣⊰ 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓 ⊱┈─̇─̣╌
│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣
│❀ 🎬 𝐓𝐢𝐭𝐥𝐞: ${movie.Title} (${movie.Year})
│❀ ⭐ 𝐈𝐌𝐃𝐛: ${movie.imdbRating}/10
│❀ 🎭 𝐆𝐞𝐧𝐫𝐞: ${movie.Genre}
│❀ ⏱️ 𝐑𝐮𝐧𝐭𝐢𝐦𝐞: ${movie.Runtime}
│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣
│❀ 📖 ${movie.Plot}
╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭

> 📌 ᴘᴏᴡᴇʀ ʙʏ 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇
` : undefined,
        }, { quoted: mek })

        // ── Tafuta trailer YouTube ──
        await reply("🎬 Trailer dhoondh raha hoon...")

        const ytResult = await yts(`${movie.Title} ${movie.Year} official trailer`)
        const trailer = ytResult.videos.find(v => v.seconds <= 300 && v.seconds > 30)

        if (!trailer) return reply("❌ Trailer nahi mila YouTube pe")

        // ── Download trailer via GiftedTech ──
        const res = await axios.get(
            `${GiftedTechApi}/api/download/ytmp4?apikey=${GiftedApiKey}&url=${encodeURIComponent(trailer.url)}`,
            { timeout: 60000 }
        )

        const d = res.data
        const dlUrl =
            d?.result?.download?.url ||
            d?.result?.download_url ||
            d?.result?.link ||
            d?.link ||
            d?.url

        if (!dlUrl) return reply("❌ Trailer download error, thori dair baad try karo")

        // ── Download na process na ffmpeg ──
        const tempDir = path.join(__dirname, '../temp')
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

        const rawPath = path.join(tempDir, `raw_${Date.now()}.mp4`)
        const finalPath = path.join(tempDir, `final_${Date.now()}.mp4`)

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

        // ── Tuma trailer ──
        await conn.sendMessage(from, {
            video: fs.readFileSync(finalPath),
            mimetype: "video/mp4",
            caption: `
╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭
│❀ 🎬 𝐓𝐫𝐚𝐢𝐥𝐞𝐫: ${movie.Title}
│❀ ⭐ 𝐈𝐌𝐃𝐛: ${movie.imdbRating}/10
╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭

> 📌 ᴘᴏᴡᴇʀ ʙʏ 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓
`
        }, { quoted: mek })

        // ── Futa temp files ──
        fs.unlinkSync(rawPath)
        fs.unlinkSync(finalPath)

    } catch (err) {
        console.error("MOVIE ERROR:", err)
        reply("❌ Movie error, thori dair baad try karo")
    }
})

