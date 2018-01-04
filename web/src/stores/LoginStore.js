import { observable, action, computed } from 'mobx';

class LoginStore {
    @observable login = this.getLogin();

    getLogin() {
        return localStorage.getItem('LOGIN');
    }

    @computed
    get isLoggedIn() {
        return !!this.login;
    }

    @action
    setLogin(login) {
        this.login = login;
        localStorage.setItem('LOGIN', login);
    }

    @action
    logOff() {
        this.login = null;
        localStorage.removeItem('LOGIN');
    }
}

export default new LoginStore();
