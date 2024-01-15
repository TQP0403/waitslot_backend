import "dotenv/config";

export const env = {
  admin: {
    username: process.env.ADMIN_USER || "blockx_admin",
    password: process.env.ADMIN_PASS,
  },
  database: {
    host: process.env.TYPEORM_HOST ?? "localhost",
    port: Number(process.env.TYPEORM_PORT ?? 5432),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    schema: process.env.TYPEORM_SCHEMA,
    appName: process.env.APP_NAME ?? "api-default",
    logging: process.env.TYPEORM_LOGGING === "true",
    ssl: process.env.TYPEORM_SSL === "true",
    timeout: Number(process.env.TYPEORM_TIMEOUT ?? 10000),
    poolSize: Number(process.env.TYPEORM_POOLSIZE ?? 10),
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT ?? 6379),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === "true",
  },
  metadata: {
    commissionPercentage: Number(
      process.env.METADATA_COMMISSION_PERCENTAGE ?? 0.05,
    ),
    deepLink: process.env.METADATA_DEEP_LINK ?? "https://blockx.network/",
    topBanner:
      process.env.METADATA_TOP_BANNER ??
      "https://d31o29lwcnxzsi.cloudfront.net/assets/08c000e7-709d-4b12-9a5d-5d7ef796c440_Banner%20Photo.png",
    leaderRankingLogo1:
      process.env.METADATA_LEADER_RANKING_LOGO_1 ??
      "https://d31o29lwcnxzsi.cloudfront.net/assets/6d2a5662-d809-4369-bba0-ecc1edc32409_Rank1.png",
    leaderRankingLogo2:
      process.env.METADATA_LEADER_RANKING_LOGO_2 ??
      "https://d31o29lwcnxzsi.cloudfront.net/assets/46f4c7e0-dcbe-42e9-b5a0-16bb94ca5a15_Rank2.png",
    leaderRankingLogo3:
      process.env.METADATA_LEADER_RANKING_LOGO_3 ??
      "https://d31o29lwcnxzsi.cloudfront.net/assets/a3c50a58-51d6-4b5b-8b19-b1fe6279a1ad_Rank3.png",
    leaderRankingLogo4:
      process.env.METADATA_LEADER_RANKING_LOGO_4 ??
      "https://d31o29lwcnxzsi.cloudfront.net/assets/47c450e4-fd76-4dd4-8ecc-bb7f0d40a28d_Rank4.png",
    leaderRankingLogo5:
      process.env.METADATA_LEADER_RANKING_LOGO_5 ??
      "https://d31o29lwcnxzsi.cloudfront.net/assets/13c60ca2-6af0-4809-9655-1ca2b07d9cf5_Rank5.png",
  },
  aws: {
    region: process.env.AWS_REGION,
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.AWS_S3_BUCKET,
    s3CloudFront: process.env.AWS_S3_CLOUDFRONT,
  },
  auth: {
    bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 10),
    secret: process.env.JWT_SECRET,
    accessTokenExpireTime:
      Number(process.env.ACCESS_TOKEN_EXPIRE_TIME ?? 2592000) * 1000,
    refreshTokenExpireTime:
      Number(process.env.REFRESH_TOKEN_EXPIRE_TIME ?? 31104000) * 1000,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    mail: process.env.SMTP_MAIL ?? "",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    expire: Number(process.env.SMTP_MAIL_EXPIRE_TIME ?? 600) * 1000,
  },
  file: {
    uploadLimit: Number(process.env.UPLOAD_LIMIT ?? 500) * 1000,
  },
  socket: {
    roomSection: Number(process.env.SOCKET_ROOM_SECTION ?? 5),
  },
};
