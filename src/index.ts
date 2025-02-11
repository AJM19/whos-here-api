import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import prisma from "./prisma";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

const server = app.listen(port, (): void =>
  console.log(`Server is listening at localhost:${port}`),
);

const io = require("socket.io")(server, {
  pingTimeout: 50000,
  cors: {
    origins: ["http://localhost:5173", "https://whos-here-app.onrender.com/"],
  },
});

io.on("connection", (socket: any) => {
  console.log(
    "USER CONNECTED @",
    new Date().toLocaleTimeString(),
    "w/ ID:",
    socket.id,
  );

  socket.on("UPDATED", (_: any) => {
    io.emit("update");
  });
});

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://whos-here-app.onrender.com/",
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  next();
});

app.use(express.json());

app.get("/", (_: Request, res: Response) => {
  res.send("Who's Here server");
});

app.get("/squares", async (_: Request, res: Response, next: NextFunction) => {
  try {
    const squares = await prisma.square.findMany({
      orderBy: { id: "asc" },
    });

    res.json({
      status: 200,
      data: squares,
    });
  } catch (e) {
    next(e);
  }
});

app.post(
  "/update-square",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, value } = req.body;

      if (!id) {
        throw new Error("No id provided");
      }

      const square = await prisma.square.upsert({
        where: {
          id: id,
        },
        create: {
          value: value as boolean,
        },
        update: {
          value: value as boolean,
        },
      });

      res.json({
        status: 200,
        data: square,
      });
    } catch (e) {
      next(e);
    }
  },
);
