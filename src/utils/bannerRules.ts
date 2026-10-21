import { BannerSlide } from '../types/index.ts';

/**
 * Filter banners that are active and sort them ascending by order
 */
export function getActiveSortedBanners(banners: BannerSlide[]): BannerSlide[] {
  return banners
    .filter((b) => b.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Resolves the destination for a clicked banner
 */
export function resolveBannerDestination(banner: BannerSlide): {
  view: string;
  categorySlug?: string;
} {
  if (banner.linkCategory) {
    return { view: 'category', categorySlug: banner.linkCategory };
  }
  if (banner.linkView) {
    return { view: banner.linkView };
  }
  return { view: 'shop' };
}

/**
 * Validates a banner object has required non-empty fields
 */
export function validateBannerInput(banner: Partial<BannerSlide>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!banner.title || banner.title.trim().length === 0) {
    errors.push('Banner title is required');
  }
  if (!banner.imageUrl || banner.imageUrl.trim().length === 0) {
    errors.push('Banner image URL is required');
  } else if (!banner.imageUrl.startsWith('http://') && !banner.imageUrl.startsWith('https://')) {
    errors.push('Banner image URL must start with http or https');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
