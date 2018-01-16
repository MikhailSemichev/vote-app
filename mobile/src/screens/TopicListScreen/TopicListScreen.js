import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from '../../components/Spinner';
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

        const topicsWithKeys = !isLoading ? topics.map(t => ({ ...t, key: t.id })) : null;

        return (
            <View style={styles.container}>
                {isLoading && <Spinner />}
                {!isLoading && (
                    <View>
                        <Button
                            style={styles.btnNewTopic}
                            title='New Topic'
                            onPress={this.handleNewTopic} />

                        {!isEmpty && (
                            <FlatList
                                style={styles.topicList}
                                data={topicsWithKeys}
                                renderItem={({ item: topic }) => (
                                    <TouchableOpacity
                                        onPress={() => this.handleVoteTopic(topic.id)}>
                                        <View style={styles.topicItem}>
                                            <Text style={styles.topicName}>{topic.name}</Text>
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
                                    </TouchableOpacity>
                                )} />
                        )}
                        {isEmpty && <Text style={styles.empty}>No topics are added yet... :)</Text>}
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'rgb(237, 231, 246)',
        flex: 1
    },
    topicList: {
        marginTop: 10
    },
    topicItem: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: 'rgba(55, 55, 55, 0.3)',
        borderBottomWidth: 0.3,
        justifyContent: 'center'
    },
    topicName: {
        flex: 1,
        fontSize: 15
    },
    icon: {
        color: '#4285f4',
        marginLeft: 10
    },
    empty: {
        marginTop: 10
    }
});
