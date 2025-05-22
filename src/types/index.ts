export interface Post {
  id: string;
  title: string;
  imageUrl: string;
  videoUrl?: string;
  description: string;
  type: 'image' | 'video';
  width: number;
  height: number;
  thumbnail: string;
}

export interface DiscoveryState {
  posts: Post[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  format: 'format1' | 'format2';
} 