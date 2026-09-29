import React, { Suspense } from 'react';
import { getAllPosts, getAllTags } from '@/lib/blog';
import { PostsSidebar } from '@/components/layout/PostsSidebar';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] w-full relative bg-slate-50/40 text-slate-900 border-t border-slate-100">
      {/* Dedicated Posts & Feature Deep Dives Sidebar (Left) */}
      <Suspense fallback={<aside className="hidden md:block w-64 lg:w-72 shrink-0 border-r border-slate-200 bg-white p-4" />}>
        <PostsSidebar posts={posts} tags={tags} className="hidden md:block" />
      </Suspense>

      {/* Main Blog Content Area */}
      <main id="blog-content" className="flex-1 min-w-0 w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8">
        <div className="w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
