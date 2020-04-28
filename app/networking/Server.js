import React from 'react';
import {AppRegistry, SectionList ,StyleSheet, Text, View } from 'react-native';

const ServerUrlGetLogin = 'http://127.0.0.1:5000/login';

async function getServer_login_to_app(params) {
    try {
        response = await fetch(ServerUrlGetLogin,{
            method: 'POST',
            hesders: {
                'Accept': 'app'
            }


        })
    } catch (error) {
        Alert.alert('disable connect to server');
    }


}