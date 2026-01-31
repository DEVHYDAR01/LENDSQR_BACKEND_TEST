import axios, { AxiosResponse } from 'axios';
import { logger } from '../utils/logger';
import { env } from '../config/env';

interface AdjutorResponse {
  status: string;
  message: string;
  data?: {
    karma_identity: string;
    amount_in_contention: number;
    reason: string;
    default_date: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

class AdjutorService {
  private readonly baseUrl = env.ADJUTOR_API_URL;
  private readonly apiKey = env.ADJUTOR_API_KEY;

  async checkBlacklist(identity: string): Promise<boolean> {
    try {
      if (!this.apiKey || !this.baseUrl) {
        logger.warn('Lendsqr Adjutor API not configured, skipping blacklist check');
        return false;
      }

      const response: AxiosResponse<AdjutorResponse> = await axios.get(
        `${this.baseUrl}/karma/${identity}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data.status === 'success' && response.data.data) {
        logger.info(`User ${identity} found in blacklist`);
        return true;
      }

      return false;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // User not found in blacklist - this is good
        return false;
      }

      logger.error('Adjutor API error:', error.message);
      // In case of API failure, allow registration but log the error
      return false;
    }
  }
}

export default new AdjutorService();