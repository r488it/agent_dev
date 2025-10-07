/**
 * ２進数計算エンジン
 * 各種演算と変換機能を提供するモジュール
 * @module binary-operations
 */

/**
 * ２進数文字列を10進数に変換
 * @param {string} binary - ２進数文字列（例: "1010"）
 * @returns {number} 10進数の値
 * @throws {Error} 不正な２進数文字列の場合
 */
function binaryToDecimal(binary) {
  if (typeof binary !== 'string') {
    throw new Error('入力は文字列である必要があります');
  }

  const cleaned = binary.replace(/^0b/i, '').trim();

  if (!/^[01]+$/.test(cleaned)) {
    throw new Error('不正な２進数文字列です。0と1のみを含む必要があります');
  }

  return parseInt(cleaned, 2);
}

/**
 * 10進数を２進数文字列に変換
 * @param {number} decimal - 10進数の値
 * @returns {string} ２進数文字列
 * @throws {Error} 不正な入力値の場合
 */
function decimalToBinary(decimal) {
  if (typeof decimal !== 'number' || !isFinite(decimal)) {
    throw new Error('入力は有限の数値である必要があります');
  }

  if (decimal < 0) {
    // 負の数の場合は符号付き32ビット表現を使用
    return (decimal >>> 0).toString(2);
  }

  return decimal.toString(2);
}

/**
 * ２進数の加算
 * @param {string} binary1 - ２進数文字列
 * @param {string} binary2 - ２進数文字列
 * @returns {string} 加算結果の２進数文字列
 * @throws {Error} 不正な入力値の場合
 */
function addition(binary1, binary2) {
  const num1 = binaryToDecimal(binary1);
  const num2 = binaryToDecimal(binary2);
  const result = num1 + num2;
  return decimalToBinary(result);
}

/**
 * ２進数の減算
 * @param {string} binary1 - ２進数文字列（被減数）
 * @param {string} binary2 - ２進数文字列（減数）
 * @returns {string} 減算結果の２進数文字列
 * @throws {Error} 不正な入力値の場合
 */
function subtraction(binary1, binary2) {
  const num1 = binaryToDecimal(binary1);
  const num2 = binaryToDecimal(binary2);
  const result = num1 - num2;
  return decimalToBinary(result);
}

/**
 * ２進数の乗算
 * @param {string} binary1 - ２進数文字列
 * @param {string} binary2 - ２進数文字列
 * @returns {string} 乗算結果の２進数文字列
 * @throws {Error} 不正な入力値の場合
 */
function multiplication(binary1, binary2) {
  const num1 = binaryToDecimal(binary1);
  const num2 = binaryToDecimal(binary2);
  const result = num1 * num2;
  return decimalToBinary(result);
}

/**
 * ２進数の除算
 * @param {string} binary1 - ２進数文字列（被除数）
 * @param {string} binary2 - ２進数文字列（除数）
 * @returns {string} 除算結果の２進数文字列（整数部分）
 * @throws {Error} 不正な入力値またはゼロ除算の場合
 */
function division(binary1, binary2) {
  const num1 = binaryToDecimal(binary1);
  const num2 = binaryToDecimal(binary2);

  if (num2 === 0) {
    throw new Error('ゼロ除算エラー: ０で割ることはできません');
  }

  const result = Math.floor(num1 / num2);
  return decimalToBinary(result);
}

/**
 * ２進数のAND演算
 * @param {string} binary1 - ２進数文字列
 * @param {string} binary2 - ２進数文字列
 * @returns {string} AND演算結果の２進数文字列
 * @throws {Error} 不正な入力値の場合
 */
function bitwiseAND(binary1, binary2) {
  const num1 = binaryToDecimal(binary1);
  const num2 = binaryToDecimal(binary2);
  const result = num1 & num2;
  return decimalToBinary(result);
}

