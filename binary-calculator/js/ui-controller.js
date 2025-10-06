/**
 * UIController - ２進数計算機のUIコントローラー
 * PHX-106: UI操作・イベント処理実装
 *
 * 機能:
 * - ボタンクリックイベントハンドリング
 * - 表示エリアの動的更新処理
 * - 入力値の検証とエラーハンドリング
 * - クリア・リセット機能
 */

class UIController {
    constructor() {
        // DOM要素の参照
        this.binaryDisplay = document.getElementById('binaryDisplay');
        this.decimalDisplay = document.getElementById('decimalDisplay');
        this.historyDisplay = document.getElementById('historyDisplay');
        this.errorDisplay = document.getElementById('errorDisplay');

        // 状態管理
        this.currentInput = '0';
        this.operator = null;
        this.previousValue = null;
        this.history = [];
        this.isNewInput = true;
        this.hasError = false;

        // 初期化
        this.init();
    }

    /**
     * 初期化処理
     */
    init() {
        this.attachEventListeners();
        this.updateDisplay();
        console.log('UIController初期化完了');
    }

    /**
     * イベントリスナーのアタッチ
     */
    attachEventListeners() {
        // 数値ボタン（0と1のみ有効）
        const numberButtons = document.querySelectorAll('.btn-number');
        numberButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const number = e.target.getAttribute('data-number');
                this.handleNumberInput(number);
            });
        });

        // 演算子ボタン
        const operatorButtons = document.querySelectorAll('.btn-operator');
        operatorButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const operator = e.target.getAttribute('data-operator');
                this.handleOperatorInput(operator);
            });
        });

        // 機能ボタン
        const functionButtons = document.querySelectorAll('.btn-function');
        functionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.handleFunctionAction(action);
            });
        });

        // イコールボタン
        const equalsButton = document.querySelector('.btn-equals');
        if (equalsButton) {
            equalsButton.addEventListener('click', () => {
                this.handleEquals();
            });
        }

        // キーボード入力対応
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
    }

    /**
     * 数値入力処理
     * @param {string} number - 入力された数値（'0'または'1'）
     */
    handleNumberInput(number) {
        // エラー状態の場合はクリア
        if (this.hasError) {
            this.clearError();
            this.clear();
        }

        // ２進数として有効な入力値の検証
        if (!this.validateBinaryInput(number)) {
            this.showError('エラー: ２進数は0と1のみ入力可能です');
            return;
        }

        // 新規入力の場合は現在値をクリア
        if (this.isNewInput) {
            this.currentInput = '';
            this.isNewInput = false;
        }

        // 先頭の0を除去（'0'のみの場合を除く）
        if (this.currentInput === '0') {
            this.currentInput = '';
        }

        // 入力値の追加
        this.currentInput += number;

        // 空の場合は'0'に設定
        if (this.currentInput === '') {
            this.currentInput = '0';
        }

        // オーバーフロー検証（32ビット制限）
        if (!this.validateBinaryLength(this.currentInput)) {
            this.showError('エラー: 入力値が大きすぎます（32ビット制限）');
            this.currentInput = this.currentInput.slice(0, -1);
            if (this.currentInput === '') {
                this.currentInput = '0';
            }
            return;
        }

        this.updateDisplay();
        console.log('数値入力:', number, '現在値:', this.currentInput);
    }

    /**
     * 演算子入力処理
     * @param {string} operator - 演算子（+, -, *, /）
     */
    handleOperatorInput(operator) {
        // エラー状態の場合は処理しない
        if (this.hasError) {
            return;
        }

        // 前の計算を実行
        if (this.operator !== null && !this.isNewInput) {
            this.handleEquals();
        }

        // 演算子と前の値を保存
        this.previousValue = this.currentInput;
        this.operator = operator;
        this.isNewInput = true;

        // 履歴表示を更新
        this.updateHistoryDisplay();

        console.log('演算子入力:', operator);
    }

    /**
     * イコールボタン処理
     */
    handleEquals() {
        // エラー状態または演算子が未設定の場合は処理しない
        if (this.hasError || this.operator === null || this.previousValue === null) {
            return;
        }

        try {
            // ２進数を10進数に変換
            const num1 = parseInt(this.previousValue, 2);
            const num2 = parseInt(this.currentInput, 2);
            let result;

            // 計算実行
            switch (this.operator) {
                case '+':
                    result = num1 + num2;
                    break;
                case '-':
                    result = num1 - num2;
                    break;
                case '*':
                    result = num1 * num2;
                    break;
                case '/':
                    if (num2 === 0) {
                        this.showError('エラー: ゼロで除算できません');
                        return;
                    }
                    result = Math.floor(num1 / num2); // 整数除算
                    break;
                default:
                    return;
            }

            // 結果が負の場合のエラーハンドリング
            if (result < 0) {
                this.showError('エラー: 負の数は扱えません');
                return;
            }

            // 結果が32ビットを超える場合のエラーハンドリング
            if (result > 0xFFFFFFFF) {
                this.showError('エラー: 計算結果が大きすぎます（32ビット制限）');
                return;
            }

            // 計算履歴を保存
            const calculation = `${this.previousValue} ${this.operator} ${this.currentInput} = ${result.toString(2)}`;
            this.addToHistory(calculation);

            // 結果を２進数に変換して表示
            this.currentInput = result.toString(2);
            this.operator = null;
            this.previousValue = null;
            this.isNewInput = true;

            this.updateDisplay();
            this.updateHistoryDisplay('');

            console.log('計算実行:', calculation);

        } catch (error) {
            this.showError('エラー: 計算中にエラーが発生しました');
            console.error('計算エラー:', error);
        }
    }

    /**
     * 機能ボタン処理
     * @param {string} action - アクション（clear, backspace, history）
     */
    handleFunctionAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                console.log('クリア実行');
                break;
            case 'backspace':
                this.backspace();
                console.log('バックスペース実行');
                break;
            case 'history':
                this.toggleHistory();
                console.log('履歴表示切替');
                break;
        }
    }

    /**
     * クリア処理
     */
    clear() {
        this.currentInput = '0';
        this.operator = null;
        this.previousValue = null;
        this.isNewInput = true;
        this.clearError();
        this.updateDisplay();
        this.updateHistoryDisplay('');
    }

    /**
     * バックスペース処理
     */
    backspace() {
        // エラー状態の場合はクリア
        if (this.hasError) {
            this.clearError();
            this.clear();
            return;
        }

        // 新規入力状態または'0'のみの場合は処理しない
        if (this.isNewInput || this.currentInput === '0') {
            return;
        }

        // 最後の文字を削除
        this.currentInput = this.currentInput.slice(0, -1);

        // 空になった場合は'0'に設定
        if (this.currentInput === '') {
            this.currentInput = '0';
        }

        this.updateDisplay();
    }

    /**
     * 履歴表示切替
     */
    toggleHistory() {
        if (this.history.length === 0) {
            this.historyDisplay.textContent = '履歴なし';
            setTimeout(() => {
                this.historyDisplay.textContent = '';
            }, 2000);
            return;
        }

        // 履歴を表示
        const historyText = this.history.slice(-5).reverse().join('\n');
        if (this.historyDisplay.textContent === '') {
            this.historyDisplay.textContent = historyText;
        } else {
            this.historyDisplay.textContent = '';
        }
    }

    /**
     * キーボード入力処理
     * @param {KeyboardEvent} event - キーボードイベント
     */
    handleKeyboardInput(event) {
        const key = event.key;

        // 数値キー
        if (key === '0' || key === '1') {
            event.preventDefault();
            this.handleNumberInput(key);
        }
        // 演算子キー
        else if (['+', '-', '*', '/'].includes(key)) {
            event.preventDefault();
            this.handleOperatorInput(key);
        }
        // Enterキー（イコール）
        else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            this.handleEquals();
        }
        // Escapeキー（クリア）
        else if (key === 'Escape') {
            event.preventDefault();
            this.clear();
        }
        // Backspaceキー
        else if (key === 'Backspace') {
            event.preventDefault();
            this.backspace();
        }
    }

    /**
     * 表示更新処理
     */
    updateDisplay() {
        // ２進数表示
        this.binaryDisplay.textContent = this.currentInput;

        // 10進数表示
        const decimalValue = parseInt(this.currentInput, 2);
        this.decimalDisplay.textContent = decimalValue;
    }

    /**
     * 履歴表示更新処理
     * @param {string} text - 表示するテキスト
     */
    updateHistoryDisplay(text = null) {
        if (text === null && this.operator && this.previousValue) {
            // 計算中の式を表示
            const operatorSymbol = {
                '+': '+',
                '-': '−',
                '*': '×',
                '/': '÷'
            }[this.operator] || this.operator;
            this.historyDisplay.textContent = `${this.previousValue} ${operatorSymbol}`;
        } else if (text !== undefined) {
            this.historyDisplay.textContent = text;
        }
    }

    /**
     * 履歴追加処理
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
     * エラー表示処理
     * @param {string} message - エラーメッセージ
     */
    showError(message) {
        this.hasError = true;
        this.errorDisplay.textContent = message;
        this.errorDisplay.style.display = 'block';
        console.error(message);
    }

    /**
     * エラークリア処理
     */
    clearError() {
        this.hasError = false;
        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';
    }

    /**
     * ２進数入力値の検証
     * @param {string} value - 検証する値
     * @returns {boolean} 有効な場合true
     */
    validateBinaryInput(value) {
        return value === '0' || value === '1';
    }

    /**
     * ２進数の長さ検証（32ビット制限）
     * @param {string} binary - ２進数文字列
     * @returns {boolean} 有効な場合true
     */
    validateBinaryLength(binary) {
        // 32ビット（2^32 - 1 = 4294967295）を超えないことを確認
        if (binary.length > 32) {
            return false;
        }
        const value = parseInt(binary, 2);
        return value <= 0xFFFFFFFF;
    }
}

// DOMContentLoaded後に初期化
document.addEventListener('DOMContentLoaded', function() {
    // 既存のcalculator.jsとの競合を避けるため、UIControllerのみ初期化
    window.uiController = new UIController();
});
