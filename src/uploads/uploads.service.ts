import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class UploadsService {

  constructor(private prisma: PrismaService) {}

  saveImage(file: Express.Multer.File, body: any) {

    return this.prisma.workImage.create({
      data: {
        imageUrl: `/uploads/${file.filename}`,
        type: body.type,
        workUpdateId: Number(body.workUpdateId),
      },
    });
  }
}