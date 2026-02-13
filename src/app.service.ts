import { Injectable } from '@nestjs/common';

export interface HealthRes {
  success: boolean;
  message: string;
  timestamp: number;
  uptime: number;
}

@Injectable()
export class AppService {
  getHealth(): HealthRes {
    return {
      success: true,
      message: 'API is running',
      timestamp: Date.now(),
      uptime: process.uptime(),
    };
  }
}
