// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-providers";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type Data = {
  uploadUrl: string;
};

const s3Client = new S3Client({
  credentials: fromIni({
    profile: process.env.AWS_PROFILE,
  }),
  region: "ca-central-1",
});

const updateCors = async () => {
  const corsUpdateCommand = new PutBucketCorsCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["PUT"],
          AllowedOrigins: ["*"],
        },
      ],
    },
  });
  await s3Client.send(corsUpdateCommand);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // await updateCors();

  const { filename } = req.body;
  const filepath = `demo/${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filepath,
  });

  const preSignedUrl = await getSignedUrl(s3Client, command);

  res.status(200).json({ uploadUrl: preSignedUrl });
}
