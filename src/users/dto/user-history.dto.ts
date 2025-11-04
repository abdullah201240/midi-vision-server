import { UserHistory } from '../entities/user-history.entity';
import { SearchResultDto } from './search-result.dto';

export class UserHistoryDto {
  id: string;
  actionType: 'scan' | 'upload' | 'view';
  imageData: string;
  resultData: SearchResultDto[] | null;
  isSuccessful: boolean;
  errorMessage: string;
  userId: string;
  medicineId: string;
  createdAt: string;
  updatedAt: string;

  constructor(history: UserHistory) {
    this.id = history.id;
    this.actionType = history.actionType;
    this.imageData = history.imageData;
    this.resultData = history.resultData;
    this.isSuccessful = history.isSuccessful;
    this.errorMessage = history.errorMessage;
    // Safely access user and medicine IDs
    this.userId = history.user?.id || '';
    this.medicineId = history.medicine?.id || '';
    // Convert dates to ISO strings
    this.createdAt = history.createdAt
      ? history.createdAt.toISOString()
      : new Date().toISOString();
    this.updatedAt = history.updatedAt
      ? history.updatedAt.toISOString()
      : new Date().toISOString();
  }
}
