// ============ PHISHING DETECTION LOGIC ============

let scanHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');

// Suspicious Patterns for detection
const suspiciousPatterns = [
    { pattern: /http:\/\//i, weight: 30, msg: "❌ HTTP protocol detected (No SSL Encryption)" },
    { pattern: /@/i, weight: 40, msg: "⚠️ '@' symbol in URL (Credential harvester pattern)" },
    { pattern: /-[a-z0-9]{5,}\./i, weight: 25, msg: "⚠️ Long dash suffix (Typosquatting suspect)" },
    { pattern: /\.(tk|ml|ga|cf|xyz|top|click|loan)$/i, weight: 35, msg: "⚠️ High-risk TLD (Top Level Domain)" },
    { pattern: /paypal|login|bank|secure|verify|signin/i, weight: 20, msg: "⚠️ Sensitive keyword in URL (Phishing bait)" },
    { pattern: /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, weight: 50, msg: "❌ IP Address instead of Domain (Malicious)" },
    { pattern: /bit\.ly|tinyurl|ow\.ly|short\.link/i, weight: 15, msg: "ℹ️ URL Shortener (Destination hidden)" }
];

// Safe domains whitelist
const safeDomains = [
    "google.com", "amazon.in", "amazon.com", "github.com", "microsoft.com", 
    "paypal.com", "facebook.com", "instagram.com", "linkedin.com", "youtube.com"
];

// Known phishing database
const phishingDatabase = [
    "paypal.com.verify-account.xyz",
    "google.com-security-alert.com",
    "netflix.com-update-billing.ru",
    "appleid.apple.com.secure-login.net"
];

// Get domain from URL
function getDomainFromUrl(url) {
    try {
        let hostname = new URL(url).hostname;
        return hostname.replace(/^www\./, '');
    } catch (e) {
        return url;
    }
}

// Main analysis function
function analyzeLink(url) {
    let score = 0;
    let flags = [];
    let domain = getDomainFromUrl(url);
    
    // Whitelist check
    let isSafeDomain = safeDomains.some(safe => domain === safe || domain.endsWith("." + safe));
    if (isSafeDomain && !domain.includes("-") && !domain.includes("verify")) {
        return { score: 5, flags: ["✅ Verified Safe Domain (Whitelist Match)"], isSafe: true };
    }
    
    // Phishing Database check
    let foundInDb = phishingDatabase.some(badUrl => url.toLowerCase().includes(badUrl));
    if (foundInDb) {
        score += 85;
        flags.push("🚨 CRITICAL: URL matches known Phishing Database (Threat Intel Feed)");
    }
    
    // Pattern matching
    for (let item of suspiciousPatterns) {
        if (item.pattern.test(url)) {
            score += item.weight;
            flags.push(item.msg);
        }
    }
    
    // Typosquatting detection
    const brands = ["google", "paypal", "facebook", "amazon", "microsoft", "apple"];
    for (let brand of brands) {
        let regex = new RegExp(brand + "([a-z0-9-]+)\\.", "i");
        if (regex.test(url) && !domain.includes(brand)) {
            score += 45;
            flags.push(`🚨 Typosquatting detected: Fake ${brand} domain`);
        }
    }
    
    // Long URL check
    if (url.length > 100) {
        score += 15;
        flags.push("📏 Unusually long URL (Obfuscation technique)");
    }
    
    score = Math.min(score, 100);
    let isSafe = score < 30;
    return { score: Math.floor(score), flags: [...new Set(flags)], isSafe: isSafe };
}

// Add to history
function addToHistory(url, score, status) {
    let historyItem = {
        url: url.substring(0, 50) + (url.length > 50 ? '...' : ''),
        fullUrl: url,
        score: score,
        status: status,
        timestamp: new Date().toLocaleString()
    };
    scanHistory.unshift(historyItem);
    if (scanHistory.length > 10) scanHistory.pop();
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
    displayHistory();
}

// Display history
function displayHistory() {
    const historyList = document.getElementById('historyList');
    
    if (scanHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-history">No scans yet. Analyze a URL to see history.</p>';
        return;
    }
    
    historyList.innerHTML = scanHistory.map(item => `
        <div class="history-item" style="border-left-color: ${item.score < 30 ? '#10b981' : item.score < 70 ? '#f59e0b' : '#ef4444'}" onclick="reanalyze('${item.fullUrl.replace(/'/g, "\\'")}')">
            <div class="history-url">
                <small>${item.timestamp}</small><br>
                <strong>${item.url}</strong>
            </div>
            <div class="history-score" style="background: ${item.score < 30 ? '#10b98120' : item.score < 70 ? '#f59e0b20' : '#ef444420'}; color: ${item.score < 30 ? '#10b981' : item.score < 70 ? '#f59e0b' : '#ef4444'}">
                Score: ${item.score}
            </div>
        </div>
    `).join('');
}

// Re-analyze from history
function reanalyze(url) {
    document.getElementById('urlInput').value = url;
    performAnalysis(url);
}

// Clear history
function clearHistory() {
    scanHistory = [];
    localStorage.removeItem('scanHistory');
    displayHistory();
}

// Copy report
function copyReport() {
    const reportText = `ShieldSecure Security Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Analysis ID: ${document.getElementById('analysisId').innerText}
URL: ${document.getElementById('scannedUrl').innerText}
Risk Score: ${document.getElementById('riskScore').innerText}/100
Status: ${document.getElementById('resultStatus').innerText}
Verdict: ${document.getElementById('verdictText').innerText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Powered by ShieldSecure - Advanced Phishing Detection`;
    
    navigator.clipboard.writeText(reportText);
    
    // Show temporary success
    const copyBtn = document.getElementById('copyReportBtn');
    const originalHtml = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
    }, 1500);
}

