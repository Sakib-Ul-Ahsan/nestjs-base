import { SetMetadata, applyDecorators } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = 'response_message';
export const RESPONSE_IS_PAGINATED_KEY = 'response_is_paginated';

export const ResponseMessage = (
  message: string,
  options?: { paginated?: boolean },
) => {
  return applyDecorators(
    SetMetadata(RESPONSE_MESSAGE_KEY, message),
    SetMetadata(RESPONSE_IS_PAGINATED_KEY, options?.paginated ?? false),
  );
};
