/**
 * UIController - ２進数計算機のUIコントローラー
 * PHX-106: UI操作・イベント処理実装
 * PHX-108: CalculatorEngineとの統合
 *
 * 機能:
 * - ボタンクリックイベントハンドリング
 * - 表示エリアの動的更新処理
 * - 入力値の検証とエラーハンドリング
 * - クリア・リセット機能
 * - CalculatorEngineとの連携
 */

class UIController {
    constructor() {
        // DOM要素の参照
        this.binaryDisplay = document.getElementById('binaryDisplay');
        this.decimalDisplay = document.getElementById('decimalDisplay');
        this.historyDisplay = document.getElementById('historyDisplay');
        this.errorDisplay = document.getElementById('errorDisplay');

        // 計算エンジンの初期化
        this.engine = new CalculatorEngine();

        // 履歴表示の状態
        this.isHistoryVisible = false;

        // 初期化
        this.init();
    }

    /**
     * 初期化処理
     */
    init() {
        this.attachEventListeners();
        this.updateDisplay();
        console.log('UIController初期化完了 - CalculatorEngine統合版');
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
        // 計算エンジンに数値入力を委譲
        const state = this.engine.inputDigit(number);

        // 表示を更新
        this.updateDisplay();

        // エラー処理
        if (state.hasError) {
            this.showError(state.errorMessage);
        } else {
            this.clearError();
        }

        console.log('数値入力:', number, '現在値:', state.currentValue);
    }

    /**
     * 演算子入力処理
     * @param {string} operator - 演算子（+, -, *, /）
     */
    handleOperatorInput(operator) {
        // 計算エンジンに演算子入力を委譲
        const state = this.engine.inputOperator(operator);

        // 表示を更新
        this.updateDisplay();
        this.updateHistoryDisplay();

        // エラー処理
        if (state.hasError) {
            this.showError(state.errorMessage);
        }

        console.log('演算子入力:', operator);
    }

    /**
     * イコールボタン処理
     */
    handleEquals() {
        // 計算エンジンに計算実行を委譲
        const state = this.engine.calculate();

        // 表示を更新
        this.updateDisplay();
        this.updateHistoryDisplay();

        // エラー処理
        if (state.hasError) {
            this.showError(state.errorMessage);
        } else {
            this.clearError();
        }

        console.log('計算実行完了');
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
        // 計算エンジンをクリア
        this.engine.clear();

        // 表示を更新
        this.updateDisplay();
        this.updateHistoryDisplay();
        this.clearError();
    }

    /**
     * バックスペース処理
     */
    backspace() {
        // 計算エンジンにバックスペース処理を委譲
        const state = this.engine.backspace();

        // 表示を更新
        this.updateDisplay();

        // エラー処理
        if (state.hasError) {
            this.clearError();
            this.clear();
        }
    }

    /**
     * 履歴表示切替
     */
    toggleHistory() {
        const history = this.engine.getHistory(5);

        if (history.length === 0) {
            this.historyDisplay.textContent = '履歴なし';
            setTimeout(() => {
                if (!this.isHistoryVisible) {
                    this.updateHistoryDisplay();
                }
            }, 2000);
            return;
        }

        // 履歴表示切替
        this.isHistoryVisible = !this.isHistoryVisible;

        if (this.isHistoryVisible) {
            // 履歴を表示
            this.historyDisplay.textContent = history.join('\n');
        } else {
            // 現在の計算式を表示
            this.updateHistoryDisplay();
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
        const state = this.engine.getState();

        // ２進数表示
        this.binaryDisplay.textContent = state.currentValue;

        // 10進数表示
        this.decimalDisplay.textContent = state.decimalValue;
    }

    /**
     * 履歴表示更新処理
     */
    updateHistoryDisplay() {
        // 履歴が表示されている場合は更新しない
        if (this.isHistoryVisible) {
            return;
        }

        const state = this.engine.getState();

        if (state.operator && state.previousValue) {
            // 計算中の式を表示
            const operatorSymbol = {
                '+': '+',
                '-': '−',
                '*': '×',
                '/': '÷'
            }[state.operator] || state.operator;
            this.historyDisplay.textContent = `${state.previousValue} ${operatorSymbol}`;
        } else {
            this.historyDisplay.textContent = '';
        }
    }

    /**
     * エラー表示処理
     * @param {string} message - エラーメッセージ
     */
    showError(message) {
        this.errorDisplay.textContent = message;
        this.errorDisplay.style.display = 'block';
        console.error(message);
    }

    /**
     * エラークリア処理
     */
    clearError() {
        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';
    }
}

// DOMContentLoaded後に初期化
document.addEventListener('DOMContentLoaded', function() {
    // UIControllerとCalculatorEngineの統合版を初期化
    window.uiController = new UIController();
});
