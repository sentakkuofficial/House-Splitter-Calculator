const consoleEl = document.getElementById("console");
const lineNumbersEl = document.getElementById("lineNumbers");
const inputArea = document.getElementById("inputArea");
const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");

let step = -1;
let housePrice = 0;
let downPaymentPercent = 0;
let closingCostPercent = 0;
let buyers = 0;
let isAnimating = false;

function renderLineNumbers() {
  if (!lineNumbersEl) return;
  lineNumbersEl.innerHTML = "";
  for (let i = 1; i <= 32; i++) {
    const num = document.createElement("div");
    num.textContent = i;
    lineNumbersEl.appendChild(num);
  }
}

function scrollConsole() {
  if (consoleEl) {
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function addLine(text = "", className = "muted", prefix = "") {
  const line = document.createElement("div");
  line.className = `console-line ${className}`;

  if (prefix) {
    const prefixSpan = document.createElement("span");
    prefixSpan.className = "console-prefix";
    prefixSpan.textContent = prefix;
    line.appendChild(prefixSpan);
  }

  const textSpan = document.createElement("span");
  textSpan.textContent = text;
  line.appendChild(textSpan);

  consoleEl.appendChild(line);
  scrollConsole();
  return line;
}

async function typeLine(text, className = "muted", prefix = "", speed = 18) {
  const line = document.createElement("div");
  line.className = `console-line ${className}`;

  if (prefix) {
    const prefixSpan = document.createElement("span");
    prefixSpan.className = "console-prefix";
    prefixSpan.textContent = prefix;
    line.appendChild(prefixSpan);
  }

  const textSpan = document.createElement("span");
  const cursor = document.createElement("span");
  cursor.className = "console-cursor";

  line.appendChild(textSpan);
  line.appendChild(cursor);
  consoleEl.appendChild(line);
  scrollConsole();

  for (let i = 0; i < text.length; i++) {
    textSpan.textContent += text[i];
    scrollConsole();
    await wait(speed);
  }

  cursor.remove();
  return line;
}

function setInputEnabled(enabled) {
  if (!userInput || !submitBtn) return;
  userInput.disabled = !enabled;
  submitBtn.disabled = !enabled;
  if (enabled) userInput.focus();
}

function addUserLine(value) {
  addLine(value, "input", "•");
}

function showStartScreen() {
  step = -1;
  housePrice = 0;
  downPaymentPercent = 0;
  closingCostPercent = 0;
  buyers = 0;
  isAnimating = false;

  consoleEl.innerHTML = "";
  inputArea.style.display = "none";
  userInput.value = "";
  setInputEnabled(false);

  const line = document.createElement("div");
  line.className = "console-line brand";
  line.innerHTML =
    'Click <span class="run-link" id="runLink">RUN</span> to preview the final project you will build.';
  consoleEl.appendChild(line);
  scrollConsole();

  const runLink = document.getElementById("runLink");
  runLink.addEventListener("click", startProgram);
}

async function startProgram() {
  if (isAnimating) return;

  step = 0;
  housePrice = 0;
  downPaymentPercent = 0;
  closingCostPercent = 0;
  buyers = 0;
  isAnimating = true;

  consoleEl.innerHTML = "";
  inputArea.style.display = "block";
  userInput.value = "";
  setInputEnabled(false);

  await typeLine("Welcome to the House Buying Cost Splitter!", "brand");
  await typeLine("What is the house price? $", "question");

  isAnimating = false;
  setInputEnabled(true);
}

async function finishProgram() {
  isAnimating = true;
  setInputEnabled(false);

  const downPayment = housePrice * (downPaymentPercent / 100);
  const closingCosts = housePrice * (closingCostPercent / 100);
  const totalNeeded = downPayment + closingCosts;
  const perPerson = totalNeeded / buyers;

  await wait(160);
  await typeLine(`Down payment amount: $${downPayment.toFixed(2)}`, "highlight");
  await typeLine(`Closing costs amount: $${closingCosts.toFixed(2)}`, "highlight");
  await typeLine(`Total upfront needed: $${totalNeeded.toFixed(2)}`, "result");
  await typeLine(`Each buyer needs to contribute: $${perPerson.toFixed(2)}`, "result");

  isAnimating = false;
}

async function handleInput() {
  const value = userInput.value.trim();
  if (!value || userInput.disabled || isAnimating) return;

  addUserLine(value);
  userInput.value = "";

  if (step === 0) {
    housePrice = parseFloat(value);
    step = 1;
    setInputEnabled(false);
    isAnimating = true;

    await wait(220);
    await typeLine("What percentage is the down payment? 10, 20, or 30?", "question");

    isAnimating = false;
    setInputEnabled(true);
  } else if (step === 1) {
    downPaymentPercent = parseInt(value, 10);
    step = 2;
    setInputEnabled(false);
    isAnimating = true;

    await wait(220);
    await typeLine("What percentage are closing costs? 2, 3, or 5?", "question");

    isAnimating = false;
    setInputEnabled(true);
  } else if (step === 2) {
    closingCostPercent = parseInt(value, 10);
    step = 3;
    setInputEnabled(false);
    isAnimating = true;

    await wait(220);
    await typeLine("How many buyers are splitting the purchase?", "question");

    isAnimating = false;
    setInputEnabled(true);
  } else if (step === 3) {
    buyers = parseInt(value, 10);
    step = 4;
    await finishProgram();
  }
}

if (!consoleEl || !lineNumbersEl || !inputArea || !userInput || !submitBtn) {
  console.error("Missing required HTML element.");
} else {
  submitBtn.addEventListener("click", handleInput);

  userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleInput();
    }
  });

  renderLineNumbers();
  showStartScreen();
}
