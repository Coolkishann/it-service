import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

 async register(data: any) {

  const existingUser = await this.prisma.user.findUnique({
    where: { email: data.email },
  });

if (existingUser) {
  throw new BadRequestException('Email already exists');
}

  const hashedPassword = await bcrypt.hash(data.password, 10);

const user = await this.prisma.user.create({
  data: {
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
  },
});

return {
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
};
}

async login(data: any) {

  const user = await this.prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const passwordMatch = await bcrypt.compare(
    data.password,
    user.password,
  );

  if (!passwordMatch) {
    throw new UnauthorizedException('Invalid credentials');
  }

const token = this.jwtService.sign({
  userId: user.id,
  role: user.role,
  officeId: user.officeId,
});

  return {
    message: 'Login successful',
    access_token: token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}
}