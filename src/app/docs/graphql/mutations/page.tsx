'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface MutationPreset {
  id: string;
  label: string;
  icon: string;
  operation: string;
  desc: string;
  query: string;
  variables: Record<string, any>;
}

const PRESETS: MutationPreset[] = [
  {
    id: 'create-post',
    label: 'Create Stateful Post',
    icon: 'ph:plus-circle-bold',
    operation: 'createPost',
    desc: 'Inserts a new post record into your visitor session overlay, immediately queryable via GraphQL or REST.',
    query: `mutation CreatePost($title: String!, $body: String!, $userId: ID!) {
  createPost(title: $title, body: $body, userId: $userId) {
    id
    title
    body
    userId
    user {
      id
      name
      email
    }
  }
}`,
    variables: {
      title: 'Building Modern Frontends with GraphQL Gateway',
      body: 'Playground API provides full stateful GraphQL mutation support across session sandboxes.',
      userId: '1',
    },
  },
  {
    id: 'update-post',
    label: 'Update Existing Post',
    icon: 'ph:pencil-simple-line-bold',
    operation: 'updatePost',
    desc: 'Applies partial field modifications to an existing post while preserving unmodified metadata.',
    query: `mutation UpdatePost($id: ID!, $title: String, $body: String) {
  updatePost(id: $id, title: $title, body: $body) {
    id
    title
    body
    userId
  }
}`,
    variables: {
      id: '1',
      title: 'Updated Post Title via GraphQL Gateway',
      body: 'Content refreshed seamlessly in your private session sandbox overlay.',
    },
  },
  {
    id: 'create-comment',
    label: 'Add Post Comment',
    icon: 'ph:chat-teardrop-text-bold',
    operation: 'createComment',
    desc: 'Attaches a new discussion comment to a specific target post ID with author attribution.',
    query: `mutation AddComment($postId: ID!, $name: String!, $email: String!, $body: String!) {
  createComment(postId: $postId, name: $name, email: $email, body: $body) {
    id
    name
    email
    body
    post_id
    post {
      id
      title
    }
  }
}`,
    variables: {
      postId: '1',
      name: 'Sarah Connor',
      email: 'sarah.connor@example.com',
      body: 'The GraphQL gateway makes relation traversal and nested mutations completely effortless!',
    },
  },
  {
    id: 'create-todo',
    label: 'Create Todo Task',
    icon: 'ph:check-square-offset-bold',
    operation: 'createTodo',
    desc: 'Appends an uncompleted task to a user todo checklist, queryable across session visits.',
    query: `mutation AddTodo($title: String!, $userId: ID!, $completed: Boolean) {
  createTodo(title: $title, userId: $userId, completed: $completed) {
    id
    title
    completed
    user_id
    user {
      name
    }
  }
}`,
    variables: {
      title: 'Complete GraphQL Gateway integration test suite',
      userId: '1',
      completed: false,
    },
  },
  {
    id: 'delete-post',
    label: 'Delete Post',
    icon: 'ph:trash-bold',
    operation: 'deletePost',
    desc: 'Tombstones a post in your visitor sandbox overlay. Subsequent queries return null or omit it.',
    query: `mutation DeletePost($id: ID!) {
  deletePost(id: $id)
}`,
    variables: {
      id: '1',
    },
  },
];

