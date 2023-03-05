import axios from "axios";

const axiosInstance = axios.create({
  validateStatus: (status) => status >= 200 && status < 400,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUserlocal = async (userData) => {
  return await axiosInstance.post("/api/auth/login", userData);
};

export const registerUserlocal = async (userData) => {
  return await axiosInstance.post("/api/users", userData);
};


export const logoutUser = async () => {
  return await axiosInstance("/api/auth/logout");
};
