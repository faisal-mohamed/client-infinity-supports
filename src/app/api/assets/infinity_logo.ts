
// pages/api/assets/infinitY_logo.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const imagePath = path.resolve(process.cwd(), 'assets', 'infinity_logo.png');

  if (fs.existsSync(imagePath)) {
    const imageBuffer = fs.readFileSync(imagePath);
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } else {
    res.status(404).send('Image not found');
  }
};
