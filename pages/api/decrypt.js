import crypto from "crypto";
import { getRedisClient } from "../../plugins/redis";

function WXBizDataCrypt(appId, sessionKey) {
  this.appId = appId;
  this.sessionKey = sessionKey;
}

WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode
  var sessionKey = Buffer.from(this.sessionKey, "base64");
  encryptedData = Buffer.from(encryptedData, "base64");
  iv = Buffer.from(iv, "base64");

  try {
    // 解密
    var decipher = crypto.createDecipheriv("aes-128-cbc", sessionKey, iv);
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true);
    var decoded = decipher.update(encryptedData, "", "utf8");
    decoded += decipher.final("utf8");

    decoded = JSON.parse(decoded);
  } catch (err) {
    throw new Error("Illegal Buffer");
  }

  if (decoded.watermark.appid !== this.appId) {
    throw new Error("Illegal Buffer");
  }

  return decoded;
};

const decryptData = ({ appId, sessionKey, encryptedData, iv }) => {
  const pc = new WXBizDataCrypt(appId, sessionKey);
  const data = pc.decryptData(encryptedData, iv);
  return data;
};

const getSessionKey = async (openid) => {
  if (!openid) {
    return "";
  }
  try {
    const client = await getRedisClient();
    const { session_key } = JSON.parse(await client.get(openid));
    return session_key;
  } catch (e) {
    return "";
  }
};

export default async function handler(req, res) {
  const query = req.query;
  const sessionKey = await getSessionKey(query.openid);

  const data = decryptData({
    appId: query.appid,
    sessionKey,
    encryptedData: query.encryptedData,
    iv: query.iv,
  });

  res.status(200).json({ data });
}
