import { prisma } from '@repo/database';
import bcrypt from 'bcrypt';
import { RegisterUserInput } from '../user/user.schema';

const SALT_ROUNDS = 10;

export async function createUser(input: RegisterUserInput) {
  const { password, ...rest } = input;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: rest.email },
  });
  if (existingUser) return null;

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      ...rest,
      passwordHash: hashedPassword,
      timezone: rest.timezone || 'UTC', // default value
    },
  });

  return user;
}


export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function verifyPassword({
  candidatePassword,
  hash,
}: {
  candidatePassword: string;
  hash: string;
}) {
  return bcrypt.compare(candidatePassword, hash);
}