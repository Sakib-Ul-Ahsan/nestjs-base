import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Use @Public() on any route to bypass JWT guard
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
