import { SERVER_URL } from '../constants/global';
import axios from 'axios';
import Cookies from "js-cookie";


export const signupService = async (data) => {
    try {
        let url = `${SERVER_URL}signup`;
        const response = await axios.post(url, data);
        return response;
    } catch (error) {
        return error.response
    }
  };

export const loginService = async (data) => {
    try {
        let url = `${SERVER_URL}login`;
        const response = await axios.post(url, data);
        return response;
    } catch (error) {
        return error.response
    }
};

  export const logoutService = async () => {
    try {
        const cookies = Cookies.get();
        axios.defaults.headers.common['Authorization'] = `Bearer ${cookies.token}`;
        let url = `${SERVER_URL}logout`;
        const response = await axios.post(url);
        return response;
    } catch (error) {
        return error.response
    }
};

  export const activateAccountService = async (data) => {
    try {
        let url = `${SERVER_URL}activate_account`;
        const response = await axios.post(url, data);
        return response;
    } catch (error) {
        return error.response
    }
};

export const verifyTokenRequest = async (token) => {
    try {
        const cookies = Cookies.get();
        axios.defaults.headers.common['Authorization'] = `Bearer ${cookies.token}`;
        let url = `${SERVER_URL}verificatete-token`;
        const response = await axios.get(url);
        return response;
    } catch (error) {
        return error.response
    }
};