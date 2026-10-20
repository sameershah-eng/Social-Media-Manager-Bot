import { storageService } from './storageService';
import { ContentPost } from '../types';

export const schedulerEngine = {
  intervalId: null as number | null,

  start(onQueueProcessed?: (updatedCount: number) => void) {
    if (this.intervalId !== null) return;

    this.intervalId = window.setInterval(() => {
      this.checkDuePosts(onQueueProcessed);
    }, 15000); // Check every 15 seconds
  },

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },

  /**
   * Process all posts that have reached or passed their scheduled time
   */
  checkDuePosts(onQueueProcessed?: (updatedCount: number) => void): number {
    const posts = storageService.getPosts();
    const nowTime = Date.now();
    let updatedCount = 0;

    const updatedPosts: ContentPost[] = posts.map((post) => {
      if (post.status === 'scheduled') {
        const scheduledTime = new Date(post.scheduledFor).getTime();
        if (scheduledTime <= nowTime) {
          updatedCount++;
          const updatedTargets = post.targets.map((t) => ({
            ...t,
            status: 'published' as const,
            platformPostId: t.platform === 'tiktok' ? `tt_${Date.now()}` : `fb_${Date.now()}`,
            platformPostUrl:
              t.platform === 'tiktok'
                ? `https://tiktok.com/@socialflow_studio/video/${Date.now()}`
                : `https://facebook.com/SocialFlowStudioApp/posts/${Date.now()}`,
            publishedAt: new Date().toISOString(),
            reach: t.platform === 'tiktok' ? Math.floor(1200 + Math.random() * 3000) : Math.floor(800 + Math.random() * 2000),
            impressions: t.platform === 'tiktok' ? Math.floor(1800 + Math.random() * 4000) : Math.floor(1200 + Math.random() * 2800),
            likes: Math.floor(40 + Math.random() * 150),
            comments: Math.floor(5 + Math.random() * 25),
            shares: Math.floor(3 + Math.random() * 18),
            videoViews: t.platform === 'tiktok' ? Math.floor(1600 + Math.random() * 3500) : undefined,
          }));

          storageService.addLog({
            id: `log_sched_${Date.now()}_${post.id}`,
            timestamp: new Date().toISOString(),
            platform: post.targets.length > 1 ? 'system' : post.targets[0].platform,
            action: 'Automated Post Published by Scheduler',
            status: 'success',
            details: `Queue worker automatically published "${post.title}" across ${post.targets.map(t => t.platform).join(', ')}.`,
            metadata: { postId: post.id },
            retryable: false,
          });

          return {
            ...post,
            status: 'published' as const,
            publishedAt: new Date().toISOString(),
            targets: updatedTargets,
            updatedAt: new Date().toISOString(),
          };
        }
      }
      return post;
    });

    if (updatedCount > 0) {
      storageService.savePosts(updatedPosts);
      if (onQueueProcessed) {
        onQueueProcessed(updatedCount);
      }
    }

    return updatedCount;
  },

  /**
   * Manually trigger immediate queue processing of the next scheduled post (for demo/testability)
   */
  forcePublishNext(): { success: boolean; postTitle?: string } {
    const posts = storageService.getPosts();
    const scheduled = posts.filter((p) => p.status === 'scheduled');
    if (scheduled.length === 0) {
      return { success: false };
    }

    const nextPost = scheduled[0];
    const updatedPost: ContentPost = {
      ...nextPost,
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targets: nextPost.targets.map((t) => ({
        ...t,
        status: 'published',
        platformPostId: t.platform === 'tiktok' ? `tt_${Date.now()}` : `fb_${Date.now()}`,
        platformPostUrl:
          t.platform === 'tiktok'
            ? `https://tiktok.com/@socialflow_studio/video/${Date.now()}`
            : `https://facebook.com/SocialFlowStudioApp/posts/${Date.now()}`,
        publishedAt: new Date().toISOString(),
        reach: t.platform === 'tiktok' ? 2450 : 1620,
        impressions: t.platform === 'tiktok' ? 3680 : 2300,
        likes: 184,
        comments: 19,
        shares: 12,
        videoViews: t.platform === 'tiktok' ? 3100 : undefined,
      })),
    };

    storageService.updatePost(updatedPost);
    storageService.addLog({
      id: `log_manual_${Date.now()}`,
      timestamp: new Date().toISOString(),
      platform: updatedPost.targets.length > 1 ? 'system' : updatedPost.targets[0].platform,
      action: 'Simulated Publishing Cycle Executed',
      status: 'success',
      details: `Published "${updatedPost.title}" to ${updatedPost.targets.map(t => t.platform).join(', ')}.`,
      metadata: { postId: updatedPost.id },
      retryable: false,
    });

    return { success: true, postTitle: updatedPost.title };
  },
};
