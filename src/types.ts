export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  isFavorite: boolean;
  dateAdded: number;
}

export type FilterType = 'all' | 'favorites';