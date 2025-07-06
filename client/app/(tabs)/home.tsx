import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const home = () => {
    const handleMigrateData = async () => {
        try {
          const response = await fetch('https://b3-iot.vercel.app/api/migrate-products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (response.ok) {
            alert(`Migration Successful: ${data.message}\nMigrated: ${data.migratedCount}, Duplicates: ${data.duplicateCount}, Failed: ${data.failedCount}`);
          } else {
            alert(`Migration Failed: ${data.error || data.message}`);
          }
        } catch (error) {
          console.error("Error triggering migration:", error);
          alert("Failed to trigger migration due to network error.");
        }
      };
  return (
    <SafeAreaView>
      <Text className='text-5xl'>Welcome to the home screen!!</Text>
      <TouchableOpacity>
        <Text>Seed database!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default home