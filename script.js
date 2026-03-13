const consoleEl = document.getElementById("console");

let step = 0;
let housePrice;
let downPaymentPercent;
let closingCostPercent;
let buyers;

function addLine(text) {
  const line = document.createElement("div");
  line.className = "console-line";
  line.textContent = text;
  consoleEl.appendChild(line);
}

function addInput(callback) {
  const wrapper = document.createElement("div");
  wrapper.className = "console-line";

  const prefix = document.createElement("span");
  prefix.textContent = "> ";
  prefix.style.color = "#d4af37";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "console-input";
  input.autofocus = true;

  wrapper.appendChild(prefix);
  wrapper.appendChild(input);
  consoleEl.appendChild(wrapper);

  input.focus();

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const value = input.value;
      input.disabled = true;
      callback(value);
    }
  });
}

function askQuestion(text, handler) {
  addLine(text);
  addInput(handler);
}

function startProgram() {
  consoleEl.innerHTML = "";
  addLine("Welcome to the House Buying Cost Splitter!");
  nextStep();
}

function nextStep() {
  if (step === 0) {
    askQuestion("What is the house price?", (val) => {
      housePrice = parseFloat(val);
      step++;
      nextStep();
    });
  }

  else if (step === 1) {
    askQuestion("What percentage is the down payment? (10, 20, 30)", (val) => {
      downPaymentPercent = parseFloat(val);
      step++;
      nextStep();
    });
  }

  else if (step === 2) {
    askQuestion("What percentage are closing costs? (2, 3, 5)", (val) => {
      closingCostPercent = parseFloat(val);
      step++;
      nextStep();
    });
  }

  else if (step === 3) {
    askQuestion("How many buyers are splitting the purchase?", (val) => {
      buyers = parseInt(val);
      step++;
      nextStep();
    });
  }

  else if (step === 4) {
    const downPayment = housePrice * (downPaymentPercent / 100);
    const closingCosts = housePrice * (closingCostPercent / 100);
    const total = downPayment + closingCosts;
    const perPerson = total / buyers;

    addLine("");
    addLine("Down payment: $" + downPayment.toFixed(2));
    addLine("Closing costs: $" + closingCosts.toFixed(2));
    addLine("Total upfront: $" + total.toFixed(2));
    addLine("Each buyer contributes: $" + perPerson.toFixed(2));
  }
}

startProgram();
