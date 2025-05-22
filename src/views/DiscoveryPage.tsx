import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { PullToRefresh, Toast } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Post } from '../types';
import { fetchPosts } from '../services/api';

const Container = styled.div`
  padding: 10px;
  background-color: #f5f5f5;
  min-height: 100vh;
  position: relative;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding-bottom: 20px;
`;

const PostCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PostImage = styled.div<{ src: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  background-color: #f0f0f0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const PostVideo = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  background: #000;
  cursor: pointer;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: '▶️';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    opacity: 0.8;
    pointer-events: none;
    transition: opacity 0.2s;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const PostTitle = styled.h3`
  padding: 10px;
  margin: 0;
  font-size: 14px;
`;

const PostDescription = styled.p`
  padding: 0 10px 10px;
  margin: 0;
  font-size: 12px;
  color: #666;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  background: rgba(255, 255, 255, 0.8);
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const RefreshTip = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #4CAF50;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const ErrorPlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
`;

const VideoOverlay = styled.div<{ isPlaying: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: ${props => props.isPlaying ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;

  video {
    max-width: 100%;
    max-height: 100vh;
    width: auto;
    height: auto;
  }

  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    color: white;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 10px;
    z-index: 1001;
  }
`;

const DiscoveryPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefreshTip, setShowRefreshTip] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [failedVideos, setFailedVideos] = useState<string[]>([]);
  const [previousPosts, setPreviousPosts] = useState<Post[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async (refresh = false) => {
    if (loadingRef.current || (!hasMore && !refresh)) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const newPage = refresh ? 1 : page;
      const newPosts = await fetchPosts(newPage, 'format1');
      
      if (refresh) {
        // 刷新时，先保存当前的数据
        setPreviousPosts([...posts]);
        // 设置新数据
        setPosts(newPosts);
        setPage(2);
        setShowRefreshTip(true);
        setTimeout(() => setShowRefreshTip(false), 2000);
        
        Toast.show({
          content: '刷新成功',
          position: 'top',
        });
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(newPosts.length > 0);
    } catch (error) {
      console.error('Failed to load posts:', error);
      Toast.show({
        content: '加载失败，请重试',
        position: 'top',
      });
    }

    setLoading(false);
    loadingRef.current = false;
  }, [page, hasMore, posts]);

  useEffect(() => {
    loadMore();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadMore(true);
    setIsRefreshing(false);
  };

  // 监听滚动事件，用于恢复之前的数据
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop } = document.documentElement;
      if (scrollTop === 0 && previousPosts.length > 0 && !isRefreshing) {
        setPosts(previousPosts);
        setPreviousPosts([]);
        setPage(Math.ceil(previousPosts.length / 10) + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [previousPosts, isRefreshing]);

  // 监听滚动事件，用于加载更多
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || loading || !hasMore || isRefreshing) return;

      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      const threshold = 100; // 距离底部100px时触发加载
      
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadMore, isRefreshing]);

  const handleImageError = (imageUrl: string) => {
    setFailedImages(prev => [...prev, imageUrl]);
  };

  const handleVideoError = (videoUrl: string) => {
    setFailedVideos(prev => [...prev, videoUrl]);
  };

  const handleVideoClick = (videoUrl: string) => {
    setCurrentVideo(videoUrl);
  };

  const closeVideo = () => {
    setCurrentVideo(null);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeVideo();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <Container ref={containerRef}>
      <RefreshTip visible={showRefreshTip}>
        ✨ 内容已更新
      </RefreshTip>
      <PullToRefresh
        onRefresh={onRefresh}
        renderText={(status) => {
          const texts = {
            pulling: '👇 继续下拉刷新',
            canRelease: '👆 松手刷新内容',
            refreshing: '🔄 正在刷新...',
            complete: '✅ 刷新成功'
          };
          return <div style={{ padding: '8px 0' }}>{texts[status]}</div>;
        }}
      >
        <PostsGrid>
          {posts.map((post) => (
            <PostCard key={post.id + post.imageUrl}>
              {post.type === 'video' && post.videoUrl ? (
                !failedVideos.includes(post.videoUrl) ? (
                  <PostVideo onClick={() => handleVideoClick(post.videoUrl!)}>
                    <video
                      poster={post.thumbnail}
                      onError={() => handleVideoError(post.videoUrl!)}
                      preload="metadata"
                    >
                      <source src={post.videoUrl} type="video/mp4" />
                    </video>
                  </PostVideo>
                ) : (
                  <ErrorPlaceholder>视频加载失败</ErrorPlaceholder>
                )
              ) : (
                !failedImages.includes(post.imageUrl) ? (
                  <PostImage
                    src={post.imageUrl}
                    onError={() => handleImageError(post.imageUrl)}
                  />
                ) : (
                  <ErrorPlaceholder>图片加载失败</ErrorPlaceholder>
                )
              )}
              <PostTitle>{post.title}</PostTitle>
              <PostDescription>{post.description}</PostDescription>
            </PostCard>
          ))}
        </PostsGrid>
        {loading && (
          <LoadingText>
            <span role="img" aria-label="loading">🔄</span> 加载第 {page} 页...
          </LoadingText>
        )}
      </PullToRefresh>

      <VideoOverlay isPlaying={!!currentVideo}>
        {currentVideo && (
          <>
            <button className="close-button" onClick={closeVideo}>✕</button>
            <video
              controls
              autoPlay
              playsInline
              src={currentVideo}
              onError={() => handleVideoError(currentVideo)}
            >
              <source src={currentVideo} type="video/mp4" />
              您的浏览器不支持视频播放
            </video>
          </>
        )}
      </VideoOverlay>
    </Container>
  );
};

export default DiscoveryPage; 