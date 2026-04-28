import { productsService } from '../product';
import { apiRequest } from '../apiClient';

jest.mock('../apiClient');

describe('productsService', () => {
  const mockApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategorizedProducts', () => {
    it('returns categorized products', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          deal_slug: 'deal-of-day',
        },
        {
          id: '2',
          name: 'Product 2',
          deal_slug: 'new-arrivals',
        },
      ];

      mockApiRequest.mockResolvedValueOnce(mockProducts);

      const result = await productsService.getCategorizedProducts();

      expect(result).toHaveProperty('deals');
      expect(result).toHaveProperty('trending');
      expect(result).toHaveProperty('newArrivals');
      expect(Array.isArray(result.deals)).toBe(true);
      expect(Array.isArray(result.trending)).toBe(true);
      expect(Array.isArray(result.newArrivals)).toBe(true);
    });
  });

  describe('getProductById', () => {
    it('returns product by id', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
      };

      mockApiRequest.mockResolvedValueOnce({ data: mockProduct });

      const result = await productsService.getProductById('1');

      expect(result).toBeDefined();
      expect(mockApiRequest).toHaveBeenCalledWith(
        expect.stringContaining('/1'),
        expect.any(Object),
      );
    });

    it('throws error when product not found', async () => {
      mockApiRequest.mockResolvedValueOnce(null);

      await expect(productsService.getProductById('999')).rejects.toThrow(
        'Product not found',
      );
    });
  });

  describe('getProductsByCategory', () => {
    it('returns all products when no category slug', async () => {
      const mockProducts = [{ id: '1' }, { id: '2' }];

      mockApiRequest.mockResolvedValueOnce(mockProducts);

      const result = await productsService.getProductsByCategory();

      expect(Array.isArray(result)).toBe(true);
    });

    it('returns filtered products by category slug', async () => {
      const mockProducts = [{ id: '1' }, { id: '2' }];

      mockApiRequest.mockResolvedValueOnce(mockProducts);

      const result = await productsService.getProductsByCategory('electronics');

      expect(Array.isArray(result)).toBe(true);
      expect(mockApiRequest).toHaveBeenCalled();
    });

    it('returns empty array when no products', async () => {
      mockApiRequest.mockResolvedValueOnce([]);

      const result = await productsService.getProductsByCategory('electronics');

      expect(result).toEqual([]);
    });
  });

  describe('searchProducts', () => {
    it('returns empty array when query is empty', async () => {
      const result = await productsService.searchProducts('');

      expect(result).toEqual([]);
      expect(mockApiRequest).not.toHaveBeenCalled();
    });

    it('returns empty array when query is only whitespace', async () => {
      const result = await productsService.searchProducts('   ');

      expect(result).toEqual([]);
    });

    it('searches products with query', async () => {
      const mockProducts = [{ id: '1' }, { id: '2' }];

      mockApiRequest.mockResolvedValueOnce(mockProducts);

      const result = await productsService.searchProducts('test query');

      expect(Array.isArray(result)).toBe(true);
    });

    it('searches products with query and category', async () => {
      const mockProducts = [{ id: '1' }];

      mockApiRequest.mockResolvedValueOnce(mockProducts);

      const result = await productsService.searchProducts(
        'test',
        'electronics',
      );

      expect(Array.isArray(result)).toBe(true);
    });

    it('returns empty array when no products found', async () => {
      mockApiRequest.mockResolvedValueOnce([]);

      const result = await productsService.searchProducts('test');

      expect(result).toEqual([]);
    });
  });

  describe('parseApiListResponse', () => {
    it('handles array response', async () => {
      const mockProducts = [{ id: '1' }, { id: '2' }];
      mockApiRequest.mockResolvedValueOnce(mockProducts);

      const result = await productsService.getCategorizedProducts();
      expect(Array.isArray(result.deals)).toBe(true);
    });

    it('handles object with data array response', async () => {
      const mockProducts = [{ id: '1' }];
      mockApiRequest.mockResolvedValueOnce({ data: mockProducts });

      const result = await productsService.getProductsByCategory();
      expect(Array.isArray(result)).toBe(true);
    });

    it('handles null response', async () => {
      mockApiRequest.mockResolvedValueOnce(null);

      const result = await productsService.getProductsByCategory();
      expect(result).toEqual([]);
    });

    it('handles undefined response', async () => {
      mockApiRequest.mockResolvedValueOnce(undefined);

      const result = await productsService.getProductsByCategory();
      expect(result).toEqual([]);
    });

    it('handles object with data that is not an array', async () => {
      mockApiRequest.mockResolvedValueOnce({ data: 'not an array' });

      const result = await productsService.getProductsByCategory();
      expect(result).toEqual([]);
    });

    it('handles object with null data', async () => {
      mockApiRequest.mockResolvedValueOnce({ data: null });

      const result = await productsService.getProductsByCategory();
      expect(result).toEqual([]);
    });
  });

  describe('parseApiSingleResponse', () => {
    it('handles object with data response', async () => {
      const mockProduct = { id: '1', name: 'Test' };
      mockApiRequest.mockResolvedValueOnce({ data: mockProduct });

      const result = await productsService.getProductById('1');
      expect(result).toBeDefined();
    });

    it('handles direct object response', async () => {
      const mockProduct = { id: '1', name: 'Test' };
      mockApiRequest.mockResolvedValueOnce(mockProduct);

      const result = await productsService.getProductById('1');
      expect(result).toBeDefined();
    });

    it('handles null response', async () => {
      mockApiRequest.mockResolvedValueOnce(null);

      await expect(productsService.getProductById('1')).rejects.toThrow();
    });

    it('handles undefined response', async () => {
      mockApiRequest.mockResolvedValueOnce(undefined);

      await expect(productsService.getProductById('1')).rejects.toThrow();
    });

    it('handles object with null data', async () => {
      mockApiRequest.mockResolvedValueOnce({ data: null });

      await expect(productsService.getProductById('1')).rejects.toThrow();
    });

    it('handles object with undefined data', async () => {
      mockApiRequest.mockResolvedValueOnce({ data: undefined });

      await expect(productsService.getProductById('1')).rejects.toThrow();
    });
  });
});
