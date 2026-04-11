const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "xstalk",
  alias: ["twitterstalk", "twtstalk"],
  desc: "Get details about a Twitter/X user",
  react: "🔍",
  category: "search",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) {
      return reply(`
*╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
*│ ╌─̇─̣⊰ 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓 ⊱┈─̇─̣╌*
*│❌ Please provide a valid Twitter/X username*
*│📌 Example:* .xstalk elonmusk
*╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
`);
    }

    // ⏳ reaction
    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const apiUrl = `https://delirius-apiofc.vercel.app/tools/xstalk?username=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.status || !data.data) {
      return reply(`
*╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
*│ ╌─̇─̣⊰ 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓 ⊱┈─̇─̣╌*
*│⚠️ Failed to fetch Twitter/X user details*
*│⏳ Please try again later*
*╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
`);
    }

    const user = data.data;
    const verified = user.verified ? "Yes ✅" : "No ❌";

    const caption = `
*╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
*│ ╌─̇─̣⊰ 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓 ⊱┈─̇─̣╌*
*│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣*
*│❀ 👤 𝐍𝐚𝐦𝐞:* ${user.name}
*│❀ 🆔 𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞:* @${user.username}
*│❀ ✔️ 𝐕𝐞𝐫𝐢𝐟𝐢𝐞𝐝:* ${verified}
*│❀ 👥 𝐅𝐨𝐥𝐥𝐨𝐰𝐞𝐫𝐬:* ${user.followers_count}
*│❀ 👤 𝐅𝐨𝐥𝐥𝐨𝐰𝐢𝐧𝐠:* ${user.following_count}
*│❀ 📝 𝐓𝐰𝐞𝐞𝐭𝐬:* ${user.tweets_count}
*│❀ 📅 𝐉𝐨𝐢𝐧𝐞𝐝:* ${user.created}
*│❀ 🔗 𝐏𝐫𝐨𝐟𝐢𝐥𝐞:* ${user.url}
*╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*

> 📌 ᴘᴏᴡᴇʀ ʙʏ 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇
`;

    await conn.sendMessage(from, {
      image: { url: user.avatar },
      caption
    }, { quoted: m });

  } catch (error) {
    console.error("XSTALK ERROR:", error);
    reply(`
*╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
*│ ╌─̇─̣⊰ 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓 ⊱┈─̇─̣╌*
*│❌ Twitter/X stalk error*
*│⏳ Please try again later*
*╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
`);
  }
});
