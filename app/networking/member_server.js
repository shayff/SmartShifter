
import React from 'react';
import {AppRegistry, SectionList ,StyleSheet, Text, View } from 'react-native';
import axios from 'axios'; 



export default axios.create({
  baseURL:'http://621782bb8a5b.ngrok.io',

})
