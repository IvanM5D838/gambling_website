// --- 1. 配置與初始化 ---
const SYMBOLS = { WILD: '🌟', SCATTER: '⚡', HIGH: '🏛️', MID: '💰', LOW: 'A' };
const WEIGHTS = [
    { name: SYMBOLS.WILD, w: 10 },
    { name: SYMBOLS.SCATTER, w: 25 }, 
    { name: SYMBOLS.HIGH, w: 40 },
    { name: SYMBOLS.MID, w: 100 },
    { name: SYMBOLS.LOW, w: 600 }
];

let state = {
    balance: 10000,
    collectCount: 0,
    isFreeGame: false,
    freeSpinsLeft: 0,
    totalWinInFeature: 0
};

// --- 2. 核心機制 ---

// 隨機選取符號
function getRandomSymbol() {
    let total = WEIGHTS.reduce((sum, s) => sum + s.w, 0);
    let r = Math.random() * total;
    for (let s of WEIGHTS) {
        if (r < s.w) return s.name;
        r -= s.w;
    }
}

// 處理旋轉點擊
document.getElementById('spin-btn').addEventListener('click', () => {
    if (state.balance < 100) return alert("餘額不足！");
    handleSpin();
});

function handleSpin() {
    const lines = parseInt(document.getElementById('line-input').value);
    const betPerLine = parseInt(document.getElementById('bet-input').value);
    const totalBet = lines * betPerLine;

    state.balance -= totalBet;
    updateUI();

    // 生成結果
    let result = [];
    for(let i=0; i<5; i++) {
        let reel = [];
        for(let j=0; j<3; j++) reel.push(getRandomSymbol());
        result.push(reel);
    }

    // 模擬捲動動畫 (簡化版)
    renderReels(result);

    // 順序：先給錢 -> 後收集
    let winAmount = checkWins(result, lines, betPerLine);
    state.balance += winAmount;
    
    // 結算後延遲收集閃電
    setTimeout(() => {
        processCollection(result);
        updateUI();
    }, 1000);
}

// 判定連線與給錢
function checkWins(result, activeLines, betPerLine) {
    let winTotal = 0;
    // 這裡會實作連線判定邏輯...
    // 假設簡易判定：第一排有三個相同
    if(result[0][0] === result[1][0] && result[1][0] === result[2][0]) {
        winTotal = betPerLine * 10;
    }
    
    if(winTotal > 0) {
        document.getElementById('message-display').innerText = `恭喜中獎: ${winTotal}!`;
    }
    return winTotal;
}

// 處理收集與轉場
function processCollection(result) {
    let scatters = result.flat().filter(s => s === SYMBOLS.SCATTER).length;
    state.collectCount += scatters;

    if (state.collectCount >= 30 && !state.isFreeGame) {
        triggerFreeGame();
    }
}

function triggerFreeGame() {
    state.isFreeGame = true;
    state.collectCount = 0;
    document.getElementById('game-screen').classList.add('olympus-peak-theme');
    document.getElementById('message-display').innerText = "神殿升空！進入免費遊戲！";
    // 這裡會接續 Free Spin 邏輯與 5 倍傳說祝福判定
}

function updateUI() {
    document.getElementById('balance').innerText = state.balance;
    document.getElementById('stat-collect').innerText = state.collectCount;
    document.getElementById('progress-bar').style.width = (state.collectCount / 30 * 100) + '%';
}

// 初始化盤面
function renderReels(result) {
    const container = document.getElementById('reels-container');
    container.innerHTML = '';
    result.forEach(reelData => {
        let reelDiv = document.createElement('div');
        reelDiv.className = 'reel';
        reelData.forEach(symbol => {
            let symDiv = document.createElement('div');
            symDiv.className = 'symbol';
            symDiv.innerText = symbol;
            reelDiv.appendChild(symDiv);
        });
        container.appendChild(reelDiv);
    });
}