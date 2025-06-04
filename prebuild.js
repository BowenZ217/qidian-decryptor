#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const assetFile = path.join(__dirname, '4819793b.qeooxh.js');
const assetUrl = 'https://cococdn.qidian.com/coco/s12062024/4819793b.qeooxh.js';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log('资源文件已存在，跳过下载');
      return resolve();
    }

    console.log(`正在下载资源: ${url}`);
    const file = fs.createWriteStream(dest);

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`状态码错误: ${res.statusCode}`));
      }

      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('资源下载完成');
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

downloadFile(assetUrl, assetFile)
  .catch((err) => {
    console.error('下载失败:', err.message);
    process.exit(1);
  });
