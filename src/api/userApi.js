import axios from "axios";

const API_URL = "https://6979b05acc9c576a8e175b9a.mockapi.io/users";

export const getUsersAPI = () => axios.get(API_URL);

export const createUserAPI = (user) => axios.post(API_URL, user);
