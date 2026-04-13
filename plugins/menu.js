const config = require('../config')
const { cmd, commands } = require('../command');
const path = require('path'); 
const os = require("os")
const fs = require('fs');
const { runtime } = require('../lib/functions')

cmd({
    pattern: "menu",
    alias: ["allmenu", "fullmenu"],
    use: '.menu2',
    desc: "Show all bot commands",
    category: "menu",
    react: "📜",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        // 1. Kutengeneza Kichwa cha Menu (Header)
        let dec = `╭━━〔 🚀 *${config.BOT_NAME}* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 👑 Owner : *${config.OWNER_NAME}*
┃◈┃• ⚙️ Prefix : *[${config.PREFIX}]*
┃◈┃• 🌐 Platform : *Heroku*
┃◈┃• 📦 Version : *4.0.0*
┃◈┃• ⏱️ Runtime : *${runtime(process.uptime())}*
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷\n`;

        // 2. Kukusanya na kupanga commands kulingana na category
        let commandGroups = {};
        
        commands.forEach((command) => {
            // Hakikisha command ina jina na sio ya kufichwa
            if (command.pattern && !command.dontAddCommandList) {
                // Kama haina category, iweke kwenye 'OTHER'
                let category = command.category ? command.category.toUpperCase() : 'OTHER';
                
                if (!commandGroups[category]) {
                    commandGroups[category] = [];
                }
                commandGroups[category].push(command.pattern);
            }
        });

        // 3. Kuunda muundo wa kila category automatic
        for (const category in commandGroups) {
            dec += `\n╭━━〔 🌟 *${category} MENU* 〕━━┈⊷\n┃◈╭─────────────────·๏\n`;
            
            commandGroups[category].forEach((cmdName) => {
                dec += `┃◈┃• ${cmdName}\n`;
            });
            
            dec += `┃◈╰─────────────────┈⊷\n╰━━━━━━━━━━━━━━━━━━━┈⊷\n`;
        }

        // Kuweka maelezo ya mwisho
        dec += `\n> ${config.DESCRIPTION || 'Powered by Your Bot'}`;

        // 4. Kutuma Menu
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

        // 5. Kutuma Audio (Hakikisha faili lipo ili kuzuia bot ku-crash)
        const audioPath = path.join(__dirname, '../assets/menu.m4a');
        if (fs.existsSync(audioPath)) {
            await conn.sendMessage(from, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mp4',
                ptt: false,
            }, { quoted: mek });
        } else {
            console.log("Audio file not found at: " + audioPath);
        }
        
    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});

