/* script.js */
const skuData = {
  conta: ["GrupoSixLLP"],
  squad: ["Delta", "Echo"],
  produto: [
    "SUGARSIX",
    "FLORASLIM",
    "PROSTASLIM",
    "ENDOPOWERPRO",
    "LIPOGUMMIES",
    "FLORALEAN",
    "ALPHAGUMMY",
    "PUREGUTPRO",
    "NERVEBLISS",
    "BACKSHIFTPRO",
  ],
  vsl: [
    "CALLCENTER",
    "VSL1",
    "VSL2",
    "VSL3",
    "VSL4",
    "VSL5",
    "VSL6",
    "VSL7",
    "VSL8",
    "VSL9",
    "VSL10",
  ],
  rede: [
    "CALLCENTER",
    "FACEBOOK",
    "YOUTUBE",
    "SEARCH",
    "NATIVE",
    "AFILIADOS",
    "EMAIL",
    "SMS",
  ],
  tipo_de_venda: ["CALLCENTER", "FRONT", "BACKREDIRECT", "UPSELL", "DOWNSELL"],
  kit: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  preco: [
    "5",
    "19",
    "29",
    "39",
    "49",
    "59",
    "69",
    "79",
    "89",
    "99",
    "109",
    "119",
    "129",
    "147",
    "149",
    "177",
    "198",
    "234",
    "261",
    "294",
    "351",
  ],
};

function generateSKU() {
  const selects = [
    "conta",
    "squad",
    "produto",
    "vsl",
    "rede",
    "tipo_de_venda",
    "kit",
    "preco",
  ];
  const values = selects.map((id) => document.getElementById(id).value);

  if (values.some((val) => val === "")) {
    alert("Por favor, selecione todas as opções");
    return null; // Return null if SKU generation fails
  }

  const sku = `A${values[0]}B${values[1]}C${values[2]}D${values[3]}E${values[4]}F${values[5]}G${values[6]}H${values[7]}`;
  document.getElementById("skuDisplay").textContent = sku;

  // Decode SKU
  const decodedSKU = decodeSKU(sku);
  document.getElementById("skuDecoded").textContent = JSON.stringify(
    decodedSKU,
    null,
    2
  );
  return sku;
}

function decodeSKU(sku) {
  const pattern = /A(\d+)B(\d+)C(\d+)D(\d+)E(\d+)F(\d+)G(\d+)H(\d+)/;
  const matches = sku.match(pattern);

  if (!matches) {
    return {
      conta: "INVALID",
      squad: "INVALID",
      produto: "INVALID",
      vsl: "INVALID",
      rede: "INVALID",
      tipo_de_venda: "INVALID",
      kit: "INVALID",
      preco: "INVALID",
    };
  }

  return {
    conta: skuData.conta[parseInt(matches[1]) - 1],
    squad: skuData.squad[parseInt(matches[2]) - 1],
    produto: skuData.produto[parseInt(matches[3]) - 1],
    vsl: skuData.vsl[parseInt(matches[4])],
    rede: skuData.rede[parseInt(matches[5]) - 1],
    tipo_de_venda: skuData.tipo_de_venda[parseInt(matches[6]) - 1],
    kit: skuData.kit[parseInt(matches[7]) - 1],
    preco: matches[8],
  };
}

function copySKU() {
  const skuElement = document.getElementById("skuDisplay");
  const sku = skuElement.textContent;

  if (sku) {
    navigator.clipboard.writeText(sku).then(() => {
      alert("SKU copiado: " + sku);
    });
  }
}

let tableData = [];