// Perform analysis
function performAnalysis(url) {
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    
    const result = analyzeLink(url);
    const resultCard = document.getElementById('resultCard');
    const riskFill = document.getElementById('riskFill');
    const riskScoreSpan = document.getElementById('riskScore');
    const scannedUrlSpan = document.getElementById('scannedUrl');
    const flagsContainer = document.getElementById('flagsList');
    const resultStatus = document.getElementById('resultStatus');
    const resultIcon = document.getElementById('resultIcon');
    const verdictText = document.getElementById('verdictText');
    
    // Generate Analysis ID
    const analysisId = "SSC-" + Math.random().toString(36).substr(2, 8).toUpperCase();
    document.getElementById('analysisId').innerText = analysisId;
    
    // Update UI
    scannedUrlSpan.innerText = url;
    riskScoreSpan.innerText = result.score;
    riskFill.style.width = result.score + "%";
    
    // Set color based on score
    if (result.score < 30) {
        riskFill.style.backgroundColor = "#10b981";
    } else if (result.score < 70) {
        riskFill.style.backgroundColor = "#f59e0b";
    } else {
        riskFill.style.backgroundColor = "#ef4444";
    }
    
    // Display flags
    if (result.flags.length === 0) {
        flagsContainer.innerHTML = "<i class='fas fa-check-circle'></i> No malicious patterns detected. Heuristics clear.";
    } else {
        flagsContainer.innerHTML = result.flags.map(f => `<div>${f}</div>`).join('');
    }
    
    // Set status and verdict
    let riskLabel, statusText, iconClass, borderColor;
    if (result.isSafe) {
        statusText = "APPROVED - SAFE";
        iconClass = "fas fa-check-circle";
        borderColor = "#10b981";
        riskLabel = "LOW RISK - Safe to browse";
    } else if (result.score < 70) {
        statusText = "SUSPICIOUS";
        iconClass = "fas fa-exclamation-triangle";
        borderColor = "#f59e0b";
        riskLabel = "MEDIUM RISK - Suspicious, do not enter credentials";
    } else {
        statusText = "MALICIOUS / PHISHING";
        iconClass = "fas fa-skull-crossbones";
        borderColor = "#ef4444";
        riskLabel = "CRITICAL RISK - Confirmed Phishing/Malicious";
    }
    
    resultStatus.innerText = statusText;
    resultIcon.className = iconClass;
    resultCard.style.borderLeftColor = borderColor;
    resultIcon.style.color = borderColor;
    resultStatus.style.color = borderColor;
    verdictText.innerHTML = `<strong>Final Verdict:</strong> ${riskLabel}`;
    
    // Show result card
    resultCard.classList.remove('hidden');
    
    // Save to history
    addToHistory(url, result.score, statusText);
    
    // Smooth scroll to result
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============ EVENT LISTENERS ============

// Analyze button click
document.getElementById('analyzeBtn').addEventListener('click', () => {
    let url = document.getElementById('urlInput').value.trim();
    if (!url) {
        alert("Please enter a valid URL");
        return;
    }
    performAnalysis(url);
});

// Example buttons
document.querySelectorAll('.ex-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        let sampleUrl = btn.getAttribute('data-url');
        document.getElementById('urlInput').value = sampleUrl;
        performAnalysis(sampleUrl);
    });
});

// Copy report button
document.getElementById('copyReportBtn').addEventListener('click', copyReport);

// Clear history button
document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);

// Load history on page load
displayHistory();