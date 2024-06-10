let values = {};
const checkmark = '&#10006;';
let mouseIsDown = false;

function markWithX(e) {
  currentValue = (values[e.currentTarget.row] ? values[e.currentTarget.row][e.currentTarget.col] : null) || {} 
  if (currentValue.checked && currentValue.color == getColor()) {
    e.currentTarget.innerHTML = '';
    delete e.currentTarget.style.color
    delete values[e.currentTarget.row][e.currentTarget.col]
  } else {
    e.currentTarget.innerHTML = checkmark;
    e.currentTarget.style.color = getColor();
    values[e.currentTarget.row] ??= {};
    values[e.currentTarget.row][e.currentTarget.col] = { checked: true, color: getColor() }
  }
  const jsonValues = JSON.stringify(values)
  localStorage.setItem("korsstygn", jsonValues);
}

function reset() {
  localStorage.clear();
  document.getElementById("color").value = '#000000'
  setup()
}

function getColor() {
  return document.getElementById("color").value;
}

function setup() {

  storedSize = JSON.parse(localStorage.getItem("korsstygnStorlek") || '{}');
  const columns = document.getElementById("numberOfColumns").value || storedSize?.columns || 60;
  const rows = document.getElementById("numberOfRows").value || storedSize?.rows || 40;
  document.getElementById("numberOfRows").value = rows;
  document.getElementById("numberOfColumns").value = columns;

  localStorage.setItem("korsstygnStorlek", JSON.stringify({
    columns,
    rows
  }))

  try {
    values = JSON.parse(localStorage.getItem("korsstygn")) || {};
  } catch {
    console.error('Unable to read local data, resetting...');
    localStorage.clear();
  }
  document.getElementById("container").innerHTML = '';
  for (let r = 0; r < rows; r++) {
    let row = document.createElement("div");
    row.style = "display: flex;";
    for (let c = 0; c < columns; c++) {
      let element = document.createElement("div");
      element.addEventListener("mousedown", markWithX);
      if (values[r] && values[r][c]?.checked){
        element.innerHTML = checkmark;
        element.style.color = values[r][c].color;
      }
      element.className = "box";
      element.col = c
      element.row = r
      row.appendChild(element);
    }
    document.getElementById("container").appendChild(row); 
  }
}

setup();
