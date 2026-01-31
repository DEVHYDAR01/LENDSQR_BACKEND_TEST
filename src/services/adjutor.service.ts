import axios, { AxiosResponse } from 'axios';
import { logger } from '../utils/logger';

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
  private readonly baseUrl = 'https://adjutor.lendsqr.com/v2/verification/karma';
  private readonly token = process.env.LENDSQR_ADJUTOR_TOKEN;

  async checkBlacklist(identity: string): Promise<boolean> {
    try {
      if (!this.token) {
        logger.warn('Lendsqr Adjutor token not configured, skipping blacklist check');
        return false;
      }

      const response: AxiosResponse<AdjutorResponse> = await axios.get(
        `${this.baseUrl}/${identity}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
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