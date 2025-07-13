#!/usr/bin/env node
/** @format */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isWatch = process.argv.includes('--watch');

/**
 * Google Apps Script用のesbuildプラグイン
 * - ES modulesをGoogle Apps Script形式に変換
 * - 関数のエクスポート処理
 */
const gasPlugin = {
  name: 'gas-plugin',
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length > 0) {return;}

      console.log('📦 TypeScript build completed');

      // Google Apps Script形式に変換
      convertToGasFormat();
    });
  }
};

/**
 * メインのビルド設定
 */
const buildConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'Code.gs',
  format: 'iife',
  target: 'es2019',
  platform: 'neutral',
  plugins: [gasPlugin],
  logLevel: 'info'
};

/**
 * Google Apps Script形式に変換
 */
function convertToGasFormat() {
  if (!fs.existsSync('Code.gs')) {
    console.error('❌ Code.gs not found');
    return;
  }

  let content = fs.readFileSync('Code.gs', 'utf8');

  // esbuildのIIFE形式をGoogle Apps Script形式に変換
  content = content
    // 先頭のIIFE開始を削除
    .replace(/^\(\(\) => \{\s*\n/m, '')
    // 末尾のIIFE終了を削除
    .replace(/\n\}\)\(\);?\s*$/m, '')
    // "use strict" を削除
    .replace(/^\s*"use strict";\s*\n/m, '')
    // var クラス宣言をclass宣言に変換
    .replace(/var (\w+) = class/g, 'class $1')
    // class文の末尾のセミコロンを削除
    .replace(/class (\w+) \{([^}]+)\};/g, 'class $1 {$2}')
    // 各行の先頭の2つのスペースを削除（IIFEのインデント除去）
    .replace(/^ {2}/gm, '')
    // 先頭にコメントを追加
    .replace(/^/, '// Google Apps Script Document Creator API\n// Generated from TypeScript sources\n\n');

  // ファイルを書き戻し
  fs.writeFileSync('Code.gs', content);
  console.log('✅ Code.gs converted to Google Apps Script format');
}

/**
 * ビルド実行
 */
async function runBuild() {
  try {
    if (isWatch) {
      console.log('👀 Starting TypeScript watch mode...');
      const context = await esbuild.context(buildConfig);
      await context.watch();
    } else {
      console.log('🔨 Building TypeScript files...');
      await esbuild.build(buildConfig);
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

runBuild();
