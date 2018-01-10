import { StackNavigator } from 'react-navigation';
import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import TopicListScreen from './src/screens/TopicListScreen/TopicListScreen';
import EditTopicScreen from './src/screens/EditTopicScreen/EditTopicScreen';

const headerStyles = {
    headerStyle: {
        backgroundColor: 'rgb(103, 58, 183)'
    },
    headerTintColor: '#ffffff'
};

const RootNavigator = StackNavigator({
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            headerTitle: 'Login',
            ...headerStyles
        }
    },
    TopicList: {
        screen: TopicListScreen,
        navigationOptions: {
            headerTitle: 'Topic List',
            ...headerStyles
        }
    },
    EditTopic: {
        screen: EditTopicScreen,
        navigationOptions: {
            headerTitle: 'Edit Topic',
            ...headerStyles
        }
    }
});

export default RootNavigator;
