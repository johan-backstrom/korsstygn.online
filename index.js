let values = {};
const checkmark = '&#10006;';

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
  setUpEditMode()
}

function getColor() {
  return document.getElementById("color").value;
}

function printFriendly() {
  window.open('./print.html','_blank','titlebar=no,toolbar=no,menubar=no');
}

function setWidth(columns) {
  localStorage.setItem("korsstygnBredd", columns)
  const rows = document.getElementById("numberOfRows")?.value;
  render(values, rows, columns, true)
}

function setHeight(rows) {
  localStorage.setItem("korsstygnHöjd", rows)
  const columns = document.getElementById("numberOfColumns")?.value;
  render(values, rows, columns, true)
}

function setUpEditMode() {

  const columns = localStorage.getItem("korsstygnBredd") || 60;
  const rows = localStorage.getItem("korsstygnHöjd") || 40;
  document.getElementById("numberOfRows").value = rows;
  document.getElementById("numberOfColumns").value = columns;
  try {
    values = JSON.parse(localStorage.getItem("korsstygn")) || {};
  } catch {
    console.error('Unable to read local data, resetting...');
    localStorage.clear();
  }
  render(values, rows, columns, true);
}

function setUpPrintMode() {
  const columns = localStorage.getItem("korsstygnBredd") || 60;
  const rows = localStorage.getItem("korsstygnHöjd") || 40;
  try {
    values = JSON.parse(localStorage.getItem("korsstygn")) || {};
  } catch {
    console.error('Unable to read local data');
  }
  render(values, rows, columns, false);
}

function render(input_values, rows, columns, editable) {
  document.getElementById("container").innerHTML = '';
  for (let r = 0; r < rows; r++) {
    let row = document.createElement("div");
    row.style = "display: flex;";
    for (let c = 0; c < columns; c++) {
      let element = document.createElement("div");
      if (editable) {
        element.addEventListener("mousedown", markWithX);
      }
      if (input_values[r] && input_values[r][c]?.checked){
        element.innerHTML = checkmark;
        element.style.color = input_values[r][c].color;
      }
      element.className = editable ? "editBox" : "printBox";
      element.col = c
      element.row = r
      row.appendChild(element);
    }
    document.getElementById("container").appendChild(row);
  }
}