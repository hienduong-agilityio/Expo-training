import { ApiProduct } from '@app/interfaces/api';
import {
  buildProductImageSource,
  mapApiProductToCard,
  filterProductsByDealSlug,
  filterTrendingProducts,
  filterProductsByCategorySlug,
  filterProductsBySearchQuery,
  getProductsByListType,
} from '../products';
import { PRODUCT_LIST_TYPES } from '@app/constants';
import { CategorizedProducts } from '@app/hooks/useProduct';

describe('products helpers', () => {
  describe('buildProductImageSource', () => {
    it('returns empty uri when no images', () => {
      const result = buildProductImageSource(null);
      expect(result.uri).toBe('');
    });

    it('returns empty uri when images array is empty', () => {
      const result = buildProductImageSource([]);
      expect(result.uri).toBe('');
    });

    it('returns full URL when image starts with http', () => {
      const result = buildProductImageSource([
        { url: 'https://example.com/image.jpg' },
      ]);
      expect(result.uri).toBe('https://example.com/image.jpg');
    });

    it('prepends base URL when image does not start with http', () => {
      const result = buildProductImageSource([{ url: '/uploads/image.jpg' }]);
      expect(result.uri).toContain('/uploads/image.jpg');
    });

    it('handles null url in image', () => {
      const result = buildProductImageSource([{ url: null }]);
      expect(result.uri).toBe('');
    });

    it('handles undefined url in image', () => {
      const result = buildProductImageSource([{ url: undefined }]);
      expect(result.uri).toBe('');
    });

    it('handles empty string url', () => {
      const result = buildProductImageSource([{ url: '' }]);
      expect(result.uri).toBe('');
    });

    it('handles image with http:// prefix', () => {
      const result = buildProductImageSource([
        { url: 'http://example.com/image.jpg' },
      ]);
      expect(result.uri).toBe('http://example.com/image.jpg');
    });

    it('handles image with https:// prefix', () => {
      const result = buildProductImageSource([
        { url: 'https://example.com/image.jpg' },
      ]);
      expect(result.uri).toBe('https://example.com/image.jpg');
    });
  });

  describe('mapApiProductToCard', () => {
    it('maps API product to card props', () => {
      const apiProduct = {
        documentId: '1',
        title: 'Test Product',
        description: 'Test Description',
        price: 100,
        ratingAvg: 4.5,
        ratingCount: 100,
        images: [{ url: 'https://example.com/image.jpg' }],
      };

      const result = mapApiProductToCard(apiProduct as unknown as ApiProduct);

      expect(result.id).toBe('1');
      expect(result.name).toBe('Test Product');
      expect(result.description).toBe('Test Description');
      expect(result.price).toBe(100);
      expect(result.rating).toBe(4.5);
      expect(result.reviewCount).toBe(100);
    });

    it('uses id when documentId is not available', () => {
      const apiProduct = {
        id: '2',
        title: 'Test Product',
      };

      const result = mapApiProductToCard(apiProduct as unknown as ApiProduct);

      expect(result.id).toBe('2');
    });

    it('uses documentId when both documentId and id are available', () => {
      const apiProduct = {
        documentId: '1',
        id: '2',
        title: 'Test Product',
      };

      const result = mapApiProductToCard(apiProduct as unknown as ApiProduct);

      expect(result.id).toBe('1');
    });

    it('handles null documentId and id', () => {
      const apiProduct = {
        documentId: null,
        id: null,
        title: 'Test Product',
      };

      const result = mapApiProductToCard(apiProduct as unknown as ApiProduct);

      expect(result.id).toBe('null');
    });

    it('handles undefined ratingAvg', () => {
      const apiProduct = {
        documentId: '1',
        title: 'Test Product',
        ratingAvg: undefined,
      };

      const result = mapApiProductToCard(apiProduct as unknown as ApiProduct);

      expect(result.rating).toBe(0);
    });

    it('handles null ratingAvg', () => {
      const apiProduct = {
        documentId: '1',
        title: 'Test Product',
        ratingAvg: null,
      };

      const result = mapApiProductToCard(apiProduct as unknown as ApiProduct);

      expect(result.rating).toBe(0);
    });

    it('handles undefined ratingCount', () => {
      const apiProduct = {
        documentId: '1',
        title: 'Test Product',
        ratingCount: undefined,
      };

      const result = mapApiProductToCard(apiProduct as unknown as ApiProduct);

      expect(result.reviewCount).toBe(0);
    });

    it('handles null ratingCount', () => {
      const apiProduct = {
        documentId: '1',
        title: 'Test Product',
        ratingCount: null,
      };

      const result = mapApiProductToCard(apiProduct as unknown as ApiProduct);

      expect(result.reviewCount).toBe(0);
    });
  });

  describe('filterProductsByDealSlug', () => {
    it('returns empty array when slug is empty', () => {
      const products = [{ title: 'Product 1' }] as unknown as ApiProduct[];
      const result = filterProductsByDealSlug(products, '');
      expect(result).toEqual([]);
    });

    it('returns empty array when slug is null', () => {
      const products = [{ title: 'Product 1' }] as unknown as ApiProduct[];
      const result = filterProductsByDealSlug(
        products,
        null as unknown as string,
      );
      expect(result).toEqual([]);
    });

    it('filters products by deal slug', () => {
      const products = [
        {
          title: 'Product 1',
          deals: [{ slug: 'deal-of-day' }],
        },
        {
          title: 'Product 2',
          deals: [{ slug: 'other-deal' }],
        },
      ] as unknown as ApiProduct[];

      const result = filterProductsByDealSlug(products, 'deal-of-day');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Product 1');
    });

    it('filters products by deal title', () => {
      const products = [
        {
          title: 'Product 1',
          deals: [{ title: 'Deal of Day' }],
        },
      ] as unknown as ApiProduct[];

      const result = filterProductsByDealSlug(products, 'deal of day');
      expect(result).toHaveLength(1);
    });

    it('returns empty array when product has no deals', () => {
      const products = [
        {
          title: 'Product 1',
          deals: null,
        },
        {
          title: 'Product 2',
        },
      ] as unknown as ApiProduct[];

      const result = filterProductsByDealSlug(products, 'deal-of-day');
      expect(result).toEqual([]);
    });

    it('returns empty array when product has empty deals array', () => {
      const products = [
        {
          title: 'Product 1',
          deals: [],
        },
      ] as unknown as ApiProduct[];

      const result = filterProductsByDealSlug(products, 'deal-of-day');
      expect(result).toEqual([]);
    });
  });

  describe('filterTrendingProducts', () => {
    it('filters products with trendings', () => {
      const products = [
        { title: 'Product 1', trendings: [{ id: '1' }] },
        { title: 'Product 2', trendings: [] },
        { title: 'Product 3' },
      ] as unknown as ApiProduct[];

      const result = filterTrendingProducts(products);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Product 1');
    });
  });

  describe('filterProductsByCategorySlug', () => {
    it('returns empty array when slug is empty', () => {
      const products = [{ title: 'Product 1' }] as unknown as ApiProduct[];
      const result = filterProductsByCategorySlug(products, '');
      expect(result).toEqual([]);
    });

    it('returns empty array when slug is null', () => {
      const products = [{ title: 'Product 1' }] as unknown as ApiProduct[];
      const result = filterProductsByCategorySlug(
        products,
        null as unknown as string,
      );
      expect(result).toEqual([]);
    });

    it('returns empty array when products is empty', () => {
      const result = filterProductsByCategorySlug([], 'electronics');
      expect(result).toEqual([]);
    });

    it('returns empty array when products is not an array', () => {
      const result = filterProductsByCategorySlug(
        null as unknown as ApiProduct[],
        'electronics',
      );
      expect(result).toEqual([]);
    });

    it('filters products by category slug', () => {
      const products = [
        {
          title: 'Product 1',
          categorySlug: 'electronics',
        },
        {
          title: 'Product 2',
          categorySlug: 'clothing',
        },
      ] as unknown as ApiProduct[];

      const result = filterProductsByCategorySlug(products, 'electronics');
      expect(result).toHaveLength(1);
    });

    it('filters products by category.slug', () => {
      const products = [
        {
          title: 'Product 1',
          category: { slug: 'electronics' },
        },
      ] as unknown as ApiProduct[];

      const result = filterProductsByCategorySlug(products, 'electronics');
      expect(result).toHaveLength(1);
    });

    it('filters products by category.attributes.slug', () => {
      const products = [
        {
          title: 'Product 1',
          category: { attributes: { slug: 'electronics' } },
        },
      ] as unknown as ApiProduct[];

      const result = filterProductsByCategorySlug(products, 'electronics');
      expect(result).toHaveLength(1);
    });

    it('filters products by categories array', () => {
      const products = [
        {
          title: 'Product 1',
          categories: [{ slug: 'electronics' }],
        },
      ] as unknown as ApiProduct[];

      const result = filterProductsByCategorySlug(products, 'electronics');
      expect(result).toHaveLength(1);
    });
  });

  describe('filterProductsBySearchQuery', () => {
    it('returns all products when query is empty', () => {
      const products = [
        { title: 'Product 1' },
        { title: 'Product 2' },
      ] as unknown as ApiProduct[];
      const result = filterProductsBySearchQuery(products, '');
      expect(result).toEqual(products);
    });

    it('returns all products when query is only whitespace', () => {
      const products = [{ title: 'Product 1' }] as unknown as ApiProduct[];
      const result = filterProductsBySearchQuery(products, '   ');
      expect(result).toEqual(products);
    });

    it('returns empty array when products is empty', () => {
      const result = filterProductsBySearchQuery([], 'test');
      expect(result).toEqual([]);
    });

    it('returns empty array when products is not an array', () => {
      const result = filterProductsBySearchQuery(
        null as unknown as ApiProduct[],
        'test',
      );
      expect(result).toEqual([]);
    });

    it('filters products by search query', () => {
      const products = [
        { title: 'Test Product' },
        { title: 'Other Product' },
      ] as unknown as ApiProduct[];

      const result = filterProductsBySearchQuery(products, 'test');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Product');
    });

    it('is case insensitive', () => {
      const products = [{ title: 'Test Product' }] as unknown as ApiProduct[];
      const result = filterProductsBySearchQuery(products, 'TEST');
      expect(result).toHaveLength(1);
    });

    it('handles products with null title', () => {
      const products = [
        { title: null },
        { title: 'Test Product' },
      ] as unknown as ApiProduct[];
      const result = filterProductsBySearchQuery(products, 'test');
      expect(result).toHaveLength(1);
    });
  });

  describe('getProductsByListType', () => {
    const mockData = {
      deals: [{ id: '1' }],
      trending: [{ id: '2' }],
      newArrivals: [{ id: '3' }],
    };

    it('returns deals for DEAL_OF_DAY', () => {
      const result = getProductsByListType(
        PRODUCT_LIST_TYPES.DEAL_OF_DAY,
        mockData as unknown as CategorizedProducts,
      );
      expect(result).toEqual(mockData.deals);
    });

    it('returns deals for DEALS', () => {
      const result = getProductsByListType(
        PRODUCT_LIST_TYPES.DEALS,
        mockData as CategorizedProducts,
      );
      expect(result).toEqual(mockData.deals);
    });

    it('returns trending for TRENDING', () => {
      const result = getProductsByListType(
        PRODUCT_LIST_TYPES.TRENDING,
        mockData as unknown as CategorizedProducts,
      );
      expect(result).toEqual(mockData.trending);
    });

    it('returns newArrivals for NEW_ARRIVALS', () => {
      const result = getProductsByListType(
        PRODUCT_LIST_TYPES.NEW_ARRIVALS,
        mockData as unknown as CategorizedProducts,
      );
      expect(result).toEqual(mockData.newArrivals);
    });

    it('returns empty array when data is undefined', () => {
      const result = getProductsByListType(PRODUCT_LIST_TYPES.DEALS);
      expect(result).toEqual([]);
    });

    it('returns empty array for unknown type', () => {
      const result = getProductsByListType(
        'unknown' as unknown as ProductListType,
        mockData as unknown as CategorizedProducts,
      );
      expect(result).toEqual([]);
    });
  });
});
