// =============================================
// 通用复制函数
// =============================================
function copyText(elementId, successMsg) {
    const element = document.getElementById(elementId);
    const text = element.innerText.trim();
    const button = event.target.closest('.btn-copy');

    if (!navigator.clipboard) {
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        try {
            document.execCommand('copy');
            alert(successMsg || '✅ 已复制！');
        } catch (err) {
            alert('❌ 复制失败，请手动复制：' + text);
        }
        document.body.removeChild(input);
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        if (button) {
            button.classList.add('copied');
            button.textContent = '✅ 已复制';
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = '📋 复制';
            }, 1800);
        } else {
            alert(successMsg || '✅ 已复制！');
        }
    }).catch(() => {
        alert('❌ 复制失败，请手动复制：' + text);
    });
}

// =============================================
// MC服务器状态查询（固定IP，自动查询）
// =============================================
const panel = document.getElementById('status-panel');

async function queryServer() {
    const ipInput = document.getElementById('serverIp');
    let ip = ipInput.value.trim();

    if (!ip || ip.length < 3) {
        panel.innerHTML = `<div class="error-text">⚠️ 请输入有效的服务器地址</div>`;
        return;
    }

    panel.innerHTML = `
        <div class="status-badge status-loading">⏳ 查询中...</div>
        <div style="color: #8a8a5a; font-size: 13px;">正在连接服务器...</div>
    `;

    try {
        const url = `https://api.mcsrvstat.us/2/${encodeURIComponent(ip)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP 错误 ${response.status}`);
        const data = await response.json();

        if (data.online === true) {
            const onlineCount = data.players?.online ?? 0;
            const maxCount = data.players?.max ?? '?';
            let motdText = '暂无欢迎语';
            if (data.motd) {
                if (typeof data.motd.clean === 'string') motdText = data.motd.clean;
                else if (Array.isArray(data.motd.clean)) motdText = data.motd.clean.join(' ');
            }

            panel.innerHTML = `
                <div class="status-badge status-online">✅ 服务器在线</div>
                <div class="player-count">${onlineCount} <span>/ ${maxCount}</span></div>
                <div style="color: #6a8a6a; font-size: 12px;">✦ 当前在线人数 ✦</div>
                <div class="motd-text">📢 ${motdText}</div>
            `;
        } else {
            panel.innerHTML = `
                <div class="status-badge status-offline">❌ 服务器离线</div>
                <div style="color: #aa7777; font-size: 13px; margin-top: 4px;">服务器未响应，请检查IP是否正确</div>
            `;
        }
    } catch (error) {
        panel.innerHTML = `
            <div class="status-badge status-offline">⚠️ 请求失败</div>
            <div class="error-text" style="font-size: 13px; margin-top: 4px;">${error.message || '网络异常，请稍后重试'}</div>
        `;
    }
}

// =============================================
// 页面加载完成后自动查询MC服务器状态
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    queryServer();
});