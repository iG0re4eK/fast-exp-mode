const form = document.getElementById("form");
const output = document.getElementById("output");
const example = document.getElementById("example");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const aInput = form.elements["aValue"];
  const xInput = form.elements["xValue"];
  const nInput = form.elements["nValue"];

  const aField = aInput.parentElement;
  const xField = xInput.parentElement;
  const nField = nInput.parentElement;

  const a = inputValid(aInput.value);
  const x = inputValidX(xInput.value);
  const n = inputValid(nInput.value);

  if (!a.valid || !x.valid || !n.valid) {
    if (!a.valid) {
      showError(aField, a.error);
    }
    if (!x.valid) {
      showError(xField, x.error);
    }
    if (!n.valid) {
      showError(nField, n.error);
    }
    return;
  }

  clearErrors([aField, xField, nField]);

  example.innerHTML = `a<sup>x</sup> mod n = ${a.value}<sup>${
    x.value
  }</sup> mod ${n.value} = ${fastExpMode(a.value, x.value, n.value)}`;
});

function showError(fieldElement, message) {
  const existingError = fieldElement.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;

  fieldElement.appendChild(errorElement);

  const input = fieldElement.querySelector("input");
  if (input) {
    input.classList.add("error-input");
  }
}

function clearErrors(fieldElements) {
  fieldElements.forEach((field) => {
    const errors = field.querySelectorAll(".error-message");
    errors.forEach((error) => error.remove());

    const input = field.querySelector("input");
    if (input) {
      input.classList.remove("error-input");
    }
  });
}

function inputValid(value) {
  const number = value.trim();

  if (number === "")
    return { valid: false, error: "Поле не должно быть пустым" };
  if (isNaN(number))
    return { valid: false, error: "Значение должно быть числом" };

  const num = Number(number);
  if (!Number.isInteger(num))
    return { valid: false, error: "Значение должно быть целочисленным" };

  return { valid: true, value: num };
}

function inputValidX(value) {
  const number = value.trim();

  if (number === "")
    return { valid: false, error: "Поле не должно быть пустым" };
  if (isNaN(number))
    return { valid: false, error: "Значение должно быть числом" };

  const num = Number(number);
  if (!Number.isInteger(num))
    return { valid: false, error: "Значение должно быть целочисленным" };

  if (num < -1)
    return { valid: false, error: "Значение должно быть больше -1" };

  return { valid: true, value: num };
}

function fastExpMode(a, x, n) {
  let solve = ``;

  let p = 1;
  solve += `<div>p = ${p}</div>`;
  let i = x === -1 ? n - 2 : x;
  solve += `<div>i = ${i}</div>`;

  let count = 1;

  while (i > 0) {
    solve += `<div class="step">Шаг ${count}:</div>`;

    const s = i % 2;
    solve += `<div>s = i % 2 = ${i} % 2 = ${s}</div>`;

    if (s === 1) {
      solve += `<div class="condition">Условие (s == 1) выполняется , значит:</div>`;
      p = (p * a) % n;
      solve += `<div class="condition-action">p = (p * a) % n = (${p} * ${a}) % ${n} = (${
        p * a
      }) % ${n} = ${p}</div>`;
    }

    a = (a * a) % n;
    solve += `<div>a = (a * a) % n = (${a} * ${a}) % ${n} = (${
      a * a
    }) % ${n} = ${a}</div>`;

    i = (i - s) / 2;
    solve += `<div>i = (i - s) / 2 = (${i} - ${s}) / 2 = (${
      i - s
    }) / 2 = ${p}</div>`;

    count++;
  }

  let result = p < 0 ? p + n : p;
  solve += `<div>Ответ: ${result}</div>`;

  output.innerHTML = solve;

  return result;
}
