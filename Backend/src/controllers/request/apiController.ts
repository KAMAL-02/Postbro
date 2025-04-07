import axios from "axios";
import { apiSchema } from "../../utils/validation";
import { request, Request, Response } from "express";
import logger from "../../utils/logger";
import { saveRequest } from "../../services/saveRequest";

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
  try {

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

    // if(user){
    //   await saveRequest(user.id, {
    //     method,
    //     url,
    //     params,
    //     headers,
    //     body: bodyData,
    //     title: metadata?.title || "Untitled",
    //   })
    //   logger.info(`Request saved for user: ${user.email}`);
    // }
    const response = await axios(requestConfig);
    console.log("Response is: ", response);

    if(user){
      await saveRequest(user.id, {
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
        headers: response.headers
      })
      logger.info(`Request saved for user: ${user.email}`);
    }

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

// const sendApiRequest = async(req: Request, res: Response) => {
//   passport.authenticate("jwt", { session: false }, async (err, user) => {
//     logger.info(`Received request: ${JSON.stringify(req.body)}`);

//     const schemaValidation = apiSchema.safeParse(req.body);

//     if (!schemaValidation.success) {
//       logger.warn(`Validation failed: ${JSON.stringify(schemaValidation.error)}`);
//       return res.status(400).json({
//         message: "Validation failed",
//         errors: schemaValidation.error.flatten().fieldErrors,
//       });
//     }

//     const { method, url, params, headers, bodyData } = req.body;

//     if (!url || !method) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     try {
//       const requestConfig: any = {
//         method,
//         url,
//         params: params || {},
//         headers: headers || {},
//         timeout: 10000,
//       };

//       if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
//         requestConfig.data = bodyData || {};
//       }

//       // Store to DB if user is logged in
//       if (user) {
//         await saveRequest(user._id, {
//           method,
//           url,
//           params,
//           headers,
//           body: bodyData,
//         });
//         logger.info(`Request saved for user: ${user.email}`);
//       }

//       const response = await axios(requestConfig);

//       logger.info(`API response received: ${JSON.stringify(response.data)}`);
//       return res.status(response.status).send(response.data);
//     } catch (error) {
//       logger.error(`Error in API request: ${error}`);

//       if (axios.isAxiosError(error)) {
//         if (error.response) {
//           return res.status(error.response.status).json({
//             status: error.response.status,
//             message: error.response.statusText,
//             data: error.response.data,
//           });
//         }

//         if (error.code === "ECONNABORTED") {
//           return res.status(504).json({ message: "Request timed out" });
//         }

//         if (error.request) {
//           return res.status(502).json({ message: "No response received from the endpoint" });
//         }
//       }

//       return res.status(500).json({ message: "Internal server error" });
//     }
//   })(req, res, next);
// }



export { sendApiRequest };
