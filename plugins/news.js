const { cmd } = require('../command');
const Esana = require('@sl-code-lords/esana-news');
const axios = require('axios');
const config = require('../config');

let activeGroups = {};
let lastNewsTitles = {};

// MP4 short looping videos with gif effect
const gifStyleVideos = [
    "https://files.catbox.moe/405y67.mp4",
    "https://files.catbox.moe/eslg4p.mp4",
    "https://files.catbox.moe/9x8k2l.mp4",
    "https://files.catbox.moe/h3d9f2.mp4"
];

function getRandomGifVideo() {
    return gifStyleVideos[Math.floor(Math.random() * gifStyleVideos.length)];
}

// Enhanced logging function
function logWithTime(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
}

// Fetch news from your API with enhanced error handling
async function fetchNewsFromAPI() {
    try {
        logWithTime('🔄 Starting API news fetch...');
        
        const response = await axios.get('https://nethu-api.vercel.app/news', {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache'
            }
        });
        
        logWithTime(`📡 API Response - Status: ${response.status}, Type: ${typeof response.data}`);
        
        if (!response.data) {
            logWithTime('⚠️ API returned empty data', 'WARN');
            return [];
        }
        
        // Log the structure for debugging
        logWithTime(`📊 API Response Structure: ${JSON.stringify(response.data, null, 2).substring(0, 500)}...`);
        
        let newsArray = [];
        
        // Enhanced response parsing
        function parseNewsItem(item, index = 0) {
            if (!item) return null;
            
            const title = item.title || item.headline || item.name || item.subject || `Breaking News #${index + 1}`;
            const content = item.description || item.content || item.summary || item.text || item.body || 'Full details available at source.';
            const date = item.date || item.publishedAt || item.published_at || item.time || item.timestamp || new Date().toLocaleDateString();
            const url = item.url || item.link || item.href || item.source_url || '';
            const source = (item.source && item.source.name) || item.source || item.publisher || item.author || 'News Source';
            
            // Clean content
            const cleanContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            const cleanTitle = title.replace(/<[^>]*>/g, '').trim();
            
            return {
                title: cleanTitle,
                content: cleanContent.length > 300 ? cleanContent.substring(0, 300) + '...' : cleanContent,
                date: typeof date === 'string' ? date : new Date(date).toLocaleDateString(),
                source: 'NEWS D API',
                url: url
            };
        }
        
        // Handle different response structures
        if (Array.isArray(response.data)) {
            logWithTime(`📋 Processing direct array with ${response.data.length} items`);
            response.data.forEach((item, index) => {
                const parsed = parseNewsItem(item, index);
                if (parsed && (parsed.title !== `Breaking News #${index + 1}` || parsed.content !== 'Full details available at source.')) {
                    newsArray.push(parsed);
                }
            });
        }
        else if (response.data && typeof response.data === 'object') {
            // Try different possible array fields
            const possibleArrayFields = ['results', 'data', 'articles', 'news', 'items', 'posts', 'content', 'feed'];
            
            let found = false;
            for (const field of possibleArrayFields) {
                if (response.data[field] && Array.isArray(response.data[field])) {
                    logWithTime(`📋 Processing ${field} array with ${response.data[field].length} items`);
                    response.data[field].forEach((item, index) => {
                        const parsed = parseNewsItem(item, index);
                        if (parsed && (parsed.title !== `Breaking News #${index + 1}` || parsed.content !== 'Full details available at source.')) {
                            newsArray.push(parsed);
                        }
                    });
                    found = true;
                    break;
                }
            }
            
            // If no array found, check if the object itself is a single news item
            if (!found && (response.data.title || response.data.headline)) {
                logWithTime('📋 Processing single news object');
                const parsed = parseNewsItem(response.data);
                if (parsed) {
                    newsArray.push(parsed);
                }
            }
        }
        
        logWithTime(`✅ API extracted ${newsArray.length} valid news items`);
        return newsArray.slice(0, 10); // Limit to 10 items
        
    } catch (error) {
        logWithTime(`❌ API fetch error: ${error.message}`, 'ERROR');
        if (error.response) {
            logWithTime(`📡 API Error Response: Status ${error.response.status} - ${error.response.statusText}`, 'ERROR');
        }
        return [];
    }
}

