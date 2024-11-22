import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; 
import HomeScreen from './HomeScreen';
import LocalityScreen from './LocalityScreen';
import ProfileScreen from './ProfileScreen';
import BlogPage from './BlogPage';

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Locality') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Community') {  
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen}  options={{ headerShown: false }}/>
      <Tab.Screen name="Locality" component={LocalityScreen}  options={{ headerShown: false }}/>
      <Tab.Screen name="Community" component={BlogPage}  options={{ headerShown: false }}/>
      <Tab.Screen name="Profile" component={ProfileScreen}  options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}
