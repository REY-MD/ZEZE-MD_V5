const axios = require("axios");
const { cmd } = require("../command");

// Command: bible
cmd({
    pattern: "bible",
    desc: "Fetch Bible verses by reference.",
    category: "fun",
    react: "📖",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (args.length === 0) {
            return reply(`⚠️ *Please provide a Bible reference.*\n\n📝 *Example:*\n.bible John 1:1`);
        }

        const reference = args.join(" ");
        const apiUrl = `https://bible-api.com/${encodeURIComponent(reference)}`;
        const response = await axios.get(apiUrl);

        if (response.status === 200 && response.data.text) {
            const { reference: ref, text, translation_name } = response.data;

            // Fake verified contact (quoted)
            let fakeContact = {
                key: {
                    fromMe: false,
                    participant: '0@s.whatsapp.net',
                    remoteJid: 'status@broadcast'
                },
                message: {
                    contactMessage: {
                        displayName: '𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇 ✅',
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇 ✅\nORG:𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD`,
                        jpegThumbnail: null
                    }
                }
            }

            await conn.sendMessage(m.chat, {
                text:
                    `📜 *Bible Verse Found!*\n\n` +
                    `📖 *Reference:* ${ref}\n` +
                    `📚 *Text:* ${text}\n\n` +
                    `🗂️ *Translation:* ${translation_name}\n\n` +
                    `© 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓 BIBLE`,
                contextInfo: {
                    externalAdReply: {
                        title: "HOLY BIBLE VERSES",
                        body: "Powered by 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇",
                        thumbnailUrl: "https://files.catbox.moe/fgiecg.jpg",
                        sourceUrl: "https://github.com/",
                        mediaType: 1,
                        renderLargerThumbnail: false,
                        showAdAttribution: true
                    },
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "@newsletter",
                        newsletterName: "𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇 Bot Updates",
                        serverMessageId: "",
                    }
                }
            }, { quoted: fakeContact });

        } else {
            reply("❌ *Verse not found.* Please check the reference and try again.");
        }
    } catch (error) {
        console.error("Bible Error:", error);
        reply("⚠️ *An error occurred while fetching the Bible verse.* Please try again.");
    }
});
