const { cmd } = require('../command');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { runtime } = require('../lib/functions');
const config = require('../config');

/* =======================
   FULL SYSTEM PING
   Command: .ping
======================= */
cmd({
    pattern: "ping",
    react: "❣️",
    desc: "Check system speed & full report",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const speed = Date.now() - m.messageTimestamp * 1000;

        const caption = `
┌───〔 SPEED LIKE JET 〕───┐
│
│ 👤 USER      :: 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓
│ ─────────────────────────────────────
│ ⚡ SPEED     :: ${speed} ms
│ 🧠 UPTIME    :: ${runtime(process.uptime())}
│ 💾 RAM       :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}GB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}GB
│ 🔥 CPU       :: ${os.cpus()[0].model}
│ 📦 VERSION   :: v${config.VERSION || "5.0.0"}
│
├──────────────────────────────────────
│ 🟢 STATUS    :: ONLINE
│ 🔐 ACCESS    :: RUNNING
└───〔 ⚔️ 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇  〕───┘

> [ ENJIYING SPEED BOT... ]
`;

        await conn.sendMessage(from, {
            text: caption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '@newsletter',
                    newsletterName: '𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // 🔊 Audio
        const audioPath = path.join(__dirname, 'https://files.catbox.moe/2fq0gi.mp4');
        if (fs.existsSync(audioPath)) {
            await conn.sendMessage(from, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mp4',
                ptt: true
            }, { quoted: mek });
        }

    } catch (e) {
        console.error("PING ERROR:", e);
        reply("❌ Ping command failed");
    }
});


/* =======================
   QUICK PING
   Command: .ping2
======================= */
cmd({
    pattern: "ping1",
    react: "🚀",
    desc: "Quick ping check",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const start = Date.now();
        const temp = await conn.sendMessage(from, { text: "⏳ *Checking speed...*" }, { quoted: mek });
        const speed = Date.now() - start;

        const msg = `
*╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
*│ ╌─̇─̣⊰ 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓  ⊱┈─̇─̣╌*
*│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣*
*│⚡ 𝐐𝐔𝐈𝐂𝐊 𝐏𝐈𝐍𝐆*
*│*
*│🚀 𝐒𝐩𝐞𝐞𝐝:* ${speed}ms
*│🟢 𝐒𝐭𝐚𝐭𝐮𝐬:* Online
*│📦 𝐕𝐞𝐫𝐬𝐢𝐨𝐧:* v${config.VERSION || "5.0.0"}
*╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*

> 📌 ᴘᴏᴡᴇʀ ʙʏ 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇
`;

        await conn.sendMessage(from, {
            text: msg,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '@newsletter',
                    newsletterName: '𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇',
                    serverMessageId: 143
                }
            }
        }, { quoted: temp });

    } catch (e) {
        console.error("PING2 ERROR:", e);
        reply("❌ Ping2 failed");
    }
});
