document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const history = document.getElementById('history');
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let resetInput = false;

    function updateDisplay() {
        if (currentInput.length > 20) {
            currentInput = currentInput.substring(0, 20);
        }

        let displayValue = currentInput;

        // Comma
        if (!isNaN(currentInput) && currentInput !== '') {
            const [intPart, decimalPart] = currentInput.split('.');
            displayValue = Number(intPart).toLocaleString();

            if (decimalPart !== undefined) {
                displayValue += '.' + decimalPart;
            }
        }

        display.textContent = displayValue;
    }


    function updateHistory() {
        if (previousInput && operation && !resetInput) {
            history.textContent = `${previousInput} ${operation} ${currentInput}`;
        } else if (previousInput && operation) {
            history.textContent = `${previousInput} ${operation}`;
        } else {
            history.textContent = '';
        }
    }

    function calculate() {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    result = 'Error';
                } else {
                    result = prev / current;
                }
                break;
            default:
                return;
        }

        currentInput = typeof result === 'number' ?
            result.toString().includes('.') ?
                result.toFixed(8).replace(/\.?0+$/, '') :
                result.toString() :
            result;

        operation = null;
        previousInput = '';
        resetInput = true;
        updateDisplay();
        updateHistory();
    }

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;

            // Handle number input
            if (action === 'number') {
                const num = this.dataset.value;

                if (currentInput === '0' || resetInput) {
                    currentInput = num;
                    resetInput = false;
                } else {
                    currentInput += num;
                }
                updateDisplay();
                updateHistory();
            }

            // Handle decimal point
            else if (action === 'decimal') {
                if (resetInput) {
                    currentInput = '0.';
                    resetInput = false;
                } else if (!currentInput.includes('.')) {
                    currentInput += '.';
                }
                updateDisplay();
                updateHistory();
            }

            else if (action === 'operation') {
                const newOperation = this.dataset.value;

                if (resetInput && operation) return;

                if (previousInput && currentInput && operation && !resetInput) {
                    calculate();
                }

                previousInput = currentInput;
                operation = newOperation;
                resetInput = true;
            }

            else if (action === 'calculate') {
                if (previousInput && operation) {
                    calculate();
                }
            }

            else if (action === 'clear') {
                currentInput = '0';
                previousInput = '';
                operation = null;
                resetInput = false;
                updateDisplay();
                updateHistory();
            }
        });
    });
});

