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

const PostImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const PostVideo = styled.video`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #000;
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

const DiscoveryPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async (refresh = false) => {
    if (loadingRef.current || (!hasMore && !refresh)) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const newPage = refresh ? 1 : page;
      const newPosts = await fetchPosts(newPage, 'format1');
      
      setPosts(prev => refresh ? newPosts : [...prev, ...newPosts]);
      setPage(refresh ? 2 : page + 1);
      setHasMore(newPosts.length > 0);

      if (refresh) {
        Toast.show({
          content: '刷新成功',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      Toast.show({
        content: '加载失败，请重试',
        position: 'top',
      });
    }

    setLoading(false);
    loadingRef.current = false;
  }, [page, hasMore]);

  useEffect(() => {
    loadMore();
  }, []);

  const onRefresh = async () => {
    await loadMore(true);
  };

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || loading || !hasMore) return;

      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      const threshold = 100; // 距离底部100px时触发加载
      
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadMore]);

  return (
    <Container ref={containerRef}>
      <PullToRefresh
        onRefresh={onRefresh}
        renderText={(status) => {
          const texts = {
            pulling: '👇 下拉刷新',
            canRelease: '👆 释放刷新',
            refreshing: '🔄 刷新中...',
            complete: '✅ 刷新成功'
          };
          return <div style={{ padding: '8px 0' }}>{texts[status]}</div>;
        }}
      >
        <PostsGrid>
          {posts.map((post) => (
            <PostCard key={post.id}>
              {post.type === 'video' && post.videoUrl ? (
                <PostVideo controls playsInline>
                  <source src={post.videoUrl} type="video/mp4" />
                  您的浏览器不支持视频播放
                </PostVideo>
              ) : (
                <PostImage src={post.imageUrl} alt={post.title} loading="lazy" />
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
    </Container>
  );
};

export default DiscoveryPage; 