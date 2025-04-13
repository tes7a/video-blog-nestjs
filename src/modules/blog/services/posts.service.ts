import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import {
  BlogsRepository,
  CommentsRepository,
  PostsRepository,
} from '../infrastructure';
import { CreateCommentDTO, CreatePostDTO } from '../dto';
import {
  Comment,
  GetCommentOutputType,
  PostDBModel,
  PostType,
} from '../models';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private blogRepository: BlogsRepository,
    private commentRepository: CommentsRepository,
  ) {}

  async createPost(
    payload: CreatePostDTO,
  ): Promise<PostType | undefined | string> {
    const { blogId, content, shortDescription, title } = payload;
    const blog = await this.blogRepository.getBlogById(blogId);

    if (!blog) return undefined;

    const { params } = new PostDBModel({
      id: v4(),
      blogId,
      blogName: blog.name,
      content,
      shortDescription,
      title,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        userRatings: [],
        newestLikes: [],
      },
    });

    return await this.postsRepository.createPost(params);
  }

  async createComment(
    payload: CreateCommentDTO,
  ): Promise<GetCommentOutputType> {
    const { content, postId, userId, userLogin } = payload;

    const post = await this.postsRepository.getPostById(postId);

    if (!post) throw new BadRequestException('Post not found');

    const { params } = new Comment({
      id: v4(),
      content,
      postId,
      createdAt: new Date().toISOString(),
      commentatorInfo: {
        userId,
        userLogin,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        userRatings: [],
      },
    });

    return await this.commentRepository.createComment(params);
  }
}
