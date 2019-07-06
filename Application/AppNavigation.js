import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

const NavigationStack = createStackNavigator( {
   LoginPage: {
     screen: LoginPage
   },
   HomePage: {
     screen: HomePage
   }
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
 });

const Container = createAppContainer(NavigationStack);
export default Container; 