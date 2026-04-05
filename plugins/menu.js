const config = require('../config')
const { cmd, commands } = require('../command');
const os = require("os")
const {runtime} = require('../lib/functions')
const axios = require('axios')

cmd({
    pattern: "menu",
    alias: ["allmenu","fullmenu"],
    use: '.menu1',
    desc: "Show all bot commands",
    category: "menu",
    react: "📜",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭━━〔 🚀 *${config.BOT_NAME}* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 👑 *Owner :* ${config.OWNER_NAME}
┃◈┃• ⚙️ *Prefix :* [${config.PREFIX}]
┃◈┃• 🌐 *Platform :* vercel
┃◈┃• 📦 *Version :* 5.0.0 Pro
┃◈┃• ⏱️ *Runtime :* ${runtime(process.uptime())}
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 📥 *DOWNLOAD MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 🟦 facebook
┃◈┃• 📁 mediafire
┃◈┃• 🎵 tiktok
┃◈┃• 🐦 twitter
┃◈┃• 📷 insta
┃◈┃• 📦 apk
┃◈┃• 🖼️ img
┃◈┃• ▶️ tt2
┃◈┃• 📌 pins
┃◈┃• 🔄 apk2
┃◈┃• 🔵 fb2
┃◈┃• 📍 pinterest
┃◈┃• 🎶 spotify
┃◈┃• 🎧 play
┃◈┃• 🎧 play2
┃◈┃• 🔉 audio
┃◈┃• 🎬 video
┃◈┃• 📹 video2
┃◈┃• 🎵 ytmp3
┃◈┃• 📹 ytmp4
┃◈┃• 🎶 song
┃◈┃• 🎬 darama
┃◈┃• ☁️ gdrive
┃◈┃• 🌐 ssweb
┃◈┃• 🎵 tiks
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 👥 *GROUP MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 🔗 grouplink
┃◈┃• 🚪 kickall
┃◈┃• 🚷 kickall2
┃◈┃• 🚫 kickall3
┃◈┃• ➕ add
┃◈┃• ➖ remove
┃◈┃• 👢 kick
┃◈┃• ⬆️ promote
┃◈┃• ⬇️ demote
┃◈┃• 🚮 dismiss
┃◈┃• 🔄 revoke
┃◈┃• 👋 setgoodbye
┃◈┃• 🎉 setwelcome
┃◈┃• 🗑️ delete
┃◈┃• 🖼️ getpic
┃◈┃• ℹ️ ginfo
┃◈┃• ⏳ disappear on
┃◈┃• ⏳ disappear off
┃◈┃• ⏳ disappear 7D,24H
┃◈┃• 📝 allreq
┃◈┃• ✏️ updategname
┃◈┃• 📝 updategdesc
┃◈┃• 📩 joinrequests
┃◈┃• 📨 senddm
┃◈┃• 🏃 nikal
┃◈┃• 🔇 mute
┃◈┃• 🔊 unmute
┃◈┃• 🔒 lockgc
┃◈┃• 🔓 unlockgc
┃◈┃• 📩 invite
┃◈┃• #️⃣ tag
┃◈┃• 🏷️ hidetag
┃◈┃• @️⃣ tagall
┃◈┃• 👔 tagadmins
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 🎭 *REACTIONS MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 👊 bully @tag
┃◈┃• 🤗 cuddle @tag
┃◈┃• 😢 cry @tag
┃◈┃• 🤗 hug @tag
┃◈┃• 🐺 awoo @tag
┃◈┃• 💋 kiss @tag
┃◈┃• 👅 lick @tag
┃◈┃• 🖐️ pat @tag
┃◈┃• 😏 smug @tag
┃◈┃• 🔨 bonk @tag
┃◈┃• 🚀 yeet @tag
┃◈┃• 😊 blush @tag
┃◈┃• 😄 smile @tag
┃◈┃• 👋 wave @tag
┃◈┃• ✋ highfive @tag
┃◈┃• 🤝 handhold @tag
┃◈┃• 🍜 nom @tag
┃◈┃• 🦷 bite @tag
┃◈┃• 🤗 glomp @tag
┃◈┃• 👋 slap @tag
┃◈┃• 💀 kill @tag
┃◈┃• 😊 happy @tag
┃◈┃• 😉 wink @tag
┃◈┃• 👉 poke @tag
┃◈┃• 💃 dance @tag
┃◈┃• 😬 cringe @tag
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 👑 *OWNER MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 👑 owner
┃◈┃• 📜 menu
┃◈┃• 📜 menu2
┃◈┃• 📊 vv
┃◈┃• 📋 listcmd
┃◈┃• 📚 allmenu
┃◈┃• 📦 repo
┃◈┃• 🚫 block
┃◈┃• ✅ unblock
┃◈┃• 🖼️ fullpp
┃◈┃• 🖼️ setpp
┃◈┃• 🔄 restart
┃◈┃• ⏹️ shutdown
┃◈┃• 🔄 updatecmd
┃◈┃• 💚 alive
┃◈┃• 🏓 ping
┃◈┃• 🆔 gjid
┃◈┃• 🆔 jid
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 ⚡ *MAIN MENU* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 🏓 ping
┃◈┃• 🏓 ping2
┃◈┃• 🚀 speed
┃◈┃• 📡 live
┃◈┃• 💚 alive
┃◈┃• ⏱️ runtime
┃◈┃• ⏳ uptime
┃◈┃• 📦 repo
┃◈┃• 👑 owner
┃◈┃• 📜 menu
┃◈┃• 📜 menu2
┃◈┃• 🔄 restart
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

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: ' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e}`);
    }
});
