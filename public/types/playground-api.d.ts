/**
 * Playground API — Full TypeScript Type Definitions (.d.ts)
 * https://playground.nileslabs.com/
 */

export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo?: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number | string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  website?: string;
  address?: Address;
  company?: Company;
  _sandbox?: 'created' | 'updated';
}

export interface Post {
  id: number | string;
  userId: number | string;
  user_id?: number | string;
  title: string;
  body: string;
  thumbnail?: string;
  _sandbox?: 'created' | 'updated';
}

export interface Comment {
  id: number | string;
  postId: number | string;
  post_id?: number | string;
  name: string;
  email: string;
  body: string;
  _sandbox?: 'created' | 'updated';
}

export interface Todo {
  id: number | string;
  userId: number | string;
  user_id?: number | string;
  title: string;
  completed: boolean;
  _sandbox?: 'created' | 'updated';
}

export interface PaginationMeta {
  page?: number;
  limit: number;
  total: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  nextCursor?: string | null;
  prevCursor?: string | null;
  hasMore?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface SessionStats {
  identityId: string;
  totalCreatedRecords: number;
  maxQuotaPerResource: number;
  resources: {
    users: number;
    posts: number;
    comments: number;
    todos: number;
  };
  expiresInDays: number;
}

export interface HealthMetrics {
  status: 'ok' | 'error';
  timestamp: string;
  uptimeSeconds: number;
  database: {
    connected: boolean;
    latencyMs: number;
  };
  activeSessions: number;
}

// Input Types for Mutations
export type CreateUserInput = Omit<User, 'id' | '_sandbox'>;
export type CreatePostInput = Omit<Post, 'id' | '_sandbox'>;
export type CreateCommentInput = Omit<Comment, 'id' | '_sandbox'>;
export type CreateTodoInput = Omit<Todo, 'id' | '_sandbox'>;

export type UpdateUserInput = Partial<CreateUserInput>;
export type UpdatePostInput = Partial<CreatePostInput>;
export type UpdateCommentInput = Partial<CreateCommentInput>;
export type UpdateTodoInput = Partial<CreateTodoInput>;

// Auth Simulation Types
export interface AuthLoginInput {
  username?: string;
  email?: string;
  password?: string;
}

export interface AuthRegisterInput {
  name: string;
  username: string;
  email: string;
  password?: string;
  company?: Company;
  address?: Address;
  phone?: string;
  website?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
  expires_at?: string;
  user: User;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: 'Bearer';
  expires_in: number;
  expires_at?: string;
}

export interface SnapshotRecord {
  id?: string;
  resource: string;
  op: 'create' | 'update' | 'delete';
  targetId?: number | string | null;
  data?: Record<string, any>;
  createdAt?: string;
}

export interface SnapshotPayload {
  version: string;
  exportedAt: string;
  identityId: string;
  targetResource: string;
  stats: {
    totalRecords: number;
    creates: number;
    updates: number;
    deletes: number;
  };
  records: SnapshotRecord[];
}

export interface ImportResponse {
  message: string;
  importedRecords: number;
  strategy: 'replace' | 'merge';
  affectedResources: string[];
}

export interface CustomCollectionSummary {
  name: string;
  endpoint: string;
  count: number;
  lastUpdated: string;
}

export interface CustomCollectionsDirectoryResponse {
  totalCollections: number;
  collections: CustomCollectionSummary[];
}

export interface CustomSeedResult {
  message: string;
  template: 'ecommerce' | 'crm' | 'saas' | 'healthcare';
  collections: string[];
  totalSeeded: number;
}

// Media & Dynamic Vector Image Generator Types
export interface AvatarOptions {
  size?: number;
  rounded?: boolean | string;
}

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  text?: string;
  description?: string;
  desc?: string;
  subtitle?: string;
}

// Shareable Sandbox & Simulation Query Parameters
export interface SandboxQueryParams {
  _sandbox?: string;
  _delay?: number;
  _status?: number;
  _chaos?: number | string;
  _chaos_errors?: string;
  _ratelimit?: string;
  ratelimit?: string;
  _format?: 'csv' | 'xlsx' | 'json';
  format?: 'csv' | 'xlsx' | 'json';
  _jwt_expiry?: string;
  jwt_expiry?: string;
  _clock_skew?: string | number;
  clock_skew?: string | number;
  cursor?: string;
  _cursor?: string;
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: 'asc' | 'desc';
}

