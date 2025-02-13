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
    "GERAL",
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
    "114",
    "117",
    "119",
    "129",
    "132",
    "147",
    "149",
    "174",
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
      option_1_name: "Bottles",
      option_1_value: `${data.kit} ${
        data.kit === "1" ? "Bottle" : "Bottles"
      } - $${data.preco} - ${data.squad[0]}${vslNumber}${data.rede[0]}${
        data.tipo_de_venda[0]
      }`,
      option_2_name: "",
      option_2_value: "",
      option_3_name: "",
      option_3_value: "",
      variant_sku: sku, // SKU 'PAI-...'
      variant_grams: "",
      variant_inventory_qty: "20000", // Estoque pode ser vazio ou 'N/A'
      variant_price: data.preco,
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
      option_1_name: "Bottles",
      option_1_value: `${data.kit} ${
        data.kit === "1" ? "Bottle" : "Bottles"
      } - $${data.preco} - ${data.squad[0]}${vslNumber}${data.rede[0]}${
        data.tipo_de_venda[0]
      }`,
      option_2_name: "",
      option_2_value: "",
      option_3_name: "",
      option_3_value: "",
      variant_sku: sku,
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
  // Create remove button cell first
  const removeCell = document.createElement("td");
  const removeButton = document.createElement("button");
  removeButton.className = "remove-btn";
  removeButton.textContent = "X";
  removeButton.onclick = () => removeRow(rowData.variant_sku);
  removeCell.appendChild(removeButton);
  rowElement.appendChild(removeCell);

  // Add the rest of the cells
  const fields = [
    "handle",
    "title",
    "description",
    "seo_title",
    "seo_description",
    "vendor",
    "type",
    "tags",
    "active",
    "option_1_name",
    "option_1_value",
    "option_2_name",
    "option_2_value",
    "option_3_name",
    "option_3_value",
    "variant_sku",
    "variant_grams",
    "variant_inventory_qty",
    "variant_price",
    "variant_compare_at_price",
    "variant_requires_shipping",
    "variant_taxable",
    "inventory_policy",
    "variant_barcode",
    "variant_weight_unit",
    "cost_per_item",
    "length",
    "width",
    "height",
    "dimension_unit",
  ];

  fields.forEach((field) => {
    const cell = document.createElement("td");
    cell.dataset.field = field;
    cell.textContent = rowData[field];
    cell.addEventListener("click", makeCellEditable);
    rowElement.appendChild(cell);
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

  const headersTXT = [
    "Handle",
    "Title",
    "Description",
    "Seo title",
    "Seo description",
    "Vendor",
    "Type",
    "Tags",
    "Active",
    "Option1 Name",
    "Option1 Value",
    "Option2 Name",
    "Option2 Value",
    "Option3 Name",
    "Option3 Value",
    "Variant SKU",
    "Variant Grams",
    "Variant Inventory Qty",
    "Variant Price",
    "Variant Compare At Price",
    "Variant Requires Shipping",
    "Variant Taxable",
    "Inventory Policy",
    "Variant Barcode",
    "Variant Weight Unit",
    "Cost per item",
    "Length",
    "Width",
    "Height",
    "Dimension Unit",
  ];

  const headers = headersTXT.join(",");
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

function saveCurrentTableAsNewProfile() {
  const profileName = prompt("Enter a name for this profile:");
  if (!profileName) return; // User cancelled or entered empty name

  const profiles = JSON.parse(localStorage.getItem("savedProfiles") || "{}");

  // Save current table data under the profile name
  profiles[profileName] = {
    timestamp: new Date().toISOString(),
    data: tableData,
  };

  localStorage.setItem("savedProfiles", JSON.stringify(profiles));
  updateProfilesList();
}

function loadProfile(profileName) {
  const profiles = JSON.parse(localStorage.getItem("savedProfiles") || "{}");
  const profile = profiles[profileName];

  if (profile) {
    tableData = [...profile.data];
    saveToLocalStorage();
    populateTable();
  }
}

function deleteProfile(profileName) {
  if (!confirm(`Are you sure you want to delete profile "${profileName}"?`))
    return;

  const profiles = JSON.parse(localStorage.getItem("savedProfiles") || "{}");
  delete profiles[profileName];
  localStorage.setItem("savedProfiles", JSON.stringify(profiles));
  updateProfilesList();
}

function updateProfilesList() {
  const profilesContainer = document.getElementById("profilesContainer");
  const profiles = JSON.parse(localStorage.getItem("savedProfiles") || "{}");

  profilesContainer.innerHTML = "";

  Object.entries(profiles).forEach(([name, profile]) => {
    const profileCard = document.createElement("div");
    profileCard.className = "profile-card";

    const date = new Date(profile.timestamp).toLocaleDateString();
    const itemCount = profile.data.length;

    profileCard.innerHTML = `
      <h3>${name}</h3>
      <p>Items: ${itemCount}</p>
      <p>Saved: ${date}</p>
      <div class="profile-actions">
        <button onclick="loadProfile('${name}')">Load</button>
        <button onclick="deleteProfile('${name}')" class="warn-button">Delete</button>
      </div>
    `;

    profilesContainer.appendChild(profileCard);
  });
}

// Call this when page loads
loadFromLocalStorage();
updateProfilesList();

function updateNewValueOptions() {
  const parameter = document.getElementById("duplicateParameter").value;
  const newValueSelect = document.getElementById("newValue");

  // Clear existing options
  newValueSelect.innerHTML = "";

  // Add new options based on selected parameter
  PARAMETER_OPTIONS[parameter].forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    newValueSelect.appendChild(optionElement);
  });
}

