import axios from "axios";

const axiosWithAuth = () => {

 const token = localStorage.getItem("token");
 console.log("Token", token);
 return axios.create({
     //TODO: Check, this is the backend url. Need frontend one?
    baseURL: "http://localhost:3002",
    headers: {
        Authorization: token
       
    },
});

}

export default axiosWithAuth;