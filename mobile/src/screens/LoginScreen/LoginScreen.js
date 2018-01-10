import React, { Component } from 'react';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';

import { loginStore } from '../../stores';

@observer
export default class LoginScreen extends Component {
    state = { loginText: '' };
 
    async componentDidMount() {
        const login = await loginStore.getLogin();
        debugger;
        console.log(login);
    }
    
    handleSubmit = () => {
        const { navigate } = this.props.navigation;

        loginStore.setLogin(this.state.loginText);
        navigate('TopicList');
    };

    render() {
        const { loginText } = this.state;

        return (
            <View style={styles.page}>
                <Text style={styles.info}>
                    Vote App is application for voting
                </Text>
                <TextInput
                    style={styles.input}
                    value={loginText}
                    onChangeText={(loginText) => this.setState({ loginText })}
                    placeholder='Please type your login...' />
                <Button
                    title="Login"
                    onPress={this.handleSubmit} />
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



/*
            <div className='login-page'>
                <div className='page-title'>
                    <h1>Login Page</h1>
                    <p>Vote App is application for voting</p>
                </div>
                <form
                    className='login-form'
                    onSubmit={this.handleSubmit}>
                    <input
                        type='text'
                        defaultValue={login}
                        placeholder='Please type your login...'
                        ref={r => this.loginRef = r} />
                    <div className='btn-container'>
                        <button className='login-btn'>Login</button>
                    </div>
                </form>
            </div>
            */