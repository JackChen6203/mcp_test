class FileOpener {
    constructor() {
        this.fileInput = document.getElementById('fileInput');
        this.openedFiles = document.getElementById('openedFiles');
        this.fileContent = document.getElementById('fileContent');
        this.clearBtn = document.getElementById('clearBtn');
        
        this.files = [];
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.clearBtn.addEventListener('click', () => this.clearAll());
        
        // 拖拽功能
        const dropArea = document.querySelector('.file-opener');
        dropArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        dropArea.addEventListener('drop', (e) => this.handleDrop(e));
    }
    
    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        files.forEach(file => this.openFile(file));
    }
    
    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
    }
    
    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const files = Array.from(event.dataTransfer.files);
        files.forEach(file => this.openFile(file));
    }
    
    openFile(file) {
        const fileInfo = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified),
            file: file
        };
        
        this.files.push(fileInfo);
        this.updateFileList();
        this.readFileContent(fileInfo);
    }
    
    readFileContent(fileInfo) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            fileInfo.content = e.target.result;
            this.displayFileContent(fileInfo);
        };
        
        // 根據檔案類型選擇讀取方式
        if (fileInfo.type.startsWith('text/') || 
            fileInfo.name.endsWith('.txt') ||
            fileInfo.name.endsWith('.js') ||
            fileInfo.name.endsWith('.html') ||
            fileInfo.name.endsWith('.css') ||
            fileInfo.name.endsWith('.json') ||
            fileInfo.name.endsWith('.md')) {
            reader.readAsText(fileInfo.file);
        } else if (fileInfo.type.startsWith('image/')) {
            reader.readAsDataURL(fileInfo.file);
        } else {
            reader.readAsText(fileInfo.file);
        }
    }
    
    updateFileList() {
        this.openedFiles.innerHTML = '';
        
        this.files.forEach((fileInfo, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-details">
                    <div class="file-name">${fileInfo.name}</div>
                    <div class="file-meta">
                        大小: ${this.formatFileSize(fileInfo.size)} | 
                        類型: ${fileInfo.type || '未知'} | 
                        修改時間: ${fileInfo.lastModified.toLocaleString()}
                    </div>
                </div>
                <div class="file-actions">
                    <button class="btn btn-sm view-btn" onclick="fileOpener.viewFile(${index})">檢視</button>
                    <button class="btn btn-sm remove-btn" onclick="fileOpener.removeFile(${index})">移除</button>
                </div>
            `;
            this.openedFiles.appendChild(fileItem);
        });
    }
    
    viewFile(index) {
        const fileInfo = this.files[index];
        this.displayFileContent(fileInfo);
    }
    
    displayFileContent(fileInfo) {
        let contentHtml = '';
        
        if (fileInfo.type.startsWith('image/')) {
            contentHtml = `
                <div class="content-header">
                    <h4>${fileInfo.name}</h4>
                </div>
                <div class="image-content">
                    <img src="${fileInfo.content}" alt="${fileInfo.name}" style="max-width: 100%; height: auto;">
                </div>
            `;
        } else if (fileInfo.type.startsWith('text/') || 
                   fileInfo.name.match(/\.(txt|js|html|css|json|md|xml)$/i)) {
            contentHtml = `
                <div class="content-header">
                    <h4>${fileInfo.name}</h4>
                </div>
                <div class="text-content">
                    <pre><code>${this.escapeHtml(fileInfo.content)}</code></pre>
                </div>
            `;
        } else {
            contentHtml = `
                <div class="content-header">
                    <h4>${fileInfo.name}</h4>
                </div>
                <div class="binary-content">
                    <p>此檔案為二進位格式，無法直接預覽。</p>
                    <p>檔案大小: ${this.formatFileSize(fileInfo.file.size)}</p>
                    <p>檔案類型: ${fileInfo.type || '未知'}</p>
                </div>
            `;
        }
        
        this.fileContent.innerHTML = contentHtml;
    }
    
    removeFile(index) {
        this.files.splice(index, 1);
        this.updateFileList();
        
        if (this.files.length === 0) {
            this.fileContent.innerHTML = '<p>請選擇一個檔案來檢視內容</p>';
        }
    }
    
    clearAll() {
        this.files = [];
        this.openedFiles.innerHTML = '<p>尚未開啟任何檔案</p>';
        this.fileContent.innerHTML = '<p>請選擇一個檔案來檢視內容</p>';
        this.fileInput.value = '';
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化檔案開啟器
const fileOpener = new FileOpener();

// 頁面載入完成後的初始化
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('openedFiles').innerHTML = '<p>尚未開啟任何檔案</p>';
    document.getElementById('fileContent').innerHTML = '<p>請選擇一個檔案來檢視內容</p>';
});