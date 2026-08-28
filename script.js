// =============================================
// 通用复制函数（带优雅提示反馈）
// =============================================
function copyText(elementId, successMsg) {
    const element = document.getElementById(elementId);
    const text = element.innerText.trim();
    const button = event.target.closest('.btn-copy'); // 获取点击的按钮

    if (!navigator.clipboard) {
        // 降级方案（针对非 HTTPS 或旧浏览器）
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

    // 现代 Clipboard API
    navigator.clipboard.writeText(text).then(() => {
        // 按钮闪烁反馈
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