// Fetch news from Esana with enhanced error handling
async function fetchEsanaNews() {
    try {
        logWithTime('🔄 Starting Esana news fetch...');
        
        const esanaApi = new Esana();
        
        // Log available methods for debugging
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(esanaApi));
        logWithTime(`📊 Esana available methods: ${methods.join(', ')}`);
        
        let esanaNews = null;
        const tryMethods = [
            'getLatestNews',
            'getNews', 
            'latest',
            'breakingNews',
            'topHeadlines',
            'getAllNews',
            'fetchNews'
        ];
        
        for (const method of tryMethods) {
            if (typeof esanaApi[method] === 'function') {
                try {
                    logWithTime(`🔄 Trying Esana.${method}()...`);
                    esanaNews = await Promise.race([
                        esanaApi[method](),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
                    ]);
                    
                    if (esanaNews) {
                        logWithTime(`✅ Esana.${method}() returned data`);
                        break;
                    }
                } catch (methodError) {
                    logWithTime(`❌ Esana.${method}() failed: ${methodError.message}`, 'WARN');
                    continue;
                }
            }
        }
        
        if (!esanaNews) {
            logWithTime('⚠️ No data from any Esana method', 'WARN');
            return [];
        }
        
        logWithTime(`📊 Esana Response Type: ${typeof esanaNews}, IsArray: ${Array.isArray(esanaNews)}`);
        
        let newsArray = [];
        
        function parseEsanaItem(item, index = 0) {
            if (!item) return null;
            
            const title = item.title || item.headline || item.name || `Lanka News #${index + 1}`;
            const content = item.description || item.content || item.summary || item.text || 'Read more at source link.';
            const date = item.publishedAt || item.date || item.time || new Date().toLocaleDateString();
            const url = item.url || item.link || '';
            
            return {
                title: title.replace(/<[^>]*>/g, '').trim(),
                content: content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 300),
                date: typeof date === 'string' ? date : new Date(date).toLocaleDateString(),
                source: 'Esana News',
                url: url
            };
        }
        
        if (Array.isArray(esanaNews)) {
            esanaNews.forEach((item, index) => {
                const parsed = parseEsanaItem(item, index);
                if (parsed && parsed.title !== `Lanka News #${index + 1}`) {
                    newsArray.push(parsed);
                }
            });
        }
        else if (esanaNews && typeof esanaNews === 'object') {
            if (esanaNews.results && Array.isArray(esanaNews.results)) {
                esanaNews.results.forEach((item, index) => {
                    const parsed = parseEsanaItem(item, index);
                    if (parsed && parsed.title !== `Lanka News #${index + 1}`) {
                        newsArray.push(parsed);
                    }
                });
            }
            else if (esanaNews.title || esanaNews.headline) {
                const parsed = parseEsanaItem(esanaNews);
                if (parsed) {
                    newsArray.push(parsed);
                }
            }
        }
        
        logWithTime(`✅ Esana extracted ${newsArray.length} valid news items`);
        return newsArray.slice(0, 8); // Limit to 8 items
        
    } catch (error) {
        logWithTime(`❌ Esana fetch error: ${error.message}`, 'ERROR');
        return [];
    }
}

