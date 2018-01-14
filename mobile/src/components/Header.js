import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { loginStore } from '../stores';

@observer
export default class Header extends Component {
    handleLogOff = () => {
        const { login } = loginStore;

        Alert.alert(
            'Login Info',
            login,
            [
                {
                    text: 'Log Off', onPress: async () => {
                        await loginStore.logOff();
                        this.props.navigation.navigate('Login');
                    }
                },
                { text: 'OK' }
            ],
        );
    };

    handleAppNameClick = () => {
        this.props.navigation.navigate('TopicList');
    };

    getLoginShort(login) {
        const words = login.split(/[\s_]/);
        if (words.length > 1) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return login.substr(0, 2).toUpperCase();
    }

    render() {
        const { login } = loginStore;

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.handleAppNameClick}>
                    <Text style={styles.text}>Vote App</Text>
                </TouchableOpacity>
                {login && <TouchableOpacity onPress={this.handleLogOff}>
                    <View style={styles.userInfo}>
                        <Icon
                            style={styles.userIcon}
                            name='user-circle-o' />
                        <Text style={styles.userName}>
                            {this.getLoginShort(login)}
                        </Text>
                    </View>
                </TouchableOpacity>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'rgb(103, 58, 183)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        color: '#FFF'
    },
    userIcon: {
        fontSize: 25,
        color: '#FFF'
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    userName: {
        marginLeft: 5,
        fontSize: 20,
        color: '#FFF'
    }
});
