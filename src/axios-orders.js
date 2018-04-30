import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://lisa-burger-builder.firebaseio.com/'
});

export default instance;