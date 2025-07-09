const generateEmailTemplate = (lowStockProducts) => {
    const productRows = lowStockProducts.map((product) => {
      return `<tr>
        <td>${product.name}</td>
        <td>${product.stockQuantity}</td>
      </tr>`;
    }).join("");
  
    return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      .container { border: 1px solid #ccc; border-radius: 8px; padding: 20px; max-width: 600px; margin: auto; }
      .header { background-color: #f44336; color: white; text-align: center; padding: 10px 0; border-radius: 8px 8px 0 0; }
      .content { margin: 20px 0; }
      .alert-text { color: #f44336; font-weight: bold; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { padding: 10px; text-align: left; border: 1px solid #ccc; }
      th { background-color: #f2f2f2; }
      .footer { margin-top: 20px; text-align: center; color: #777; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>⚠️ Low Stock Alert</h2>
      </div>
      <div class="content">
        <p>Dear Admin,</p>
        <p class="alert-text">The following products are critically low in stock and require immediate attention:</p>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Current Stock</th>
            </tr>
          </thead>
          <tbody>
            ${productRows} <!-- Dynamically generated rows -->
          </tbody>
        </table>
        <p>Please take the necessary actions to restock these items promptly.</p>
      </div>
      <div class="footer">
        <p>This is an automated email. Please do not reply.</p>
      </div>
    </div>
  </body>
  </html>
    `;
  };
  
module.exports = generateEmailTemplate;
  