// Get all latest news with enhanced fallback system
async function getLatestNews() {
    logWithTime('🚀 Starting comprehensive news fetch...');
    
    let allNews = [];
    let sources = [];

    // Step 1: Try your API first (priority)
    try {
        const apiNews = await fetchNewsFromAPI();
        if (apiNews.length > 0) {
            allNews = [...apiNews];
            sources.push(`API (${apiNews.length} items)`);
            logWithTime(`✅ API returned ${apiNews.length} news items`);
        }
    } catch (error) {
        logWithTime(`❌ API completely failed: ${error.message}`, 'ERROR');
    }

    // Step 2: Try Esana if API didn't provide enough news
    if (allNews.length < 3) {
        try {
            logWithTime('🔄 API returned insufficient news, trying Esana...');
            const esanaNews = await fetchEsanaNews();
            if (esanaNews.length > 0) {
                // Combine and deduplicate
                const combined = [...allNews, ...esanaNews];
                allNews = combined.filter((news, index, self) => 
                    index === self.findIndex(n => 
                        n.title.toLowerCase().trim() === news.title.toLowerCase().trim()
                    )
                );
                sources.push(`Esana (${esanaNews.length} items)`);
                logWithTime(`✅ Combined news: ${allNews.length} unique items`);
            }
        } catch (error) {
            logWithTime(`❌ Esana completely failed: ${error.message}`, 'ERROR');
        }
    }

    // Step 3: Create fallback news if still insufficient
    if (allNews.length === 0) {
        logWithTime('🔄 No news from any source, creating fallback content...');
        
        const fallbackNews = [
            {
                title: "🔴 NEWS D - Service Status Update",
                content: "NEWS D automated news service is active and monitoring multiple Sri Lankan news sources. Fresh news updates will be posted as soon as they become available from our trusted news providers.",
                date: new Date().toLocaleDateString('en-GB', { 
                    timeZone: 'Asia/Colombo',
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric'
                }),
                source: 'NEWS D System',
                url: ''
            },
            {
                title: "📡 Real-time News Monitoring Active",
                content: "Our system continuously scans leading Sri Lankan news sources including major newspapers, TV channels, and digital news platforms to bring you the latest updates automatically.",
                date: new Date().toLocaleDateString('en-GB', { 
                    timeZone: 'Asia/Colombo',
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric'
                }),
                source: 'NEWS D Network',
                url: ''
            },
            {
                title: "⚡ Instant News Delivery System",
                content: "NEWS D ensures you never miss important breaking news. The system automatically posts verified news from trusted sources directly to your group with real-time updates.",
                date: new Date().toLocaleDateString('en-GB', { 
                    timeZone: 'Asia/Colombo',
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric'
                }),
                source: 'NEWS D Hub',
                url: ''
            }
        ];
        
        allNews = fallbackNews;
        sources.push('Fallback System (3 items)');
        logWithTime('✅ Created fallback news content');
    }

    // Remove duplicates and limit results
    const uniqueNews = allNews.filter((news, index, self) => 
        index === self.findIndex(n => n.title.toLowerCase().trim() === news.title.toLowerCase().trim())
    ).slice(0, 12);

    logWithTime(`🎯 Final result: ${uniqueNews.length} unique news items from sources: ${sources.join(', ')}`);
    return uniqueNews;
}

