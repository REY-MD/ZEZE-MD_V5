const { cmd } = require('../command');
const axios = require('axios');

// FakevCard sawa na zilizopita
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363295141350550@newsletter',
            newsletterName: '© 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇',
            serverMessageId: 143,
        }
    };
};

// ======== YOUR API KEY ========
const SRIHUB_API = "dew_5H5Dbuh4v7NbkNRmI0Ns2u2ZK240aNnJ9lnYQXR9";

// ======== SIMPLE CACHE ========
global.movie_cache = global.movie_cache || {};

// ================= MOVIE SEARCH =================
cmd({
    pattern: "movie",
    desc: "Search & download movies",
    category: "media",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, sender }) => {
    try {
        const query = args.join(" ").trim();
        if (!query) {
            return await conn.sendMessage(from, { 
                text: "🎬 *𝚄𝚜𝚊𝚐𝚎:* `.movie venom`\n\n> © Powered by 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇", 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // --------------- SEARCH -------------------
        const searchRes = await axios.get(
            "https://api.srihub.store/movie/sinhalasub",
            {
                params: { apikey: SRIHUB_API, query },
                timeout: 15000,
                headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" }
            }
        );

        if (!searchRes.data || searchRes.data.success !== true || !Array.isArray(searchRes.data.result) || searchRes.data.result.length === 0) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝙼𝚘𝚟𝚒𝚎 𝚗𝚘𝚝 𝚏𝚘𝚞𝚗𝚍.\n\n> © Powered by 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇", 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        const moviePageUrl = searchRes.data.result[0].link;

        // --------------- DETAILS -------------------
        const detailRes = await axios.get(
            "https://api.srihub.store/movie/sinhalasubdl",
            {
                params: { apikey: SRIHUB_API, url: moviePageUrl },
                timeout: 15000,
                headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" }
            }
        );

        if (!detailRes.data || detailRes.data.success !== true) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚏𝚎𝚝𝚌𝚑 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚕𝚒𝚗𝚔𝚜.\n\n> © Powered by 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇", 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        const movie = detailRes.data.result;
        if (!movie || !Array.isArray(movie.downloads) || movie.downloads.length === 0) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝙽𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚊𝚋𝚕𝚎 𝚏𝚒𝚕𝚎𝚜 𝚏𝚘𝚞𝚗𝚍.\n\n> © Powered by 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇", 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // --------------- AUTO SD 480P FIRST -------------------
        movie.downloads.sort((a, b) => {
            if (a.quality.includes("480")) return -1;
            if (b.quality.includes("480")) return 1;
            return 0;
        });

        // --------------- CACHE -------------------
        global.movie_cache[from] = {
            title: movie.title || "Movie",
            downloads: movie.downloads
        };

        // --------------- MENU -------------------
        let caption = `╭━━〔 🎬 *${movie.title}* 〕━━┈⊷\n┃\n`;
        movie.downloads.forEach((d, i) => {
            caption += `┃ ${i + 1} | ${d.quality} 📁\n`;
        });
        caption += `┃\n┃ 𝚁𝚎𝚙𝚕𝚢 𝚠𝚒𝚝𝚑 𝚊 𝚗𝚞𝚖𝚋𝚎𝚛 (1–${movie.downloads.length})\n┃\n╰━━━━━━━━━━━━━━━━━━┈⊷\n> © Powered by 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`;

        await conn.sendMessage(from, { 
            image: { url: movie.poster }, 
            caption,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

    } catch (err) {
        console.error("MOVIE ERROR:", err?.response?.data || err.message);
        await conn.sendMessage(from, { 
            text: "⚠️ 𝙼𝚘𝚟𝚒𝚎 𝚜𝚎𝚛𝚟𝚒𝚌𝚎 𝚎𝚛𝚛𝚘𝚛. 𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.\n\n> © Powered by 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

// ================= QUALITY SELECTION =================
cmd({ on: "text" }, async (conn, mek, m, { from, body, sender }) => {
    try {
        if (!global.movie_cache[from]) return;
        if (body.startsWith(".") || body.startsWith("/")) return;

        const index = parseInt(body.trim()) - 1;
        const cache = global.movie_cache[from];

        if (isNaN(index) || !cache.downloads[index]) return;

        const selected = cache.downloads[index];

        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });

        await conn.sendMessage(
            from,
            {
                document: { url: selected.url },
                mimetype: "video/mp4",
                fileName: `${cache.title} (${selected.quality}).mp4`,
                caption: `🎬 *${cache.title}*\n𝚀𝚞𝚊𝚕𝚒𝚝𝚢: ${selected.quality}\n\n> © Powered by 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`,
                contextInfo: getContextInfo({ sender: sender })
            },
            { quoted: fkontak }
        );

    } catch (e) {
        console.error("Movie selection error:", e);
        await conn.sendMessage(from, { 
            text: "❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚏𝚒𝚕𝚎.\n\n> © Powered by 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } finally {
        delete global.movie_cache[from];
    }
});
