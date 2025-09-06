import type { RequestHandler } from 'express';

import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { z } from 'zod';
import type { ApiResponseBody } from '@/lib/types/apiResponseBody.js';
import { userTable } from '@/data/schema/user.schema.js';
import { eq } from 'drizzle-orm';
import type { User, UserInsert } from '@/data/entity.type.js';

import db from '@/data/db.js';
import { ACCESS_TOKEN_KEY } from '@/config/env.js';

export const SignUpRequest = z.object({
  email: z.email().nonempty(),
  password: z.string().min(8).nonempty(),
});

type SignUpRequest = z.infer<typeof SignUpRequest>;

export const signUp: RequestHandler<object, ApiResponseBody<any | undefined>, SignUpRequest> = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isEmailRegistered = (await db.$count(userTable, eq(userTable.email, email))) > 0;

    if (isEmailRegistered) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Email address is already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // use Argon2id instead

    const newUser: UserInsert = {
      email: email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: null,
    };

    const insertedUsers = await db.insert(userTable).values(newUser).returning();
    const savedUser: User | undefined = insertedUsers[0];

    if (!savedUser) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to create user.' });
    }

    const now = Math.floor(new Date().getTime() / 1000);
    const sessionId = 'sessionId'; // -> placeholder

    const accessToken: string = jwt.sign(
      {
        sub: savedUser.id,
        iss: 'papertrailApi',
        exp: now + 10 * 60,
        iat: now,
        sid: sessionId,
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ACCESS_TOKEN_KEY!,
      { algorithm: 'HS256' }
    ) as string;

    res
      .status(StatusCodes.OK)
      .cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: expiration,
      })
      .json({ message: 'User registered', success: true });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};
