import axios from "axios";
import { Request, Response } from "express";

const sendApiRequest = async (req: Request, res: Response) => {
  console.log("Request body is: ", req.body);
  const { method, url, params, headers } = req.body;
  if (!url || !method) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  try {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    console.log("Full URL:", fullUrl);
    const response = await axios({ method, url, params: params || {}, headers: headers || {} });
    console.log("Response from the API is: ", response);

    res.status(response.status).json({ status: response.status, data: response.data });
  } catch (error) {
    console.error("Error is", error);

    // Error from the url provided
    if(axios.isAxiosError(error)){
        if(error.response){
            res.status(error.response.status).json({ status: error.response.status, data: error.response.data });
            return;
        }

        // Error from the request like timeout or network error
        if(error.request){
            res.status(502).json({
                message: "Bad Gateway",
            });
            return;
        }
    }

    // Internal server error
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export { sendApiRequest };