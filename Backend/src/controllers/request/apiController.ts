import axios from "axios";
import { apiSchema } from "../../utils/validation";
import { Request, Response } from "express";
import logger from "../../utils/logger";

const sendApiRequest = async (req: Request, res: Response) => {
  // console.log("Request body is   : ", req.body);
  logger.info(`Recieved request: ${JSON.stringify(req.body)}`);

  const schemaValidation = apiSchema.safeParse(req.body);

  if (!schemaValidation.success) {
    logger.warn(`Validation failed: ${JSON.stringify(schemaValidation.error)}`);

    // const formattedErrors = schemaValidation.error.flatten((issue) => ({
    //   errorCode: issue.code,
    // }));

    res.status(400).json({
      message: "Validation failed",
      errors: schemaValidation.error.flatten().fieldErrors,
    });
    return;
  }

  const { method, url, params, headers, bodyData } = req.body;
  if (!url || !method) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  try {
    // const queryString = new URLSearchParams(params).toString();
    // const fullUrl = queryString ? `${url}?${queryString}` : url;

    // console.log("Full URL:", fullUrl);

    // This is the actual request to the API

    const requestConfig: any = {
      method,
      url,
      params: params || {},
      headers: headers || {},
      timeout: 10000,
    }

    if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      requestConfig.data = bodyData || {};
    }
    const response = await axios(requestConfig);

    logger.info(`API response received: ${JSON.stringify(response.data)}`);

    res.status(response.status).send(response.data);
    
  } catch (error) {
    logger.error(`Error in API request: ${error}`);

    // Error from the url provided
    if (axios.isAxiosError(error)) {

      if (error.response) {
        res
          .status(error.response.status)
          .json({
            status: error.response.status,
            message: error.response.status,
            data: error.response.data,
          });
        return;
      }

      if (error.code === "ECONNABORTED") {
        res.status(504).json({
          message: "Request timed out",
        });
        return;
      }

      // Error from the request like timeout or network error
      if (error.request) {
        res.status(502).json({
          message: "No response received from the endpoint",
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
