import { test } from 'node:test';
import assert from 'node:assert';
import {
  getActiveSortedBanners,
  resolveBannerDestination,
  validateBannerInput,
} from './bannerRules.ts';
import { BannerSlide } from '../types/index.ts';

const mockBanners: BannerSlide[] = [
  {
    id: 'b1',
    title: 'Banner 1',
    imageUrl: 'https://images.unsplash.com/test1',
    isActive: true,
    order: 3,
  },
  {
    id: 'b2',
    title: 'Banner 2',
    imageUrl: 'https://images.unsplash.com/test2',
    isActive: false,
    order: 1,
  },
  {
    id: 'b3',
    title: 'Banner 3',
    imageUrl: 'https://images.unsplash.com/test3',
    isActive: true,
    order: 1,
  },
  {
    id: 'b4',
    title: 'Banner 4',
    imageUrl: 'https://images.unsplash.com/test4',
    isActive: true,
    order: 2,
  },
];

test('getActiveSortedBanners filters out inactive slides and sorts ascending by order', () => {
  const result = getActiveSortedBanners(mockBanners);
  assert.strictEqual(result.length, 3);
  assert.strictEqual(result[0].id, 'b3'); // order 1
  assert.strictEqual(result[1].id, 'b4'); // order 2
  assert.strictEqual(result[2].id, 'b1'); // order 3
});

test('resolveBannerDestination prefers category link, then view, and defaults to shop', () => {
  const catBanner: BannerSlide = {
    id: 'c1',
    title: 'Fashion Sale',
    imageUrl: 'https://images.unsplash.com/test',
    linkCategory: 'heritage-fashion',
    linkView: 'category',
    isActive: true,
    order: 1,
  };
  const catResult = resolveBannerDestination(catBanner);
  assert.strictEqual(catResult.view, 'category');
  assert.strictEqual(catResult.categorySlug, 'heritage-fashion');

  const viewBanner: BannerSlide = {
    id: 'v1',
    title: 'Digital E-Books',
    imageUrl: 'https://images.unsplash.com/test',
    linkView: 'digital-library',
    isActive: true,
    order: 2,
  };
  const viewResult = resolveBannerDestination(viewBanner);
  assert.strictEqual(viewResult.view, 'digital-library');
  assert.strictEqual(viewResult.categorySlug, undefined);

  const fallbackBanner: BannerSlide = {
    id: 'f1',
    title: 'All Products',
    imageUrl: 'https://images.unsplash.com/test',
    isActive: true,
    order: 3,
  };
  const fallbackResult = resolveBannerDestination(fallbackBanner);
  assert.strictEqual(fallbackResult.view, 'shop');
});

test('validateBannerInput validates required title and URL structure', () => {
  const valid = validateBannerInput({
    title: 'Smart Gadgets Sale',
    imageUrl: 'https://images.unsplash.com/test',
  });
  assert.strictEqual(valid.isValid, true);
  assert.strictEqual(valid.errors.length, 0);

  const missingTitle = validateBannerInput({
    title: '   ',
    imageUrl: 'https://images.unsplash.com/test',
  });
  assert.strictEqual(missingTitle.isValid, false);
  assert.ok(missingTitle.errors.some((e) => e.includes('title')));

  const invalidUrl = validateBannerInput({
    title: 'Eid Special',
    imageUrl: 'ftp://not-a-valid-http-url',
  });
  assert.strictEqual(invalidUrl.isValid, false);
  assert.ok(invalidUrl.errors.some((e) => e.includes('http')));
});
