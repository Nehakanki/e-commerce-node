
const cron = require("node-cron");
const sendEmail = require("../config/email"); 
const generateEmailTemplate = require("../config/emailTemplate"); 

const User = require("../models/User"); 
const Product = require("../models/Product");

const runInventoryCheck = async () => {
  console.log("Running daily inventory check for all admins...");

  try {
   
    const admins = await User.find({ role: "admin" });

    if (!admins || admins.length === 0) {
      console.log("No admins found.");
      return;
    }

    console.log(`Found ${admins.length} admins.`);

    for (let admin of admins) {
      const adminEmail = admin.email;
      console.log(`Processing admin: ${admin.name} (${adminEmail})`);

      const lowStockProducts = await Product.find({ admin: admin._id, stockQuantity: { $lt: 10 } });

      if (lowStockProducts.length > 0) {
        const alertMessage = lowStockProducts
          .map((product) => `Product: ${product.name}, Stock: ${product.stockQuantity}`)
          .join("\n");

        console.log(`Low stock alert for ${admin.name}:\n`, alertMessage);

        const emailHtml = generateEmailTemplate(lowStockProducts);

        
        await sendEmail(adminEmail, "Low Stock Alert", alertMessage, emailHtml);

        console.log(`Low stock email sent to ${admin.name} (${adminEmail}).`);
      } else {
        console.log(`All products for ${admin.name} have sufficient stock.`);
      }
    }
  } catch (error) {
    console.error("Error running inventory check:", error.message);
  }
};

//  cron job to run daily midnight 12
cron.schedule('0 0 * * *', () => {
  console.log(" Cron job triggered at", new Date().toLocaleString());
  runInventoryCheck();
});

module.exports = runInventoryCheck;
