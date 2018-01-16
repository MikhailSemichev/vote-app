import { ActivityIndicator } from 'react-native';
import withStyles from './withStyles';

export default withStyles(
    ActivityIndicator,
    // default styles
    {
        flex: 1,
        justifyContent: 'center'
    },
    // default props
    {
        size: 'large',
        color: '#0000ff'
    }
);
