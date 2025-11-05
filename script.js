function numberToWords(num) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (num === 0) return "Zero";

  let words = "";

  // Handle rupees part
  let rupees = Math.floor(num);
  let paise = Math.round((num - rupees) * 100);

  if (rupees > 0) {
    if (rupees >= 10000000) {
      words += numberToWords(Math.floor(rupees / 10000000)) + " Crore ";
      rupees %= 10000000;
    }

    if (rupees >= 100000) {
      words += numberToWords(Math.floor(rupees / 100000)) + " Lakh ";
      rupees %= 100000;
    }

    if (rupees >= 1000) {
      words += numberToWords(Math.floor(rupees / 1000)) + " Thousand ";
      rupees %= 1000;
    }

    if (rupees >= 100) {
      words += numberToWords(Math.floor(rupees / 100)) + " Hundred ";
      rupees %= 100;
    }

    if (rupees > 0) {
      if (words !== "") words += "and ";

      if (rupees < 20) {
        words += ones[rupees];
      } else {
        words += tens[Math.floor(rupees / 10)];
        if (rupees % 10 > 0) {
          words += " " + ones[rupees % 10];
        }
      }
    }
  }

  if (words === "") words = "Zero";

  if (paise > 0) {
    words += " and ";
    if (paise < 20) {
      words += ones[paise];
    } else {
      words += tens[Math.floor(paise / 10)];
      if (paise % 10 > 0) {
        words += " " + ones[paise % 10];
      }
    }
    words += " Paise";
  }

  return words.trim();
}

