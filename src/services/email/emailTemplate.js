// Function to generate the email template
export const generateEmailTemplate= (userName, orderCode)=> {
    return `
      <html>
        <head>
          <style>
            .container {
              width: 80%;
              margin: auto;
              padding: 10px;
              border: 1px solid #ddd;
              font-family: Arial, sans-serif;
            }
            .header {
              background-color: #f7f7f7;
              padding: 10px 20px;
              text-align: center;
              border-bottom: 1px solid #ddd;
            }
            .content {
              padding: 20px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #999;
              padding: 10px;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Order Confirmation</h2>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              <p>Thank you for your order! Your order has been confirmed.</p>
              <p><strong>Order Code:</strong> ${orderCode}</p>
              <p>We appreciate your business and hope you enjoy your purchase.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
