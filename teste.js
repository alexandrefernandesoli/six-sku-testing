const fs = require("fs");
const csv = require("csv-parser");

async function processCSV(filePath) {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const processedData = await Promise.all(
          results.map(async (row) => {
            if (row.option_1_value) {
              const parts = row.option_1_value.split(" - ");
              if (parts.length > 1) {
                const quantity = parts[0];
                const suffix = parts.slice(1).join(" - ");
                const price = row.variant_price || ""; // Use empty string if variant_price is missing
                row.option_1_value = `${quantity} - ${suffix}`;
              }
            }
            return row;
          })
        );
        resolve(processedData);
      })
      .on("error", reject); // Handle errors during CSV parsing
  });
}

function convertArrayOfObjectsToCSV(arr) {
  if (!arr || arr.length === 0) {
    return ""; // Handle empty array case
  }
  const header = Object.keys(arr[0]).join(",");
  const rows = arr
    .map((obj) =>
      Object.values(obj)
        .map(
          (value) => `"${value ? value.toString().replace(/"/g, '""') : ""}"`
        )
        .join(",")
    )
    .join("\n"); // Escape double quotes
  return `${header}\n${rows}`;
}

function writeCSV(csvContent, filePath) {
  fs.writeFile(filePath, csvContent, (err) => {
    if (err) {
      console.error("Error writing CSV file:", err);
    } else {
      console.log(`CSV file "${filePath}" written successfully.`);
    }
  });
}

// Example usage:
const filePath = "lipogummies.csv"; // Replace with your CSV file path
const outputFilePath = "processed_data.csv";

async function main() {
  try {
    const processedData = await processCSV(filePath);
    const csvContent = convertArrayOfObjectsToCSV(processedData);
    writeCSV(csvContent, outputFilePath);
    console.log("CSV processing complete.");
  } catch (error) {
    console.error("Error processing CSV:", error);
  }
}

main();