function addToTable() {
  const isProdutoPai = document.getElementById("produtoPaiCheckbox").checked;
  const handle = document.getElementById("handle").value;
  let tituloProduto, descricaoProduto;

  if (isProdutoPai) {
    tituloProduto = document.getElementById("tituloProdutoPai").value;
    descricaoProduto = document.getElementById("descricaoProdutoPai").value;
    sku = generateSKU(); // Gera SKU normal se não for Produto Pai

    document.getElementById("skuDisplay").textContent = sku;

    const decodedSKU = decodeSKU(sku);

    document.getElementById("skuDecoded").textContent = JSON.stringify(
      decodedSKU,
      null,
      2
    );
  } else {
    sku = generateSKU(); // Gera SKU normal se não for Produto Pai
    if (!sku) return; // Sai se a geração de SKU falhar (campos de seleção vazios)
    const decodedSKU = decodeSKU(sku);
    document.getElementById("skuDecoded").textContent = JSON.stringify(
      decodedSKU,
      null,
      2
    );
    tituloProduto = ""; // Limpa para variantes
    descricaoProduto = ""; // Limpa para variantes
  }

  const tableBody = document.getElementById("skuTableBody");
  const newRow = tableBody.insertRow();

  let newRowData;

  const data = decodeSKU(sku);
  const vslNumber = data.vsl === "CALLCENTER" ? 0 : data.vsl.replace("VSL", "");

  if (isProdutoPai) {
    newRowData = {
      handle: handle, // Handle amigável para produto pai
      title: tituloProduto, // Título do produto pai
      description: descricaoProduto, // Descrição do produto pai
      seo_title: tituloProduto, // SEO Title pode ser o mesmo que o título
      seo_description: descricaoProduto.substring(0, 150), // SEO Description -  primeiros 150 caracteres
      vendor: "", // Vendor padrão ou pode deixar vazio
      type: "", // Tipo 'Produto Pai' para fácil identificação
      tags: "", // Tag para filtrar se necessário
      active: "TRUE",
      variant_sku: sku, // SKU 'PAI-...'
      option_1_name: "Bottles",
      option_1_value: `${data.kit} ${
        data.kit === "1" ? "Bottle" : "Bottles"
      } - ${data.squad[0]}${vslNumber}${data.rede[0]}${data.tipo_de_venda[0]}`,
      option_2_name: "",
      option_2_value: "",
      option_3_name: "",
      option_3_value: "",
      variant_grams: "",
      variant_inventory_qty: "20000", // Estoque pode ser vazio ou 'N/A'
      variant_price: "", // Preço pode ser vazio ou 'N/A'
      variant_compare_at_price: "",
      variant_requires_shipping: "FALSE", // Produto pai não precisa de frete direto
      variant_taxable: "FALSE", // Produto pai pode não ser diretamente taxável
      inventory_policy: "",
      variant_barcode: "",
      variant_weight_unit: "",
      cost_per_item: "",
      length: "2",
      width: "2",
      height: "4",
      dimension_unit: "in",
    };
  } else {
    const data = decodeSKU(sku);
    const vslNumber =
      data.vsl === "CALLCENTER" ? 0 : data.vsl.replace("VSL", "");

    newRowData = {
      handle: handle, // Handle mais completo
      title: "", // Título vazio para variantes, pode usar SKU se quiser
      description: "", // Descrição vazia para variantes
      seo_title: "",
      seo_description: "",
      vendor: "",
      type: "",
      tags: "",
      active: "TRUE",
      variant_sku: sku,
      option_1_name: "Bottles",
      option_1_value: `${data.kit} ${
        data.kit === "1" ? "Bottle" : "Bottles"
      } - ${data.squad[0]}${vslNumber}${data.rede[0]}${data.tipo_de_venda[0]}`,
      option_2_name: "",
      option_2_value: "",
      option_3_name: "",
      option_3_value: "",
      variant_grams: "",
      variant_inventory_qty: "20000",
      variant_price: data.preco,
      variant_compare_at_price: "",
      variant_requires_shipping: "TRUE",
      variant_taxable: "TRUE",
      inventory_policy: "",
      variant_barcode: "",
      variant_weight_unit: "",
      cost_per_item: "",
      length: "2",
      width: "2",
      height: "4",
      dimension_unit: "in",
    };
  }

  tableData.push(newRowData);
  updateTableRow(newRow, newRowData);
  saveToLocalStorage();

  // Limpar campos de Produto Pai após adicionar à tabela (opcional)
  document.getElementById("tituloProdutoPai").value = "";
  document.getElementById("descricaoProdutoPai").value = "";
  document.getElementById("produtoPaiCheckbox").checked = false;
}

