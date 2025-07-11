document.addEventListener('DOMContentLoaded', function() {
    const openBtn = document.getElementById('openBtn');
    const downloadHost = document.getElementById('downloadHost');
    const status = document.getElementById('status');
    
    // 檢查原生主機是否已安裝
    checkNativeHost();
    
    openBtn.addEventListener('click', function() {
        openWordFile();
    });
    
    downloadHost.addEventListener('click', function() {
        downloadNativeHost();
    });
    
    function openWordFile() {
        showStatus('正在嘗試開啟檔案...', 'info');
        openBtn.disabled = true;
        
        // 使用原生訊息傳遞
        chrome.runtime.sendNativeMessage(
            'com.fileOpener.nativeHost',
            {
                action: 'openFile',
                filePath: 'C:\\Users\\solidityDeveloper\\Documents\\2.docx'
            },
            function(response) {
                openBtn.disabled = false;
                
                if (chrome.runtime.lastError) {
                    console.error('原生主機錯誤:', chrome.runtime.lastError);
                    showStatus('無法連接到原生主機。請先安裝原生主機程式。', 'error');
                    return;
                }
                
                if (response && response.success) {
                    showStatus('檔案已成功開啟！', 'success');
                } else {
                    showStatus('開啟檔案失敗: ' + (response ? response.error : '未知錯誤'), 'error');
                }
            }
        );
    }
    
    function checkNativeHost() {
        chrome.runtime.sendNativeMessage(
            'com.fileOpener.nativeHost',
            { action: 'ping' },
            function(response) {
                if (chrome.runtime.lastError) {
                    showStatus('原生主機未安裝。請先下載並安裝。', 'error');
                    openBtn.disabled = true;
                } else {
                    showStatus('原生主機已就緒，可以開啟檔案。', 'success');
                    openBtn.disabled = false;
                }
            }
        );
    }
    
    function downloadNativeHost() {
        // 創建原生主機安裝程式
        const batchContent = `@echo off
echo 正在安裝原生訊息主機...

:: 創建原生主機目錄
mkdir "%LOCALAPPDATA%\\FileOpener" 2>nul

:: 創建原生主機執行檔
echo @echo off > "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat"
echo setlocal EnableDelayedExpansion >> "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat"
echo set /p input= >> "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat"
echo for /f "tokens=*" %%%%i in ('echo !input! ^| findstr "openFile"') do ( >> "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat"
echo   for /f "tokens=2 delims=:" %%%%j in ('echo !input! ^| findstr "filePath"') do ( >> "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat"
echo     set filepath=%%%%j >> "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat"
echo     set filepath=!filepath:~1,-1! >> "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat"
echo     start "" "!filepath!" >> "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat"
echo     echo {"success": true} >> "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat"
echo     goto :end >> "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat"
echo   ^) >> "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat"
echo ^) >> "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat"
echo echo {"success": false, "error": "Invalid command"} >> "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat"
echo :end >> "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat"

:: 註冊到 Windows 登錄檔
reg add "HKEY_CURRENT_USER\\Software\\Microsoft\\Edge\\NativeMessagingHosts\\com.fileOpener.nativeHost" /ve /t REG_SZ /d "%LOCALAPPDATA%\\FileOpener\\manifest.json" /f

:: 創建 manifest.json
echo { > "%LOCALAPPDATA%\\FileOpener\\manifest.json"
echo   "name": "com.fileOpener.nativeHost", >> "%LOCALAPPDATA%\\FileOpener\\manifest.json"
echo   "description": "File Opener Native Host", >> "%LOCALAPPDATA%\\FileOpener\\manifest.json"
echo   "path": "%LOCALAPPDATA%\\FileOpener\\file_opener_host.bat", >> "%LOCALAPPDATA%\\FileOpener\\manifest.json"
echo   "type": "stdio", >> "%LOCALAPPDATA%\\FileOpener\\manifest.json"
echo   "allowed_origins": [ >> "%LOCALAPPDATA%\\FileOpener\\manifest.json"
echo     "extension://YOUR_EXTENSION_ID/" >> "%LOCALAPPDATA%\\FileOpener\\manifest.json"
echo   ] >> "%LOCALAPPDATA%\\FileOpener\\manifest.json"
echo } >> "%LOCALAPPDATA%\\FileOpener\\manifest.json"

echo 原生主機安裝完成！
echo 請重新載入 Edge 擴充功能。
pause`;

        const blob = new Blob([batchContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'install_native_host.bat';
        a.click();
        URL.revokeObjectURL(url);
        
        showStatus('安裝程式已下載。請以管理員身分執行。', 'info');
    }
    
    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        status.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                status.style.display = 'none';
            }, 3000);
        }
    }
});