import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getHistory = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const user = req.user as any;

  try {
    const history = await prisma.history.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        timestamp: "desc",
      },
      include: {
        request: {
          include: {
            response: true,
          },
        },
      },
    });
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching history: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteHistory = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const user = req.user as any;
  const historyId = req.params.id;

  try {
    const history = await prisma.history.findUnique({
      where: {
        id: historyId,
      },
    });
  
    if (!history || history.userId !== user.id) {
      res.status(404).json({ message: "History not found" });
      return;
    }

    await prisma.request.delete({
      where: { id: history.requestId },
    });
  
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting history: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getHistoryById = async(historyId: string, userId: string) => {

  try{
    const history = await prisma.history.findUnique({
      where: {
        id: historyId,
        userId: userId,
      },
      include: {
        request: {
          include: {
            response: true,
          },
        },
      },
    });

    if(!history) {
      throw new Error("History not found");
    }
    return history;

  }catch (error) {
    console.error("Error fetching history: ", error);
    throw new Error("Internal server error");
  }
}

export const deleteAllHistory = async(req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const user = req.user as any;

  try {
    await prisma.history.deleteMany({
      where: {
        userId: user.id,
      },
    });
    res.status(200).json({ message: "History deleted" });
  } catch (error) {
    console.error("Error deleting all history: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}