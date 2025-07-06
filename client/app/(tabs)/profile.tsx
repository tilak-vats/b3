import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { Feather } from '@expo/vector-icons'
import { Redirect } from 'expo-router'

const profile = () => {
    const {signOut} = useAuth();
  return (
    <View>
      <Text>Profile of man</Text>
      <TouchableOpacity onPress={()=>{
        signOut();
        return <Redirect href={'/(auth)'} />
      }}>
        <Text>Logout <Feather name='log-out' color='red' /></Text>
      </TouchableOpacity>
    </View>
  )
}

export default profile