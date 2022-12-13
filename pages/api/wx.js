// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import { getRedisClient } from "../../plugins/redis";

const wxApi = axios.create({
  baseURL: "https://api.weixin.qq.com",
});

wxApi.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    console.log("config", config);
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

const getSession = async ({ appid, secret, code }) => {
  const { status, data } = await wxApi.get("/sns/jscode2session", {
    params: {
      appid,
      secret,
      js_code: code,
      grant_type: "authorization_code",
    },
  });
  if (status === 200) {
    return data; // { session_key, openid }
  }
  return null;
};

const getOpenID = async ({ appid, secret, code }) => {
  const res = await getSession({ appid, secret, code });
  return res.openid;
};

const getPhoneNumber = async (code) => {
  const access_token = await getAccessToken();
  const { status, data } = await wxApi.post(
    "/wxa/business/getuserphonenumber",
    { code },
    {
      params: { access_token },
    }
  );
};

const getAccessToken = async (appid, secret) => {
  const client = await getRedisClient();
  const storeToken = await client.get(`${appid}_access_token`);
  if (storeToken) {
    return storeToken;
  }
  const { status, data } = await wxApi.get("/cgi-bin/token", {
    params: {
      grant_type: "client_credential",
      appid,
      secret,
    },
  });
  const token = data.access_token; // data: { access_token, expires_in }
  await client.set(`${appid}_access_token`, token, { EX: data.expires_in });
  if (status === 200) {
    return token;
  }
  return null;
};

export default async function handler(req, res) {
  const query = req.query;
  const openid = await getOpenID(query);
  res.status(200).json({ openid });
}
