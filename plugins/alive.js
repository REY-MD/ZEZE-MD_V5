const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check bot is alive or not",
    category: "main",
    react: "🌈",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        const aliveMsg = `
*╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
*│ ╌─̇─̣⊰ ZEZE-MD_V5 ⊱┈─̇─̣╌*
*│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣*
*│❀ 🤖 𝐁𝐨𝐭 𝐒𝐭𝐚𝐭𝐮𝐬:* Online ✅
*│❀ 👑 𝐎𝐰𝐧𝐞𝐫:* ${config.OWNER_NAME}
*│❀ ⚙️ 𝐌𝐨𝐝𝐞:* ${config.MODE}
*│❀ 🔣 𝐏𝐫𝐞𝐟𝐢𝐱:* ${config.PREFIX}
*│❀ 💻 𝐇𝐨𝐬𝐭:* ${os.hostname()}
*│❀ 💾 𝐑𝐀𝐌:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
*│❀ ⏱️ 𝐔𝐩𝐭𝐢𝐦𝐞:* ${runtime(process.uptime())}
*╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*

> 📌 ᴘᴏᴡᴇʀ ʙʏ ZEZE TECH
`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption: aliveMsg,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '@newsletter',
                    newsletterName: 'ZEZE TECH',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("ALIVE ERROR:", err);

        const errorMsg = `
*╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
*│ ╌─̇─̣⊰ ZEZE-MD_V5 ⊱┈─̇─̣╌*
*│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣*
*│❌ 𝐀𝐥𝐢𝐯𝐞 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐄𝐫𝐫𝐨𝐫*
*│⏳ Please try again later*
*╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*

> 📌 ᴘᴏᴡᴇʀ ʙʏ ZEZE TECH
`;

        await reply(errorMsg);
    }
});
