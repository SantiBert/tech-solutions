import { STATUS_CODES } from '@/constants/statusCodes.constants';
import { createException } from '@/exceptions/HttpException';

export const MOVIE_NOT_FOUND = 'movie_not_found';
export const movieNotFoundException = createException(
    MOVIE_NOT_FOUND,
    STATUS_CODES.NOT_FOUND
);

export const MOVIE_NOT_CREATED = 'movie_not_created';
export const movieNotCreatedException = createException(
    MOVIE_NOT_CREATED,
    STATUS_CODES.NOT_FOUND
);