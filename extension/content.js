// 內容腳本 - 在網頁中注入檔案開啟功能

// 檢查是否為我們的檔案開啟器頁面
if (window.location.hostname.includes('jackchen6203.github.io') || 
    window.location.pathname.includes('mcp_test')) {
    
    // 注入檔案開啟按鈕
    injectFileOpenerButton();
}

function injectFileOpenerButton() {
    // 等待頁面載入完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addExtensionButton);
    } else {
        addExtensionButton();
    }
}

function addExtensionButton() {
    // 查找現有的開啟按鈕
    const existingButton = document.querySelector('.file-link, button[onclick*="open"]');
    
    if (existingButton) {
        // 創建擴充功能專用按鈕
        const extensionButton = document.createElement('button');
        extensionButton.innerHTML = '🔗 使用 Edge 擴充功能開啟';
        extensionButton.style.cssText = `
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(45deg, #0078d4, #106ebe);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin: 10px;
            transition: all 0.3s ease;
        `;
        
        extensionButton.addEventListener('mouseenter', () => {
            extensionButton.style.transform = 'translateY(-2px)';
            extensionButton.style.boxShadow = '0 4px 15px rgba(0, 120, 212, 0.4)';
        });
        
        extensionButton.addEventListener('mouseleave', () => {
            extensionButton.style.transform = 'translateY(0)';
            extensionButton.style.boxShadow = 'none';
        });
        
        extensionButton.addEventListener('click', () => {
            openFileWithExtension();
        });
        
        // 插入到現有按鈕附近
        existingButton.parentNode.insertBefore(extensionButton, existingButton.nextSibling);
        
        // 添加提示訊息
        const notice = document.createElement('div');
        notice.innerHTML = `
            <div style="margin: 20px 0; padding: 15px; background: #e1f5fe; border: 1px solid #b3e5fc; border-radius: 6px; font-size: 14px;">
                <strong>🔌 Edge 擴充功能模式</strong><br>
                此按鈕使用 Edge 擴充功能直接開啟本地檔案，無需下載額外檔案。
            </div>
        `;
        extensionButton.parentNode.insertBefore(notice, extensionButton.nextSibling);
    }
}

function openFileWithExtension() {
    // 發送訊息給背景腳本
    chrome.runtime.sendMessage({
        action: 'openFile',
        filePath: 'C:\\Users\\solidityDeveloper\\Documents\\2.docx'
    }, (response) => {
        if (response && response.success) {
            showNotification('檔案已成功開啟！', 'success');
        } else {
            showNotification('開啟失敗: ' + (response ? response.error : '請確認已安裝原生主機'), 'error');
        }
    });
}

function showNotification(message, type) {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        ${type === 'success' ? 
            'background: #4caf50; color: white;' : 
            'background: #f44336; color: white;'
        }
    `;
    
    document.body.appendChild(notification);
    
    // 3秒後移除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}