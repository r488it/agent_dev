/**
 * CalculatorEngine - ２進数計算機の計算エンジン
 * PHX-108: 計算機本体ロジック実装
 *
 * 機能:
 * - 計算機の状態管理（入力中、演算子待ち、結果表示等）
 * - 計算フロー制御（演算順序、優先度処理）
 * - エラーハンドリング（無効な演算、オーバーフロー等）
 * - 計算ロジックの統合制御
 */

class CalculatorEngine {
    /**
     * 計算機の状態定義
     */
    static STATE = {
        INPUT: 'INPUT',           // 数値入力中
        OPERATOR: 'OPERATOR',     // 演算子入力待ち
        RESULT: 'RESULT',         // 計算結果表示中
        ERROR: 'ERROR'            // エラー状態
    };

    /**
     * エラータイプ定義
     */
    static ERROR_TYPE = {
        INVALID_INPUT: 'INVALID_INPUT',       // 無効な入力
        DIVISION_BY_ZERO: 'DIVISION_BY_ZERO', // ゼロ除算
        NEGATIVE_RESULT: 'NEGATIVE_RESULT',   // 負の数
        OVERFLOW: 'OVERFLOW',                 // オーバーフロー
        CALCULATION_ERROR: 'CALCULATION_ERROR' // 計算エラー
    };

    /**
     * 計算機の定数
     */
    static CONSTANTS = {
        MAX_BITS: 32,                    // 最大ビット数
        MAX_VALUE: 0xFFFFFFFF,           // 最大値（32ビット）
        MIN_VALUE: 0,                    // 最小値
        DEFAULT_VALUE: '0'               // デフォルト値
    };

    /**
     * コンストラクタ
     */
    constructor() {
        this.reset();
    }

    /**
     * 計算機のリセット
     */
    reset() {
        this.state = CalculatorEngine.STATE.INPUT;
        this.currentValue = CalculatorEngine.CONSTANTS.DEFAULT_VALUE;
        this.previousValue = null;
        this.operator = null;
        this.errorMessage = null;
        this.isNewInput = true;
        this.history = [];
    }

    /**
     * 現在の状態を取得
     * @returns {object} 計算機の状態
     */
    getState() {
        return {
            state: this.state,
            currentValue: this.currentValue,
            previousValue: this.previousValue,
            operator: this.operator,
            errorMessage: this.errorMessage,
            isNewInput: this.isNewInput,
            decimalValue: this.getDecimalValue(),
            hasError: this.state === CalculatorEngine.STATE.ERROR
        };
    }

    /**
     * 数値入力処理
     * @param {string} digit - 入力された数値（'0'または'1'）
     * @returns {object} 処理結果
     */
    inputDigit(digit) {
        // エラー状態の場合はリセット
        if (this.state === CalculatorEngine.STATE.ERROR) {
            this.reset();
        }

        // 入力値の検証
        if (!this.validateBinaryDigit(digit)) {
            return this.setError(
                CalculatorEngine.ERROR_TYPE.INVALID_INPUT,
                'エラー: ２進数は0と1のみ入力可能です'
            );
        }

        // 新規入力の場合は現在値をクリア
        if (this.isNewInput) {
            this.currentValue = '';
            this.isNewInput = false;
            this.state = CalculatorEngine.STATE.INPUT;
        }

        // 先頭の0を除去（'0'のみの場合を除く）
        if (this.currentValue === '0') {
            this.currentValue = '';
        }

        // 入力値の追加
        this.currentValue += digit;

        // 空の場合は'0'に設定
        if (this.currentValue === '') {
            this.currentValue = '0';
        }

        // オーバーフロー検証
        if (!this.validateBinaryLength(this.currentValue)) {
            // 最後の入力を取り消し
            this.currentValue = this.currentValue.slice(0, -1);
            if (this.currentValue === '') {
                this.currentValue = '0';
            }
            return this.setError(
                CalculatorEngine.ERROR_TYPE.OVERFLOW,
                'エラー: 入力値が大きすぎます（32ビット制限）'
            );
        }

        return this.getState();
    }

