import "../styles/globals.css";
import { redisConnect } from "../plugins/redis";

typeof window === "undefined" && redisConnect();

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
