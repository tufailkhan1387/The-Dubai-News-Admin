import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../Utils/urls";


const useFetch = (url) => {
  const [apiData, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const header_config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(BASE_URL + url, header_config);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    const header_config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };
    setLoading(true);
    try {
      const response = await axios.get(BASE_URL + url, header_config);
      console.log(response);
      setData(response.data);
    } catch (error) {
      console.error("Error re-fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { apiData, loading, reFetch };
};

export default useFetch;
