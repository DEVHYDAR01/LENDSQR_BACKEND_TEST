import adjutorService from '../services/adjutor.service';

// Mock fetch for testing
global.fetch = jest.fn();

describe('AdjutorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkBlacklist', () => {
    it('should return false when user is not blacklisted', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ blacklisted: false }),
      });

      const result = await adjutorService.checkBlacklist('test@example.com');
      
      expect(result).toBe(false);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('adjutor.lendsqr.com'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer'),
          }),
        })
      );
    });

    it('should return true when user is blacklisted', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ blacklisted: true }),
      });

      const result = await adjutorService.checkBlacklist('blacklisted@example.com');
      
      expect(result).toBe(true);
    });

    it('should return false when API call fails', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await adjutorService.checkBlacklist('test@example.com');
      
      expect(result).toBe(false);
    });

    it('should return false when API returns non-ok response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await adjutorService.checkBlacklist('test@example.com');
      
      expect(result).toBe(false);
    });
  });
});