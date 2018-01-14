import React, { Component } from 'react';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { NavigationActions } from 'react-navigation';

import { loginStore } from '../../stores';

@observer
export default class LoginScreen extends Component {
    state = {
        loginText: '',
        isLoadingLogin: true
    };

    async componentDidMount() {
        const login = await loginStore.getLogin();

        if (login) {
            this.navigateToTopicList();
        } else {
            this.setState({ isLoadingLogin: false });
        }
    }

    handleSubmit = async () => {
        await loginStore.setLogin(this.state.loginText);
        this.navigateToTopicList();
    };

    navigateToTopicList() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'TopicList' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        const { loginText, isLoadingLogin } = this.state;

        return (
            <View style={styles.page}>
                {isLoadingLogin && <Text>Loading...</Text>}
                {!isLoadingLogin && <View>
                    <Text style={styles.info}>
                        Vote App is application for voting
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={loginText}
                        onChangeText={text => this.setState({ loginText: text })}
                        placeholder='Please type your login...' />
                    <Button
                        title='Login'
                        onPress={this.handleSubmit} />
                </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        padding: 10,
        backgroundColor: 'rgb(237, 231, 246)'
    },
    info: {
        textAlign: 'center',
        marginBottom: 20
    },
    input: {
        fontSize: 20,
        marginBottom: 10
    }
});
