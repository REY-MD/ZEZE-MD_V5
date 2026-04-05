const config = require('../config')
const {cmd , commands} = require('../command')
cmd({
    pattern: "about",
    alias: ["zeze-md","whois"], 
    react: "👑",
    desc: "get owner dec",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let about = `
*╭━━〔 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓 〕━━┈⊷*

*👋 HELLO ${pushname}*

*╰──────────────┈⊷*
*╭━━━〔 MY ABOUT 〕━━━┈⊷*
*┃★╭──────────────*
*┃★│* *ᴡᴇʟᴄᴏᴍᴇ ɪᴛs 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓*
*┃★│* *ᴄʀᴇᴀᴛᴇʀ : 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇*
*┃★│* *ʀᴇᴀʟ ɴᴀᴍᴇ : Humphrey47*
*┃★│* *ᴘᴜʙʟɪᴄ ɴᴀᴍᴇ : Mr-Humphrey47*
*┃★│* *ᴀɢᴇ : 19 Years*
*┃★│* *ᴄɪᴛʏ : Morogoro*
*┃★│* *ᴀ sɪᴍᴘʟᴇ ᴡʜᴀᴛsᴀᴘᴘ ᴅᴇᴠᴇʟᴘᴏʀ*
*┃★╰──────────────*
*╰━━━━━━━━━━━━━━━┈⊷*
> *◆◆◆◆◆◆◆◆◆◆◆◆*

*[ • SPECIAL THANKS FOR • ]*
*╭━━━〔 THANKS TO 〕━━━┈⊷*
*┃★╭──────────────*
*┃★│* *▢Alone-md*
*┃★│* *▢Ruhama*
*┃★│* *▢Kheris*
*┃★│* *▢Kate*
*┃★│* *▢Liverpool*
*┃★│* *▢Azam Fc*
*┃★╰──────────────*
*╰━━━━━━━━━━━━━━━┈⊷*

*•────────────•⟢*
> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇
*•────────────•⟢*
`

await conn.sendMessage(from,{image:{url:`https://files.catbox.moe/sez5vx.jpg`},caption:about,
                             contextInfo: {
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363295141350550@newsletter',
      newsletterName: '𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇-XMD',
      serverMessageId: 999
    }
  }
}, { quoted: mek });
} catch (e) {
console.log(e)
reply(`${e}`)
}
})
