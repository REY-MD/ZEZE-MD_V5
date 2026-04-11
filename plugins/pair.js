const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for 𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓 bot",
    category: "download",
    use: ".pair 255617xxxxxx",
    filename: __filename
}, async (conn, mek, m, { reply, q, senderNumber }) => {
    try {
        // 📱 number handling
        const phone = q
            ? q.replace(/[^0-9]/g, '')
            : senderNumber.replace(/[^0-9]/g, '');

        if (!phone || phone.length < 10 || phone.length > 15) {
            return reply(
                "❌ Please provide a valid WhatsApp number.\n\nExample:\n.pair 255617xxxxxxx"
            );
        }

        // 🌐 API call
        const url = `https://paring-site-44t7.onrender.com/code?number=${phone}`;
        const response = await axios.get(url, { timeout: 15000 });

        if (!response.data) {
            return reply("❌ Failed to get pairing code. Please try again later.");
        }

        // 🔑 flexible response handling
        const pairCode =
            response.data.code ||
            response.data.pair ||
            response.data.pairingCode ||
            response.data.result;

        if (!pairCode) {
            return reply("❌ Pairing service is busy. Please try again after a short while.");
        }

        // ✅ success message
        await reply(
            `*𝐙𝐄𝐙𝐄-𝐌𝐃_𝐕𝟓 PAIRING CODE*\n\n` +
            `🔑 Code: *${pairCode}*\n\n` +
            `_Enter this code in WhatsApp to link your device._`
        );

        // ⏳ resend clean code
        setTimeout(async () => {
            await reply(`${pairCode}`);
        }, 2000);

    } catch (err) {
        console.error("PAIR ERROR:", err.message);
        reply("❌ An error occurred. Please try again after a short while.");
    }
});
