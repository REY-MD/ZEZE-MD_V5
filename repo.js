const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

// Safe fetch for all Node versions
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch information about bot GitHub repository",
    react: "🩷",
    category: "info",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {

    const githubRepoURL = 'https://github.com/Mselachui03/MSELA-CHUI-BOT';

    try {
        const match = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("❌ Invalid GitHub repository URL");

        const username = match[1];
        const repoName = match[2];

        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);

        const repoData = await response.json();

        const caption = `
╭━〔 🌐 𝐆𝐈𝐓𝐇𝐔𝐁 𝐑𝐄𝐏𝐎 𝐈𝐍𝐅𝐎 〕━⬣
┃ 👤 User: @${m.sender.split("@")[0]}
┃
┃ 🤖 Bot Name   : ${repoData.name}
┃ 👑 Owner      : ${repoData.owner.login}
┃ ⭐ Stars      : ${repoData.stargazers_count}
┃ 🍴 Forks      : ${repoData.forks_count}
┃ 📝 Description:
┃ ${repoData.description || "🚀 Advanced WhatsApp Bot • Fast • Secure • Multi-Device Supported • Packed with Premium Features & Smooth Performance"}
┃
┃ 🔗 Repo Link:
┃ ${repoData.html_url}
┃
╰━━━━━━━━━━━━━━━━━━━━⬣

> 🚀 𝐒𝐮𝐩𝐩𝐨𝐫𝐭 𝐓𝐡𝐞 𝐏𝐫𝐨𝐣𝐞𝐜𝐭 ⭐  
> 💎 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝚳𝐒𝚵𝐋𝚫-𝐂𝚮𝐔𝚰-𝚾𝚳𝐃
`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/78gezo.jpg' },
            caption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363423019441144@newsletter',
                    newsletterName: '𝚳𝐒𝚵𝐋𝚫-𝐂𝚮𝐔𝚰-𝚾𝚳𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Optional voice
        const audioPath = path.join(__dirname, '../assets/menu.m4a');
        if (fs.existsSync(audioPath)) {
            await conn.sendMessage(from, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mp4',
                ptt: false
            }, { quoted: mek });
        }

    } catch (err) {
        console.error("REPO ERROR:", err);
        reply(`
*╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
*│ ╌─̇─̣⊰ 𝚳𝐒𝚵𝐋𝚫-𝐂𝚮𝐔𝚰-𝚾𝚳𝐃 ⊱┈─̇─̣╌*
*│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣*
*│❌ 𝐑𝐞𝐩𝐨 𝐅𝐞𝐭𝐜𝐡 𝐅𝐚𝐢𝐥𝐞𝐝*
*│⏳ Try again later*
*╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
`);
    }
});
