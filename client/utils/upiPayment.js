// src/utils/upiPayment.js
import { Linking, Alert } from 'react-native'; // Import Linking from react-native (which uses expo-linking under the hood in Expo projects)

const initiateUpiPayment = async (amount, productName) => {
  // --- IMPORTANT: REPLACE WITH YOUR ACTUAL MERCHANT UPI ID ---
  // This is the VPA (Virtual Payment Address) where the money will be sent.
  const vpa = '7878117101@ptyes'; // Example: your_merchant_id@bank, test@ybl etc.
  // ----------------------------------------------------------

  const payeeName = 'B3 Store'; // Your store name
  const transactionRef = `B3STORE_TXN_${Date.now()}`; // A unique reference for your transaction
  const transactionNote = `Payment for ${productName}`;
  const amountString = amount.toFixed(2); // Ensure amount is a string with 2 decimal places

  // Construct the UPI deep link URL.
  // This format is standard for most UPI applications.
  // Query parameters:
  // pa: Payee Address (VPA)
  // pn: Payee Name
  // mc: Merchant Category Code (optional, '0000' for generic)
  // tid: Transaction ID (unique ID for the transaction)
  // tr: Transaction Reference (another unique reference, often same as tid)
  // tn: Transaction Note/Description
  // am: Amount
  // cu: Currency (INR for Indian Rupees)
  const upiUrl = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&mc=0000&tid=${transactionRef}&tr=${transactionRef}&tn=${encodeURIComponent(transactionNote)}&am=${amountString}&cu=INR`;

  try {
    // Check if the device can open a UPI app with this URL scheme
    const supported = await Linking.canOpenURL(upiUrl);

    if (!supported) {
      Alert.alert(
        'UPI App Not Found',
        'No UPI payment application found on your device. Please install one (like Google Pay, PhonePe, Paytm) to proceed with online payment.'
      );
      return false; // Indicate that payment initiation failed
    }

    // Attempt to open the UPI application
    await Linking.openURL(upiUrl);

    // --- CRITICAL CAVEAT ---
    // Linking.openURL() only confirms that the UPI app was launched.
    // It DOES NOT provide direct feedback on whether the payment was
    // successful, failed, or cancelled within the UPI app.
    // For a robust production system, you typically need:
    // 1. A backend server to which your payment gateway sends a webhook
    //    notification about the actual payment status.
    // 2. Your app would then query your backend to confirm the payment status
    //    after the user returns from the UPI app.

    Alert.alert(
      'Payment Initiated',
      'Please complete the payment in your UPI app. Your order will be confirmed upon successful payment.'
    );

    // Since we cannot get direct payment success/failure from the UPI app via deep linking
    // in a client-side only flow, we'll return true here to allow the order process to continue
    // on the assumption that the user will complete the payment.
    // You MUST implement a backend check for actual payment status for production.
    return true;

  } catch (error) {
    console.error('Error opening UPI app or payment initiation:', error);
    Alert.alert(
      'Payment Error',
      'Could not initiate UPI payment. Please try again.'
    );
    return false; // Indicate that payment initiation failed
  }
};

export default initiateUpiPayment;
