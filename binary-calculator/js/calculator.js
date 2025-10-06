// ２進数計算機 JavaScript（基本構造のみ）
// PHX-104: UI構築用の基本的なイベントハンドラ

document.addEventListener('DOMContentLoaded', function() {
    // DOM要素取得
    const binaryDisplay = document.getElementById('binaryDisplay');
    const decimalDisplay = document.getElementById('decimalDisplay');
    const historyDisplay = document.getElementById('historyDisplay');

    // 初期値
    let currentBinary = '0';
    let currentDecimal = 0;

    // 数値ボタンのイベントリスナー
    const numberButtons = document.querySelectorAll('.btn-number');
    numberButtons.forEach(button => {
        button.addEventListener('click', function() {
            const number = this.getAttribute('data-number');
            console.log('数値ボタンクリック:', number);
            // 実装は次のフェーズ（PHX-105）で行います
        });
    });

    // 演算子ボタンのイベントリスナー
    const operatorButtons = document.querySelectorAll('.btn-operator');
    operatorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const operator = this.getAttribute('data-operator');
            console.log('演算子ボタンクリック:', operator);
            // 実装は次のフェーズ（PHX-105）で行います
        });
    });

    // 機能ボタンのイベントリスナー
    const functionButtons = document.querySelectorAll('.btn-function');
    functionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            console.log('機能ボタンクリック:', action);

            if (action === 'clear') {
                // クリア機能の基本実装
                currentBinary = '0';
                currentDecimal = 0;
                binaryDisplay.textContent = currentBinary;
                decimalDisplay.textContent = currentDecimal;
                historyDisplay.textContent = '';
            }
            // その他の実装は次のフェーズで行います
        });
    });

    // イコールボタンのイベントリスナー
    const equalsButton = document.querySelector('.btn-equals');
    if (equalsButton) {
        equalsButton.addEventListener('click', function() {
            console.log('イコールボタンクリック');
            // 実装は次のフェーズ（PHX-105）で行います
        });
    }

    console.log('２進数計算機UI初期化完了');
});