    /**
     * 演算子入力処理
     * @param {string} operator - 演算子（+, -, *, /）
     * @returns {object} 処理結果
     */
    inputOperator(operator) {
        // エラー状態の場合は処理しない
        if (this.state === CalculatorEngine.STATE.ERROR) {
            return this.getState();
        }

        // 演算子の検証
        if (!this.validateOperator(operator)) {
            return this.setError(
                CalculatorEngine.ERROR_TYPE.INVALID_INPUT,
                'エラー: 無効な演算子です'
            );
        }

        // 前の計算を実行（連続計算）
        if (this.operator !== null && !this.isNewInput) {
            const result = this.calculate();
            if (result.hasError) {
                return result;
            }
        }

        // 演算子と前の値を保存
        this.previousValue = this.currentValue;
        this.operator = operator;
        this.state = CalculatorEngine.STATE.OPERATOR;
        this.isNewInput = true;

        return this.getState();
    }

    /**
     * 計算実行
     * @returns {object} 計算結果
     */
    calculate() {
        // エラー状態または演算子が未設定の場合は処理しない
        if (this.state === CalculatorEngine.STATE.ERROR ||
            this.operator === null ||
            this.previousValue === null) {
            return this.getState();
        }

        try {
            // ２進数を10進数に変換
            const num1 = parseInt(this.previousValue, 2);
            const num2 = parseInt(this.currentValue, 2);
            let result;

            // 計算実行
            switch (this.operator) {
                case '+':
                    result = this.add(num1, num2);
                    break;
                case '-':
                    result = this.subtract(num1, num2);
                    break;
                case '*':
                    result = this.multiply(num1, num2);
                    break;
                case '/':
                    result = this.divide(num1, num2);
                    break;
                default:
                    return this.setError(
                        CalculatorEngine.ERROR_TYPE.INVALID_INPUT,
                        'エラー: 無効な演算子です'
                    );
            }

            // エラーチェック
            if (result.error) {
                return this.setError(result.errorType, result.message);
            }

            // 計算履歴を保存
            const calculation = `${this.previousValue} ${this.operator} ${this.currentValue} = ${result.value.toString(2)}`;
            this.addToHistory(calculation);

            // 結果を２進数に変換して設定
            this.currentValue = result.value.toString(2);
            this.operator = null;
            this.previousValue = null;
            this.state = CalculatorEngine.STATE.RESULT;
            this.isNewInput = true;

            return this.getState();

        } catch (error) {
            return this.setError(
                CalculatorEngine.ERROR_TYPE.CALCULATION_ERROR,
                'エラー: 計算中にエラーが発生しました'
            );
        }
    }

    /**
     * 加算
     * @param {number} num1 - 第1オペランド
     * @param {number} num2 - 第2オペランド
     * @returns {object} 計算結果
     */
    add(num1, num2) {
        const result = num1 + num2;

        if (result > CalculatorEngine.CONSTANTS.MAX_VALUE) {
            return {
                error: true,
                errorType: CalculatorEngine.ERROR_TYPE.OVERFLOW,
                message: 'エラー: 計算結果が大きすぎます（32ビット制限）'
            };
        }

        return { error: false, value: result };
    }

    /**
     * 減算
     * @param {number} num1 - 第1オペランド
     * @param {number} num2 - 第2オペランド
     * @returns {object} 計算結果
     */
    subtract(num1, num2) {
        const result = num1 - num2;

        if (result < CalculatorEngine.CONSTANTS.MIN_VALUE) {
            return {
                error: true,
                errorType: CalculatorEngine.ERROR_TYPE.NEGATIVE_RESULT,
                message: 'エラー: 負の数は扱えません'
            };
        }

        return { error: false, value: result };
    }

