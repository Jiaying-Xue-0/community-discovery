import { Post } from '../types';

// 不同的数据格式
const dataFormats = {
  format1: {
    getImageUrl: (id: string) => `https://picsum.photos/400/300?random=${id}`,
    getVideoUrl: (id: string) => {
      const videos = [
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      ];
      return videos[parseInt(id) % videos.length];
    },
    getThumbnail: (id: string) => `https://picsum.photos/200/200?random=${id}`,
  },
  format2: {
    getImageUrl: (id: string) => `https://source.unsplash.com/random/400x300?sig=${id}`,
    getVideoUrl: (id: string) => {
      const videos = [
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      ];
      return videos[parseInt(id) % videos.length];
    },
    getThumbnail: (id: string) => `https://source.unsplash.com/random/200x200?sig=${id}`,
  }
};

// Mock data generator with different formats
const generateMockPosts = (page: number, format: 'format1' | 'format2' = 'format1'): Post[] => {
  const posts: Post[] = [];
  const startIndex = (page - 1) * 10;
  const dataFormat = dataFormats[format];
  
  for (let i = 0; i < 10; i++) {
    const id = `${startIndex + i}`;
    const isVideo = Math.random() > 0.7;
    const width = Math.floor(Math.random() * 200) + 200;
    const height = Math.floor(Math.random() * 200) + 200;
    
    posts.push({
      id,
      title: `发现内容 ${id} - ${isVideo ? '视频' : '图片'}`,
      imageUrl: dataFormat.getImageUrl(id),
      videoUrl: isVideo ? dataFormat.getVideoUrl(id) : undefined,
      type: isVideo ? 'video' : 'image',
      description: `这是第 ${id} 号内容的详细描述`,
      width,
      height,
      thumbnail: dataFormat.getThumbnail(id),
    });
  }
  
  return posts;
};

// Simulated API call with delay and format parameter
export const fetchPosts = async (page: number, format: 'format1' | 'format2' = 'format1'): Promise<Post[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Use the mock data generator with format
  const posts = generateMockPosts(page, format);
  
  // Simulate end of data after page 5
  if (page > 5) {
    return [];
  }
  
  return posts;
}; 