function updateTableRow(rowElement, rowData) {
  rowElement.innerHTML = `
      <td><button class="remove-btn" onclick="removeRow('${rowData.variant_sku}')">X</button></td>
      <td data-field="handle">${rowData.handle}</td>
      <td data-field="title">${rowData.title}</td>
      <td data-field="description">${rowData.description}</td>
      <td data-field="seo_title">${rowData.seo_title}</td>
      <td data-field="seo_description">${rowData.seo_description}</td>
      <td data-field="vendor">${rowData.vendor}</td>
      <td data-field="type">${rowData.type}</td>
      <td data-field="tags">${rowData.tags}</td>
      <td data-field="active">${rowData.active}</td>
      <td data-field="option_1_name">${rowData.option_1_name}</td>
      <td data-field="option_1_value">${rowData.option_1_value}</td>
      <td data-field="option_2_name">${rowData.option_2_name}</td>
      <td data-field="option_2_value">${rowData.option_2_value}</td>
      <td data-field="option_3_name">${rowData.option_3_name}</td>
      <td data-field="option_3_value">${rowData.option_3_value}</td>
      <td data-field="variant_sku">${rowData.variant_sku}</td>
      <td data-field="variant_grams">${rowData.variant_grams}</td>
      <td data-field="variant_inventory_qty">${rowData.variant_inventory_qty}</td>
      <td data-field="variant_price">${rowData.variant_price}</td>
      <td data-field="variant_compare_at_price">${rowData.variant_compare_at_price}</td>
      <td data-field="variant_requires_shipping">${rowData.variant_requires_shipping}</td>
      <td data-field="variant_taxable">${rowData.variant_taxable}</td>
      <td data-field="inventory_policy">${rowData.inventory_policy}</td>
      <td data-field="variant_barcode">${rowData.variant_barcode}</td>
      <td data-field="variant_weight_unit">${rowData.variant_weight_unit}</td>
      <td data-field="cost_per_item">${rowData.cost_per_item}</td>
      <td data-field="length">${rowData.length}</td>
      <td data-field="width">${rowData.width}</td>
      <td data-field="height">${rowData.height}</td>
      <td data-field="dimension_unit">${rowData.dimension_unit}</td>
  `;

  // Make cells editable after row is created
  Array.from(rowElement.cells).forEach((cell, index) => {
    if (index > 0) {
      // Skip the first cell (remove button)
      cell.addEventListener("click", makeCellEditable);
    }
  });
}

function saveToLocalStorage() {
  localStorage.setItem("tableData", JSON.stringify(tableData));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("tableData");
  if (data) {
    tableData = JSON.parse(data);
  }
  populateTable();
}

function populateTable() {
  const tableBody = document.getElementById("skuTableBody");
  tableBody.innerHTML = ""; // Clear existing table rows
  tableData.forEach((row) => {
    const newRow = tableBody.insertRow();
    updateTableRow(newRow, row);
  });
}

function removeRow(sku) {
  const index = tableData.findIndex((row) => row.variant_sku === sku);
  if (index !== -1) {
    tableData.splice(index, 1);
    saveToLocalStorage();
    populateTable(); // Re-render the table
  }
}

function saveToCSV() {
  if (tableData.length === 0) {
    alert("A tabela está vazia. Adicione SKUs para gerar o CSV.");
    return;
  }

  const headers = Object.keys(tableData[0]).join(",");
  const csvRows = tableData.map((row) => Object.values(row).join(","));
  const csvData =
    "data:text/csv;charset=utf-8," + headers + "\n" + csvRows.join("\n");
  const encodedUri = encodeURI(csvData);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "sku_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // Clean up the link element
}

function clearTable() {
  tableData = [];
  saveToLocalStorage();
  populateTable();
}

let currentlyEditingCell = null;

function makeCellEditable(event) {
  if (currentlyEditingCell) {
    return; // Prevent editing multiple cells at once
  }

  const cell = event.target;
  const rowIndex = cell.parentNode.rowIndex - 1; // Get row index, adjusting for header row
  const colIndex = cell.cellIndex;
  const fieldName = cell.dataset.field;
  const originalValue = cell.textContent.trim();

  if (colIndex <= 0) return; // Don't edit the remove button cell

  cell.classList.add("editable-cell");
  currentlyEditingCell = cell;

  const input = document.createElement("input");
  input.value = originalValue;
  input.style.boxSizing = "border-box"; // Ensure padding and border are inside the element's dimensions

  input.addEventListener("blur", function () {
    updateCellContent(cell, rowIndex, fieldName, input.value);
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      updateCellContent(cell, rowIndex, fieldName, input.value);
    } else if (e.key === "Escape") {
      cell.textContent = originalValue;
      cell.classList.remove("editable-cell");
      currentlyEditingCell = null;
    }
  });

  cell.textContent = ""; // Clear cell content
  cell.appendChild(input);
  input.focus();
}

function updateCellContent(cell, rowIndex, fieldName, newValue) {
  cell.classList.remove("editable-cell");
  cell.textContent = newValue;
  tableData[rowIndex][fieldName] = newValue; // Update the tableData array
  saveToLocalStorage(); // Save updated data to localStorage
  currentlyEditingCell = null;
}

loadFromLocalStorage();
