const defaultStats = {
  hp: 34,
  maxHp: 35,
  mana: null,
  maxMana: 20,
  stamina: 90,
  sync: 20
};

let stats = loadStats();

function loadStats() {
  const saved = localStorage.getItem("characterStats");

  if (!saved) {
    return { ...defaultStats };
  }

  try {
    return { ...defaultStats, ...JSON.parse(saved) };
  } catch {
    return { ...defaultStats };
  }
}

function saveStats() {
  localStorage.setItem("characterStats", JSON.stringify(stats));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function percentage(value, max) {
  if (value === null || value === undefined || max <= 0) {
    return 0;
  }

  return clamp((value / max) * 100, 0, 100);
}

function render() {
  document.getElementById("hpValue").textContent = stats.hp;
  document.getElementById("hpFill").style.width = `${percentage(stats.hp, stats.maxHp)}%`;

  if (stats.mana === null || stats.mana === undefined || stats.mana === "undefined") {
    document.getElementById("manaValue").textContent = "undefined";
    document.getElementById("manaFill").style.width = "0%";
  } else {
    document.getElementById("manaValue").textContent = stats.mana;
    document.getElementById("manaFill").style.width = `${percentage(Number(stats.mana), stats.maxMana)}%`;
  }

  document.getElementById("staminaValue").textContent = `${stats.stamina}%`;
  document.getElementById("staminaFill").style.width = `${clamp(stats.stamina, 0, 100)}%`;

  document.getElementById("syncValue").textContent = `${stats.sync}%`;
  document.getElementById("syncFill").style.width = `${clamp(stats.sync, 0, 100)}%`;

  fillEditor();
}

function fillEditor() {
  document.getElementById("hpInput").value = stats.hp;
  document.getElementById("maxHpInput").value = stats.maxHp;
  document.getElementById("manaInput").value = stats.mana ?? "undefined";
  document.getElementById("maxManaInput").value = stats.maxMana;
  document.getElementById("staminaInput").value = stats.stamina;
  document.getElementById("syncInput").value = stats.sync;
}

function toggleEditor() {
  document.getElementById("editor").classList.toggle("hidden");
  fillEditor();
}

function saveEditor() {
  const manaRaw = document.getElementById("manaInput").value.trim();

  stats.hp = Number(document.getElementById("hpInput").value);
  stats.maxHp = Number(document.getElementById("maxHpInput").value);
  stats.mana = manaRaw.toLowerCase() === "undefined" || manaRaw === "" ? null : Number(manaRaw);
  stats.maxMana = Number(document.getElementById("maxManaInput").value);
  stats.stamina = Number(document.getElementById("staminaInput").value);
  stats.sync = Number(document.getElementById("syncInput").value);

  stats.hp = clamp(stats.hp, 0, stats.maxHp);
  stats.maxHp = Math.max(stats.maxHp, 1);
  stats.maxMana = Math.max(stats.maxMana, 1);
  stats.stamina = clamp(stats.stamina, 0, 100);
  stats.sync = clamp(stats.sync, 0, 100);

  saveStats();
  render();
}

function changeNumber(statName) {
  let label = {
    hp: "HP",
    mana: "Mana",
    stamina: "Ausdauer %",
    sync: "Synchronisation %"
  }[statName];

  const currentValue = stats[statName] ?? "undefined";
  const input = prompt(`${label} ändern:`, currentValue);

  if (input === null) return;

  if (statName === "mana" && input.trim().toLowerCase() === "undefined") {
    stats.mana = null;
  } else {
    const number = Number(input);

    if (Number.isNaN(number)) {
      alert("Bitte eine Zahl eingeben.");
      return;
    }

    stats[statName] = number;
  }

  if (statName === "hp") {
    stats.hp = clamp(stats.hp, 0, stats.maxHp);
  }

  if (statName === "stamina" || statName === "sync") {
    stats[statName] = clamp(stats[statName], 0, 100);
  }

  saveStats();
  render();
}

function resetStats() {
  const confirmReset = confirm("Werte wirklich zurücksetzen?");

  if (!confirmReset) return;

  stats = { ...defaultStats };
  saveStats();
  render();
}

render();
