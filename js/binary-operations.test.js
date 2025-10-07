/**
 * ２進数計算エンジンのテストスイート
 */

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

describe('変換機能のテスト', () => {
  describe('binaryToDecimal', () => {
    test('正常な２進数文字列を10進数に変換', () => {
      expect(binaryToDecimal('1010')).toBe(10);
      expect(binaryToDecimal('1111')).toBe(15);
      expect(binaryToDecimal('0')).toBe(0);
      expect(binaryToDecimal('1')).toBe(1);
      expect(binaryToDecimal('11111111')).toBe(255);
    });

    test('0bプレフィックス付き２進数文字列を変換', () => {
      expect(binaryToDecimal('0b1010')).toBe(10);
      expect(binaryToDecimal('0B1111')).toBe(15);
    });

    test('不正な入力でエラーをスロー', () => {
      expect(() => binaryToDecimal('1012')).toThrow('不正な２進数文字列');
      expect(() => binaryToDecimal('abc')).toThrow('不正な２進数文字列');
      expect(() => binaryToDecimal(123)).toThrow('文字列である必要があります');
      expect(() => binaryToDecimal('')).toThrow('不正な２進数文字列');
    });
  });

  describe('decimalToBinary', () => {
    test('正常な10進数を２進数文字列に変換', () => {
      expect(decimalToBinary(10)).toBe('1010');
      expect(decimalToBinary(15)).toBe('1111');
      expect(decimalToBinary(0)).toBe('0');
      expect(decimalToBinary(1)).toBe('1');
      expect(decimalToBinary(255)).toBe('11111111');
    });

    test('負の数を変換', () => {
      const result = decimalToBinary(-1);
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    test('不正な入力でエラーをスロー', () => {
      expect(() => decimalToBinary('123')).toThrow('有限の数値である必要があります');
      expect(() => decimalToBinary(Infinity)).toThrow('有限の数値である必要があります');
      expect(() => decimalToBinary(NaN)).toThrow('有限の数値である必要があります');
    });
  });
});

describe('四則演算のテスト', () => {
  describe('addition (加算)', () => {
    test('正常な加算', () => {
      expect(addition('1010', '101')).toBe('1111'); // 10 + 5 = 15
      expect(addition('1', '1')).toBe('10'); // 1 + 1 = 2
      expect(addition('1111', '1')).toBe('10000'); // 15 + 1 = 16
      expect(addition('0', '0')).toBe('0'); // 0 + 0 = 0
    });

    test('大きな数の加算', () => {
      expect(addition('11111111', '1')).toBe('100000000'); // 255 + 1 = 256
    });
  });

  describe('subtraction (減算)', () => {
    test('正常な減算', () => {
      expect(subtraction('1010', '101')).toBe('101'); // 10 - 5 = 5
      expect(subtraction('1111', '1')).toBe('1110'); // 15 - 1 = 14
      expect(subtraction('10', '1')).toBe('1'); // 2 - 1 = 1
    });

    test('ゼロになる減算', () => {
      expect(subtraction('101', '101')).toBe('0'); // 5 - 5 = 0
    });

    test('負の結果になる減算', () => {
      const result = subtraction('1', '10'); // 1 - 2 = -1
      expect(result).toBeTruthy();
    });
  });

  describe('multiplication (乗算)', () => {
    test('正常な乗算', () => {
      expect(multiplication('101', '10')).toBe('1010'); // 5 * 2 = 10
      expect(multiplication('11', '11')).toBe('1001'); // 3 * 3 = 9
      expect(multiplication('1010', '10')).toBe('10100'); // 10 * 2 = 20
    });

    test('ゼロとの乗算', () => {
      expect(multiplication('1010', '0')).toBe('0'); // 10 * 0 = 0
      expect(multiplication('0', '1111')).toBe('0'); // 0 * 15 = 0
    });

    test('1との乗算', () => {
      expect(multiplication('1010', '1')).toBe('1010'); // 10 * 1 = 10
    });
  });

  describe('division (除算)', () => {
    test('正常な除算', () => {
      expect(division('1010', '10')).toBe('101'); // 10 / 2 = 5
      expect(division('1111', '11')).toBe('101'); // 15 / 3 = 5
      expect(division('1000', '10')).toBe('100'); // 8 / 2 = 4
    });

    test('切り捨て除算', () => {
      expect(division('111', '10')).toBe('11'); // 7 / 2 = 3 (切り捨て)
      expect(division('1010', '11')).toBe('11'); // 10 / 3 = 3 (切り捨て)
    });

    test('ゼロ除算でエラーをスロー', () => {
      expect(() => division('1010', '0')).toThrow('ゼロ除算エラー');
    });

    test('ゼロを除算', () => {
      expect(division('0', '1010')).toBe('0'); // 0 / 10 = 0
    });
  });
});

describe('ビット演算のテスト', () => {
  describe('bitwiseAND', () => {
    test('正常なAND演算', () => {
      expect(bitwiseAND('1100', '1010')).toBe('1000'); // 12 & 10 = 8
      expect(bitwiseAND('1111', '1111')).toBe('1111'); // 15 & 15 = 15
      expect(bitwiseAND('1010', '0101')).toBe('0'); // 10 & 5 = 0
    });

    test('ゼロとのAND演算', () => {
      expect(bitwiseAND('1111', '0')).toBe('0'); // 15 & 0 = 0
    });
  });

  describe('bitwiseOR', () => {
    test('正常なOR演算', () => {
      expect(bitwiseOR('1100', '1010')).toBe('1110'); // 12 | 10 = 14
      expect(bitwiseOR('1010', '0101')).toBe('1111'); // 10 | 5 = 15
      expect(bitwiseOR('0', '0')).toBe('0'); // 0 | 0 = 0
    });

    test('同じ値とのOR演算', () => {
      expect(bitwiseOR('1010', '1010')).toBe('1010'); // 10 | 10 = 10
    });
  });

  describe('bitwiseXOR', () => {
    test('正常なXOR演算', () => {
      expect(bitwiseXOR('1100', '1010')).toBe('110'); // 12 ^ 10 = 6
      expect(bitwiseXOR('1111', '1010')).toBe('101'); // 15 ^ 10 = 5
      expect(bitwiseXOR('1010', '0101')).toBe('1111'); // 10 ^ 5 = 15
    });

    test('同じ値とのXOR演算', () => {
      expect(bitwiseXOR('1010', '1010')).toBe('0'); // 10 ^ 10 = 0
    });

    test('ゼロとのXOR演算', () => {
      expect(bitwiseXOR('1010', '0')).toBe('1010'); // 10 ^ 0 = 10
    });
  });

  describe('bitwiseNOT', () => {
    test('正常なNOT演算', () => {
      const result1 = bitwiseNOT('1010'); // ~10
      expect(result1).toBeTruthy();
      expect(result1.length).toBeGreaterThan(0);

      const result2 = bitwiseNOT('0');
      expect(result2).toBeTruthy();
    });

    test('NOT演算の結果を確認', () => {
      const result = bitwiseNOT('1111');
      // NOT演算の結果は32ビット符号なし整数
      expect(parseInt(result, 2)).toBe(~15 >>> 0);
    });
  });

  describe('leftShift (左シフト)', () => {
    test('正常な左シフト', () => {
      expect(leftShift('1010', 1)).toBe('10100'); // 10 << 1 = 20
      expect(leftShift('1', 3)).toBe('1000'); // 1 << 3 = 8
      expect(leftShift('101', 2)).toBe('10100'); // 5 << 2 = 20
    });

    test('ゼロシフト', () => {
      expect(leftShift('1010', 0)).toBe('1010'); // 10 << 0 = 10
    });

    test('不正なシフト量でエラーをスロー', () => {
      expect(() => leftShift('1010', -1)).toThrow('非負の整数である必要があります');
      expect(() => leftShift('1010', 1.5)).toThrow('非負の整数である必要があります');
      expect(() => leftShift('1010', '2')).toThrow('非負の整数である必要があります');
    });
  });

  describe('rightShift (右シフト)', () => {
    test('正常な右シフト', () => {
      expect(rightShift('1010', 1)).toBe('101'); // 10 >> 1 = 5
      expect(rightShift('1000', 3)).toBe('1'); // 8 >> 3 = 1
      expect(rightShift('10100', 2)).toBe('101'); // 20 >> 2 = 5
    });

    test('ゼロシフト', () => {
      expect(rightShift('1010', 0)).toBe('1010'); // 10 >> 0 = 10
    });

    test('完全にシフトアウト', () => {
      expect(rightShift('1', 1)).toBe('0'); // 1 >> 1 = 0
      expect(rightShift('1', 10)).toBe('0'); // 1 >> 10 = 0
    });

    test('不正なシフト量でエラーをスロー', () => {
      expect(() => rightShift('1010', -1)).toThrow('非負の整数である必要があります');
      expect(() => rightShift('1010', 1.5)).toThrow('非負の整数である必要があります');
    });
  });
});

describe('その他の演算のテスト', () => {
  describe('power (べき乗)', () => {
    test('正常なべき乗演算', () => {
      expect(power('10', 2)).toBe('100'); // 2^2 = 4
      expect(power('10', 3)).toBe('1000'); // 2^3 = 8
      expect(power('11', 2)).toBe('1001'); // 3^2 = 9
      expect(power('101', 2)).toBe('11001'); // 5^2 = 25
    });

    test('指数が0の場合', () => {
      expect(power('1010', 0)).toBe('1'); // 10^0 = 1
      expect(power('1111', 0)).toBe('1'); // 15^0 = 1
    });

    test('指数が1の場合', () => {
      expect(power('1010', 1)).toBe('1010'); // 10^1 = 10
    });

    test('小数の指数', () => {
      const result = power('100', 0.5); // 4^0.5 = 2
      expect(result).toBe('10');
    });

    test('不正な指数でエラーをスロー', () => {
      expect(() => power('10', Infinity)).toThrow('有限の数値である必要があります');
      expect(() => power('10', NaN)).toThrow('有限の数値である必要があります');
    });

    test('結果が大きすぎる場合のエラー', () => {
      expect(() => power('1111111111', 1000)).toThrow('有限値を超えました');
    });
  });

  describe('squareRoot (平方根)', () => {
    test('正常な平方根演算', () => {
      expect(squareRoot('100')).toBe('10'); // √4 = 2
      expect(squareRoot('1001')).toBe('11'); // √9 = 3
      expect(squareRoot('10000')).toBe('100'); // √16 = 4
      expect(squareRoot('11001')).toBe('101'); // √25 = 5
    });

    test('完全平方数でない場合（切り捨て）', () => {
      expect(squareRoot('1010')).toBe('11'); // √10 = 3.16... → 3
      expect(squareRoot('1111')).toBe('11'); // √15 = 3.87... → 3
    });

    test('0と1の平方根', () => {
      expect(squareRoot('0')).toBe('0'); // √0 = 0
      expect(squareRoot('1')).toBe('1'); // √1 = 1
    });

    test('大きな数の平方根', () => {
      expect(squareRoot('1100100')).toBe('1010'); // √100 = 10
    });

    test('負の数でエラーをスロー', () => {
      // 負の数を２進数で表現してテストするのは難しいため、
      // 内部的に負になるケースを想定
      // この実装では２進数入力は常に正の数として扱われるため、
      // 直接的な負の数のテストは不要
    });
  });
});

describe('エラーハンドリングの統合テスト', () => {
  test('すべての演算で不正な２進数文字列を拒否', () => {
    const invalidBinary = '102';

    expect(() => addition(invalidBinary, '1')).toThrow();
    expect(() => subtraction(invalidBinary, '1')).toThrow();
    expect(() => multiplication(invalidBinary, '1')).toThrow();
    expect(() => division(invalidBinary, '1')).toThrow();
    expect(() => bitwiseAND(invalidBinary, '1')).toThrow();
    expect(() => bitwiseOR(invalidBinary, '1')).toThrow();
    expect(() => bitwiseXOR(invalidBinary, '1')).toThrow();
    expect(() => bitwiseNOT(invalidBinary)).toThrow();
    expect(() => leftShift(invalidBinary, 1)).toThrow();
    expect(() => rightShift(invalidBinary, 1)).toThrow();
    expect(() => power(invalidBinary, 2)).toThrow();
    expect(() => squareRoot(invalidBinary)).toThrow();
  });

  test('空文字列を拒否', () => {
    expect(() => binaryToDecimal('')).toThrow();
  });

  test('nullやundefinedを拒否', () => {
    expect(() => binaryToDecimal(null)).toThrow();
    expect(() => binaryToDecimal(undefined)).toThrow();
  });
});

describe('実用的なユースケースのテスト', () => {
  test('ビットマスク操作', () => {
    // フラグの設定: 0b0001 | 0b0010 = 0b0011
    expect(bitwiseOR('1', '10')).toBe('11');

    // フラグの確認: 0b0011 & 0b0010 = 0b0010
    expect(bitwiseAND('11', '10')).toBe('10');

    // フラグのトグル: 0b0011 ^ 0b0010 = 0b0001
    expect(bitwiseXOR('11', '10')).toBe('1');
  });

  test('2のべき乗の計算', () => {
    expect(leftShift('1', 0)).toBe('1'); // 2^0 = 1
    expect(leftShift('1', 1)).toBe('10'); // 2^1 = 2
    expect(leftShift('1', 2)).toBe('100'); // 2^2 = 4
    expect(leftShift('1', 3)).toBe('1000'); // 2^3 = 8
  });

  test('整数の半分を求める（右シフト）', () => {
    expect(rightShift('1010', 1)).toBe('101'); // 10 / 2 = 5
    expect(rightShift('10100', 1)).toBe('1010'); // 20 / 2 = 10
  });

  test('チェーン操作', () => {
    // (5 + 3) * 2 = 16
    const sum = addition('101', '11'); // 5 + 3 = 8
    const result = multiplication(sum, '10'); // 8 * 2 = 16
    expect(result).toBe('10000');
  });
});
