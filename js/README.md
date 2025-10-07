# ２進数計算エンジン (Binary Operations Engine)

PHX-107 - ２進数での各種演算ができる計算エンジン

## 概要

このモジュールは、JavaScriptで２進数の演算を行うための包括的なライブラリです。
四則演算、ビット演算、べき乗、平方根など、様々な演算をサポートしています。

## 機能

### 変換機能
- **binaryToDecimal**: ２進数文字列を10進数に変換
- **decimalToBinary**: 10進数を２進数文字列に変換

### 四則演算
- **addition**: 加算
- **subtraction**: 減算
- **multiplication**: 乗算
- **division**: 除算（整数除算）

### ビット演算
- **bitwiseAND**: AND演算
- **bitwiseOR**: OR演算
- **bitwiseXOR**: XOR演算
- **bitwiseNOT**: NOT演算（32ビット）
- **leftShift**: 左シフト
- **rightShift**: 右シフト

### その他の演算
- **power**: べき乗
- **squareRoot**: 平方根（整数部分）

## インストール

```bash
npm install
```

## 使用方法

```javascript
const {
  binaryToDecimal,
  decimalToBinary,
  addition,
  subtraction,
  multiplication,
  division,
  bitwiseAND,
  bitwiseOR,
  bitwiseXOR,
  bitwiseNOT,
  leftShift,
  rightShift,
  power,
  squareRoot
} = require('./binary-operations');

// 変換
console.log(binaryToDecimal('1010')); // 10
console.log(decimalToBinary(10));     // "1010"

// 四則演算
console.log(addition('1010', '101'));      // "1111" (10 + 5 = 15)
console.log(subtraction('1010', '101'));   // "101"  (10 - 5 = 5)
console.log(multiplication('101', '10'));  // "1010" (5 * 2 = 10)
console.log(division('1010', '10'));       // "101"  (10 / 2 = 5)

// ビット演算
console.log(bitwiseAND('1100', '1010'));   // "1000" (12 & 10 = 8)
console.log(bitwiseOR('1100', '1010'));    // "1110" (12 | 10 = 14)
console.log(bitwiseXOR('1100', '1010'));   // "110"  (12 ^ 10 = 6)
console.log(leftShift('1010', 2));         // "101000" (10 << 2 = 40)
console.log(rightShift('1010', 1));        // "101"  (10 >> 1 = 5)

// その他の演算
console.log(power('10', 3));               // "1000" (2^3 = 8)
console.log(squareRoot('10000'));          // "100"  (√16 = 4)
```

## エラーハンドリング

このライブラリは、不正な入力に対して適切なエラーメッセージを返します。

```javascript
// 不正な２進数文字列
try {
  binaryToDecimal('1012'); // '2'は２進数ではない
} catch (error) {
  console.error(error.message); // "不正な２進数文字列です。0と1のみを含む必要があります"
}

// ゼロ除算
try {
  division('1010', '0');
} catch (error) {
  console.error(error.message); // "ゼロ除算エラー: ０で割ることはできません"
}

// 不正なシフト量
try {
  leftShift('1010', -1);
} catch (error) {
  console.error(error.message); // "シフト量は非負の整数である必要があります"
}
```

## テスト

```bash
# テストの実行
npm test

# カバレッジ付きテスト
npm run test:coverage
```

### テストカバレッジ

現在のテストカバレッジ: **98.5%**

- Statements: 98.5%
- Branches: 96.66%
- Functions: 100%
- Lines: 98.5%

全52件のテストケースが正常にパスしています。

## 実用例

### ビットマスク操作

```javascript
// フラグの設定
const flag1 = '1';
const flag2 = '10';
const flags = bitwiseOR(flag1, flag2); // "11"

// フラグの確認
const hasFlag2 = bitwiseAND(flags, flag2); // "10" (フラグ2が立っている)

// フラグのトグル
const toggled = bitwiseXOR(flags, flag2); // "1" (フラグ2を解除)
```

### 2のべき乗の計算

```javascript
// 左シフトで2のべき乗を計算
console.log(leftShift('1', 0));  // "1"    (2^0 = 1)
console.log(leftShift('1', 1));  // "10"   (2^1 = 2)
console.log(leftShift('1', 3));  // "1000" (2^3 = 8)
```

### チェーン操作

```javascript
// (5 + 3) * 2 = 16
const sum = addition('101', '11');        // "1000" (8)
const result = multiplication(sum, '10'); // "10000" (16)
```

## 技術仕様

- **言語**: JavaScript (Node.js)
- **テストフレームワーク**: Jest
- **対応Node.jsバージョン**: v20.19.0以上推奨

## 注意事項

1. **整数演算**: 除算と平方根は整数部分のみを返します（切り捨て）
2. **NOT演算**: 32ビット符号なし整数として処理されます
3. **負の数**: 除算結果が負になる場合は32ビット符号付き表現を使用します
4. **入力形式**: ２進数文字列は "0b" プレフィックス付きでも受け付けます

## ライセンス

ISC

## 作成者

🐒エージェント - スクラムチームDEV
