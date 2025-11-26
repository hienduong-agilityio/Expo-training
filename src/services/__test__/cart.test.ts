import { cartService } from '../cart';
import { apiRequest } from '../apiClient';

jest.mock('../apiClient');

describe('cartService', () => {
  const mockApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getActiveCartForUser', () => {
    it('returns cart when found', async () => {
      const mockCart = {
        documentId: '1',
        userId: 'user1',
        cart_status: 'active',
        products: [],
      };

      mockApiRequest.mockResolvedValueOnce({
        data: [mockCart],
      });

      const result = await cartService.getActiveCartForUser('user1');

      expect(result).toEqual(mockCart);
      expect(mockApiRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'GET',
          auth: true,
        }),
      );
    });

    it('returns null when cart not found', async () => {
      mockApiRequest.mockResolvedValueOnce({
        data: [],
      });

      const result = await cartService.getActiveCartForUser('user1');

      expect(result).toBeNull();
    });

    it('returns null when data array is empty', async () => {
      mockApiRequest.mockResolvedValueOnce({
        data: [],
      });

      const result = await cartService.getActiveCartForUser('user1');

      expect(result).toBeNull();
    });

    it('returns first cart when multiple carts found', async () => {
      const mockCart1 = {
        documentId: '1',
        userId: 'user1',
        cart_status: 'active',
        products: [],
      };
      const mockCart2 = {
        documentId: '2',
        userId: 'user1',
        cart_status: 'active',
        products: [],
      };

      mockApiRequest.mockResolvedValueOnce({
        data: [mockCart1, mockCart2],
      });

      const result = await cartService.getActiveCartForUser('user1');

      expect(result).toEqual(mockCart1);
    });
  });

  describe('ensureActiveCartForUser', () => {
    it('returns existing cart if found', async () => {
      const mockCart = {
        documentId: '1',
        userId: 'user1',
        cart_status: 'active',
        products: [],
      };

      mockApiRequest.mockResolvedValueOnce({
        data: [mockCart],
      });

      const result = await cartService.ensureActiveCartForUser('user1');

      expect(result).toEqual(mockCart);
      expect(mockApiRequest).toHaveBeenCalledTimes(1);
    });

    it('creates new cart if not found', async () => {
      const newCart = {
        documentId: '2',
        userId: 'user1',
        cart_status: 'active',
        products: [],
      };

      mockApiRequest
        .mockResolvedValueOnce({ data: [] })
        .mockResolvedValueOnce({ data: newCart });

      const result = await cartService.ensureActiveCartForUser('user1');

      expect(result).toEqual(newCart);
      expect(mockApiRequest).toHaveBeenCalledTimes(2);
      expect(mockApiRequest).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: expect.objectContaining({
            data: expect.objectContaining({
              userId: 'user1',
              cart_status: 'active',
            }),
          }),
        }),
      );
    });
  });

  describe('updateCartProducts', () => {
    it('updates cart products', async () => {
      const mockCart = {
        documentId: '1',
        userId: 'user1',
        products: [{ productId: '1', quantity: 2 }],
      };

      mockApiRequest.mockResolvedValueOnce({ data: mockCart });

      const result = await cartService.updateCartProducts('1', [
        { productId: '1', quantity: 2 },
      ]);

      expect(result).toEqual(mockCart);
      expect(mockApiRequest).toHaveBeenCalledWith(
        expect.stringContaining('/1'),
        expect.objectContaining({
          method: 'PUT',
          body: expect.objectContaining({
            data: expect.objectContaining({
              products: [{ productId: '1', quantity: 2 }],
            }),
          }),
        }),
      );
    });
  });

  describe('clearCartProducts', () => {
    it('clears cart products', async () => {
      const mockCart = {
        documentId: '1',
        userId: 'user1',
        products: [],
      };

      mockApiRequest.mockResolvedValueOnce({ data: mockCart });

      const result = await cartService.clearCartProducts('1');

      expect(result).toEqual(mockCart);
      expect(mockApiRequest).toHaveBeenCalledWith(
        expect.stringContaining('/1'),
        expect.objectContaining({
          method: 'PUT',
          body: expect.objectContaining({
            data: expect.objectContaining({
              products: [],
            }),
          }),
        }),
      );
    });
  });
});
