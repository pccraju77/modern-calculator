class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert("Cannot divide by zero");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const splitNumber = stringNumber.split('.');
        const integerDigits = parseFloat(splitNumber[0]);
        const decimalDigits = splitNumber[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            // Limit decimal digits to 10 places to prevent overflow
            const truncatedDecimal = decimalDigits.substring(0, 10);
            return `${integerDisplay}.${truncatedDecimal}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        const displayValue = this.getDisplayNumber(this.currentOperand);
        this.currentOperandTextElement.innerText = displayValue;

        // Dynamic font scaling
        if (displayValue.length > 12) {
            this.currentOperandTextElement.classList.remove('text-4xl', 'sm:text-5xl');
            this.currentOperandTextElement.classList.add('text-2xl');
        } else if (displayValue.length > 8) {
            this.currentOperandTextElement.classList.remove('text-4xl', 'sm:text-5xl');
            this.currentOperandTextElement.classList.add('text-3xl');
        } else {
            this.currentOperandTextElement.classList.remove('text-2xl', 'text-3xl');
            this.currentOperandTextElement.classList.add('text-4xl', 'sm:text-5xl');
        }

        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

function appendNumber(number) {
    calculator.appendNumber(number);
}

function appendOperator(operator) {
    calculator.chooseOperation(operator);
}

function compute() {
    calculator.compute();
}

function clearDisplay() {
    calculator.clear();
}

function deleteDigit() {
    calculator.delete();
}

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') calculator.appendNumber(e.key);
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '%') calculator.chooseOperation(e.key);
    if (e.key === 'Enter' || e.key === '=') calculator.compute();
    if (e.key === 'Backspace') calculator.delete();
    if (e.key === 'Escape') calculator.clear();
});
