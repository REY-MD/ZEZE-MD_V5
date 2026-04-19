const { cmd } = require("../command");
const config = require("../config");

// FakevCard sawa na zilizopita
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363295141350550@newsletter',
            newsletterName: '𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇',
            serverMessageId: 143,
        },
    };
};

// Memory for warnings
const userWarnings = new Set();
const warningCount = {};

// === Anti-Link Event Handler ===
cmd({ on: "body" }, async (client, message, chat, { from, sender, isGroup, isAdmins, isOwner, body }) => {
  try {
    // Basic checks: Only groups, no admins, no owner, must be enabled
    if (!isGroup || isAdmins || isOwner || !config.ANTI_LINK) return;

    // Accurate Regex for ALL links (http, https, www, and domains like .com, .net, .ke, etc.)
    const linkRegex = /((https?:\/\/|www\.)[^\s]+|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?)/gi;

    if (linkRegex.test(body)) {
      const mode = config.ANTILINK_MODE || 'delete';

      // 1. Delete the message first
      await client.sendMessage(from, { delete: message.key });

      // 2. Handle Actions (Warn, Kick, or just Delete)
      if (mode === 'warn') {
        warningCount[sender] = (warningCount[sender] || 0) + 1;
        
        if (warningCount[sender] >= 3) {
          await client.sendMessage(from, { 
            text: `🚫 @${sender.split("@")[0]} 𝚛𝚎𝚊𝚌𝚑𝚎𝚍 𝟹/𝟹 𝚠𝚊𝚛𝚗𝚒𝚗𝚐𝚜 𝚊𝚗𝚍 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚛𝚎𝚖𝚘𝚟𝚎𝚍.\n\n> © Powered by 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`, 
            mentions: [sender],
            contextInfo: getContextInfo({ sender: sender })
          }, { quoted: fkontak });
          await client.groupParticipantsUpdate(from, [sender], "remove");
          delete warningCount[sender];
        } else {
          await client.sendMessage(from, { 
            text: `⚠️ *𝙻𝚒𝚗𝚔 𝙳𝚎𝚝𝚎𝚌𝚝𝚎𝚍!* @${sender.split("@")[0]}\n\n𝚆𝚊𝚛𝚗𝚒𝚗𝚐: ${warningCount[sender]}/𝟹\n_𝚂𝚎𝚗𝚍𝚒𝚗𝚐 𝚕𝚒𝚗𝚔𝚜 𝚒𝚜 𝚜𝚝𝚛𝚒𝚌𝚝𝚕𝚢 𝚙𝚛𝚘𝚑𝚒𝚋𝚒𝚝𝚎𝚍!_\n\n> © Powered by 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`, 
            mentions: [sender],
            contextInfo: getContextInfo({ sender: sender })
          }, { quoted: fkontak });
        }
      } 
      
      else if (mode === 'kick') {
        await client.sendMessage(from, { 
          text: `🚫 *𝙻𝚒𝚗𝚔 𝙳𝚎𝚝𝚎𝚌𝚝𝚎𝚍!* @${sender.split("@")[0]} 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚔𝚒𝚌𝚔𝚎𝚍.\n\n> © Powered by 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`, 
          mentions: [sender],
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
        await client.groupParticipantsUpdate(from, [sender], "remove");
      } 
      
      else {
        // Mode: Delete only
        await client.sendMessage(from, { 
          text: `🚫 *𝙻𝚒𝚗𝚔𝚜 𝚊𝚛𝚎 𝚗𝚘𝚝 𝚊𝚕𝚕𝚘𝚠𝚎𝚍 𝚑𝚎𝚛𝚎!*\n\n> © Powered by 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇`,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }
    }
  } catch (error) {
    console.error("❌ Anti-link handler error:", error);
  }
});

// === Anti-Link Command ===
cmd({
  pattern: "antilink",
  alias: ["alink", "blocklink"],
  desc: "Toggle and configure link blocking",
  category: "group",
  react: "🔗",
  filename: __filename,
},
async (client, message, m, { isGroup, isAdmins, isOwner, from, sender, args, reply }) => {
  try {
    if (!isGroup) {
      return await client.sendMessage(from, { 
        text: "❌ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚏𝚘𝚛 𝚐𝚛𝚘𝚞𝚙𝚜!\n\n> © Powered by 𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇",
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }
    
    if (!isAdmins && !isOwner) {
      return await client.sendMessage(from, { 
        text: "🚫 *𝙰𝚍𝚖𝚒𝚗-𝚘𝚗𝚕𝚢 𝚌𝚘𝚖𝚖𝚊𝚗𝚍!*\n\n> © Powered by Sila Tech",
        mentions: [sender],
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }

    const action = args[0]?.toLowerCase() || 'status';
    let statusText, reaction = "🔗", additionalInfo = "";

    switch (action) {
      case 'on':
        config.ANTI_LINK = true;
        statusText = "✅ 𝙰𝚗𝚝𝚒-𝚕𝚒𝚗𝚔 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 *𝙴𝙽𝙰𝙱𝙻𝙴𝙳*!";
        reaction = "✅";
        additionalInfo = "𝙰𝚕𝚕 𝚕𝚒𝚗𝚔𝚜 𝚠𝚒𝚕𝚕 𝚗𝚘𝚠 𝚋𝚎 𝚖𝚘𝚗𝚒𝚝𝚘𝚛𝚎𝚍 🛡️";
        break;

      case 'off':
        config.ANTI_LINK = false;
        statusText = "❌ 𝙰𝚗𝚝𝚒-𝚕𝚒𝚗𝚔 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 *𝙳𝙸𝚂𝙰𝙱𝙻𝙴𝙳*!";
        reaction = "❌";
        additionalInfo = "𝙻𝚒𝚗𝚔𝚜 𝚊𝚛𝚎 𝚗𝚘𝚠 𝚊𝚕𝚕𝚘𝚠𝚎𝚍 𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙 🔓";
        break;

      case 'warn':
      case 'kick':
      case 'delete':
        config.ANTI_LINK = true;
        config.ANTILINK_MODE = action;
        statusText = `⚙️ 𝙼𝚘𝚍𝚎 𝚜𝚎𝚝 𝚝𝚘 *${action.toUpperCase()}*`;
        reaction = "🛡️";
        additionalInfo = `𝙱𝚘𝚝 𝚠𝚒𝚕𝚕 𝚗𝚘𝚠 ${action} 𝚞𝚜𝚎𝚛𝚜 𝚜𝚎𝚗𝚍𝚒𝚗𝚐 𝚕𝚒𝚗𝚔𝚜.`;
        break;

      default:
        statusText = `📌 𝙰𝚗𝚝𝚒-𝚕𝚒𝚗𝚔 𝚂𝚝𝚊𝚝𝚞𝚜: ${config.ANTI_LINK ? "✅ *𝙴𝙽𝙰𝙱𝙻𝙴𝙳*" : "❌ *𝙳𝙸𝚂𝙰𝙱𝙻𝙴𝙳*"}`;
        additionalInfo = `𝙲𝚞𝚛𝚛𝚎𝚗𝚝 𝙼𝚘𝚍𝚎: *${config.ANTILINK_MODE || 'delete'}*\n\n*𝚄𝚜𝚊𝚐𝚎:* \n.antilink on/off\n.antilink warn/kick/delete`;
        break;
    }

    // Send combined image + newsletter style message
    await client.sendMessage(from, {
      image: { url: "https://files.catbox.moe/sez5vx.jpg" },
      caption: `
${statusText}
${additionalInfo}

> © Powered by Sila Tech
      `,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363295141350550@newsletter',
          newsletterName: '𝐙𝐄𝐙𝐄-𝐓𝐄𝐂𝐇',
          serverMessageId: 143
        }
      }
    }, { quoted: fkontak });

    // React to original command
    await client.sendMessage(from, {
      react: { text: reaction, key: message.key }
    });

  } catch (error) {
    console.error("❌ Anti-link command error:", error);
    await client.sendMessage(from, { 
      text: `⚠️ 𝙴𝚛𝚛𝚘𝚛: ${error.message}\n\n> © Powered by Sila Tech`,
      mentions: [sender],
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
  }
});
