import { wishlistService } from '../wishlist';
import { apiRequest } from '../apiClient';

jest.mock('../apiClient');

describe('wishlistService', () => {
  const mockApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWishlistForUser', () => {
    it('returns wishlist when found', async () => {
      const mockWishlist = {
        documentId: '1',
        userId: 'user1',
        products: [],
      };

      mockApiRequest.mockResolvedValueOnce({
        data: [mockWishlist],
      });

      const result = await wishlistService.getWishlistForUser('user1');

      expect(result).toEqual(mockWishlist);
      expect(mockApiRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'GET',
        }),
      );
    });

    it('returns null when wishlist not found', async () => {
      mockApiRequest.mockResolvedValueOnce({
        data: [],
      });

      const result = await wishlistService.getWishlistForUser('user1');

      expect(result).toBeNull();
    });

    it('returns null when data array is empty', async () => {
      mockApiRequest.mockResolvedValueOnce({
        data: [],
      });

      const result = await wishlistService.getWishlistForUser('user1');

      expect(result).toBeNull();
    });

    it('returns null when API responds with 404 (missing collection or route)', async () => {
      mockApiRequest.mockRejectedValueOnce({
        status: 404,
        message: 'Not Found',
        name: 'NotFoundError',
        details: {},
      });

      const result = await wishlistService.getWishlistForUser('user1');

      expect(result).toBeNull();
    });

    it('returns first wishlist when multiple wishlists found', async () => {
      const mockWishlist1 = {
        documentId: '1',
        userId: 'user1',
        products: [],
      };
      const mockWishlist2 = {
        documentId: '2',
        userId: 'user1',
        products: [],
      };

      mockApiRequest.mockResolvedValueOnce({
        data: [mockWishlist1, mockWishlist2],
      });

      const result = await wishlistService.getWishlistForUser('user1');

      expect(result).toEqual(mockWishlist1);
    });
  });

  describe('ensureWishlistForUser', () => {
    it('returns existing wishlist if found', async () => {
      const mockWishlist = {
        documentId: '1',
        userId: 'user1',
        products: [],
      };

      mockApiRequest.mockResolvedValueOnce({
        data: [mockWishlist],
      });

      const result = await wishlistService.ensureWishlistForUser('user1');

      expect(result).toEqual(mockWishlist);
      expect(mockApiRequest).toHaveBeenCalledTimes(1);
    });

    it('creates new wishlist if not found', async () => {
      const newWishlist = {
        documentId: '2',
        userId: 'user1',
        products: [],
      };

      mockApiRequest
        .mockResolvedValueOnce({ data: [] })
        .mockResolvedValueOnce({ data: newWishlist });

      const result = await wishlistService.ensureWishlistForUser('user1');

      expect(result).toEqual(newWishlist);
      expect(mockApiRequest).toHaveBeenCalledTimes(2);
      expect(mockApiRequest).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: expect.objectContaining({
            data: expect.objectContaining({
              userId: 'user1',
              products: [],
            }),
          }),
        }),
      );
    });
  });

  describe('updateWishlistProducts', () => {
    it('updates wishlist products', async () => {
      const mockWishlist = {
        documentId: '1',
        userId: 'user1',
        products: [{ productId: '1' }],
      };

      mockApiRequest.mockResolvedValueOnce({ data: mockWishlist });

      const result = await wishlistService.updateWishlistProducts('1', [
        { productId: '1' },
      ]);

      expect(result).toEqual(mockWishlist);
      expect(mockApiRequest).toHaveBeenCalledWith(
        expect.stringContaining('/1'),
        expect.objectContaining({
          method: 'PUT',
          body: expect.objectContaining({
            data: expect.objectContaining({
              products: [{ productId: '1' }],
            }),
          }),
        }),
      );
    });
  });
});
