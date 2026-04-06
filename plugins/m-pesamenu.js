const axios = require("axios");
const { cmd } = require("../command");


cmd({
    pattern: "m-pesamenu",
    alias: ["pesa"],
    desc: "menu the bot",
    category: "menu",
    react: "🎀",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `*╭───❍ 📩CASH POINT💰 *
‎*├⬡ .LIPA MIX BY YAS*
‎*├⬡ .45176379 YAS*
‎*├⬡ .0747397675 VODA*
‎*├⬡ .HUMPHREY MBISE
‎*╰───────────────❍*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/sez5vx.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363295141350550@newsletter',
                        newsletterName: "𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇 𝐏𝐀𝐘𝐌𝐄𝐍𝐓",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
