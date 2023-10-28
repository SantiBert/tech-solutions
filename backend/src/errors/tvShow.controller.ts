import { STATUS_CODES } from '@/constants/statusCodes.constants';
import { createException } from '@/exceptions/HttpException';

export const TV_SHOW_NOT_FOUND = 'tv_show_not_found';
export const tvShowNotFoundException = createException(
    TV_SHOW_NOT_FOUND,
    STATUS_CODES.NOT_FOUND
);

export const TV_SHOW_NOT_CREATED = 'tv_show_not_created';
export const tvShowCreatedException = createException(
    TV_SHOW_NOT_CREATED,
    STATUS_CODES.NOT_FOUND
);

