import { createClient } from "redis";

export const redisClient = createClient({ url: process.env.REDIS });

redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient.on("ready", () => console.log("Redis Client Ready"));

let ready = false;
export const redisConnect = async () => {
  await redisClient.connect();
  ready = true;
};

export const getRedisClient = async () => {
  if (ready) {
    return redisClient;
  } else {
    await redisConnect();
    return redisClient;
  }
};
