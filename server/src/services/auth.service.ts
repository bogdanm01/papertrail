import * as argon from 'argon2';
import { StatusCodes } from 'http-status-codes';

import type { User, UserInsert } from '@/data/entity.type.js';
import type { ApiResponse } from '@/lib/interfaces/apiResponse.js';

import env from '@/config/env.js';
import { createJWT } from '@/lib/utils.js';
import type { Session } from '@/lib/interfaces/session.js';
import { authConsts } from '@/lib/const.js';
import { inject, injectable } from 'tsyringe';
import type { RedisClient } from '@/data/redisClient.js';
import { TOKENS } from '@/config/diTokens.js';
import type { UserRepository } from '@/data/repository/user.repository.js';
import { AppError } from '@/lib/errors/appError.js';
import type { AuthUser } from '@/lib/interfaces/authUser.js';
import { userTable } from '@/data/schema/user.schema.js';
import { eq } from 'drizzle-orm';

const ACCESS_TTL_SEC = authConsts.ACCESS_TTL_SEC;
const REFRESH_TTL_SEC = authConsts.REFRESH_TTL_SEC;

@injectable()
export class AuthService {
  constructor(
    @inject(TOKENS.redis) private redisClient: RedisClient,
    @inject(TOKENS.userRepository) private userRepository: UserRepository
  ) {}

  async signUp(
    email: string,
    password: string
  ): Promise<ApiResponse<undefined> & { accessToken?: string; refreshToken?: string }> {
    const isEmailRegistered = await this.userRepository.existsByEmail(email);

    if (isEmailRegistered) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Email address is already in use');
    }

    const hashedPassword = await argon.hash(password, { type: argon.argon2id });

    const newUser: UserInsert = {
      email: email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: null,
    };

    const inserted = await this.userRepository.insert(newUser);
    const savedUser: User | undefined = inserted;

    if (!savedUser) {
      throw new Error('Failed to create user');
    }

    const nowSec = Math.floor(new Date().getTime() / 1000);
    const sessionId = crypto.randomUUID();
    const refreshJti = crypto.randomUUID();

    const sessionObj: Session = {
      user: savedUser.id,
      refreshTokenJti: refreshJti,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    await this.redisClient.set(sessionId, JSON.stringify(sessionObj), {
      expiration: {
        type: 'EX',
        value: REFRESH_TTL_SEC,
      },
    });

    const accessToken = createJWT(
      { sub: savedUser.id, exp: nowSec + ACCESS_TTL_SEC, iat: nowSec, sid: sessionId },
      { key: env.ACCESS_TOKEN_KEY }
    );

    const refreshToken = createJWT(
      {
        sub: savedUser.id,
        exp: nowSec + REFRESH_TTL_SEC,
        iat: nowSec,
        sid: sessionId,
        jti: refreshJti,
      },
      { key: env.REFRESH_TOKEN_KEY }
    );

    return {
      statusHeader: StatusCodes.OK,
      responseBody: {
        success: true,
        message: 'User registered successfully.',
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async signIn(
    email: string,
    password: string
  ): Promise<ApiResponse<undefined> & { accessToken?: string; refreshToken?: string }> {
    const user: Partial<User> | null = await this.userRepository.find(
      { id: userTable.id, password: userTable.password },
      eq(userTable.email, email)
    );

    if (!user) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Incorrect credentials provided');
    }

    const passwordMatches: boolean = await argon.verify(user.password!, password);

    if (!passwordMatches) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Incorrect credentials provided');
    }

    // TODO: Consider session number limit
    const sessionId = crypto.randomUUID();
    const refreshTokenJti = crypto.randomUUID();
    const nowSec = Math.floor(new Date().getTime() / 1000);

    const sessionObj: Session = {
      user: user.id!,
      refreshTokenJti: refreshTokenJti,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    await this.redisClient.set(sessionId, JSON.stringify(sessionObj), {
      expiration: {
        type: 'EX',
        value: REFRESH_TTL_SEC,
      },
    });

    const accessToken = createJWT(
      { sub: user.id!, exp: nowSec + ACCESS_TTL_SEC, iat: nowSec, sid: sessionId },
      { key: env.ACCESS_TOKEN_KEY }
    );

    const refreshToken = createJWT(
      {
        sub: user.id!,
        exp: nowSec + REFRESH_TTL_SEC,
        iat: nowSec,
        sid: sessionId,
        jti: refreshTokenJti,
      },
      { key: env.REFRESH_TOKEN_KEY }
    );

    return {
      statusHeader: StatusCodes.OK,
      responseBody: {
        success: true,
        message: 'OK',
      },
      accessToken,
      refreshToken,
    };
  }

  async signOut(sessionId: string) {
    try {
      await this.redisClient.del(sessionId);
    } catch (err) {
      throw err;
    }
  }

  async refresh(
    sessionId: string,
    userId: string,
    jti: string
  ): Promise<ApiResponse<undefined> & { accessToken?: string; refreshToken?: string }> {
    const nowSec = Math.floor(new Date().getTime() / 1000);
    const session = await this.redisClient.get(sessionId);

    // TODO: Get session from req.auth, this is already validated upstream
    if (!session) {
      throw new AppError(StatusCodes.UNAUTHORIZED);
    }

    const sessionObj: Session = JSON.parse(session) as Session;

    const newJti = crypto.randomUUID();
    const newSessionObj: Session = {
      ...sessionObj,
      refreshTokenJti: newJti,
      updatedAt: new Date().toISOString(),
    };

    const remainingTTL = await this.redisClient.ttl(sessionId);

    if (remainingTTL <= 0) {
      throw new AppError(StatusCodes.UNAUTHORIZED);
    }

    await this.redisClient.set(sessionId, JSON.stringify(newSessionObj), {
      expiration: {
        type: 'EX',
        value: remainingTTL,
      },
    });

    const newAccessToken = createJWT(
      { sub: userId, exp: nowSec + ACCESS_TTL_SEC, iat: nowSec, sid: sessionId },
      { key: env.ACCESS_TOKEN_KEY }
    );

    const newRefreshToken = createJWT(
      {
        sub: userId,
        exp: nowSec + REFRESH_TTL_SEC,
        iat: nowSec,
        sid: sessionId,
        jti: newJti,
      },
      { key: env.REFRESH_TOKEN_KEY }
    );

    return {
      statusHeader: StatusCodes.OK,
      responseBody: {
        success: true,
        message: 'OK',
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async me(userId: string, sessionId: string): Promise<ApiResponse<AuthUser>> {
    const user: Partial<User> | null = await this.userRepository.findById(userId, {
      email: userTable.email,
      name: userTable.name,
      onboardingStep: userTable.onboardingStep,
      profilePicture: userTable.profilePicture,
    });

    if (!user) {
      await this.redisClient.del(sessionId);
      throw new AppError(StatusCodes.UNAUTHORIZED);
    }

    const authUser: AuthUser = {
      email: user.email!,
      name: user.name,
      profilePicture: user.profilePicture,
      onboardingStep: user.onboardingStep!,
    };

    return {
      statusHeader: StatusCodes.OK,
      responseBody: {
        success: true,
        data: authUser,
      },
    };
  }
}
