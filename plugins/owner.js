const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    react: "✅", 
    desc: "Get owner number",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from }) => {
    try {
        const ownerNumber = config.OWNER_NUMBER; // Fetch owner number from config
        const ownerName = config.OWNER_NAME;     // Fetch owner name from config

        const vcard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      `FN:${ownerName}\n` +  
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\n` + 
                      'END:VCARD';

        // Send the vCard
        const sentVCard = await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        // Send the owner contact message with image and audio
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/sez5vx.jpg' }, // Image URL from your request
            caption: `╭━━〔 *𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃° *Here is the owner details*
┃◈┃° *Name* - ${ownerName}
┃◈┃° *Number* ${ownerNumber}
┃◈┃° *Version*: 5.0.0 Bet
┃◈┃° *Inst:humphreymbise255
┃◈┃° *Fb:Humphrey Mbise
┃◈┃° *Tic:humphreymbise47
┃◈┃° *Thread:humphreymbise47
┃◈└───────────┈⊷
╰──────────────┈⊷
> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`, // Display the owner's details
            contextInfo: {
                mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`], 
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363295141350550@newsletter',
                    newsletterName: '𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇',
                    serverMessageId: 143
                }            
            }
        }, { quoted: mek });

        // Send audio as per your request
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/6359fd.mp4' }, // Audio URL
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`An error occurred: ${error.message}`);
    }
});
