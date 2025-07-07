export const smsTemplates = {
  orderPlaced: (orderNumber, total) => 
    `🎉 Thank you for shopping with Balaji Bachat Bazar!\n\n` +
    `📋 Order #${orderNumber}\n` +
    `💰 Total: ₹${total}\n` +
    `📱 Track your order in the app\n\n` +
    `We're preparing your order with care!`,
    
  orderConfirmed: (orderNumber) =>
    `✅ Great news! Your order #${orderNumber} has been confirmed.\n\n` +
    `👨‍🍳 Our team is now preparing your items.\n` +
    `⏰ Estimated time: 15-20 minutes\n\n` +
    `Thank you for choosing B3 Store!`,
    
  orderPreparing: (orderNumber) =>
    `👨‍🍳 Your order #${orderNumber} is being prepared with love!\n\n` +
    `🕐 Almost ready - just a few more minutes\n` +
    `📱 You'll be notified when it's ready`,
    
  orderReady: (orderNumber, deliveryType) =>
    deliveryType === 'delivery' 
      ? `🚚 Your order #${orderNumber} is ready and out for delivery!\n\n` +
        `📍 Our delivery partner is on the way\n` +
        `⏰ Expected delivery: 10-15 minutes\n\n` +
        `Please keep your phone handy!`
      : `✅ Your order #${orderNumber} is ready for pickup!\n\n` +
        `📍 Please visit our store to collect your order\n` +
        `🕐 Store hours: 9 AM - 9 PM\n\n` +
        `Thank you for choosing B3 Store!`,
        
  orderDelivered: (orderNumber) =>
    `🎉 Your order #${orderNumber} has been delivered!\n\n` +
    `😊 Hope you enjoy your purchase\n` +
    `⭐ Rate your experience in the app\n\n` +
    `Thank you for shopping with B3 Store!`,
    
  orderCancelled: (orderNumber) =>
    `❌ We're sorry! Your order #${orderNumber} has been cancelled.\n\n` +
    `💰 Refund will be processed within 3-5 business days\n` +
    `📞 Contact us for any queries\n\n` +
    `We apologize for the inconvenience.`
};