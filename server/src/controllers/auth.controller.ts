import db from '@/data/db.js';
import type { RequestHandler } from 'express';

import { StatusCodes } from 'http-status-codes';

import * as bcrypt from 'bcrypt';

import { z } from 'zod';
import type { ApiResponseBody } from '@/lib/types/apiResponseBody.js';
import { userTable } from '@/data/schema/user.schema.js';
import { eq } from 'drizzle-orm';
import type { User } from '@/data/entity.type.js';

export const SignUpRequest = z.object({
  email: z.email().nonempty(),
  password: z.string().min(8).nonempty(),
});

type SignUpRequest = z.infer<typeof SignUpRequest>;

export const signUp: RequestHandler<object, ApiResponseBody<{ token: string } | undefined>, SignUpRequest> = async (
  req,
  res
) => {
  try {
    // get request body -> email and password
    // validate request body
    // salt the password and hash it
    // save user record to the db
    // create JWT token
    // response with JWT token

    const { email, password } = req.body;
    const isEmailRegistered = (await db.$count(userTable, eq(userTable.email, email))) > 0;

    if (isEmailRegistered) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Email address is already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      email: email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: null,
    };

    await db.insert(userTable).values(newUser);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token: 'token placehodler',
      },
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};