export default function GraphqlMutationsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activePreset, setActivePreset] = useState<MutationPreset>(PRESETS[0]);
  const [activeRecipe, setActiveRecipe] = useState<'apollo' | 'tanstack' | 'serverAction'>('apollo');

  const apolloRecipe = `// Apollo Client Optimistic Mutation Pattern (React 19)
import { useMutation, gql } from '@apollo/client';

const CREATE_POST_MUTATION = gql\`
  mutation CreatePost($title: String!, $body: String!, $userId: ID!) {
    createPost(title: $title, body: $body, userId: $userId) {
      id
      title
      body
      userId
    }
  }
\`;

export function NewPostForm() {
  const [createPost, { loading, error }] = useMutation(CREATE_POST_MUTATION, {
    // 1. Optimistic UI update before network round-trip finishes
    optimisticResponse: {
      createPost: {
        __typename: 'Post',
        id: \`temp-\${Date.now()}\`,
        title: 'Pending Submission...',
        body: 'Optimistic body preview',
        userId: '1',
      },
    },
    // 2. Automatically sync Apollo normalized cache
    update(cache, { data: { createPost } }) {
      cache.modify({
        fields: {
          posts(existingPosts = []) {
            const newPostRef = cache.writeFragment({
              data: createPost,
              fragment: gql\`
                fragment NewPost on Post {
                  id
                  title
                  body
                  userId
                }
              \`,
            });
            return [newPostRef, ...existingPosts];
          },
        },
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost({
      variables: {
        title: 'Optimistic Post Title',
        body: 'Rendered instantly in the client interface.',
        userId: '1',
      },
    });
  };

  return <button onClick={handleSubmit} disabled={loading}>Submit Post</button>;
}`;

  const tanstackRecipe = `// TanStack React Query Mutation with Rollback Cache
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';

const ENDPOINT = '${publicApiUrl}/graphql';

const CREATE_TODO_MUTATION = gql\`
  mutation AddTodo($title: String!, $userId: ID!) {
    createTodo(title: $title, userId: $userId, completed: false) {
      id
      title
      completed
    }
  }
\`;

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, userId }: { title: string; userId: string }) => {
      return await request(ENDPOINT, CREATE_TODO_MUTATION, { title, userId });
    },
    onMutate: async (newTodo) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot previous value for rollback
      const previousTodos = queryClient.getQueryData(['todos']);

      // Optimistically insert
      queryClient.setQueryData(['todos'], (old: any = []) => [
        { id: 'temp-id', ...newTodo, completed: false },
        ...old,
      ]);

      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}`;

  const serverActionRecipe = `// Next.js 15+ Server Action Pattern
'use server';

interface CreatePostInput {
  title: string;
  body: string;
  userId: string;
}

export async function submitPostAction(formData: FormData) {
  const title = formData.get('title') as string;
  const body = formData.get('body') as string;
  const userId = formData.get('userId') as string;

  const mutation = \`
    mutation CreatePost($title: String!, $body: String!, $userId: ID!) {
      createPost(title: $title, body: $body, userId: $userId) {
        id
        title
        body
      }
    }
  \`;

  const response = await fetch('${publicApiUrl}/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: mutation,
      variables: { title, body, userId },
    }),
  });

  const { data, errors } = await response.json();
  if (errors?.length) {
    throw new Error(errors[0].message);
  }

  return data.createPost;
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:pencil-line-bold" className="w-3.5 h-3.5" />
          <span>GraphQL Gateway</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Stateful GraphQL Mutations
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Execute mutations to create, modify, and delete resources with genuine persistence. Mutations are committed directly to your visitor sandbox overlay, immediately visible across subsequent GraphQL queries and REST endpoints.
        </p>
      </div>

      {/* 2. Interactive Mutation Runner */}
      <div id="mutation-workbench" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Mutation Workbench
          </h2>
          <p className="text-sm text-slate-600">
            Select an operational mutation preset below to load variables and execute state changes against your session:
          </p>
        </div>

        {/* Preset Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setActivePreset(preset)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                activePreset.id === preset.id
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  activePreset.id === preset.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <Icon icon={preset.icon} className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {preset.label}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                  {preset.desc}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Live Interactive Console */}
        <InteractiveConsole
          key={activePreset.id}
          method="POST"
          path="/graphql"
          title={`Execute Mutation: ${activePreset.operation}`}
          initialBody={JSON.stringify(
            {
              query: activePreset.query,
              variables: activePreset.variables,
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Stateful Overlay Lifecycle */}
      <div id="persistence-lifecycle" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Sandbox Overlay Architecture
          </h2>
          <p className="text-sm text-slate-600">
            How Playground API achieves 100% deterministic state mutation without database pollution:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Session Identity Mapping</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every request carries a cryptographic <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">pg_identity</code> cookie or header. Mutations are isolated to your sandbox UUID.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Copy-on-Write Delta Records</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              New records and field patches are stored as overlay deltas in Postgres. Base seed records remain intact for other developers.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Dual-Gateway Synchronization</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Create a post in GraphQL, then fetch it via <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">GET /api/v1/posts</code>. State synchronizes across both protocols instantly.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Supported Mutations Reference */}
      <div id="supported-mutations" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Supported Mutation Signatures
          </h2>
          <p className="text-sm text-slate-600">
            Available mutation operations implemented in the Playground API GraphQL gateway:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Mutation</th>
                  <th className="py-3 px-4">Input Arguments</th>
                  <th className="py-3 px-4">Return Type</th>
                  <th className="py-3 px-4">Persistence Effect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">createPost</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">title: String!, body: String, userId: ID</td>
                  <td className="py-3 px-4 font-mono text-indigo-600 text-xs">Post</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Inserts post into session delta, assigns auto-increment ID.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">updatePost</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">id: ID!, title: String, body: String</td>
                  <td className="py-3 px-4 font-mono text-indigo-600 text-xs">Post</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Merges modifications over base seed or previously created post.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">deletePost</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">id: ID!</td>
                  <td className="py-3 px-4 font-mono text-indigo-600 text-xs">Boolean</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Marks post as tombstoned for the current session.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">createComment</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">postId: ID!, name: String!, email: String!, body: String!</td>
                  <td className="py-3 px-4 font-mono text-indigo-600 text-xs">Comment</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Creates comment attached to post and triggers subscription stream.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">createTodo</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">title: String!, userId: ID, completed: Boolean</td>
                  <td className="py-3 px-4 font-mono text-indigo-600 text-xs">Todo</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Inserts checklist item into user task list.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">createUser</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">name: String!, username: String, email: String, phone: String</td>
                  <td className="py-3 px-4 font-mono text-indigo-600 text-xs">User</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Creates user profile record with auto-generated avatar URL.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Production Integration Recipes */}
      <div id="client-recipes" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Frontend Mutation Recipes
          </h2>
          <p className="text-sm text-slate-600">
            Production patterns featuring optimistic updates, normalized cache synchronization, and server actions:
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'apollo', label: 'Apollo Client (Optimistic UI)', icon: 'ph:atom-bold' },
              { id: 'tanstack', label: 'TanStack Mutation (Rollback)', icon: 'ph:lightning-bold' },
              { id: 'serverAction', label: 'Next.js 15 Server Action', icon: 'ph:code-bold' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveRecipe(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeRecipe === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <CodeBlock
            code={
              activeRecipe === 'apollo'
                ? apolloRecipe
                : activeRecipe === 'tanstack'
                ? tanstackRecipe
                : serverActionRecipe
            }
            language="typescript"
            title={`useGraphQLMutation.${activeRecipe === 'serverAction' ? 'ts' : 'tsx'}`}
            copyable
          />
        </div>
      </div>
    </div>
  );
}