// Function to update the invoice preview
function updateInvoicePreview() {
  const invoicePreview = document.getElementById("invoicePreview");

  // Get values from form inputs
  const invoiceNumber = document.getElementById("invoiceNumber").value;
  const invoiceDate = document.getElementById("invoiceDate").value;
  const placeOfSupply = document.getElementById("placeOfSupply").value;
  const cgstRate = parseFloat(document.getElementById("cgstRate").value) || 0;
  const sgstRate = parseFloat(document.getElementById("sgstRate").value) || 0;
  const igstRate = parseFloat(document.getElementById("igstRate").value) || 0;
  const receiverName = document.getElementById("receiverName").value;
  const eWayBill = document.getElementById("eWayBill").value || "";
  const receiverGSTN = document.getElementById("receiverGSTN").value || "";
  const receiverAddress =
    document.getElementById("receiverAddress").value || "";
  const consigneeName = document.getElementById("consigneeName").value || "";
  const consigneeAddress =
    document.getElementById("consigneeAddress").value || "";
  const vehicleNo = document.getElementById("vehicleNo").value || "";
  const deliveryCharge =
    parseFloat(document.getElementById("deliveryCharge").value) || 0;

  // Calculate subtotal
  let subtotal = 0;
  const items = [];
  const itemRows = document.querySelectorAll("#itemsBody tr");

  itemRows.forEach((row, index) => {
    const slNo = index + 1;
    const hsn = row.querySelector(".item-hsn").value || "";
    const desc = row.querySelector(".item-desc").value || "Item";
    const qty = row.querySelector(".item-qty").value || "";
    const unit = row.querySelector(".item-unit").value || "Pcs";
    const rate = parseFloat(row.querySelector(".item-rate").value) || 0;
    const discount = parseFloat(row.querySelector(".item-discount").value) || 0;
    const amount = unit * rate - discount;

    items.push({ slNo, hsn, desc, qty, unit, rate, discount, amount });
    subtotal += amount;
  });

  const businessState = "DL";
  const isInterState = placeOfSupply !== businessState;

  // Calculate tax values
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isInterState) {
    igstAmount = subtotal * (igstRate / 100);
  } else {
    cgstAmount = subtotal * (cgstRate / 100);
    sgstAmount = subtotal * (sgstRate / 100);
  }

  // Grand total
  const grandTotalBeforeRound =
    subtotal + cgstAmount + sgstAmount + igstAmount + deliveryCharge;

  // Round off the grand total to the nearest integer
  const grandTotal = Math.round(grandTotalBeforeRound);

  // Calculate round off difference (for display)
  const roundOff = (grandTotal - grandTotalBeforeRound).toFixed(2);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  // Tax section
  const taxSection = isInterState
    ? `
      <div class="total-row"><span>(+) IGST (${igstRate}%)</span><span>₹${igstAmount.toFixed(
        2
      )}</span></div>
      <div class="total-row"><span>(+) CGST</span><span>₹0.00</span></div>
      <div class="total-row"><span>(+) SGST</span><span>₹0.00</span></div>
    `
    : `
      <div class="total-row"><span>(+) CGST (${cgstRate}%)</span><span>₹${cgstAmount.toFixed(
        2
      )}</span></div>
      <div class="total-row"><span>(+) SGST (${sgstRate}%)</span><span>₹${sgstAmount.toFixed(
        2
      )}</span></div>
      <div class="total-row"><span>(+) IGST</span><span>₹0.00</span></div>
    `;

  // Generate Invoice Preview HTML
  invoicePreview.innerHTML = `
    <div class="company-header">
      <div class="company-name">SURYALAKSHMI TRADERS</div>
      <div class="company-address">H.NO, PVT SV-1605, KH NO.159, GALI NO.5/11, SAMTA VIHAR MUKUNDPUR, NEW DELHI-110042</div>
      <div class="company-contact">Deals in: Paints, Epoxy Paints, Putty, Water Proofing, Primer, Hardware & Work contract</div>
      <div class="company-contact">Mobile: 9729708912, 8168239664 | E-mail: suryalakshmitraders98@gmail.com</div>
      <div class="company-contact">GSTN: 07ESVPK4501D1ZP</div>
    </div>

    <div class="invoice-title">INVOICE</div>
    <div class="invoice-details">
      <table>
        <tr>
          <td><strong>Invoice No:</strong> ${invoiceNumber}</td>
          <td><strong>Date:</strong> ${formatDate(invoiceDate)}</td>
          <td><strong>Place of Supply:</strong> ${placeOfSupply}</td>
          <td><strong>Vehicle No:</strong> ${vehicleNo}</td>
        </tr>
      </table>
    </div>

    <div class="receiver-details">
      <div class="receiver">
        <h3>Details of Receiver (Bill To)</h3>
        <p><strong>Name:</strong> ${receiverName}</p>
        <p><strong>Address:</strong> ${receiverAddress.replace(
          /\n/g,
          "<br>"
        )}</p>
        <p><strong>GSTN:</strong> ${receiverGSTN}</p>
        <p><strong>E-WAY Bill:</strong> ${eWayBill}</p>
      </div>
      <div class="consignee">
        <h3>Details of Consignee (Ship To)</h3>
        <p><strong>Name:</strong> ${consigneeName}</p>
        <p><strong>Address:</strong> ${consigneeAddress.replace(
          /\n/g,
          "<br>"
        )}</p>
      </div>
    </div>

    <table class="invoice-table">
      <thead>
        <tr>
          <th>SL.No</th>
          <th>HSN/SAC</th>
          <th>Item</th>
          <th>Qty</th>
          <th>Unit</th>
          <th>Rate</th>
          <th>Discount</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
          <tr>
            <td>${item.slNo}</td>
            <td>${item.hsn}</td>
            <td>${item.desc}</td>
            <td>${item.qty}</td>
            <td>${item.unit}</td>
            <td>₹${item.rate.toFixed(2)}</td>
            <td>₹${item.discount.toFixed(2)}</td>
            <td>₹${item.amount.toFixed(2)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="invoice-footer">
      <div class="totals-container">
        <div class="amount-in-words">
          <h4>Amount in Words: <span>Rupees ${numberToWords(
            grandTotal
          )} Only</span></h4>
        </div>
        <div class="totals">
          <div class="total-row"><span>Total Taxable Value</span><span>₹${subtotal.toFixed(
            2
          )}</span></div>
          ${
            deliveryCharge > 0
              ? `<div class="total-row"><span>Delivery Charge</span><span>₹${deliveryCharge.toFixed(
                  2
                )}</span></div>`
              : ""
          }
          ${taxSection}
          <div class="total-row grand-total"><span>Grand Total</span><span>₹${grandTotal.toFixed(
            0
          )}</span></div>
        </div>
      </div>

      <div class="bottom-section">
        <div class="left-column">
          <div class="bank-details">
            <p><strong>SURYALAKSHMI TRADERS</strong></p>
            <p>BANK - YES BANK | A/C NO - 062261900003140</p>
            <p>RTGS/IFSC CODE - YESB0000622</p>
            <p>Branch - Rohini Sector 18, New Delhi 110085</p>
          </div>
          <div class="terms">
            <p>- Goods once sold cannot be taken back.</p>
            <p>- Subject to Delhi Jurisdiction only.</p>
            <p>Whether Tax Payable under Reverse Charge: No</p>
          </div>
        </div>

        <div class="signature">
          <img src="sign.jpg" alt="Signature" width="100" /> 
          <p>For SURYALAKSHMI TRADERS</p>
          <p>Authorised Sign.</p>
          <p>Customer's Signature</p>
        </div>
      </div>
    </div>
  `;
}
function removeItemRow(index) {
  const itemsBody = document.getElementById("itemsBody");
  const rows = itemsBody.querySelectorAll("tr");

  if (rows[index]) {
    rows[index].remove();
  }

  // Reorder SL.No and reassign remove buttons
  Array.from(itemsBody.children).forEach((row, i) => {
    row.cells[0].textContent = i + 1; // Update SL.No
    const removeBtn = row.querySelector(".remove-btn");
    if (removeBtn) removeBtn.setAttribute("onclick", `removeItemRow(${i})`);
  });

  updateInvoicePreview();
}

// Add new item row
function addItemRow() {
  const itemsBody = document.getElementById("itemsBody");
  const newRow = document.createElement("tr");
  const slNo = itemsBody.children.length + 1;

  newRow.innerHTML = `
    <td>${slNo}</td>
    <td><input type="text" class="item-hsn" placeholder="HSN Code"></td>
    <td><input type="text" class="item-desc" placeholder="Item description"></td>
    <td><input type="text" class="item-qty"></td>
    <td><input type="number" class="item-unit" value="1" min="1"></td>
    <td><input type="number" class="item-rate" value="0.00" step="0.01"></td>
    <td><input type="number" class="item-discount" value="0.00" step="0.01"></td>
    <td class="item-amount">0.00</td>
    <td><button class="remove-btn" onclick="removeItemRow(${
      slNo - 1
    })">❌</button></td>
  `;
  itemsBody.appendChild(newRow);

  const inputs = newRow.querySelectorAll("input");
  inputs.forEach((input) =>
    input.addEventListener("input", updateInvoicePreview)
  );

  updateInvoicePreview();
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll("input, textarea")
    .forEach((input) => input.addEventListener("input", updateInvoicePreview));

  document.getElementById("addItemBtn").addEventListener("click", addItemRow);

  document
    .getElementById("printBtn")
    .addEventListener("click", () => window.print());

  updateInvoicePreview();
});
