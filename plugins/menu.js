const axios = require("axios");
const { cmd } = require("../command");


cmd({
    pattern: "menu",
    alias: ["menu-list"],
    desc: "menu the bot",
    category: "menu",
    react: "📜",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `*╭───❍「 MENU LIST 」❍*
‎*├⬡ .alive*
‎*├⬡ .about*
‎*├⬡ .ping*
‎*├⬡ .test*
‎*├⬡ .update*
‎*├⬡ .zeze-md*
‎*├⬡ .visionʟ*
‎*├⬡ .support*
‎*├⬡ .viewones*
‎*├⬡ .video*
‎*├⬡ .channel*
‎*├⬡ .bug*
‎*├⬡ .anti-link*
‎*├⬡ .anti-delete*
‎*├⬡ .save*
‎*├⬡ .ʙᴏᴏᴍ*
‎*├⬡ .tagall*
‎*├⬡ .url*
‎*├⬡ .youtube*
‎*├⬡ .facebook*
‎*├⬡ .playstore*
‎*├⬡ .instagram*
‎*├⬡ .tictok*
‎*├⬡ .bible*
‎*├⬡ .quran*
‎*├⬡ .logo*
‎*├⬡ .anime*
‎*├⬡ .restart*
‎*├⬡ .hug*
‎*├⬡ .kick*
‎*├⬡ .listplugins*
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
                        newsletterName: "𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓 𝐌𝐄𝐍𝐔🧸₊",
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