/**
 * ２進数のOR演算
 * @param {string} binary1 - ２進数文字列
 * @param {string} binary2 - ２進数文字列
 * @returns {string} OR演算結果の２進数文字列
 * @throws {Error} 不正な入力値の場合
 */
function bitwiseOR(binary1, binary2) {
  const num1 = binaryToDecimal(binary1);
  const num2 = binaryToDecimal(binary2);
  const result = num1 | num2;
  return decimalToBinary(result);
}

/**
 * ２進数のXOR演算
 * @param {string} binary1 - ２進数文字列
 * @param {string} binary2 - ２進数文字列
 * @returns {string} XOR演算結果の２進数文字列
 * @throws {Error} 不正な入力値の場合
 */
function bitwiseXOR(binary1, binary2) {
  const num1 = binaryToDecimal(binary1);
  const num2 = binaryToDecimal(binary2);
  const result = num1 ^ num2;
  return decimalToBinary(result);
}

/**
 * ２進数のNOT演算（32ビット）
 * @param {string} binary - ２進数文字列
 * @returns {string} NOT演算結果の２進数文字列
 * @throws {Error} 不正な入力値の場合
 */
function bitwiseNOT(binary) {
  const num = binaryToDecimal(binary);
  const result = ~num;
  return decimalToBinary(result >>> 0); // 符号なし32ビット整数として返す
}

/**
 * ２進数の左シフト演算
 * @param {string} binary - ２進数文字列
 * @param {number} shift - シフト量
 * @returns {string} 左シフト結果の２進数文字列
 * @throws {Error} 不正な入力値の場合
 */
function leftShift(binary, shift) {
  if (typeof shift !== 'number' || shift < 0 || !Number.isInteger(shift)) {
    throw new Error('シフト量は非負の整数である必要があります');
  }

  const num = binaryToDecimal(binary);
  const result = num << shift;
  return decimalToBinary(result);
}

/**
 * ２進数の右シフト演算
 * @param {string} binary - ２進数文字列
 * @param {number} shift - シフト量
 * @returns {string} 右シフト結果の２進数文字列
 * @throws {Error} 不正な入力値の場合
 */
function rightShift(binary, shift) {
  if (typeof shift !== 'number' || shift < 0 || !Number.isInteger(shift)) {
    throw new Error('シフト量は非負の整数である必要があります');
  }

  const num = binaryToDecimal(binary);
  const result = num >> shift;
  return decimalToBinary(result);
}

/**
 * ２進数のべき乗演算
 * @param {string} binary - ２進数文字列（基数）
 * @param {number} exponent - 指数
 * @returns {string} べき乗結果の２進数文字列
 * @throws {Error} 不正な入力値の場合
 */
function power(binary, exponent) {
  if (typeof exponent !== 'number' || !isFinite(exponent)) {
    throw new Error('指数は有限の数値である必要があります');
  }

  const base = binaryToDecimal(binary);
  const result = Math.pow(base, exponent);

  if (!isFinite(result)) {
    throw new Error('計算結果が有限値を超えました');
  }

  return decimalToBinary(Math.floor(result));
}

/**
 * ２進数の平方根演算
 * @param {string} binary - ２進数文字列
 * @returns {string} 平方根の２進数文字列（整数部分）
 * @throws {Error} 不正な入力値または負の数の場合
 */
function squareRoot(binary) {
  const num = binaryToDecimal(binary);

  if (num < 0) {
    throw new Error('負の数の平方根は計算できません');
  }

  const result = Math.sqrt(num);
  return decimalToBinary(Math.floor(result));
}

// エクスポート
module.exports = {
  // 変換機能
  binaryToDecimal,
  decimalToBinary,

  // 四則演算
  addition,
  subtraction,
  multiplication,
  division,

  // ビット演算
  bitwiseAND,
  bitwiseOR,
  bitwiseXOR,
  bitwiseNOT,
  leftShift,
  rightShift,

  // その他の演算
  power,
  squareRoot
};
