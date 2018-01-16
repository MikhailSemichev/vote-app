import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { topicsStore, votesStore, loginStore } from '../../stores';

@observer
export default class LoginScreen extends Component {
    state = {};

    componentDidMount() {
        this.loadTopic();
    }

    getTopicId() {
        return this.props.navigation.state.params.topicId;
    }

    async loadTopic() {
        const topicId = this.getTopicId();

        this.closeSocket && this.closeSocket();
        this.closeSocket = votesStore.onVote(topicId);

        const topic = await topicsStore.getTopic(topicId);

        this.setState({
            topicId,
            topic: { ...topic }
        });
    }

    render() {
        const { topic } = this.state;
        const { topicVotes } = votesStore;
        const { login } = loginStore;
        let candidatesInfo = [];

        if (topic) {
            candidatesInfo = topic.candidates.map(c => {
                const logins = topicVotes
                    .filter(v => c.name === v.candidateName)
                    .map(v => v.login);

                return {
                    name: c.name,
                    isVoted: logins.includes(login),
                    logins
                };
            });
            candidatesInfo.sort((c1, c2) => {
                return c2.logins.length - c1.logins.length;
            });
        }

        return (
            <View style={styles.container}>
                {topic && <View>
                    <Text>{topic.name}</Text>
                    {candidatesInfo.map(c => (
                        <View key={c.name}>
                            <Text>{c.name}</Text>
                        </View>
                    ))}
                </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'rgb(237, 231, 246)'
    }
});

