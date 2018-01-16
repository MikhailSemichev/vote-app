import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { topicsStore, votesStore, loginStore } from '../../stores';

@observer
export default class LoginScreen extends Component {
    state = {};

    componentDidMount() {
        this.loadTopic();
    }

    componentWillUnmount() {
        this.closeSocket && this.closeSocket();
    }

    handleVote = (candidateName, isVote) => {
        votesStore.vote(this.getTopicId(), candidateName, isVote);
    };

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
                    key: c.name,
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
                    <FlatList
                        style={styles.candidatesList}
                        data={candidatesInfo}
                        renderItem={({ item: c }) => (
                            <View style={styles.candidatesItem}>
                                <View style={styles.votesCount}>
                                    <Text>{c.logins.length}</Text>
                                </View>
                                <View style={styles.candidateName}>
                                    <Text>{c.name}</Text>
                                </View>
                                <View style={styles.voteButton}>
                                    <Icon
                                        name={c.isVoted ? 'thumbs-up' : 'thumbs-o-up'}
                                        size={25}
                                        style={styles.icon}
                                        onPress={() => this.handleVote(c.name, !c.isVoted)} />
                                </View>
                            </View>

                        )} />
                </View>
                }
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
    candidatesList: {
        marginTop: 10
    },
    candidatesItem: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: 'rgba(55, 55, 55, 0.3)',
        borderBottomWidth: 0.3,
        justifyContent: 'center'
    },
    votesCount: {
        flexBasis: 25
    },
    candidateName: {
        flex: 1
    },
    voteButton: {
        flexBasis: 30
    },
    icon: {
        color: '#4285f4'
    }
});

