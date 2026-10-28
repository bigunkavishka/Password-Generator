
const password = document.getElementById("password");
const length = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const message = document.getElementById("message");

length.addEventListener("input", () => {
  lengthValue.textContent = length.value;
});

function randomIndex(max) {
  const arr = new Uint32Array(1);
  const limit = Math.floor(2 ** 32 / max) * max;

  do {
    crypto.getRandomValues(arr);
  } while (arr[0] >= limit);

  return arr[0] % max;
}

function generatePassword() {
  const groups = [];

  if (document.getElementById("upper").checked)
    groups.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

  if (document.getElementById("lower").checked)
    groups.push("abcdefghijklmnopqrstuvwxyz");

  if (document.getElementById("numbers").checked)
    groups.push("0123456789");

  if (document.getElementById("symbols").checked)
    groups.push("!@#$%^&*()-_=+?");

  if (groups.length === 0) {
    message.textContent = "Select at least one option!";
    password.value = "";
    return;
  }

  const size = Number(length.value);
  const chars = groups.join("");
  const result = [];

  // Ensure at least one character per selected group
  for (const group of groups) {
    result.push(group[randomIndex(group.length)]);
  }

  // Fill the remaining characters
  while (result.length < size) {
    result.push(chars[randomIndex(chars.length)]);
  }

  // Securely shuffle the password
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  password.value = result.join("");
  message.textContent = "Password generated!";
}

document.getElementById("generate")
  .addEventListener("click", generatePassword);

document.getElementById("copyBtn")
  .addEventListener("click", async () => {
    if (!password.value) {
      message.textContent = "Generate a password first!";
      return;
    }

    try {
      await navigator.clipboard.writeText(password.value);
      message.textContent = "Copied!";
    } catch {
      message.textContent =
        "Copy failed. Please copy manually.";
    }
  });
