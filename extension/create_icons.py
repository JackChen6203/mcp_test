#!/usr/bin/env python3
"""
創建擴充功能圖示的簡單腳本
由於無法直接創建圖片檔案，這個腳本可以用來生成基本圖示
"""

import os

# 創建簡單的 SVG 圖示
svg_content = '''<?xml version="1.0" encoding="UTF-8"?>
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="20" fill="url(#grad1)"/>
  <rect x="20" y="30" width="88" height="68" rx="8" fill="white" opacity="0.9"/>
  <rect x="30" y="45" width="68" height="4" fill="#667eea"/>
  <rect x="30" y="55" width="68" height="4" fill="#667eea"/>
  <rect x="30" y="65" width="68" height="4" fill="#667eea"/>
  <rect x="30" y="75" width="40" height="4" fill="#667eea"/>
  <circle cx="90" cy="50" r="8" fill="#28a745"/>
  <path d="M86 50 L89 53 L94 47" stroke="white" stroke-width="2" fill="none"/>
</svg>'''

# 寫入 SVG 檔案
with open('/mnt/c/Users/solidityDeveloper/file-opener-app/extension/icons/icon.svg', 'w') as f:
    f.write(svg_content)

print("SVG 圖示已創建。")
print("請使用線上 SVG 轉 PNG 工具創建以下尺寸的 PNG 檔案：")
print("- icon16.png (16x16)")
print("- icon32.png (32x32)")
print("- icon48.png (48x48)")
print("- icon128.png (128x128)")