export interface ShareableSandboxSession {
  identityId: string;
  signedToken: string;
  shareUrl: string;
  createdAt: string;
  lastSeenAt: string;
}

// Real-Time WebSockets, Socket.io & Live Stream Types
export interface ChatMessage {
  id: string | number;
  room: string;
  sender_id: string | number;
  sender_name: string;
  recipient_id?: string | number | null;
  text: string;
  created_at: string;
  _sandbox?: 'created' | 'updated';
}

export interface WsMessagePayload {
  type: 'message' | 'join' | 'typing' | 'connected' | 'joined' | 'error' | 'ping' | 'pong';
  room?: string;
  sender_id?: string | number;
  sender_name?: string;
  text?: string;
  user?: string;
  isTyping?: boolean;
  status?: boolean;
  clientId?: string;
  timestamp?: string;
}

export interface SseNotification {
  id: string;
  title: string;
  body: string;
  type?: 'post' | 'comment' | 'todo' | 'system';
  timestamp: string;
}

// Outgoing Webhooks Dispatcher & Delivery Inspector Types
export interface WebhookSubscription {
  id: string | number;
  name?: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  created_at: string;
}

export interface WebhookPayload<T = unknown> {
  id: string;
  uptimeSeconds: number;
  database: {
    connected: boolean;
    latencyMs: number;
  };
  activeSessions: number;
}

// Input Types for Mutations
export type CreateUserInput = Omit<User, 'id' | '_sandbox'>;
export type CreatePostInput = Omit<Post, 'id' | '_sandbox'>;
export type CreateCommentInput = Omit<Comment, 'id' | '_sandbox'>;
export type CreateTodoInput = Omit<Todo, 'id' | '_sandbox'>;

export type UpdateUserInput = Partial<CreateUserInput>;
export type UpdatePostInput = Partial<CreatePostInput>;
export type UpdateCommentInput = Partial<CreateCommentInput>;
export type UpdateTodoInput = Partial<CreateTodoInput>;

// Auth Simulation Types
export interface AuthLoginInput {
  username?: string;
  email?: string;
  password?: string;
}

export interface AuthRegisterInput {
  name: string;
  username: string;
  email: string;
  password?: string;
  company?: Company;
  address?: Address;
  phone?: string;
  website?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
  expires_at?: string;
  user: User;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: 'Bearer';
  expires_in: number;
  expires_at?: string;
}

export interface SnapshotRecord {
  id?: string;
  resource: string;
  op: 'create' | 'update' | 'delete';
  targetId?: number | string | null;
  data?: Record<string, any>;
  createdAt?: string;
}

export interface SnapshotPayload {
  version: string;
  exportedAt: string;
  identityId: string;
  targetResource: string;
  stats: {
    totalRecords: number;
    creates: number;
    updates: number;
    deletes: number;
  };
  records: SnapshotRecord[];
}

export interface ImportResponse {
  message: string;
  importedRecords: number;
  strategy: 'replace' | 'merge';
  affectedResources: string[];
}

export interface CustomCollectionSummary {
  name: string;
  endpoint: string;
  count: number;
  lastUpdated: string;
}

export interface CustomCollectionsDirectoryResponse {
  totalCollections: number;
  collections: CustomCollectionSummary[];
}

export interface CustomSeedResult {
  message: string;
  template: 'ecommerce' | 'crm' | 'saas' | 'healthcare';
  collections: string[];
  totalSeeded: number;
}

// Media & Dynamic Vector Image Generator Types
export interface AvatarOptions {
  size?: number;
  rounded?: boolean | string;
}

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  text?: string;
  description?: string;
  desc?: string;
  subtitle?: string;
}

// Shareable Sandbox & Simulation Query Parameters
export interface SandboxQueryParams {
  _sandbox?: string;
  _delay?: number;
  _status?: number;
  _chaos?: number | string;
  _chaos_errors?: string;
  _ratelimit?: string;
  ratelimit?: string;
  _format?: 'csv' | 'xlsx' | 'json';
  format?: 'csv' | 'xlsx' | 'json';
  _jwt_expiry?: string;
  jwt_expiry?: string;
  _clock_skew?: string | number;
  clock_skew?: string | number;
  cursor?: string;
  _cursor?: string;
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: 'asc' | 'desc';
}

