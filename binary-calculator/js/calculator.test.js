/**
 * CalculatorEngine - ２進数計算機の計算エンジンのテスト
 * PHX-108: 計算機本体ロジック実装テスト
 */

// Node.js環境用にCalculatorEngineをインポート
const CalculatorEngine = require('./calculator.js');

describe('CalculatorEngine', () => {
    let calc;

    beforeEach(() => {
        calc = new CalculatorEngine();
    });

    describe('初期化とリセット', () => {
        test('初期状態が正しく設定される', () => {
            const state = calc.getState();
            expect(state.state).toBe(CalculatorEngine.STATE.INPUT);
            expect(state.currentValue).toBe('0');
            expect(state.previousValue).toBe(null);
            expect(state.operator).toBe(null);
            expect(state.hasError).toBe(false);
            expect(state.isNewInput).toBe(true);
        });

        test('reset()で状態がリセットされる', () => {
            calc.inputDigit('1');
            calc.inputOperator('+');
            calc.inputDigit('1');
            calc.reset();

            const state = calc.getState();
            expect(state.currentValue).toBe('0');
            expect(state.operator).toBe(null);
            expect(state.previousValue).toBe(null);
        });

        test('clear()で状態がクリアされる', () => {
            calc.inputDigit('1');
            calc.inputDigit('0');
            calc.clear();

            const state = calc.getState();
            expect(state.currentValue).toBe('0');
        });
    });

    describe('数値入力', () => {
        test('0を入力できる', () => {
            const state = calc.inputDigit('0');
            expect(state.currentValue).toBe('0');
            expect(state.hasError).toBe(false);
        });

        test('1を入力できる', () => {
            const state = calc.inputDigit('1');
            expect(state.currentValue).toBe('1');
            expect(state.hasError).toBe(false);
        });

        test('複数桁の入力（101）', () => {
            calc.inputDigit('1');
            calc.inputDigit('0');
            const state = calc.inputDigit('1');
            expect(state.currentValue).toBe('101');
            expect(state.decimalValue).toBe(5);
        });

        test('先頭の0が除去される', () => {
            calc.inputDigit('0');
            calc.inputDigit('0');
            const state = calc.inputDigit('1');
            expect(state.currentValue).toBe('1');
        });

        test('無効な入力（2）がエラーになる', () => {
            const state = calc.inputDigit('2');
            expect(state.hasError).toBe(true);
            expect(state.errorMessage).toContain('０と1のみ');
        });

        test('32ビット制限を超える入力がエラーになる', () => {
            // 33ビットの入力を試みる
            for (let i = 0; i < 33; i++) {
                calc.inputDigit('1');
            }
            const state = calc.getState();
            expect(state.hasError).toBe(true);
            expect(state.errorMessage).toContain('大きすぎます');
        });
    });

    describe('演算子入力', () => {
        test('加算演算子が入力できる', () => {
            calc.inputDigit('1');
            calc.inputDigit('0');
            const state = calc.inputOperator('+');
            expect(state.operator).toBe('+');
            expect(state.previousValue).toBe('10');
            expect(state.state).toBe(CalculatorEngine.STATE.OPERATOR);
        });

        test('減算演算子が入力できる', () => {
            calc.inputDigit('1');
            calc.inputDigit('1');
            const state = calc.inputOperator('-');
            expect(state.operator).toBe('-');
            expect(state.previousValue).toBe('11');
        });

        test('乗算演算子が入力できる', () => {
            calc.inputDigit('1');
            calc.inputDigit('0');
            const state = calc.inputOperator('*');
            expect(state.operator).toBe('*');
        });

        test('除算演算子が入力できる', () => {
            calc.inputDigit('1');
            calc.inputDigit('0');
            calc.inputDigit('0');
            const state = calc.inputOperator('/');
            expect(state.operator).toBe('/');
        });

        test('無効な演算子がエラーになる', () => {
            calc.inputDigit('1');
            const state = calc.inputOperator('%');
            expect(state.hasError).toBe(true);
        });
    });

    describe('加算', () => {
        test('基本的な加算（11 + 10 = 101）', () => {
            calc.inputDigit('1');
            calc.inputDigit('1'); // 11 (3)
            calc.inputOperator('+');
            calc.inputDigit('1');
            calc.inputDigit('0'); // 10 (2)
            const state = calc.calculate();
            expect(state.currentValue).toBe('101'); // 5
            expect(state.decimalValue).toBe(5);
            expect(state.hasError).toBe(false);
        });

        test('オーバーフローエラー', () => {
            // 最大値に近い値を設定
            calc.currentValue = '11111111111111111111111111111111'; // 32ビット最大値
            calc.operator = '+';
            calc.previousValue = '1';
            const state = calc.calculate();
            expect(state.hasError).toBe(true);
            expect(state.errorMessage).toContain('大きすぎます');
        });
    });

    describe('減算', () => {
        test('基本的な減算（11 - 10 = 1）', () => {
            calc.inputDigit('1');
            calc.inputDigit('1'); // 11 (3)
            calc.inputOperator('-');
            calc.inputDigit('1');
            calc.inputDigit('0'); // 10 (2)
            const state = calc.calculate();
            expect(state.currentValue).toBe('1'); // 1
            expect(state.decimalValue).toBe(1);
        });

        test('負の数エラー（10 - 11）', () => {
            calc.inputDigit('1');
            calc.inputDigit('0'); // 10 (2)
            calc.inputOperator('-');
            calc.inputDigit('1');
            calc.inputDigit('1'); // 11 (3)
            const state = calc.calculate();
            expect(state.hasError).toBe(true);
            expect(state.errorMessage).toContain('負の数');
        });
    });

    describe('乗算', () => {
        test('基本的な乗算（11 * 10 = 110）', () => {
            calc.inputDigit('1');
            calc.inputDigit('1'); // 11 (3)
            calc.inputOperator('*');
            calc.inputDigit('1');
            calc.inputDigit('0'); // 10 (2)
            const state = calc.calculate();
            expect(state.currentValue).toBe('110'); // 6
            expect(state.decimalValue).toBe(6);
        });

        test('乗算オーバーフローエラー', () => {
            calc.currentValue = '1111111111111111'; // 大きな値
            calc.operator = '*';
            calc.previousValue = '111111111111111111'; // 大きな値
            const state = calc.calculate();
            expect(state.hasError).toBe(true);
        });
    });

    describe('除算', () => {
        test('基本的な除算（110 / 10 = 11）', () => {
            calc.inputDigit('1');
            calc.inputDigit('1');
            calc.inputDigit('0'); // 110 (6)
            calc.inputOperator('/');
            calc.inputDigit('1');
            calc.inputDigit('0'); // 10 (2)
            const state = calc.calculate();
            expect(state.currentValue).toBe('11'); // 3
            expect(state.decimalValue).toBe(3);
        });

        test('整数除算（111 / 10 = 11）', () => {
            calc.inputDigit('1');
            calc.inputDigit('1');
            calc.inputDigit('1'); // 111 (7)
            calc.inputOperator('/');
            calc.inputDigit('1');
            calc.inputDigit('0'); // 10 (2)
            const state = calc.calculate();
            expect(state.currentValue).toBe('11'); // 3 (7 / 2 = 3.5 → 3)
        });

        test('ゼロ除算エラー', () => {
            calc.inputDigit('1');
            calc.inputDigit('0');
            calc.inputDigit('0'); // 100 (4)
            calc.inputOperator('/');
            calc.inputDigit('0'); // 0
            const state = calc.calculate();
            expect(state.hasError).toBe(true);
            expect(state.errorMessage).toContain('ゼロで除算');
        });
    });

    describe('連続計算', () => {
        test('連続計算（10 + 11 = 101, 101 * 10 = 1010）', () => {
            calc.inputDigit('1');
            calc.inputDigit('0'); // 10 (2)
            calc.inputOperator('+');
            calc.inputDigit('1');
            calc.inputDigit('1'); // 11 (3)
            calc.inputOperator('*'); // = 101 (5), then *
            calc.inputDigit('1');
            calc.inputDigit('0'); // 10 (2)
            const state = calc.calculate();
            expect(state.currentValue).toBe('1010'); // 10
            expect(state.decimalValue).toBe(10);
        });
    });

    describe('バックスペース', () => {
        test('最後の桁を削除（101 → 10）', () => {
            calc.inputDigit('1');
            calc.inputDigit('0');
            calc.inputDigit('1');
            const state = calc.backspace();
            expect(state.currentValue).toBe('10');
        });

        test('1桁まで削除すると0になる', () => {
            calc.inputDigit('1');
            calc.backspace();
            const state = calc.getState();
            expect(state.currentValue).toBe('0');
        });

        test('新規入力状態ではバックスペース無効', () => {
            calc.inputDigit('1');
            calc.inputOperator('+');
            const state = calc.backspace();
            expect(state.currentValue).toBe('1');
        });
    });

    describe('計算履歴', () => {
        test('計算履歴が保存される', () => {
            calc.inputDigit('1');
            calc.inputDigit('1');
            calc.inputOperator('+');
            calc.inputDigit('1');
            calc.inputDigit('0');
            calc.calculate();

            const history = calc.getHistory();
            expect(history.length).toBe(1);
            expect(history[0]).toContain('11 + 10 = 101');
        });

        test('複数の計算履歴が保存される', () => {
            // 1回目の計算
            calc.inputDigit('1');
            calc.inputOperator('+');
            calc.inputDigit('1');
            calc.calculate();

            // 2回目の計算
            calc.inputOperator('*');
            calc.inputDigit('1');
            calc.inputDigit('0');
            calc.calculate();

            const history = calc.getHistory();
            expect(history.length).toBe(2);
        });
    });

    describe('エラーハンドリング', () => {
        test('エラー後に数値入力するとリセットされる', () => {
            calc.inputDigit('2'); // エラー
            expect(calc.getState().hasError).toBe(true);

            calc.inputDigit('1'); // リセットされる
            const state = calc.getState();
            expect(state.hasError).toBe(false);
            expect(state.currentValue).toBe('1');
        });

        test('エラー状態で演算子入力は無視される', () => {
            calc.inputDigit('2'); // エラー
            const state = calc.inputOperator('+');
            expect(state.hasError).toBe(true);
        });
    });

    describe('状態管理', () => {
        test('状態遷移: INPUT → OPERATOR → INPUT → RESULT', () => {
            // INPUT状態
            calc.inputDigit('1');
            expect(calc.getState().state).toBe(CalculatorEngine.STATE.INPUT);

            // OPERATOR状態
            calc.inputOperator('+');
            expect(calc.getState().state).toBe(CalculatorEngine.STATE.OPERATOR);

            // INPUT状態に戻る
            calc.inputDigit('1');
            expect(calc.getState().state).toBe(CalculatorEngine.STATE.INPUT);

            // RESULT状態
            calc.calculate();
            expect(calc.getState().state).toBe(CalculatorEngine.STATE.RESULT);
        });

        test('エラー状態への遷移', () => {
            calc.inputDigit('2'); // 無効な入力
            expect(calc.getState().state).toBe(CalculatorEngine.STATE.ERROR);
        });
    });
});
