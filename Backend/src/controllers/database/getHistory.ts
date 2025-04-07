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
    console.log("History data: ", history);
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching history: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
