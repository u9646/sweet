import "../styles/globals.css";
import { redisConnect } from "../plugins/redis";
import dbConnect from "../models";

typeof window === "undefined" &&
  dbConnect()
    .then(() => console.log("Mongodb start successed"))
    .catch((e) => console.log("Mongodb start failed with", e)) &&
  redisConnect();

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