function duplicateTableWithNewParameter() {
  const parameter = document.getElementById("duplicateParameter").value;
  const newValue = document.getElementById("newValue").value;
  const handleSuffix = document.getElementById("newHandle").value;

  // Create new entries based on current tableData
  const newEntries = tableData
    .map((row) => {
      // Create a deep copy of the row
      const newRow = { ...row };

      // Update the handle if suffix is provided
      if (handleSuffix) {
        newRow.handle = row.handle + handleSuffix;
      }

      // Update the select element with the new value
      const selectElement = document.getElementById(parameter);
      if (selectElement) {
        selectElement.value = newValue;
      }

      // Generate new SKU based on current selections
      const newSku = generateSKU();
      if (!newSku) return null; // Skip if SKU generation fails

      // Update SKU-related fields
      newRow.variant_sku = newSku;

      // Update option_1_value based on new parameters
      const decodedSku = decodeSKU(newSku);
      const vslNumber =
        decodedSku.vsl === "CALLCENTER" ? 0 : decodedSku.vsl.replace("VSL", "");
      newRow.option_1_value = `${decodedSku.kit} ${
        decodedSku.kit === "1" ? "Bottle" : "Bottles"
      } - ${decodedSku.squad[0]}${vslNumber}${decodedSku.rede[0]}${
        decodedSku.tipo_de_venda[0]
      }`;

      // Update price if that's the parameter being changed
      if (parameter === "preco") {
        newRow.variant_price = newValue;
      }

      return newRow;
    })
    .filter((row) => row !== null); // Remove any failed entries

  // Add new entries to tableData
  tableData.push(...newEntries);

  // Save and update display
  saveToLocalStorage();
  populateTable();

  // Reset the handle suffix input
  document.getElementById("newHandle").value = "";
}

// Update the updateTableRow function to properly handle the remove button
function updateTableRow(rowElement, rowData) {
  // Create remove button cell first
  const removeCell = document.createElement("td");
  const removeButton = document.createElement("button");
  removeButton.className = "remove-btn";
  removeButton.textContent = "X";
  removeButton.onclick = () => removeRow(rowData.variant_sku);
  removeCell.appendChild(removeButton);
  rowElement.appendChild(removeCell);

  // Add the rest of the cells
  const fields = [
    "handle",
    "title",
    "description",
    "seo_title",
    "seo_description",
    "vendor",
    "type",
    "tags",
    "active",
    "option_1_name",
    "option_1_value",
    "option_2_name",
    "option_2_value",
    "option_3_name",
    "option_3_value",
    "variant_sku",
    "variant_grams",
    "variant_inventory_qty",
    "variant_price",
    "variant_compare_at_price",
    "variant_requires_shipping",
    "variant_taxable",
    "inventory_policy",
    "variant_barcode",
    "variant_weight_unit",
    "cost_per_item",
    "length",
    "width",
    "height",
    "dimension_unit",
  ];

  fields.forEach((field) => {
    const cell = document.createElement("td");
    cell.dataset.field = field;
    cell.textContent = rowData[field];
    cell.addEventListener("click", makeCellEditable);
    rowElement.appendChild(cell);
  });
}

// Add event listener for parameter change
document
  .getElementById("duplicateParameter")
  .addEventListener("change", updateNewValueOptions);

// Initialize new value options when page loads
document.addEventListener("DOMContentLoaded", () => {
  updateNewValueOptions();
});
