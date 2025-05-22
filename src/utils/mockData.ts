import { Post } from '../types';

const imageUrls = [
  'https://picsum.photos/400/300',
  'https://picsum.photos/300/400',
  'https://picsum.photos/350/350',
];

const videoUrls = [
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
];

const titles = [
  '发现美好生活',
  '分享快乐时光',
  '游戏社区精选',
  '今日热门',
  '玩家推荐',
  '精彩瞬间',
  '热门话题',
  '社区精选',
  '每日发现',
  '趣味分享',
];

const descriptions = [
  '这是一个有趣的发现',
  '分享生活中的美好时刻',
  '游戏中的精彩瞬间',
  '不容错过的精彩内容',
  '社区成员的优质分享',
  '每天都有新发现',
  '一起来看看这个',
  '值得收藏的好内容',
  '发现生活中的乐趣',
  '有趣的分享等你来看',
];

export const generateMockPosts = (page: number, limit: number = 10): Post[] => {
  return Array(limit).fill(null).map((_, index) => {
    const isVideo = Math.random() > 0.7;
    const width = Math.floor(Math.random() * 200) + 200;
    const height = Math.floor(Math.random() * 200) + 200;
    
    // 使用页码和索引确保每个帖子都是唯一的
    const uniqueId = (page - 1) * limit + index;
    
    return {
      id: `${page}-${index}`,
      // 使用取模运算确保标题和描述循环使用
      title: `${titles[uniqueId % titles.length]} #${page}-${index + 1}`,
      imageUrl: `https://picsum.photos/${width}/${height}?random=${uniqueId}`,
      videoUrl: isVideo ? videoUrls[Math.floor(Math.random() * videoUrls.length)] : undefined,
      type: isVideo ? 'video' : 'image',
      description: `${descriptions[uniqueId % descriptions.length]} (第${page}页-${index + 1}号)`,
      width,
      height,
      thumbnail: `https://picsum.photos/100/100?random=${uniqueId}`,
    };
  });
}; 