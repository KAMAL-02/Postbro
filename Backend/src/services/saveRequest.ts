import { PrismaClient, HttpMethod } from "@prisma/client";

const prisma = new PrismaClient();

interface RequestData {
  method: HttpMethod;
  url: string;
  headers?: any;
  params?: any;
  body?: any;
  title?: string;
}

interface ResponseData {
  body?: any;
  status: number;
  statusText?: string;
  headers?: any;
  timeTaken?: number;
  size?: string;
}

export const saveRequest = async (userId: string, data: RequestData, responseData?: ResponseData) => {
  try {
    const request = await prisma.request.create({
      data: {
        userId,
        url: data.url,
        method: data.method,
        params: data.params || {},
        headers: data.headers || {},
        body: data.body || {},
        title: data.title || "Untitled",
      },
    });

    let response ;

    if (responseData) {
      response = await prisma.response.create({
        data: {
          requestId: request.id,
          body: responseData.body || {},
          status: responseData.status,
          statusText: responseData.statusText || "",
          headers: responseData.headers || {},
          timeTaken: responseData.timeTaken || 0,
          size: responseData.size || "",
        },
      });
    }
    const history = await prisma.history.create({
      data: {
        userId,
        requestId: request.id,
      },
    });
    return { request, response, history };
  } catch (error) {
    console.error("Error saving request:", error);
    throw new Error("Failed to save request");
  }
};
