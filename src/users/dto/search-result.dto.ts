export interface SearchResultDto {
  id: string;
  name: string;
  nameBn?: string;
  brand?: string;
  brandBn?: string;
  similarity?: number;
  confidence?: string;
  images?: string[];
  [key: string]: any; // Allow additional properties
}
