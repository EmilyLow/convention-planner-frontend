import axios from "axios";

const axiosWithAuth = () => {

 const token = localStorage.getItem("token");

 return axios.create({

    baseUrl: 'https://convention-planner-backend.herokuapp.com',
    // baseURL: "http://localhost:3002",
    headers: {
        Authorization: token
       
    },
});

}

export default axiosWithAuth;