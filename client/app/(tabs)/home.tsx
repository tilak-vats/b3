import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const home = () => {
  return (
    <SafeAreaView>
      <Text className='text-5xl'>Welcome to the home screen!!</Text>
    </SafeAreaView>
  )
}

export default home