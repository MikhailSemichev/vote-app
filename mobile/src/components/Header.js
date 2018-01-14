import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { loginStore } from '../stores';

@observer
export default class Header extends Component {
    handleLogOff = async () => {
        await loginStore.logOff();
        this.props.navigation.navigate('Login');
    };

    handleAppNameClick = () => {
        this.props.navigation.navigate('TopicList');
    };

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
                            {login.substr(0, 2).toUpperCase()}
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
