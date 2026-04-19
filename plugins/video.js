const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');
const { silainfo, myquoted } = require('../config');

//=========== VIDEO COMMAND ===========//
cmd({
    pattern: "video",
    alias: ["ytmp4", "mp4", "ytv", "vi", "v", "vid", "vide", "videos", "silavideo", "ytvid", "ytvide", "ytvideos", "searchyt", "download", "get", "need", "search"],
    desc: "Download YouTube MP4",
    category: "media",
    react: "📽️",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) {
            await conn.sendMessage(
                from,
                {
                    text: `╔► 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 📽️\n╚► → 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐯𝐢𝐝𝐞𝐨 𝐧𝐚𝐦𝐞\n\n╔► 𝐄𝐱𝐚𝐦𝐩𝐥𝐞:\n╚► → .𝐯𝐢𝐝𝐞𝐨 𝐬𝐨𝐧𝐠 𝐧𝐚𝐦𝐞\n╚► → .𝐯𝐢𝐝𝐞𝐨 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 𝐮𝐫𝐥\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐝 𝐁𝐲 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`,
                    ...silainfo()
                },
                { quoted: myquoted }
            );
            return;
        }

        const text = args.join(' ');
        
        // Send searching message
        await conn.sendMessage(
            from,
            {
                text: `╔► 𝐒𝐄𝐀𝐑𝐂𝐇𝐈𝐍𝐆 🔍\n╚► → ${text}\n\n⏳ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭...\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐝 𝐁𝐲 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`,
                ...silainfo()
            },
            { quoted: myquoted }
        );

        // Search YouTube
        const search = await yts(text);
        if (!search.videos.length) {
            await conn.sendMessage(
                from,
                {
                    text: `╔► 𝐄𝐫𝐫𝐨𝐫: ❌\n╚► → 𝐍𝐨 𝐯𝐢𝐝𝐞𝐨 𝐟𝐨𝐮𝐧𝐝\n\n╔► 𝐓𝐫𝐲:\n╚► → 𝐃𝐢𝐟𝐟𝐞𝐫𝐞𝐧𝐭 𝐧𝐚𝐦𝐞\n╚► → 𝐂𝐡𝐞𝐜𝐤 𝐬𝐩𝐞𝐥𝐥𝐢𝐧𝐠\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐝 𝐁𝐲 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`,
                    ...silainfo()
                },
                { quoted: myquoted }
            );
            return;
        }

        const data = search.videos[0];
        const ytUrl = data.url;

        // YouTube download API
        const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.media?.video_url) {
            throw new Error('𝐕𝐢𝐝𝐞𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐟𝐚𝐢𝐥𝐞𝐝');
        }

        const result = apiRes.result.media;

        // Create caption with video info
        const caption = `╔► 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐕𝐈𝐃𝐄𝐎 📽️\n╚► → ${data.title}\n\n╔► 𝐕𝐢𝐝𝐞𝐨 𝐈𝐧𝐟𝐨:\n╚► → 𝐕𝐢𝐞𝐰𝐬: ${data.views}\n╚► → 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧: ${data.timestamp}\n╚► → 𝐀𝐮𝐭𝐡𝐨𝐫: ${data.author.name}\n\n╔► 𝐂𝐡𝐨𝐨𝐬𝐞 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐓𝐲𝐩𝐞:\n╚► → 𝟏 = 𝐒𝐢𝐦𝐩𝐥𝐞 𝐕𝐢𝐝𝐞𝐨\n╚► → 𝟐 = 𝐕𝐢𝐝𝐞𝐨 𝐅𝐢𝐥𝐞\n\n╔► 𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝟏 𝐨𝐫 𝟐:\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐝 𝐁𝐲 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`;

        // Send video info with thumbnail
        const sentMsg = await conn.sendMessage(
            from,
            {
                image: { url: result.thumbnail || data.thumbnail },
                caption: caption,
                ...silainfo()
            },
            { quoted: myquoted }
        );

        const messageID = sentMsg.key.id;

        // Listen for user reply
        const listener = async (msgData) => {
            try {
                const receivedMsg = msgData.messages?.[0];
                if (!receivedMsg?.message) return;

                const receivedText = receivedMsg.message.conversation || 
                                   receivedMsg.message.extendedTextMessage?.text;
                
                const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                const senderID = receivedMsg.key.remoteJid;

                if (isReplyToBot && senderID === from) {
                    switch (receivedText.trim()) {
                        case "1":
                            await conn.sendMessage(
                                from,
                                {
                                    video: { url: result.video_url },
                                    mimetype: "video/mp4",
                                    caption: `╔► 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 ✅\n╚► → ${data.title}\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐝 𝐁𝐲 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`,
                                    ...silainfo()
                                },
                                { quoted: myquoted }
                            );
                            break;

                        case "2":
                            await conn.sendMessage(
                                from,
                                {
                                    document: { url: result.video_url },
                                    mimetype: "video/mp4",
                                    fileName: `${data.title.replace(/[<>:"/\\|?*]/g, '')}.mp4`,
                                    caption: `╔► 𝐕𝐈𝐃𝐄𝐎 𝐅𝐈𝐋𝐄 📄\n╚► → ${data.title}\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐝 𝐁𝐲 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`,
                                    ...silainfo()
                                },
                                { quoted: myquoted }
                            );
                            break;

                        default:
                            await conn.sendMessage(
                                from,
                                {
                                    text: `╔► 𝐄𝐫𝐫𝐨𝐫: ❌\n╚► → 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝟏 𝐨𝐫 𝟐\n\n╔► 𝟏 = 𝐒𝐢𝐦𝐩𝐥𝐞 𝐕𝐢𝐝𝐞𝐨\n╚► 𝟐 = 𝐕𝐢𝐝𝐞𝐨 𝐅𝐢𝐥𝐞\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐝 𝐁𝐲 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`,
                                    ...silainfo()
                                },
                                { quoted: myquoted }
                            );
                    }
                    
                    // Remove listener after handling
                    conn.ev.off('messages.upsert', listener);
                }
            } catch (error) {
                console.error("Reply handler error:", error);
            }
        };

        // Set timeout for listener
        conn.ev.on('messages.upsert', listener);
        setTimeout(() => {
            conn.ev.off('messages.upsert', listener);
        }, 60000); // 1 minute timeout

    } catch (error) {
        console.error("Video command error:", error);
        await conn.sendMessage(
            from,
            {
                text: `╔► 𝐄𝐫𝐫𝐨𝐫: ❌\n╚► → 𝐕𝐢𝐝𝐞𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐟𝐚𝐢𝐥𝐞𝐝\n\n╔► 𝐑𝐞𝐚𝐬𝐨𝐧:\n╚► → ${error.message}\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐝 𝐁𝐲 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`,
                ...silainfo()
            },
            { quoted: myquoted }
        );
    }
});
