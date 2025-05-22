import React from 'react';
import styled from 'styled-components';
import { Image } from 'antd-mobile';
import { Post } from '../types';

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const CardContent = styled.div`
  padding: 12px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #f5f5f5;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Card>
      <ImageContainer>
        <Image src={post.imageUrl} alt={post.title} lazy />
      </ImageContainer>
      <CardContent>
        <Title>{post.title}</Title>
      </CardContent>
    </Card>
  );
};

export default PostCard; 