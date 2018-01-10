import { observable, action, computed } from 'mobx';
import { AsyncStorage } from 'react-native'; 

class LoginStore {
    @observable login = this.getLogin();

    getLogin() {
        return AsyncStorage.getItem('LOGIN');
    }

    @computed
    get isLoggedIn() {
        return !!this.login;
    }

    @action
    setLogin(login) {
        this.login = login;
        return AsyncStorage.setItem('LOGIN', login);
    }

    @action
    logOff() {
        this.login = null;
        return AsyncStorage.removeItem('LOGIN');
    }
}

export default new LoginStore();
