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

  words += "";

  // Handle paise part
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
    words += "";
  }

  return words + "";
}

// Function to update the invoice preview
function updateInvoicePreview() {
  const invoicePreview = document.getElementById("invoicePreview");

  // Get values from form inputs
  const invoiceNumber = document.getElementById("invoiceNumber").value;
  const invoiceDate = document.getElementById("invoiceDate").value;
  const placeOfSupply = document.getElementById("placeOfSupply").value;
  const gstRate = parseFloat(document.getElementById("gstRate").value);
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

  // Calculate items and totals
  let subtotal = 0;
  const items = [];
  const itemRows = document.querySelectorAll("#itemsBody tr");

  itemRows.forEach((row, index) => {
    const slNo = index + 1;
    const hsn = row.querySelector(".item-hsn").value || "";
    const desc = row.querySelector(".item-desc").value || "Item";
    const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
    const unit = row.querySelector(".item-unit").value || "Pcs";
    const rate = parseFloat(row.querySelector(".item-rate").value) || 0;
    const discount = parseFloat(row.querySelector(".item-discount").value) || 0;
    const amount = qty * rate - discount;

    items.push({ slNo, hsn, desc, qty, unit, rate, discount, amount });
    subtotal += amount;
  });

  // Calculate tax on subtotal only (excluding delivery charge)
  const taxAmount = subtotal * (gstRate / 100);
  const grandTotal = subtotal + taxAmount + deliveryCharge;

  // Determine tax type based on place of supply
  const isInterState = placeOfSupply !== "HR"; // Assuming HR is the business state
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isInterState) {
    igstAmount = taxAmount;
  } else {
    cgstAmount = taxAmount / 2;
    sgstAmount = taxAmount / 2;
  }

  // Format dates
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  // Generate the invoice preview HTML
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
    </tr>
    <tr>
      <td><strong>GSTN:</strong> ${receiverGSTN}</td>
      <td><strong>E-WAY Bill:</strong> ${eWayBill}</td>
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
                      <h4>G.Total in Words : Rs. <span>${numberToWords(
                        grandTotal
                      )} Only</span></h4>
                  </div>
                  <div class="totals">
                      <div class="total-row">
                          <span>Total Taxable Value</span>
                          <span>₹${subtotal.toFixed(2)}</span>
                      </div>
                      ${
                        deliveryCharge > 0
                          ? `<div class="total-row delivery-charge-row">
                          <span>Delivery Charge</span>
                          <span>₹${deliveryCharge.toFixed(2)}</span>
                      </div>`
                          : `<div class="total-row delivery-charge-row" style="display: none;">
                          <span>Delivery Charge</span>
                          <span>₹0.00</span>
                      </div>`
                      }
                      ${
                        !isInterState
                          ? `
                      <div class="total-row">
                          <span>(+) CGST AMOUNT (${(gstRate / 2).toFixed(
                            2
                          )}%)</span>
                          <span>₹${cgstAmount.toFixed(2)}</span>
                      </div>
                      <div class="total-row">
                          <span>(+) SGST AMOUNT (${(gstRate / 2).toFixed(
                            2
                          )}%)</span>
                          <span>₹${sgstAmount.toFixed(2)}</span>
                      </div>
                      <div class="total-row">
                          <span>(+) IGST AMOUNT</span>
                          <span>₹0.00</span>
                      </div>
                      `
                          : `
                      <div class="total-row">
                          <span>(+) CGST AMOUNT</span>
                          <span>₹0.00</span>
                      </div>
                      <div class="total-row">
                          <span>(+) SGST AMOUNT</span>
                          <span>₹0.00</span>
                      </div>
                      <div class="total-row">
                          <span>(+) IGST AMOUNT (${gstRate}%)</span>
                          <span>₹${igstAmount.toFixed(2)}</span>
                      </div>
                      `
                      }
                      <div class="total-row">
                          <span>Round Off</span>
                          <span>₹0.00</span>
                      </div>
                      <div class="total-row grand-total">
                          <span>Grand Total</span>
                          <span>₹${grandTotal.toFixed(2)}</span>
                      </div>
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
    <p style="margin-top: 5px;">Authorised Sign.</p>
    <p style="margin-top: 5px;">Customer's Signature</p>
  </div>
</div>

          </div>
      `;
}

// Function to add a new item row
function addItemRow() {
  const itemsBody = document.getElementById("itemsBody");
  const newRow = document.createElement("tr");
  const slNo = itemsBody.children.length + 1;

  newRow.innerHTML = `
          <td>${slNo}</td>
          <td><input type="text" class="item-hsn" placeholder="HSN Code"></td>
          <td><input type="text" class="item-desc" placeholder="Item description"></td>
          <td><input type="number" class="item-qty" value="1" min="1"></td>
          <td><input type="text" class="item-unit" value="Pcs"></td>
          <td><input type="number" class="item-rate" value="0.00" step="0.01"></td>
          <td><input type="number" class="item-discount" value="0.00" step="0.01"></td>
          <td class="item-amount">0.00</td>
      `;

  itemsBody.appendChild(newRow);

  // Add event listeners to the new inputs
  const inputs = newRow.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("input", updateInvoicePreview);
  });

  updateInvoicePreview();
}

// Function to calculate item amount
function calculateItemAmount(row) {
  const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
  const rate = parseFloat(row.querySelector(".item-rate").value) || 0;
  const discount = parseFloat(row.querySelector(".item-discount").value) || 0;
  const amount = qty * rate - discount;
  row.querySelector(".item-amount").textContent = amount.toFixed(2);
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners to all form inputs
  const inputs = document.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("input", updateInvoicePreview);
  });

  // Add event listener to the "Add Item" button
  document.getElementById("addItemBtn").addEventListener("click", addItemRow);

  // Add event listeners to existing item inputs
  const itemInputs = document.querySelectorAll(
    ".item-hsn, .item-desc, .item-qty, .item-unit, .item-rate, .item-discount"
  );
  itemInputs.forEach((input) => {
    input.addEventListener("input", function () {
      calculateItemAmount(this.closest("tr"));
      updateInvoicePreview();
    });
  });

  // Add event listener to print button
  document.getElementById("printBtn").addEventListener("click", function () {
    window.print();
  });

  // Initialize the invoice preview
  updateInvoicePreview();
});
