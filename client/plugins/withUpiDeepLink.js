// plugins/withUpiDeepLink.js
const { withAndroidManifest } = require('@expo/config-plugins');

function withUpiDeepLink(config) {
  return withAndroidManifest(config, async config => {
    const androidManifest = config.modResults.manifest;

    // Ensure the <queries> tag exists and add the UPI intent
    if (!androidManifest.queries) {
      androidManifest.queries = [];
    }

    const upiIntent = {
      intent: [
        {
          action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
          category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
          data: [{ $: { 'android:host': 'pay', 'android:scheme': 'upi' } }],
        },
      ],
    };

    // Check if the UPI intent already exists to prevent duplicates
    const existingUpiQuery = androidManifest.queries.find(query =>
      query.intent && query.intent.some(intent =>
        intent.data && intent.data.some(data =>
          data.$.hasOwnProperty('android:scheme') && data.$['android:scheme'] === 'upi'
        )
      )
    );

    if (!existingUpiQuery) {
      androidManifest.queries.push(upiIntent);
    }
    
    return config;
  });
}

module.exports = withUpiDeepLink;