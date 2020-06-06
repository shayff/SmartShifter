import React from 'react';
import {AppRegistry, SectionList ,StyleSheet, Text, View } from 'react-native';

const ServerUrlGetLogin = '127.0.0.1:5000/login';

async function Get_Server_login_to_app(params) {
    try {
        console.log('a10');
        response = await fetch(ServerUrlGetLogin,{
            method: 'POST',
            hesders: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)


        });
        let responseJson = await response.json();
        return responseJson.ok;
    } catch (error) {
        console.log('disable connect to server '+ error);
    }


}

export {Get_Server_login_to_app};