export interface ShareableSandboxSession {
  identityId: string;
  signedToken: string;
  shareUrl: string;
  createdAt: string;
  lastSeenAt: string;
}

// Real-Time WebSockets, Socket.io & Live Stream Types
export interface ChatMessage {
  id: string | number;
  room: string;
  sender_id: string | number;
  sender_name: string;
  recipient_id?: string | number | null;
  text: string;
  created_at: string;
  _sandbox?: 'created' | 'updated';
}

export interface WsMessagePayload {
  type: 'message' | 'join' | 'typing' | 'connected' | 'joined' | 'error' | 'ping' | 'pong';
  room?: string;
  sender_id?: string | number;
  sender_name?: string;
  text?: string;
  user?: string;
  isTyping?: boolean;
  status?: boolean;
  clientId?: string;
  timestamp?: string;
}

export interface SseNotification {
  id: string;
  title: string;
  body: string;
  type?: 'post' | 'comment' | 'todo' | 'system';
  timestamp: string;
}

// Outgoing Webhooks Dispatcher & Delivery Inspector Types
export interface WebhookSubscription {
  id: string | number;
  name?: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  created_at: string;
}

export interface WebhookPayload<T = unknown> {
  id: string;
  event: string;
  timestamp: string;
  data: T;
}

export interface WebhookDeliveryLog {
  id: string;
  webhookId: string | number;
  webhookUrl: string;
  event: string;
  status: number;
  success: boolean;
  durationMs: number;
  requestHeaders: Record<string, string>;
  requestBody: WebhookPayload;
  responseBody: string;
  error?: string | null;
  timestamp: string;
}

// Virtual Inbox & Messaging Types
export interface EmailAttachment {
  name: string;
  url: string;
  size?: number | string;
  type?: string;
  cloudinary_public_id?: string;
  content_type?: string;
}

export interface EmailMessage {
  id: string;
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
  template?: string;
  otp_code?: string;
  attachments?: EmailAttachment[];
  created_at: string;
}

export interface SmsMessage {
  id: string;
  to: string;
  from: string;
  body: string;
  otp_code?: string;
  created_at: string;
}

export interface InboxItem {
  id: string;
  type: 'email' | 'sms';
  to: string;
  from: string;
  subject?: string;
  body?: string;
  html?: string;
  text?: string;
  otp_code?: string;
  attachments?: EmailAttachment[];
  created_at: string;
}

// Payment Gateway & Checkout Types
export interface PaymentMethod {
  id: string;
  object?: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    funding?: string;
    country?: string;
  };
  billing_details?: {
    name?: string;
    email?: string;
    address?: Record<string, unknown>;
  };
}

export interface PaymentIntent {
  id: string;
  object: string;
  amount: number;
  amount_received?: number;
  amount_refunded?: number;
  currency: string;
  status:
    | 'requires_payment_method'
    | 'requires_action'
    | 'processing'
    | 'succeeded'
    | 'canceled'
    | 'refunded'
    | 'partially_refunded';
  client_secret?: string;
  description?: string;
  receipt_email?: string | null;
  customer?: string | null;
  payment_method?: PaymentMethod | null;
  payment_method_types?: string[];
  next_action?: {
    type: string;
    redirect_to_url?: {
      url: string;
      return_url?: string;
    };
  } | null;
  last_payment_error?: {
    code?: string;
    message?: string;
    type?: string;
    decline_code?: string;
  } | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface CheckoutSession {
  id: string;
  object: string;
  amount_total: number;
  amount_subtotal?: number;
  currency: string;
  customer_email?: string;
  line_items: Array<{
    name: string;
    amount: number;
    currency?: string;
    quantity: number;
  }>;
  mode: 'payment' | 'subscription';
  payment_status: 'unpaid' | 'paid';
  status: 'open' | 'complete' | 'expired';
  url: string;
  success_url?: string;
  cancel_url?: string;
  payment_intent?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  expires_at?: string;
}

export interface Refund {
  id: string;
  object: string;
  amount: number;
  currency: string;
  payment_intent: string;
  reason?: string;
  status: 'succeeded' | 'failed' | 'pending';
  created_at?: string;
}

export interface Customer {
  id: string;
  object: string;
  name: string;
  email: string;
  phone?: string;
  balance?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}
