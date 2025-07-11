// 背景腳本處理原生訊息傳遞
chrome.runtime.onInstalled.addListener(() => {
    console.log('檔案開啟器擴充功能已安裝');
});

// 處理來自內容腳本的訊息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openFile') {
        openLocalFile(message.filePath)
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // 保持訊息通道開啟
    }
});

// 開啟本地檔案的函數
async function openLocalFile(filePath) {
    try {
        // 嘗試使用原生訊息主機
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendNativeMessage(
                'com.fileOpener.nativeHost',
                {
                    action: 'openFile',
                    filePath: filePath
                },
                (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                }
            );
        });
        
        return response;
    } catch (error) {
        console.error('開啟檔案失敗:', error);
        throw error;
    }
}

// 檢查原生主機是否可用
function checkNativeHost() {
    return new Promise((resolve) => {
        chrome.runtime.sendNativeMessage(
            'com.fileOpener.nativeHost',
            { action: 'ping' },
            (response) => {
                if (chrome.runtime.lastError) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        );
    });
}