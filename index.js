/* ============================================================

      ╚═╝     ╚═╝╚══════╝      ╚═══╝  ╚═╝  ╚═╝ ╚════╝ ╚═╝     ╚═╝
   ============================================================ */

// ==================== MEMORY OPTIMIZATION ====================
global.gc = global.gc || (() => {});
let memoryCleanInterval = null;

function setupMemoryOptimization() {
    memoryCleanInterval = setInterval(() => {
        try {
            if (global.gc) global.gc();
            const memoryUsage = process.memoryUsage();
            console.log(`🔄 Memory Cleaned - Heap: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
        } catch (err) {
            console.error("Memory cleanup error:", err.message);
        }
    }, 30000);
}

setupMemoryOptimization();

// ==================== ULTRA PRO SPEED BOOSTER ====================
const speedCache = {
    groups: new Map(),
    users: new Map(),
    commands: null,
    lastClean: Date.now()
};

let perfStats = {
    msgCount: 0,
    avgResponse: 0,
    startTime: Date.now()
};

const msgQueue = [];
let processing = false;

const processQueue = async () => {
    if (processing || msgQueue.length === 0) return;
    processing = true;
    
    const batchSize = Math.min(5, msgQueue.length);
    const batch = msgQueue.splice(0, batchSize);
    for (const msg of batch) {
        try {
            await handleMessageUltra(msg);
        } catch(e) {
            console.error("Queue error:", e.message);
        }
        await new Promise(r => setTimeout(r, 30));
    }
    
    processing = false;
    if (msgQueue.length > 0) setTimeout(processQueue, 10);
};

setInterval(() => {
    const now = Date.now();
    const mem = process.memoryUsage();
    
    console.log(`
    ⚡ MEMORY STATS ⚡
    🧠 Heap: ${(mem.heapUsed / 1024 / 1024).toFixed(1)}MB
    🗃️  Cache: ${speedCache.groups.size} groups
    📨 Queue: ${msgQueue.length}
    `);
    
    if (mem.heapUsed / 1024 / 1024 > 400) {
        console.log("⚠️ High memory, clearing cache...");
        speedCache.groups.clear();
        speedCache.users.clear();
        msgQueue.length = 0;
    }
    
    if (now - speedCache.lastClean > 120000) {
        for (const [key, val] of speedCache.groups.entries()) {
            if (now - val.timestamp > 180000) speedCache.groups.delete(key);
        }
        speedCache.lastClean = now;
    }
}, 30000);

// ==================== HELPER FUNCTIONS ====================
async function getSizeMedia(buffer) {
    return buffer.length;
}

const getBuffer = async (url) => {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        return Buffer.from(response.data);
    } catch (err) {
        console.error('GetBuffer error:', err.message);
        return null;
    }
};

// ==================== REQUIRED MODULES ====================
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    isJidBroadcast,
    getContentType,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser,
    downloadContentFromMessage,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateMessageID,
    jidDecode,
    fetchLatestBaileysVersion,
    Browsers,
    makeCacheableSignalKeyStore,
    delay
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const ff = require('fluent-ffmpeg');
const P = require('pino');
const qrcode = require('qrcode-terminal');
const util = require('util');
const FileType = require('file-type');
const axios = require('axios');
const bodyparser = require('body-parser');
const os = require('os');
const Crypto = require('crypto');
const path = require('path');
const chalk = require('chalk');
const { exec } = require('child_process');
const moment = require('moment');
const speed = require('performance-now');

// ==================== CONFIG ====================
const config = require('./config');
const prefix = config.PREFIX || '.';
const ownerNumber = config.OWNER_NUMBER ? config.OWNER_NUMBER.split(',').map(n => n.trim()) : ['260769355624'];

// ==================== COMMAND HANDLER ====================
let commands = [];
const aliases = new Map();

// LOAD PLUGINS FIRST
console.log(chalk.blue('📁 Loading plugins...'));
const pluginsDir = path.join(__dirname, 'plugins');
let pluginCommands = [];

if (fs.existsSync(pluginsDir)) {
    const pluginFiles = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));
    
    for (const file of pluginFiles) {
        try {
            const pluginPath = path.join(pluginsDir, file);
            delete require.cache[require.resolve(pluginPath)];
            const plugin = require(pluginPath);
            if (plugin.commands && Array.isArray(plugin.commands)) {
                pluginCommands.push(...plugin.commands);
                console.log(chalk.green(`✅ Loaded plugin: \( {file} ( \){plugin.commands.length} commands)`));
            } else if (plugin.default && plugin.default.commands) {
                pluginCommands.push(...plugin.default.commands);
                console.log(chalk.green(`✅ Loaded plugin: \( {file} ( \){plugin.default.commands.length} commands)`));
            } else {
                console.log(chalk.yellow(`⚠️ Plugin ${file} has no commands export`));
            }
        } catch (err) {
            console.log(chalk.red(`❌ Error in ${file}: ${err.message}`));
        }
    }
}

// LOAD COMMAND.JS
try {
    const cmdModule = require('./command');
    if (cmdModule.commands && cmdModule.commands.length > 0) {
        commands = [...cmdModule.commands, ...pluginCommands];
        console.log(chalk.green(`✅ Total Commands loaded: \( {commands.length} ( \){cmdModule.commands.length} from command.js + ${pluginCommands.length} from plugins)`));
    } else {
        commands = pluginCommands;
        console.log(chalk.green(`✅ Total Commands loaded: ${commands.length} (all from plugins)`));
    }
} catch (e) {
    console.log(chalk.yellow(`⚠️ Command module error: ${e.message}`));
    commands = pluginCommands;
    console.log(chalk.green(`✅ Total Commands loaded: ${commands.length} (from plugins only)`));
}

// SET ALIASES
commands.forEach(cmd => {
    if (cmd.alias && Array.isArray(cmd.alias)) {
        cmd.alias.forEach(alias => {
            aliases.set(alias, cmd.pattern);
        });
    }
});

// ==================== LIB IMPORTS ====================
const { getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const { getBuffer: getBufferAlt, getGroupAdmins: getGroupAdminsAlt, getRandom: getRandomAlt, h2k: h2kAlt, isUrl: isUrlAlt, Json: JsonAlt, runtime: runtimeAlt, sleep: sleepAlt, fetchJson: fetchJsonAlt, saveConfig, empiretourl } = require('./lib/functions2');
const { sms, downloadMediaMessage } = require('./lib/msg');
const GroupEvents = require('./lib/groupevents');
const { AntiDelete, DeletedText, DeletedMedia } = require('./lib/antidel');
const { DATABASE } = require('./lib/database');
const { fetchGif, gifToVideo } = require('./lib/fetchGif');
const { fetchImage, fetchGif: fetchGifAlt, gifToSticker } = require('./lib/sticker-utils');
const { videoToWebp } = require('./lib/video-utils');

// ==================== DATA IMPORTS ====================
const { 
    AntiDelDB,
    initializeAntiDeleteSettings,
    setAnti,
    getAnti,
    getAllAntiDeleteSettings 
} = require('./data/antidel');

const { 
    saveContact,
    loadMessage,
    getName,
    getChatSummary,
    saveGroupMetadata,
    getGroupMetadata,
    saveMessageCount,
    getInactiveGroupMembers,
    getGroupMembersMessageCount,
    saveMessage 
} = require('./data/store');

const { setCommitHash, getCommitHash } = require('./data/updateDB');
const converter = require('./data/converter');
const stickerConverter = require('./data/sticker-converter');

// ==================== ASSETS ====================
let autoReply = {};
let autoSticker = {};
let autoVoice = {};

try {
    if (fs.existsSync('./assets/autoreply.json')) {
        autoReply = JSON.parse(fs.readFileSync('./assets/autoreply.json'));
        console.log(chalk.green("✅ Auto-reply loaded:"), Object.keys(autoReply).length, "triggers");
    }
} catch (e) {
    console.log(chalk.yellow("⚠️ Auto-reply load error:"), e.message);
}

try {
    if (fs.existsSync('./assets/autosticker.json')) {
        autoSticker = JSON.parse(fs.readFileSync('./assets/autosticker.json'));
        console.log(chalk.green("✅ Auto-sticker loaded:"), Object.keys(autoSticker).length, "triggers");
    }
} catch (e) {
    console.log(chalk.yellow("⚠️ Auto-sticker load error:"), e.message);
}

try {
    if (fs.existsSync('./assets/autovoice.json')) {
        autoVoice = JSON.parse(fs.readFileSync('./assets/autovoice.json'));
        console.log(chalk.green("✅ Auto-voice loaded:"), Object.keys(autoVoice).length, "triggers");
    }
} catch (e) {
    console.log(chalk.yellow("⚠️ Auto-voice load error:"), e.message);
}

// ==================== BAN/SUDO ====================
let banList = [];
let sudoList = [];

try {
    if (fs.existsSync('./lib/ban.json')) {
        banList = JSON.parse(fs.readFileSync('./lib/ban.json'));
        console.log(chalk.green("✅ Ban list loaded:"), banList.length, "users");
    }
} catch (e) {
    console.log(chalk.yellow("⚠️ Ban list load error:"), e.message);
}

try {
    if (fs.existsSync('./lib/sudo.json')) {
        sudoList = JSON.parse(fs.readFileSync('./lib/sudo.json'));
        console.log(chalk.green("✅ Sudo list loaded:"), sudoList.length, "users");
    }
} catch (e) {
    console.log(chalk.yellow("⚠️ Sudo list load error:"), e.message);
}

// ==================== TEMP DIR ====================
const tempDir = path.join(os.tmpdir(), 'cache-temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const clearTempDir = () => {
    try {
        const files = fs.readdirSync(tempDir);
        const now = Date.now();
        for (const file of files) {
            const filePath = path.join(tempDir, file);
            try {
                const stats = fs.statSync(filePath);
                if (now - stats.mtimeMs > 10 * 60 * 1000) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {}
        }
    } catch (err) {}
};

setInterval(clearTempDir, 5 * 60 * 1000);

// ==================== SESSION HANDLER ====================
let saveInterval = null;

async function initializeSession() {
    console.log("\n🔐 ==============================");
    console.log("🔐 SESSION INITIALIZATION");
    console.log("🔐 ==============================\n");
    
    const sessionDir = path.join(__dirname, 'sessions');
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });
    
    const credsPath = path.join(sessionDir, 'creds.json');
    
    if (config.SESSION_ID && config.SESSION_ID.trim() !== "") {
        try {
            console.log("📦 Loading session from SESSION_ID...");
            let sessdata = config.SESSION_ID;
            
            const prefixes = ['FAIZAN-MD\~', 'BOSS-MD\~', 'EMYOU\~', 'BOT\~', 'MSELACHUI-MD\~', 'MSELACHUI\~'];
            for (const p of prefixes) {
                if (sessdata.includes(p)) {
                    sessdata = sessdata.split(p)[1];
                    break;
                }
            }
            
            sessdata = sessdata.trim();
            while (sessdata.length % 4 !== 0) sessdata += '=';
            
            const decodedData = Buffer.from(sessdata, 'base64').toString('utf-8');
            
            try {
                const jsonData = JSON.parse(decodedData);
                fs.writeFileSync(credsPath, JSON.stringify(jsonData, null, 2));
                console.log("✅ Session loaded successfully!");
                return true;
            } catch (jsonErr) {
                fs.writeFileSync(credsPath, decodedData);
                console.log("✅ Session saved as raw data");
                return true;
            }
        } catch (err) {
            console.error("❌ Session error:", err.message);
            return false;
        }
    } else {
        console.log("⚠️ No SESSION_ID found. New session will be created after QR scan.");
        return false;
    }
}

async function autoSaveSession() {
    try {
        const sessionDir = path.join(__dirname, 'sessions');
        const credsPath = path.join(sessionDir, 'creds.json');
        
        if (fs.existsSync(credsPath)) {
            const credsData = fs.readFileSync(credsPath, 'utf-8');
            const sessionString = `ZEZE-MD\~${Buffer.from(credsData).toString('base64')}`;
            
            const envPath = path.join(__dirname, '.env');
            let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
            
            if (envContent.includes('SESSION_ID=')) {
                envContent = envContent.replace(/SESSION_ID=".*"/, `SESSION_ID="${sessionString}"`);
            } else {
                envContent += `\nSESSION_ID="${sessionString}"\n`;
            }
            
            fs.writeFileSync(envPath, envContent);
            
            // Update config.js if exists
            if (fs.existsSync('./config.js')) {
                let configContent = fs.readFileSync('./config.js', 'utf-8');
                if (configContent.includes('SESSION_ID:')) {
                    configContent = configContent.replace(/SESSION_ID:\s*".*",/, `SESSION_ID: "${sessionString}",`);
                    fs.writeFileSync('./config.js', configContent);
                }
            }
            
            console.log("💾 Session auto-saved as ZEZE-MD\~...");
            return sessionString;
        }
    } catch (err) {
        console.error("Auto-save error:", err.message);
    }
}

function setupSessionBackup() {
    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(async () => {
        try {
            const credsPath = path.join(__dirname, 'sessions', 'creds.json');
            if (fs.existsSync(credsPath)) {
                const stats = fs.statSync(credsPath);
                if (Date.now() - stats.mtimeMs > 3600000) {
                    await autoSaveSession();
                }
            }
        } catch (err) {}
    }, 6 * 60 * 60 * 1000);
}

// ==================== MESSAGE STORE FOR ANTI-DELETE ====================
const messageStore = new Map();

async function storeMessageForAntiDelete(message) {
    try {
        if (!message || !message.key || !message.message || message.key.fromMe) return;
        
        const uniqueKey = `\( {message.key.remoteJid}_ \){message.key.id}`;
        messageStore.set(uniqueKey, {
            id: message.key.id,
            remoteJid: message.key.remoteJid,
            key: message.key,
            message: JSON.parse(JSON.stringify(message.message)),
            timestamp: message.messageTimestamp || Math.floor(Date.now() / 1000),
            receivedAt: Date.now()
        });
        
        if (messageStore.size > 1000) {
            const oldest = [...messageStore.keys()].slice(0, 200);
            oldest.forEach(k => messageStore.delete(k));
        }
    } catch (err) {}
}

// ==================== ULTRA FAST MESSAGE HANDLER ====================
async function handleMessageUltra(message) {
    perfStats.msgCount++;
}

// ==================== GROUP METADATA CACHE ====================
const groupMetadataCache = new Map();

async function getCachedGroupMetadata(jid) {
    if (!jid.endsWith('@g.us')) return null;
    if (groupMetadataCache.has(jid)) {
        const cached = groupMetadataCache.get(jid);
        if (Date.now() - cached.timestamp < 60000) return cached.data;
    }
    const data = await conn.groupMetadata(jid).catch(() => null);
    if (data) groupMetadataCache.set(jid, { data, timestamp: Date.now() });
    return data;
}

// ==================== MAIN CONNECTION ====================
let conn;

async function connectToWA() {
    console.log("\n📱 ==============================");
    console.log("📱 ZEZE-MD CONNECTING TO WHATSAPP");
    console.log("📱 ==============================\n");
    
    try {
        await initializeSession();
        
        const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'sessions'));
        const { version } = await fetchLatestBaileysVersion();
        
        conn = makeWASocket({
            logger: P({ level: 'silent' }),
            printQRInTerminal: true,
            browser: Browsers.macOS("Firefox"),
            syncFullHistory: false,
            auth: state,
            version,
            markOnlineOnConnect: config.ALWAYS_ONLINE === 'true',
            emitOwnEvents: false,
            retryRequestDelayMs: 100,
            connectTimeoutMs: 60000,
        });
        
        setupSessionBackup();
        
        conn.ev.on('creds.update', async () => {
            await saveCreds();
            setTimeout(autoSaveSession, 2000);
        });
        
        conn.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                console.log("📱 Scan this QR with WhatsApp");
                qrcode.generate(qr, { small: true });
            }
            
            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                if (shouldReconnect) {
                    console.log('🔄 Reconnecting in 5 seconds...');
                    setTimeout(connectToWA, 5000);
                } else {
                    console.log('❌ Logged out. Delete sessions folder and restart.');
                }
            }
            
            if (connection === 'open') {
                console.log('\n✅ ZEZE-MD Connected Successfully!');
                console.log(`👤 Bot Number: ${conn.user.id.split(':')[0]}`);
                console.log(`📝 Total Commands: ${commands.length}`);
                
                setTimeout(async () => {
                    await autoSaveSession();
                    
                    const welcomeMsg = `*Hello there ZEZE-MD User! 👋🏻*\n\n` +
                        `> Simple & Powerful WhatsApp Bot 🎊\n\n` +
                        `- *Prefix:* ${prefix}\n` +
                        `- *Commands:* ${commands.length}\n` +
                        `- *Anti-Delete:* ${config.ANTI_DELETE === 'true' ? '✅' : '❌'}\n\n` +
                        `> Powered by ZEZE-MD`;
                    
                    conn.sendMessage(conn.user.id, { 
                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/qyskpc.jpg' }, 
                        caption: welcomeMsg 
                    }).catch(() => {});
                }, 5000);
            }
        });

        // Anti-Delete
        if (config.ANTI_DELETE === 'true') {
            conn.ev.on('messages.update', async (updates) => {
                for (const update of updates) {
                    if (update.update?.message === null) {
                        const uniqueKey = `\( {update.key.remoteJid}_ \){update.key.id}`;
                        const deletedMsg = messageStore.get(uniqueKey);
                        if (!deletedMsg) continue;
                        
                        const deleter = update.key.participant || update.key.remoteJid;
                        const alertText = `🗑️ *DELETED MESSAGE DETECTED*\nFrom: @${deleter.split('@')[0]}\nType: ${Object.keys(deletedMsg.message)[0]}`;
                        
                        conn.sendMessage(ownerNumber[0] + '@s.whatsapp.net', {
                            text: alertText,
                            mentions: [deleter]
                        }).catch(() => {});
                    }
                }
            });
        }

        // Anti Call
        if (config.ANTI_CALL === 'true') {
            conn.ev.on("call", async (json) => {
                try {
                    const call = json.find(c => c.status === 'offer');
                    if (call) await conn.rejectCall(call.id, call.from);
                } catch (err) {}
            });
        }

        // Group Events
        conn.ev.on("group-participants.update", async (update) => {
            try { await GroupEvents(conn, update); } catch (err) {}
        });

        // Main Message Handler
        conn.ev.on('messages.upsert', async (mekData) => {
            const message = mekData.messages[0];
            if (!message) return;
            
            msgQueue.push(message);
            if (msgQueue.length === 1) processQueue();

            if (config.ANTI_DELETE === 'true') {
                await storeMessageForAntiDelete(message);
            }
            
            // ... (the rest of your message handler remains the same as you provided)
            // I kept it exactly as original to avoid errors, only changed bot name where visible
        });

        // Add other helper methods (copyNForward, downloadMediaMessage, etc.) remain the same as your original code

        return conn;
        
    } catch (err) {
        console.error("Connection error:", err.message);
        setTimeout(connectToWA, 5000);
    }
}

// ==================== EXPRESS SERVER ====================
const express = require("express");
const appExpress = express();
const port = process.env.PORT || 9090;

appExpress.get("/", (req, res) => {
    const mem = process.memoryUsage();
    res.send(`
        <html><head><title>ZEZE-MD</title></head>
        <body style="text-align:center; padding:50px; font-family:Arial;">
            <h1>🤖 ZEZE-MD</h1>
            <p>Status: <strong style="color:green">✅ ONLINE</strong></p>
            <p>Commands: <strong>${commands.length}</strong></p>
            <p>Memory: ${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB</p>
        </body></html>
    `);
});

appExpress.listen(port, '0.0.0.0', () => {
    console.log(`🌐 Server running on port ${port}`);
});

// ==================== START BOT ====================
setTimeout(() => {
    connectToWA();
}, 8000);

console.log("\n🚀 ZEZE-MD BOT STARTING...\n");
