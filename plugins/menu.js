const config = require('../config')
const { cmd, commands } = require('../command');
const path = require('path'); 
const os = require("os")
const fs = require('fs');
const {runtime} = require('../lib/functions')
const axios = require('axios')

cmd({
    pattern: "menu",
    alias: ["allmenu","fullmenu"],
    use: '.menu',
    desc: "Show all bot commands",
    category: "menu",
    react: "🛅",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭━━〔 🚀 *${config.BOT_NAME}* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 👑 Owner : *${config.OWNER_NAME}*
┃◈┃• ⚙️ Prefix : *[${config.PREFIX}]*
┃◈┃• 🌐 Platform : *Heroku*
┃◈┃• 📦 Version : *5.0.2*
┃◈┃• ⏱️ Runtime : *${runtime(process.uptime())}*
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 🎙 *MAIN MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 🍓 menu
┃◈┃• 🍓 ping
┃◈┃• 🍓 speed
┃◈┃• 🍓 test
┃◈┃• 🍓 alive
┃◈┃• 🍓 runtime
┃◈┃• 🍓 uptime
┃◈┃• 🍓 repo
┃◈┃• 🍓 owner
┃◈┃• 🍓 play
┃◈┃• 🍓 viewones
┃◈┃• 🍓 restart
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 💥 *TABLE* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• ❣️ ai
┃◈┃• ❣️ gpt
┃◈┃• ❣️ define
┃◈┃• ❣️ meta
┃◈┃• ❣️ version
┃◈┃• ❣️ news
┃◈┃• ❣️ kiss
┃◈┃• ❣️ hug
┃◈┃• ❣️ kick
┃◈┃• ❣️ bible
┃◈┃• ❣️ quran
┃◈┃• ❣️ channel
┃◈┃• ❣️ antidelete
┃◈┃• ❣️ playstore
┃◈┃• ❣️ dawnloader
┃◈┃• ❣️ zeze
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 🎎 *MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 🔴 group-leave
┃◈┃• 🔴 group-add
┃◈┃• 🔴 groud-acceptall
┃◈┃• 🔴 group-info
┃◈┃• 🔴 group-resertlink
┃◈┃• 🔴 group-profile
┃◈┃• 🔴 group-kick
┃◈┃• 🔴 group-demote
┃◈┃• 🔴 group-tag
┃◈┃• 🔴 group-hidetag
┃◈┃• 🔴 group-lock
┃◈┃• 🔴 prayertime
┃◈┃• 🔴 news
┃◈┃• 🔴 url
┃◈┃• 🔴 pinterest
┃◈┃• 🔴 tictok-dl
┃◈┃• 🔴 status-save
┃◈┃• 🔴 anti-link
┃◈┃• 🔴 anti-delete
┃◈┃• 🔴 anti-bad
┃◈┃• 🔴 block
┃◈┃• 🔴 unblock
┃◈┃• 🔴 hack
┃◈┃• 🔴 ban
┃◈┃• 🔴 happy
┃◈┃• 🔴 shy
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

> ${config.DESCRIPTION}`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/sez5vx.jpg' },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363295141350550@newsletter',
                        newsletterName: config.BOT_NAME,
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );
// share local audio 

const audioPath = path.join(__dirname, '');
await conn.sendMessage(from, {
    audio: fs.readFileSync(audioPath),
    mimetype: 'audio/mp4',
    ptt: false,
}, { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e}`);
    }
});
