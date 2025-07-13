#!/usr/bin/env node

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
      if (result.errors.length > 0) return;
      
      console.log('📦 TypeScript build completed');
      
      // Code.gsファイルの生成
      generateCodeGS();
    });
  }
};

/**
 * メインのビルド設定
 */
const buildConfig = {
  entryPoints: [
    'src/documentService.ts',
    'src/responseHelper.ts', 
    'src/requestHandler.ts'
  ],
  bundle: false,
  outdir: 'dist',
  format: 'iife',
  target: 'es2019',
  platform: 'neutral',
  plugins: [gasPlugin],
  logLevel: 'info'
};

/**
 * Code.gsファイルを生成
 */
function generateCodeGS() {
  const distFiles = [
    'dist/documentService.js',
    'dist/responseHelper.js',
    'dist/requestHandler.js'
  ];
  
  let codeContent = `// Google Apps Script Document Creator API
// Generated from TypeScript sources

`;

  // 各ファイルの内容を結合してGoogle Apps Script形式に変換
  distFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // TypeScriptのコンパイル結果をGoogle Apps Script形式に変換
      let cleanContent = content
        // IIFE削除
        .replace(/^"use strict";\n\(\(\) => \{\n/, '')
        .replace(/\n\}\)\(\);?$/, '')
        // import文を削除（Google Apps Scriptでは不要）
        .replace(/^\s*var import_\w+ = require\(.*\);\n/gm, '')
        // import参照をクラス名に直接変更
        .replace(/import_\w+\./g, '')
        .trim();
      
      codeContent += cleanContent + '\n\n';
    }
  });

  // エントリーポイント関数を追加
  codeContent += `// Entry point functions for Google Apps Script
function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const action = request.action;
    
    switch (action) {
      case 'createDocument':
        return RequestHandler.handleCreateDocument(request);
      case 'updateDocument':
        return RequestHandler.handleUpdateDocument(request);
      case 'deleteDocument':
        return RequestHandler.handleDeleteDocument(request);
      default:
        return ResponseHelper.createErrorResponse(400, 'Invalid action');
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error);
    return ResponseHelper.createErrorResponse(500, 'Internal server error');
  }
}

function doGet(e) {
  return ResponseHelper.createSuccessResponse({
    message: 'Google Apps Script Document API',
    version: '1.0.0',
    endpoints: [
      'POST /exec - Main API endpoint'
    ]
  });
}
`;

  fs.writeFileSync('Code.gs', codeContent);
  console.log('✅ Code.gs generated successfully');
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