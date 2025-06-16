let display = document.getElementById("display");
let history = document.getElementById("history");
let currentInput = "";
let shouldResetDisplay = false;
let lastResult = 0;

function appendToDisplay(value) {
  if (shouldResetDisplay) {
    currentInput = "";
    shouldResetDisplay = false;
  }

  if (value === ".") {
    let parts = currentInput.split(/[\+\-\*\/\(\)]/);
    let lastPart = parts[parts.length - 1];
    if (lastPart.includes(".") || lastPart === "") return;
  }

  if (["+", "-", "*", "/"].includes(value)) {
    let lastChar = currentInput.slice(-1);
    if (["+", "-", "*", "/"].includes(lastChar)) {
      currentInput = currentInput.slice(0, -1);
    }
    if (currentInput === "" && value !== "-") return;
  }

  currentInput += value;
  display.value = currentInput;
  updateHistory();
}

function addFunction(func) {
  if (shouldResetDisplay) {
    currentInput = "";
    shouldResetDisplay = false;
  }

  const functions = {
    "pi": Math.PI.toFixed(10),
    "sqrt(": "Math.sqrt(",
    "sin(": "Math.sin(",
    "cos(": "Math.cos(",
    "tan(": "Math.tan(",
    "log(": "Math.log10(",
    "pow(": "Math.pow("
  };

  currentInput += functions[func] || func;
  display.value = currentInput;
  updateHistory();
}

function clearAll() {
  currentInput = "";
  display.value = "";
  history.textContent = "";
  shouldResetDisplay = false;
}

function clearEntry() {
  currentInput = "";
  display.value = "";
  shouldResetDisplay = false;
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  display.value = currentInput;
  updateHistory();
}

function updateHistory() {
  if (currentInput) {
    history.textContent = currentInput
      .replace(/Math\.sqrt\(/g, "√(")
      .replace(/Math\.sin\(/g, "sin(")
      .replace(/Math\.cos\(/g, "cos(")
      .replace(/Math\.tan\(/g, "tan(")
      .replace(/Math\.log10\(/g, "log(")
      .replace(/Math\.pow\(/g, "pow(")
      .replace(/\*/g, "×");
  }
}

function calculateResult() {
  try {
    if (currentInput === "") return;

    let expression = currentInput;

    let openParens = (expression.match(/\(/g) || []).length;
    let closeParens = (expression.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      throw new Error("Mismatched parentheses");
    }

    let result = eval(expression);
    if (!isFinite(result)) throw new Error("Invalid calculation");

    result =
      result % 1 === 0 && Math.abs(result) < 1e15
        ? parseInt(result)
        : parseFloat(result.toFixed(10));

    display.value = result;
    history.textContent = `${currentInput.replace(/\*/g, "×")} =`;
    currentInput = result.toString();
    lastResult = result;
    shouldResetDisplay = true;
  } catch (error) {
    display.value = "Error";
    history.textContent = "Invalid Expression";
    currentInput = "";
    shouldResetDisplay = true;
  }
}
