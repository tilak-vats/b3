import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Tabs } from 'expo-router'
import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Feather} from '@expo/vector-icons';
import { useAuthRole } from '@/hooks/useAuth';

const _layout = () => {
    const insets = useSafeAreaInsets()
    const { isSignedIn } = useAuth();
    const { isAdmin } = useAuthRole();
    
    if (!isSignedIn) return <Redirect href='/(auth)' />
    
    return (
        <Tabs
        screenOptions={{
            tabBarActiveTintColor:"#8968CD",
            tabBarInactiveTintColor:"#657786",
            tabBarStyle:{
              backgroundColor:"#fff",
              borderTopWidth:1,
              borderTopColor:"#E1E8ED",
              height:50 + insets.bottom,
            },
            tabBarIconStyle:{
                fontSize:16,
            },
            headerShown:false
          }}
        >
            <Tabs.Screen
                name='home'
                options={{
                    title:'Home',
                    tabBarIcon:({color,size})=> <Feather size={size} color={color} name='home' />,
                }}
            />
            <Tabs.Screen
                name='cart'
                options={{
                    title:'Cart',
                    tabBarIcon:({color,size})=> <Feather size={size} color={color} name='shopping-cart' />
                }}
            />
            {isAdmin && (
                <Tabs.Screen
                    name='admin'
                    options={{
                        title:'Admin',
                        tabBarIcon:({color,size})=> <Feather size={size} color={color} name='settings' />
                    }}
                />
            )}
            <Tabs.Screen
                name='profile'
                options={{
                    title:'Profile',
                    tabBarIcon:({color,size})=> <Feather size={size} color={color} name='user' />
                }}
            />
        </Tabs>
    )
}

export default _layout