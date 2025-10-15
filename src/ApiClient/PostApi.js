import axios from "axios";
import { BASE_URL } from "../Utils/urls";

export const PostApi = async (url, postData) => {
  console.log(url);
  console.log(postData);

  let config = {
    headers: {
      accessToken: localStorage.getItem("accessToken"),
    },
  };
  console.log(config);
  try {
    const res = await axios.post(BASE_URL + url, postData, config);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};
