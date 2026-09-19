var PlaygroundAPI = (function () {
  'use strict';

  class PlaygroundError extends Error {
    constructor(message, status, statusText, data, headers) {
      super(message);
      this.name = 'PlaygroundError';
      this.status = status;
      this.statusText = statusText;
      this.data = data;
      this.headers = headers;
      if (data && typeof data === 'object' && 'errors' in data && Array.isArray(data.errors)) {
        this.errors = data.errors;
      }
      Object.setPrototypeOf(this, PlaygroundError.prototype);
    }
    get isUnauthorized() { return this.status === 401; }
    get isForbidden() { return this.status === 403; }
    get isNotFound() { return this.status === 404; }
    get isRateLimited() { return this.status === 429; }
    get isServerError() { return this.status >= 500; }
    get retryAfter() {
      const retryHeader = this.headers ? this.headers.get('retry-after') : null;
      if (retryHeader) {
        const parsed = parseInt(retryHeader, 10);
        return isNaN(parsed) ? null : parsed;
      }
      return null;
    }
  }

  class PostsResource {
    constructor(client) { this.client = client; }
    list(params, options) { return this.client.request('/posts', { method: 'GET', params, ...options }); }
    get(id, options) { return this.client.request('/posts/' + id, { method: 'GET', ...options }); }
    create(data, options) { return this.client.request('/posts', { method: 'POST', body: data, ...options }); }
    update(id, data, options) { return this.client.request('/posts/' + id, { method: 'PUT', body: data, ...options }); }
    patch(id, data, options) { return this.client.request('/posts/' + id, { method: 'PATCH', body: data, ...options }); }
    delete(id, options) { return this.client.request('/posts/' + id, { method: 'DELETE', ...options }); }
    comments(id, options) { return this.client.request('/posts/' + id + '/comments', { method: 'GET', ...options }); }
  }

  class UsersResource {
    constructor(client) { this.client = client; }
    list(params, options) { return this.client.request('/users', { method: 'GET', params, ...options }); }
    get(id, options) { return this.client.request('/users/' + id, { method: 'GET', ...options }); }
    create(data, options) { return this.client.request('/users', { method: 'POST', body: data, ...options }); }
    update(id, data, options) { return this.client.request('/users/' + id, { method: 'PUT', body: data, ...options }); }
    delete(id, options) { return this.client.request('/users/' + id, { method: 'DELETE', ...options }); }
    posts(id, options) { return this.client.request('/users/' + id + '/posts', { method: 'GET', ...options }); }
    todos(id, options) { return this.client.request('/users/' + id + '/todos', { method: 'GET', ...options }); }
  }

  class CommentsResource {
    constructor(client) { this.client = client; }
    list(params, options) { return this.client.request('/comments', { method: 'GET', params, ...options }); }
    get(id, options) { return this.client.request('/comments/' + id, { method: 'GET', ...options }); }
    create(data, options) { return this.client.request('/comments', { method: 'POST', body: data, ...options }); }
    update(id, data, options) { return this.client.request('/comments/' + id, { method: 'PUT', body: data, ...options }); }
    delete(id, options) { return this.client.request('/comments/' + id, { method: 'DELETE', ...options }); }
  }

  class TodosResource {
    constructor(client) { this.client = client; }
    list(params, options) { return this.client.request('/todos', { method: 'GET', params, ...options }); }
    get(id, options) { return this.client.request('/todos/' + id, { method: 'GET', ...options }); }
    create(data, options) { return this.client.request('/todos', { method: 'POST', body: data, ...options }); }
    update(id, data, options) { return this.client.request('/todos/' + id, { method: 'PUT', body: data, ...options }); }
    delete(id, options) { return this.client.request('/todos/' + id, { method: 'DELETE', ...options }); }
  }

  class AuthResource {
    constructor(client) { this.client = client; }
    async login(credentials, options) {
      const res = await this.client.request('/auth/login', { method: 'POST', body: credentials, ...options });
      const token = res && (res.access_token || (res.tokens && res.tokens.accessToken));
      if (token) {
        this.client.setAuthToken(token);
      }
      return res;
    }
    async register(data, options) {
      const res = await this.client.request('/auth/register', { method: 'POST', body: data, ...options });
      const token = res && (res.access_token || (res.tokens && res.tokens.accessToken));
      if (token) {
        this.client.setAuthToken(token);
      }
      return res;
    }
    async refresh(refreshToken, options) {
      const res = await this.client.request('/auth/refresh', { method: 'POST', body: refreshToken ? { refreshToken } : {}, ...options });
      const token = res && (res.access_token || (res.tokens && res.tokens.accessToken));
      if (token) {
        this.client.setAuthToken(token);
      }
      return res;
    }
    async me(options) {
      return this.client.request('/auth/me', { method: 'GET', ...options });
    }
    async updateMe(data, options) {
      return this.client.request('/auth/me', { method: 'PATCH', body: data, ...options });
    }
    logout() { this.client.setAuthToken(undefined); }
  }

  class CustomResourceHandler {
    constructor(client, resourceName) {
      this.client = client;
      this.resourceName = resourceName;
    }
    list(params, options) { return this.client.request('/custom/' + this.resourceName, { method: 'GET', params, ...options }); }
    get(id, options) { return this.client.request('/custom/' + this.resourceName + '/' + id, { method: 'GET', ...options }); }
    create(data, options) { return this.client.request('/custom/' + this.resourceName, { method: 'POST', body: data, ...options }); }
    update(id, data, options) { return this.client.request('/custom/' + this.resourceName + '/' + id, { method: 'PUT', body: data, ...options }); }
    patch(id, data, options) { return this.client.request('/custom/' + this.resourceName + '/' + id, { method: 'PATCH', body: data, ...options }); }
    delete(id, options) { return this.client.request('/custom/' + this.resourceName + '/' + id, { method: 'DELETE', ...options }); }
  }

  class WebhooksResource {
    constructor(client) { this.client = client; }
    list(params, options) { return this.client.request('/webhooks', { method: 'GET', params, ...options }); }
    get(id, options) { return this.client.request('/webhooks/' + id, { method: 'GET', ...options }); }
    create(data, options) { return this.client.request('/webhooks', { method: 'POST', body: data, ...options }); }
    delete(id, options) { return this.client.request('/webhooks/' + id, { method: 'DELETE', ...options }); }
    test(data, options) { return this.client.request('/webhooks/test', { method: 'POST', body: data, ...options }); }
    deliveries(id, options) { return this.client.request('/webhooks/' + id + '/deliveries', { method: 'GET', ...options }); }
  }

  class MessagesResource {
    constructor(client) { this.client = client; }
    list(params, options) { return this.client.request('/messages', { method: 'GET', params, ...options }); }
    send(data, options) { return this.client.request('/messages', { method: 'POST', body: data, ...options }); }
  }

  class SessionResource {
    constructor(client) { this.client = client; }
    reset(options) { return this.client.request('/session/reset', { method: 'DELETE', ...options }); }
    stats(options) { return this.client.request('/session/stats', { method: 'GET', ...options }); }
    export(options) { return this.client.request('/session/export', { method: 'GET', ...options }); }
    import(snapshot, options) { return this.client.request('/session/import', { method: 'POST', body: snapshot, ...options }); }
  }

  class GraphQLResource {
    constructor(client) { this.client = client; }
    query(query, variables, options) {
      return this.client.request('/graphql', {
        method: 'POST',
        body: { query, variables },
        ...options
      });
    }
  }

  class RealtimeResource {
    constructor(client) { this.client = client; }
    subscribeNotifications(options = {}) {
      const baseUrl = this.client.getApiUrl().replace(/\/$/, '');
      const url = baseUrl + '/stream/notifications';
      if (typeof EventSource === 'undefined') {
        throw new Error('EventSource is not defined in this environment.');
      }
      const eventSource = new EventSource(url, { withCredentials: true });
      if (options.onOpen) eventSource.onopen = () => options.onOpen();
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          options.onMessage && options.onMessage(parsed);
        } catch (_e) {
          options.onMessage && options.onMessage(event.data);
        }
      };
      if (options.onError) eventSource.onerror = (err) => options.onError && options.onError(err);
      return { close: () => eventSource.close() };
    }
  }

  class EmailsResource {
    constructor(client) { this.client = client; }
    async send(payload, options) {
      const res = await this.client.request('/emails/send', { method: 'POST', body: payload, ...options });
      return (res && res.email) || res;
    }
    async list(options) {
      const res = await this.client.request('/emails', { method: 'GET', ...options });
      return Array.isArray(res) ? res : ((res && res.data) || []);
    }
    get(id, options) { return this.client.request('/emails/' + id, { method: 'GET', ...options }); }
    delete(id, options) { return this.client.request('/emails/' + id, { method: 'DELETE', ...options }); }
    async listTemplates(options) {
      const res = await this.client.request('/emails/templates', { method: 'GET', ...options });
      return Array.isArray(res) ? res : ((res && res.data) || []);
    }
    async createTemplate(template, options) {
      const res = await this.client.request('/emails/templates', { method: 'POST', body: template, ...options });
      return (res && res.template) || res;
    }
  }

  class SmsResource {
    constructor(client) { this.client = client; }
    async send(payload, options) {
      const res = await this.client.request('/sms/send', { method: 'POST', body: payload, ...options });
      return (res && res.sms) || res;
    }
    async list(options) {
      const res = await this.client.request('/sms', { method: 'GET', ...options });
      return Array.isArray(res) ? res : ((res && res.data) || []);
    }
    get(id, options) { return this.client.request('/sms/' + id, { method: 'GET', ...options }); }
    delete(id, options) { return this.client.request('/sms/' + id, { method: 'DELETE', ...options }); }
  }

  class InboxResource {
    constructor(client) { this.client = client; }
    async list(filters, options) {
      const res = await this.client.request('/inbox', { method: 'GET', params: filters, ...options });
      return Array.isArray(res) ? res : ((res && res.data) || []);
    }
    clear(options) { return this.client.request('/inbox', { method: 'DELETE', ...options }); }
  }

  class PlaygroundClient {
    constructor(options = {}) {
      this.apiUrl = options.apiUrl || 'http://localhost:3000/api/v1';
      this.identityToken = options.identityToken;
      this.authToken = options.authToken;
      this.defaultHeaders = options.defaultHeaders || {};
      this.customFetch = options.fetch || (typeof fetch !== 'undefined' ? fetch : globalThis.fetch);
      this.simulation = {
        delay: options.delay !== undefined ? options.delay : (options.simulation && options.simulation.delay),
        chaos: options.chaos !== undefined ? options.chaos : (options.simulation && options.simulation.chaos),
        status: options.status !== undefined ? options.status : (options.simulation && options.simulation.status),
        rateLimit: options.rateLimit !== undefined ? options.rateLimit : (options.simulation && options.simulation.rateLimit),
        jwtExpiry: options.jwtExpiry !== undefined ? options.jwtExpiry : (options.simulation && options.simulation.jwtExpiry)
      };

      this.posts = new PostsResource(this);
      this.users = new UsersResource(this);
      this.comments = new CommentsResource(this);
      this.todos = new TodosResource(this);
      this.auth = new AuthResource(this);
      this.webhooks = new WebhooksResource(this);
      this.messages = new MessagesResource(this);
      this.session = new SessionResource(this);
      this.realtime = new RealtimeResource(this);
      this.emails = new EmailsResource(this);
      this.sms = new SmsResource(this);
      this.inbox = new InboxResource(this);
      this._graphqlResource = new GraphQLResource(this);
    }

    getApiUrl() { return this.apiUrl; }
    setApiUrl(url) { this.apiUrl = url; return this; }
    setIdentityToken(token) { this.identityToken = token; return this; }
    setAuthToken(token) { this.authToken = token; return this; }
    custom(resourceName) { return new CustomResourceHandler(this, resourceName); }
    graphql(query, variables, options) { return this._graphqlResource.query(query, variables, options); }

    async request(endpoint, options = {}) {
      const {
        method = 'GET',
        params,
        body,
        headers: customHeaders = {},
        identityToken,
        authToken,
        signal,
        delay,
        chaos,
        status,
        rateLimit,
        jwtExpiry
      } = options;

      let cleanEndpoint = endpoint.startsWith('/') ? endpoint : ('/' + endpoint);
      const cleanBaseUrl = this.apiUrl.replace(/\/$/, '');
      let url = cleanBaseUrl + cleanEndpoint;

      if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        }
        const qs = searchParams.toString();
        if (qs) url += (url.includes('?') ? '&' : '?') + qs;
      }

      const headers = {
        'Accept': 'application/json',
        ...this.defaultHeaders,
        ...customHeaders
      };

      if (body !== undefined && !(typeof FormData !== 'undefined' && body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const effectiveIdentity = identityToken || this.identityToken;
      if (effectiveIdentity) headers['X-Playground-Identity'] = effectiveIdentity;

      const effectiveAuth = authToken || this.authToken;
      if (effectiveAuth) headers['Authorization'] = 'Bearer ' + effectiveAuth;

      const effDelay = delay !== undefined ? delay : this.simulation.delay;
      if (effDelay !== undefined && effDelay > 0) headers['X-Simulate-Delay'] = String(effDelay);

      const effChaos = chaos !== undefined ? chaos : this.simulation.chaos;
      if (effChaos !== undefined && effChaos > 0) headers['X-Simulate-Chaos'] = String(effChaos);

      const effStatus = status !== undefined ? status : this.simulation.status;
      if (effStatus !== undefined) headers['X-Simulate-Status'] = String(effStatus);

      const effRateLimit = rateLimit !== undefined ? rateLimit : this.simulation.rateLimit;
      if (effRateLimit !== undefined) headers['X-Simulate-RateLimit'] = String(effRateLimit);

      const effJwtExpiry = jwtExpiry !== undefined ? jwtExpiry : this.simulation.jwtExpiry;
      if (effJwtExpiry !== undefined) headers['X-Simulate-JWT-Expiry'] = String(effJwtExpiry);

      const fetchInit = {
        method,
        headers,
        signal,
        credentials: (typeof window !== 'undefined') ? 'include' : 'omit'
      };

      if (body !== undefined) {
        fetchInit.body = (typeof FormData !== 'undefined' && body instanceof FormData) ? body : JSON.stringify(body);
      }

      const res = await this.customFetch(url, fetchInit);

      let responseData = null;
      const contentType = res.headers ? (res.headers.get('content-type') || '') : '';
      if (contentType.includes('application/json')) {
        try { responseData = await res.json(); } catch (_e) { responseData = null; }
      } else {
        try { responseData = await res.text(); } catch (_e) { responseData = null; }
      }

      if (!res.ok) {
        const errorMessage = (responseData && typeof responseData === 'object' && responseData.error) ||
          (responseData && typeof responseData === 'object' && responseData.message) ||
          res.statusText ||
          ('HTTP Error ' + res.status);

        throw new PlaygroundError(errorMessage, res.status, res.statusText, responseData, res.headers);
      }

      return responseData;
    }
  }

  return {
    PlaygroundClient,
    PlaygroundError,
    PostsResource,
    UsersResource,
    CommentsResource,
    TodosResource,
    AuthResource,
    CustomResourceHandler,
    WebhooksResource,
    MessagesResource,
    SessionResource,
    GraphQLResource,
    RealtimeResource,
    EmailsResource,
    SmsResource,
    InboxResource
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PlaygroundAPI;
}
if (typeof window !== 'undefined') {
  window.PlaygroundAPI = PlaygroundAPI;
  window.PlaygroundClient = PlaygroundAPI.PlaygroundClient;
}
