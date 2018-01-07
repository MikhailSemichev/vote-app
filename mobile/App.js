import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default class ToDo extends Component {
    constructor() {
        super();
        this.state = {
            todos: [],
            newToDo: ''
        };
    }

    handleChange(text) {
        this.setState({ newToDo: text });
    }

    handlePress(e) {
        const todos = [...this.state.todos, this.state.newToDo];
        this.setState({ todos, newToDo: ''});
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    value={this.state.newToDo}
                    onChangeText={this.handleChange.bind(this)}/>
                    <TouchableOpacity onPress={this.handlePress.bind(this)}>
                        <Text>Create</Text>
                    </TouchableOpacity>
                {this.state.todos.map((todo, i) => (
                    <Text key={i}>{todo}</Text>
                ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