// Enhanced news posting with better error handling
async function checkAndPostNews(conn, groupId) {
    try {
        logWithTime(`🔍 Starting news check for group: ${groupId.substring(0, 20)}...`);
        
        const latestNews = await getLatestNews();

        if (latestNews.length === 0) {
            logWithTime('❌ No news data available after all attempts', 'ERROR');
            return;
        }

        logWithTime(`📰 Processing ${latestNews.length} news items for posting`);

        // Initialize group tracking if needed
        if (!lastNewsTitles[groupId]) {
            lastNewsTitles[groupId] = [];
        }

        let newPostCount = 0;

        for (const newsItem of latestNews) {
            try {
                // Check if this news was already posted
                if (!lastNewsTitles[groupId].includes(newsItem.title)) {
                    logWithTime(`📤 Posting new news: ${newsItem.title.substring(0, 50)}...`);
                    
                    const gifVideo = getRandomGifVideo();
                    
                    // Enhanced NEWS D Caption format
                    const caption = `*🔴 𝐍𝐄𝐖𝐒 𝐃*\n▁ ▂ ▄ ▅ ▆ ▇ █ [  ] █ ▇ ▆ ▅ ▄ ▂ ▁\n\n📰 *${newsItem.title}*\n\n${newsItem.content}\n\n📅 *Date:* ${newsItem.date}\n🔗 *Source:* ${newsItem.source}\n${newsItem.url ? `🌐 *Link:* ${newsItem.url}\n` : ''}\n> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ᴅɪɴᴇꜱʜ ᴏꜰᴄ*\n> *QUEEN-SADU-MD & D-XTRO-MD*`;

                    let messageSent = false;

                    // Try to send with video first
                    try {
                        await conn.sendMessage(groupId, {
                            video: { url: gifVideo },
                            caption,
                            mimetype: "video/mp4",
                            gifPlayback: true
                        });

                        logWithTime(`✅ News video sent successfully to group`);
                        messageSent = true;

                    } catch (videoError) {
                        logWithTime(`⚠️ Video send failed: ${videoError.message}`, 'WARN');
                        
                        // Fallback: Send as text message with emoji
                        try {
                            const textMessage = `*🔴 𝐍𝐄𝐖𝐒 𝐃* 📰\n\n*${newsItem.title}*\n\n${newsItem.content}\n\n📅 *Date:* ${newsItem.date}\n🔗 *Source:* ${newsItem.source}\n${newsItem.url ? `🌐 *Link:* ${newsItem.url}\n` : ''}\n> *QUEEN-SADU-MD & D-XTRO-MD*`;
                            
                            await conn.sendMessage(groupId, { text: textMessage });
                            logWithTime(`✅ News text sent successfully to group`);
                            messageSent = true;
                            
                        } catch (textError) {
                            logWithTime(`❌ Text send also failed: ${textError.message}`, 'ERROR');
                        }
                    }

                    if (messageSent) {
                        // Store the title to prevent duplicates
                        lastNewsTitles[groupId].push(newsItem.title);
                        newPostCount++;
                        
                        // Keep only last 50 titles to prevent memory issues
                        if (lastNewsTitles[groupId].length > 50) {
                            lastNewsTitles[groupId] = lastNewsTitles[groupId].slice(-30);
                        }

                        // Add delay between messages to avoid spam/rate limits
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                } else {
                    logWithTime(`⏭️ Skipping duplicate news: ${newsItem.title.substring(0, 50)}...`);
                }
            } catch (itemError) {
                logWithTime(`❌ Error processing news item: ${itemError.message}`, 'ERROR');
                continue;
            }
        }

        logWithTime(`🎯 Posted ${newPostCount} new news items to group`);

    } catch (error) {
        logWithTime(`💥 Critical error in checkAndPostNews: ${error.message}`, 'ERROR');
        console.error('Full error stack:', error.stack);
        
        // Try to send error notification to group
        try {
            await conn.sendMessage(groupId, { 
                text: `⚠️ *NEWS D Service Alert*\n\nTemporary technical issue detected. Our team is working to resolve it. Normal news updates will resume shortly.\n\n> QUEEN-SADU-MD & D-XTRO-MD`
            });
        } catch (notifyError) {
            logWithTime(`❌ Could not send error notification: ${notifyError.message}`, 'ERROR');
        }
    }
}

// Start news command with enhanced features
cmd({
    pattern: "startnews",
    desc: "Enable Sri Lankan news updates in this group",
    isGroup: true,
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, participants }) => {
    try {
        if (!isGroup) {
            return await conn.sendMessage(from, { text: "❌ This command can only be used in groups." });
        }

        // Check admin permissions
        const isAdmin = participants.some(p => p.id === mek.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
        const isBotOwner = mek.sender === conn.user.jid;

        if (!isAdmin && !isBotOwner) {
            return await conn.sendMessage(from, { text: "🚫 Only group admins or bot owner can use this command." });
        }

        if (activeGroups[from]) {
            return await conn.sendMessage(from, { 
                text: "*✅ NEWS D Already Active!*\n\n🔴 Auto news updates are already running in this group.\n📊 Status: Active\n⏱️ Check interval: Every 2 minutes\n📱 Total active groups: " + Object.keys(activeGroups).filter(key => key !== 'interval').length + "\n\n> QUEEN-SADU-MD & D-XTRO-MD" 
            });
        }

        // Activate news for this group
        activeGroups[from] = true;
        logWithTime(`📢 NEWS D activated for group: ${from.substring(0, 20)}...`);

        await conn.sendMessage(from, { 
            text: "🇱🇰 *NEWS D Activated Successfully!* ✅\n\n🔴 *Service:* Sri Lankan News Updates\n⏱️ *Interval:* Every 2 minutes\n📡 *Sources:* Multiple verified news APIs\n🎯 *Content:* Breaking news, headlines, updates\n📱 *Format:* Video + Text with links\n\n🚀 *First news will arrive in 10 seconds...*\n\n> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ᴅɪɴᴇꜱʜ ᴏꜰᴄ*\n> QUEEN-SADU-MD & D-XTRO-MD" 
        });

        // Start the global interval if it's not already running
        if (!activeGroups['interval']) {
            logWithTime('🚀 Starting NEWS D global interval service...');
            
            activeGroups['interval'] = setInterval(async () => {
                const activeGroupIds = Object.keys(activeGroups).filter(key => key !== 'interval');
                logWithTime(`⏰ Running NEWS D interval check for ${activeGroupIds.length} active groups...`);
                
                for (const groupId of activeGroupIds) {
                    if (activeGroups[groupId]) {
                        logWithTime(`📊 Processing news for group: ${groupId.substring(0, 20)}...`);
                        await checkAndPostNews(conn, groupId);
                        
                        // Add delay between groups to prevent rate limiting
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
            }, 120000); // Check every 2 minutes (120000ms)
            
            logWithTime('✅ NEWS D global interval started successfully');
        }

        // Send first news immediately after 10 seconds
        setTimeout(async () => {
            logWithTime('📤 Sending initial news to new group...');
            await checkAndPostNews(conn, from);
        }, 10000);

    } catch (e) {
        logWithTime(`💥 Error in startnews command: ${e.message}`, 'ERROR');
        await conn.sendMessage(from, { 
            text: "❌ *Failed to activate NEWS D*\n\nTechnical error occurred. Please try again in a moment.\n\n> QUEEN-SADU-MD & D-XTRO-MD" 
        });
    }
});

// Stop news command
cmd({
    pattern: "stopnews",
    desc: "Disable Sri Lankan news updates in this group",
    isGroup: true,
    react: "🛑",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, participants }) => {
    try {
        if (!isGroup) {
            return await conn.sendMessage(from, { text: "❌ This command can only be used in groups." });
        }

        const isAdmin = participants.some(p => p.id === mek.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
        const isBotOwner = mek.sender === conn.user.jid;

        if (!isAdmin && !isBotOwner) {
            return await conn.sendMessage(from, { text: "🚫 Only group admins or bot owner can use this command." });
        }

        if (!activeGroups[from]) {
            return await conn.sendMessage(from, { text: "⚠️ NEWS D is not active in this group." });
        }

        // Deactivate news for this group
        delete activeGroups[from];
        delete lastNewsTitles[from];
        logWithTime(`🛑 NEWS D deactivated for group: ${from.substring(0, 20)}...`);
        
        await conn.sendMessage(from, { 
            text: "*🛑 NEWS D Disabled*\n\n❌ Automatic news updates have been stopped for this group.\n📊 You can reactivate anytime with *.startnews*\n\n> QUEEN-SADU-MD & D-XTRO-MD" 
        });

        // Stop the global interval if no groups are active
        const activeGroupCount = Object.keys(activeGroups).filter(key => key !== 'interval').length;
        if (activeGroupCount === 0 && activeGroups['interval']) {
            logWithTime('⏹️ No active groups remaining, stopping NEWS D interval...');
            clearInterval(activeGroups['interval']);
            delete activeGroups['interval'];
            logWithTime('✅ NEWS D global interval stopped');
        }

    } catch (e) {
        logWithTime(`💥 Error in stopnews command: ${e.message}`, 'ERROR');
        await conn.sendMessage(from, { text: "❌ Failed to deactivate NEWS D service." });
    }
});

// Manual news check command
cmd({
    pattern: "getnews",
    desc: "Manually check and post latest news",
    isGroup: true,
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, participants }) => {
    try {
        if (!isGroup) return;

        const isAdmin = participants.some(p => p.id === mek.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
        const isBotOwner = mek.sender === conn.user.jid;

        if (!isAdmin && !isBotOwner) {
            return await conn.sendMessage(from, { text: "🚫 Only group admins or bot owner can use this command." });
        }

        await conn.sendMessage(from, { text: "🔍 *NEWS D Manual Check*\n\n⏳ Scanning all news sources...\nPlease wait while we fetch the latest updates..." });
        
        logWithTime(`🔍 Manual news check requested for group: ${from.substring(0, 20)}...`);
        await checkAndPostNews(conn, from);
        
    } catch (e) {
        logWithTime(`💥 Error in getnews command: ${e.message}`, 'ERROR');
        await conn.sendMessage(from, { text: "❌ Failed to fetch latest news. Please try again." });
    }
});

// Enhanced status command
cmd({
    pattern: "newsstatus",
    desc: "Check NEWS D comprehensive status",
    react: "📊",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const activeCount = Object.keys(activeGroups).filter(key => key !== 'interval').length;
        const intervalStatus = activeGroups['interval'] ? '🟢 Running' : '🔴 Stopped';
        const uptime = activeGroups['interval'] ? 'Active' : 'Inactive';
        
        // Get memory usage of tracking data
        const totalTrackedTitles = Object.values(lastNewsTitles).reduce((sum, titles) => sum + titles.length, 0);
        
        const statusMsg = `*📊 NEWS D Complete Status Report*\n\n` +
                         `🔴 *Service Status:* ${intervalStatus}\n` +
                         `👥 *Active Groups:* ${activeCount}\n` +
                         `⏱️ *Check Interval:* 2 minutes\n` +
                         `📰 *News Sources:* API + Esana + Fallback\n` +
                         `🗃️ *Tracked Headlines:* ${totalTrackedTitles}\n` +
                         `💾 *System Uptime:* ${uptime}\n` +
                         `🔄 *Auto-refresh:* Enabled\n` +
                         `📡 *Network Status:* Connected\n\n` +
                         `*🛠️ Commands Available:*\n` +
                         `• *.startnews* - Activate service\n` +
                         `• *.stopnews* - Deactivate service\n` +
                         `• *.getnews* - Manual refresh\n` +
                         `• *.newsstatus* - This status\n\n` +
                         `> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ZEZE TECH*\n` +
                         `> ZEZE-MD & ZEZE TECH`;
        
        await conn.sendMessage(from, { text: statusMsg });
        logWithTime(`📊 Status requested - Active groups: ${activeCount}, Interval: ${intervalStatus}`);
        
    } catch (e) {
        logWithTime(`💥 Error in newsstatus command: ${e.message}`, 'ERROR');
        await conn.sendMessage(from, { text: "❌ Unable to fetch status information." });
    }
});

// Export for external use
module.exports = { 
    activeGroups, 
    lastNewsTitles, 
    getLatestNews,
    checkAndPostNews,
    fetchNewsFromAPI,
    fetchEsanaNews
};