    /**
     * 乗算
     * @param {number} num1 - 第1オペランド
     * @param {number} num2 - 第2オペランド
     * @returns {object} 計算結果
     */
    multiply(num1, num2) {
        const result = num1 * num2;

        if (result > CalculatorEngine.CONSTANTS.MAX_VALUE) {
            return {
                error: true,
                errorType: CalculatorEngine.ERROR_TYPE.OVERFLOW,
                message: 'エラー: 計算結果が大きすぎます（32ビット制限）'
            };
        }

        return { error: false, value: result };
    }

    /**
     * 除算（整数除算）
     * @param {number} num1 - 第1オペランド（被除数）
     * @param {number} num2 - 第2オペランド（除数）
     * @returns {object} 計算結果
     */
    divide(num1, num2) {
        if (num2 === 0) {
            return {
                error: true,
                errorType: CalculatorEngine.ERROR_TYPE.DIVISION_BY_ZERO,
                message: 'エラー: ゼロで除算できません'
            };
        }

        const result = Math.floor(num1 / num2);
        return { error: false, value: result };
    }

    /**
     * バックスペース処理
     * @returns {object} 処理結果
     */
    backspace() {
        // エラー状態の場合はリセット
        if (this.state === CalculatorEngine.STATE.ERROR) {
            this.reset();
            return this.getState();
        }

        // 新規入力状態または'0'のみの場合は処理しない
        if (this.isNewInput || this.currentValue === '0') {
            return this.getState();
        }

        // 最後の文字を削除
        this.currentValue = this.currentValue.slice(0, -1);

        // 空になった場合は'0'に設定
        if (this.currentValue === '') {
            this.currentValue = '0';
        }

        return this.getState();
    }

    /**
     * クリア処理
     * @returns {object} 処理結果
     */
    clear() {
        this.reset();
        return this.getState();
    }

    /**
     * 計算履歴を取得
     * @param {number} limit - 取得する履歴の最大数
     * @returns {array} 計算履歴
     */
    getHistory(limit = 10) {
        return this.history.slice(-limit).reverse();
    }

    /**
     * 計算履歴に追加
     * @param {string} calculation - 計算式
     */
    addToHistory(calculation) {
        this.history.push(calculation);
        // 履歴は最大100件まで保持
        if (this.history.length > 100) {
            this.history.shift();
        }
    }

    /**
     * 現在の10進数値を取得
     * @returns {number} 10進数値
     */
    getDecimalValue() {
        if (this.currentValue === '') {
            return 0;
        }
        return parseInt(this.currentValue, 2);
    }

    /**
     * エラー設定
     * @param {string} errorType - エラータイプ
     * @param {string} message - エラーメッセージ
     * @returns {object} エラー状態
     */
    setError(errorType, message) {
        this.state = CalculatorEngine.STATE.ERROR;
        this.errorMessage = message;
        return this.getState();
    }

    /**
     * ２進数の桁数検証
     * @param {string} digit - 検証する桁（'0'または'1'）
     * @returns {boolean} 有効な場合true
     */
    validateBinaryDigit(digit) {
        return digit === '0' || digit === '1';
    }

    /**
     * ２進数の長さ検証（32ビット制限）
     * @param {string} binary - ２進数文字列
     * @returns {boolean} 有効な場合true
     */
    validateBinaryLength(binary) {
        // 32ビットを超えないことを確認
        if (binary.length > CalculatorEngine.CONSTANTS.MAX_BITS) {
            return false;
        }
        const value = parseInt(binary, 2);
        return value <= CalculatorEngine.CONSTANTS.MAX_VALUE;
    }

    /**
     * 演算子検証
     * @param {string} operator - 演算子
     * @returns {boolean} 有効な場合true
     */
    validateOperator(operator) {
        return ['+', '-', '*', '/'].includes(operator);
    }
}

// モジュールとしてエクスポート（Node.js環境用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalculatorEngine;
}
