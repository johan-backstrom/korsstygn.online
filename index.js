let currentColor = "black";
let values = {};
const checkmark = '&#10006;';

function markWithX(e) {
  const value = e.currentTarget.innerHTML.charCodeAt(0) === 10006 &&  e.currentTarget.style.color === currentColor ? '' : checkmark
  e.currentTarget.innerHTML = value;
  e.currentTarget.style.color = currentColor;
  if (!values[e.currentTarget.y]) {
    values[e.currentTarget.y] = {};
  }
  values[e.currentTarget.y][e.currentTarget.x] = { checked: true, color: currentColor }
  const jsonValues = JSON.stringify(values)
  localStorage.setItem("korsstygn", jsonValues);
}

function reset() {
  localStorage.clear();
  document.getElementById("container").innerHTML = '';
  setup()
}

function selectColor(e) {
  currentColor = e.id
  document.getElementById("currentColor").style.color = currentColor;
}

function setup() {
  const rowNumberElement = document.getElementById("numberOfRows");
  const columnNumberElement = document.getElementById("numberOfColumns");
  rowNumberElement.value = rowNumberElement.value || 40;
  columnNumberElement.value = columnNumberElement.value || 60;

  const xBoxes = columnNumberElement.value;
  const yBoxes = rowNumberElement.value;

  try {
    values = JSON.parse(localStorage.getItem("korsstygn")) || {};
  } catch {
    console.error('Unable to read local data, resetting...');
    localStorage.clear();
  }
  document.getElementById("container").innerHTML = '';
  for (let y = 0; y < yBoxes; y++) {
    let row = document.createElement("div");
    row.style = "display: flex;";
    for (let x = 0; x < xBoxes; x++) {
      let element = document.createElement("div");
      element.addEventListener("click", markWithX);
      if (values[y] && values[y][x]?.checked){
        element.innerHTML = checkmark;
        element.style.color = values[y][x].color;
      }
      element.className = "box";
      element.x = x
      element.y = y
      row.appendChild(element);
    }
    document.getElementById("container").appendChild(row); 
  }
}

setup();
