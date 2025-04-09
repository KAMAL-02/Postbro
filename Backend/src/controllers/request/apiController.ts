import axios from "axios";
import { apiSchema } from "../../utils/validation";
import { Request, Response } from "express";
import logger from "../../utils/logger";
import { saveRequest } from "../../services/saveRequest";
import { getSize } from "../../utils/getSize";
import { performance } from "perf_hooks";

const sendApiRequest = async (req: Request, res: Response) => {
  console.log("Request body is: ", req.body);
  console.log("req.user is: ", req.user);
  const user = req.user as any;

  const { metadata, requestConfig } = req.body;

  const schemaValidation = apiSchema.safeParse(requestConfig);

  if (!schemaValidation.success) {
    console.log("Validation failed: ", schemaValidation.error.flatten().fieldErrors);

    res.status(400).json({
      message: "Validation failed",
      errors: schemaValidation.error.flatten().fieldErrors,
    });
    return;
  }

  const { method, url, params, headers, bodyData } = requestConfig;
  if (!url || !method) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const reqApiConfig: any = {
    method,
    url,
    params: params || {},
    headers: headers || {},
    timeout: 10000,
  }

  if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
    reqApiConfig.data = bodyData || {};
  }

  const startTime = performance.now();
  try {

    const response = await axios(reqApiConfig);
    const endTime = performance.now();
    const timeTaken = Math.round(endTime - startTime); // Calculate time taken in milliseconds
    const size = getSize(response.data); // Get the size of the response data
    console.log("Response is: ", response);

    if(user){
      const { history } = await saveRequest(user.id, {
        method,
        url,
        params,
        headers,
        body: bodyData,
        title: metadata?.title || "Untitled",
      }, {
        body: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        timeTaken,
        size: size,
      })
      logger.info(`Request saved for user: ${user.email}`);
    }

    res.status(response.status).send(response.data);
    
  } catch (error) {
    const endTime = performance.now();
    const timeTaken = Math.round(endTime - startTime);
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
