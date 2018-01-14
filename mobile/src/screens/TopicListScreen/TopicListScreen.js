import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, Alert } from 'react-native';
import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { topicsStore } from '../../stores';

@observer
export default class TopicListScreen extends Component {
    componentWillMount() {
        topicsStore.loadTopics();
    }

    handleNewTopic = e => {
        this.props.navigation.navigate('EditTopic');
    }

    handleEditTopic = topicId => {
        this.props.navigation.navigate('EditTopic', { topicId });
    }

    handleVoteTopic = topicId => {
        this.props.navigation.navigate('Vote', { topicId });
    }

    handleDeleteTopic = topic => {
        Alert.alert(
            'Confirmation',
            `Are you sure to delete topic: ${topic.name}?`,
            [
                { text: 'OK', onPress: () => topicsStore.deleteTopic(topic.id) },
                { text: 'Cancel' }
            ],
        );
    }

    render() {
        const { topics } = topicsStore;
        const isLoading = topics === null;
        const isEmpty = topics && !topics.length;

        return (
            <View style={styles.container}>
                <View>
                    <Button
                        title='New Topic'
                        onPress={this.handleNewTopic} />
                </View>
                {topics && topics.map(topic => (
                    <View
                        style={styles.topicItem}
                        key={topic.id}>
                        <Text
                            style={styles.topicName}
                            onPress={() => this.handleVoteTopic(topic.id)}>{topic.name}</Text>
                        <Icon
                            name='pencil-square-o'
                            size={25}
                            style={styles.icon}
                            onPress={() => this.handleEditTopic(topic.id)} />
                        <Icon
                            name='times'
                            size={25}
                            style={styles.icon}
                            onPress={() => this.handleDeleteTopic(topic)} />
                    </View>
                ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'rgb(237, 231, 246)'
    },
    topicItem: {
        flexDirection: 'row'
    },
    topicName: {
        flex: 1
    },
    icon: {
        color: '#4285f4',
        marginLeft: 10
    }
});
