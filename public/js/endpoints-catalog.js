window.ALL_ENDPOINTS_CATALOG = [
  // USERS
  {
    resource: 'users',
    method: 'GET',
    path: '/users',
    summary: 'Retrieve a paginated list of users. Results merge shared global user records with session sandbox overlays (newly created users appear at the top).',
    params: [
      { name: 'page', in: 'query', type: 'integer', description: 'Page number (1-indexed, default 1).' },
      { name: 'limit', in: 'query', type: 'integer', description: 'Number of records per page (default 10, max 200).' },
      { name: 'cursor', in: 'query', type: 'string', description: 'Base64 cursor for infinite scroll pagination.' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        {
          id: 1,
          name: "Leanne Graham",
          username: "bret",
          email: "sincere@april.biz",
          phone: "+1-770-555-0123",
          website: "hildegard.org",
          address: { street: "Kulas Light", city: "Gwenborough", zipcode: "92998-3874" },
          company: { name: "Romaguera-Crona", catchPhrase: "Multi-layered client-server neural-net" }
        }
      ],
      pagination: { page: 1, limit: 10, total: 25, totalPages: 3, hasNextPage: true, hasPrevPage: false }
    }, null, 2)
  },
  {
    resource: 'users',
    method: 'GET',
    path: '/users/:id',
    summary: 'Retrieve a single user by ID. Supports plain integer IDs for global records and string IDs formatted as local-<uuid> for session sandbox records.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'User ID (e.g. 1 for global user or local-<uuid> for sandbox user).' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      id: 1,
      name: "Leanne Graham",
      username: "bret",
      email: "sincere@april.biz",
      phone: "+1-770-555-0123",
      website: "hildegard.org",
      address: { street: "Kulas Light", city: "Gwenborough", zipcode: "92998-3874" },
      company: { name: "Romaguera-Crona", catchPhrase: "Multi-layered client-server neural-net" }
    }, null, 2)
  },
  {
    resource: 'users',
    method: 'POST',
    path: '/users',
    summary: 'Create a new session sandbox user record. Returns a local-<uuid> formatted ID with _sandbox: "created". Each session identity is capped at 30 created records.',
    params: [
      { name: 'name', in: 'body', type: 'string', description: 'Full name of the user.' },
      { name: 'username', in: 'body', type: 'string', description: 'Username.' },
      { name: 'email', in: 'body', type: 'string', description: 'Email address.' }
    ],
    bodyExample: JSON.stringify({
      name: "Alexander Wright",
      username: "alex_w",
      email: "alexander.wright@techflow.io",
      phone: "+1-415-555-0182",
      website: "alexwright.dev",
      address: { street: "Market St", city: "San Francisco", zipcode: "94103" },
      company: { name: "TechFlow Labs", catchPhrase: "Distributed cloud infrastructure" }
    }, null, 2),
    responseExample: JSON.stringify({
      id: "local-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      name: "Alexander Wright",
      username: "alex_w",
      email: "alexander.wright@techflow.io",
      phone: "+1-415-555-0182",
      website: "alexwright.dev",
      address: { street: "Market St", city: "San Francisco", zipcode: "94103" },
      company: { name: "TechFlow Labs", catchPhrase: "Distributed cloud infrastructure" },
      _sandbox: "created"
    }, null, 2)
  },
  {
    resource: 'users',
    method: 'PUT',
    path: '/users/:id',
    summary: 'Replace an existing user record in the session overlay. Global records remain untouched for other visitors and preserve original list position.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'User ID to update (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({
      name: "Leanne Graham (Updated)",
      username: "bret",
      email: "sincere@april.biz",
      website: "hildegard-updated.org"
    }, null, 2),
    responseExample: JSON.stringify({
      id: 1,
      name: "Leanne Graham (Updated)",
      username: "bret",
      email: "sincere@april.biz",
      website: "hildegard-updated.org",
      _sandbox: "updated"
    }, null, 2)
  },
  {
    resource: 'users',
    method: 'PATCH',
    path: '/users/:id',
    summary: 'Partially update specific fields of a user record in the session overlay.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'User ID to patch (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ website: "https://updated-portfolio.dev" }, null, 2),
    responseExample: JSON.stringify({
      id: 1,
      name: "Leanne Graham",
      website: "https://updated-portfolio.dev",
      _sandbox: "updated"
    }, null, 2)
  },
  {
    resource: 'users',
    method: 'DELETE',
    path: '/users/:id',
    summary: 'Remove a user record from the requesting session view. The underlying global record is unaffected for other visitors.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'User ID to delete (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: null,
    responseExample: "204 No Content"
  },

  // POSTS
  {
    resource: 'posts',
    method: 'GET',
    path: '/posts',
    summary: 'Retrieve a paginated list of posts. Results merge shared global post records with session sandbox overlays (newly created posts appear at the top).',
    params: [
      { name: 'page', in: 'query', type: 'integer', description: 'Page number (1-indexed, default 1).' },
      { name: 'limit', in: 'query', type: 'integer', description: 'Number of records per page (default 10, max 200).' },
      { name: 'cursor', in: 'query', type: 'string', description: 'Base64 cursor for infinite scroll pagination.' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        {
          id: 1,
          user_id: 1,
          title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
          body: "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto"
        }
      ],
      pagination: { page: 1, limit: 10, total: 100, totalPages: 10, hasNextPage: true, hasPrevPage: false }
    }, null, 2)
  },
  {
    resource: 'posts',
    method: 'GET',
    path: '/posts/:id',
    summary: 'Retrieve a single post by ID. Supports plain integer IDs for global records and string IDs formatted as local-<uuid> for session sandbox records.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Post ID (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      id: 1,
      user_id: 1,
      title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      body: "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto"
    }, null, 2)
  },
  {
    resource: 'posts',
    method: 'POST',
    path: '/posts',
    summary: 'Create a new session sandbox post record. Returns a local-<uuid> formatted ID with _sandbox: "created". Each session identity is capped at 30 created records.',
    params: [
      { name: 'user_id', in: 'body', type: 'integer', description: 'Author user ID.' },
      { name: 'title', in: 'body', type: 'string', description: 'Post title.' },
      { name: 'body', in: 'body', type: 'string', description: 'Post body content.' }
    ],
    bodyExample: JSON.stringify({
      user_id: 1,
      title: "optimizing database indexing strategies for large scale applications",
      body: "database indexing is one of the most critical factors in query performance. by creating proper B-tree and GIN indexes, read latency can drop from seconds to milliseconds during peak concurrency loads."
    }, null, 2),
    responseExample: JSON.stringify({
      id: "local-b2c3d4e5-f6a7-8901-bcde-f12345678901",
      user_id: 1,
      title: "optimizing database indexing strategies for large scale applications",
      body: "database indexing is one of the most critical factors in query performance. by creating proper B-tree and GIN indexes, read latency can drop from seconds to milliseconds during peak concurrency loads.",
      _sandbox: "created"
    }, null, 2)
  },
  {
    resource: 'posts',
    method: 'PUT',
    path: '/posts/:id',
    summary: 'Replace an existing post record in the session overlay. Global records remain untouched for other visitors and preserve original list position.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Post ID to update (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({
      user_id: 1,
      title: "sunt aut facere repellat provident occaecati (Updated)",
      body: "quia et suscipit suscipit recusandae consequuntur expedita..."
    }, null, 2),
    responseExample: JSON.stringify({
      id: 1,
      user_id: 1,
      title: "sunt aut facere repellat provident occaecati (Updated)",
      body: "quia et suscipit suscipit recusandae consequuntur expedita...",
      _sandbox: "updated"
    }, null, 2)
  },
  {
    resource: 'posts',
    method: 'PATCH',
    path: '/posts/:id',
    summary: 'Partially update specific fields of a post record in the session overlay.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Post ID to patch (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ title: "sunt aut facere (Patched)" }, null, 2),
    responseExample: JSON.stringify({
      id: 1,
      title: "sunt aut facere (Patched)",
      _sandbox: "updated"
    }, null, 2)
  },
  {
    resource: 'posts',
    method: 'DELETE',
    path: '/posts/:id',
    summary: 'Remove a post record from the requesting session view. The underlying global record is unaffected for other visitors.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Post ID to delete (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: null,
    responseExample: "204 No Content"
  },

  // COMMENTS
  {
    resource: 'comments',
    method: 'GET',
    path: '/comments',
    summary: 'Retrieve a paginated list of comments. Results merge shared global comment records with session sandbox overlays (newly created comments appear at the top).',
    params: [
      { name: 'page', in: 'query', type: 'integer', description: 'Page number (1-indexed, default 1).' },
      { name: 'limit', in: 'query', type: 'integer', description: 'Number of records per page (default 10, max 200).' },
      { name: 'cursor', in: 'query', type: 'string', description: 'Base64 cursor for infinite scroll pagination.' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        {
          id: 1,
          post_id: 1,
          name: "id labore ex et quam laborum",
          email: "Eliseo@gardner.biz",
          body: "laudantium enim quasi est quidem magnam voluptatem aut eveniet quas aliquid sint expedita consequuntur alias ea quam expedita possimus"
        }
      ],
      pagination: { page: 1, limit: 10, total: 300, totalPages: 30, hasNextPage: true, hasPrevPage: false }
    }, null, 2)
  },
  {
    resource: 'comments',
    method: 'GET',
    path: '/comments/:id',
    summary: 'Retrieve a single comment by ID. Supports plain integer IDs for global records and string IDs formatted as local-<uuid> for session sandbox records.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Comment ID (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      id: 1,
      post_id: 1,
      name: "id labore ex et quam laborum",
      email: "Eliseo@gardner.biz",
      body: "laudantium enim quasi est quidem magnam voluptatem aut eveniet quas aliquid sint expedita consequuntur alias ea quam expedita possimus"
    }, null, 2)
  },
  {
    resource: 'comments',
    method: 'POST',
    path: '/comments',
    summary: 'Create a new session sandbox comment record. Returns a local-<uuid> formatted ID with _sandbox: "created". Each session identity is capped at 30 created records.',
    params: [
      { name: 'post_id', in: 'body', type: 'integer', description: 'Associated post ID.' },
      { name: 'name', in: 'body', type: 'string', description: 'Comment title/name.' },
      { name: 'email', in: 'body', type: 'string', description: 'Author email address.' },
      { name: 'body', in: 'body', type: 'string', description: 'Comment text content.' }
    ],
    bodyExample: JSON.stringify({
      post_id: 1,
      name: "super helpful post on JWT security",
      email: "dev_reviewer@tech.net",
      body: "This article helped our team fix an identity cookie validation issue in production. Thanks for sharing these clear code snippets!"
    }, null, 2),
    responseExample: JSON.stringify({
      id: "local-c3d4e5f6-7890-abcd-ef12-345678901234",
      post_id: 1,
      name: "super helpful post on JWT security",
      email: "dev_reviewer@tech.net",
      body: "This article helped our team fix an identity cookie validation issue in production. Thanks for sharing these clear code snippets!",
      _sandbox: "created"
    }, null, 2)
  },
  {
    resource: 'comments',
    method: 'PUT',
    path: '/comments/:id',
    summary: 'Replace an existing comment record in the session overlay. Global records remain untouched for other visitors and preserve original list position.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Comment ID to update (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({
      post_id: 1,
      name: "id labore ex et quam laborum (Updated)",
      email: "Eliseo@gardner.biz",
      body: "Updated comment text body content."
    }, null, 2),
    responseExample: JSON.stringify({
      id: 1,
      post_id: 1,
      name: "id labore ex et quam laborum (Updated)",
      email: "Eliseo@gardner.biz",
      body: "Updated comment text body content.",
      _sandbox: "updated"
    }, null, 2)
  },
  {
    resource: 'comments',
    method: 'PATCH',
    path: '/comments/:id',
    summary: 'Partially update specific fields of a comment record in the session overlay.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Comment ID to patch (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ body: "Partially updated comment text body content." }, null, 2),
    responseExample: JSON.stringify({
      id: 1,
      body: "Partially updated comment text body content.",
      _sandbox: "updated"
    }, null, 2)
  },
  {
    resource: 'comments',
    method: 'DELETE',
    path: '/comments/:id',
    summary: 'Remove a comment record from the requesting session view. The underlying global record is unaffected for other visitors.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Comment ID to delete (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: null,
    responseExample: "204 No Content"
  },

  // TODOS
  {
    resource: 'todos',
    method: 'GET',
    path: '/todos',
    summary: 'Retrieve a paginated list of todos. Results merge shared global todo records with session sandbox overlays (newly created todos appear at the top).',
    params: [
      { name: 'page', in: 'query', type: 'integer', description: 'Page number (1-indexed, default 1).' },
      { name: 'limit', in: 'query', type: 'integer', description: 'Number of records per page (default 10, max 200).' },
      { name: 'cursor', in: 'query', type: 'string', description: 'Base64 cursor for infinite scroll pagination.' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        { id: 1, user_id: 1, title: "delectus aut autem", completed: false }
      ],
      pagination: { page: 1, limit: 10, total: 125, totalPages: 13, hasNextPage: true, hasPrevPage: false }
    }, null, 2)
  },
  {
    resource: 'todos',
    method: 'GET',
    path: '/todos/:id',
    summary: 'Retrieve a single todo item by ID. Supports plain integer IDs for global records and string IDs formatted as local-<uuid> for session sandbox records.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Todo ID (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({ id: 1, user_id: 1, title: "delectus aut autem", completed: false }, null, 2)
  },
  {
    resource: 'todos',
    method: 'POST',
    path: '/todos',
    summary: 'Create a new session sandbox todo record. Returns a local-<uuid> formatted ID with _sandbox: "created". Each session identity is capped at 30 created records.',
    params: [
      { name: 'user_id', in: 'body', type: 'integer', description: 'Owner user ID.' },
      { name: 'title', in: 'body', type: 'string', description: 'Todo item title.' },
      { name: 'completed', in: 'body', type: 'boolean', description: 'Completion status (true/false).' }
    ],
    bodyExample: JSON.stringify({
      user_id: 1,
      title: "Review and merge pull request #142 for identity middleware",
      completed: true
    }, null, 2),
    responseExample: JSON.stringify({
      id: "local-d4e5f6a7-8901-bcde-f123-456789012345",
      user_id: 1,
      title: "Review and merge pull request #142 for identity middleware",
      completed: true,
      _sandbox: "created"
    }, null, 2)
  },
  {
    resource: 'todos',
    method: 'PUT',
    path: '/todos/:id',
    summary: 'Replace an existing todo record in the session overlay. Global records remain untouched for other visitors and preserve original list position.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Todo ID to update (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ user_id: 1, title: "delectus aut autem", completed: true }, null, 2),
    responseExample: JSON.stringify({ id: 1, user_id: 1, title: "delectus aut autem", completed: true, _sandbox: "updated" }, null, 2)
  },
  {
    resource: 'todos',
    method: 'PATCH',
    path: '/todos/:id',
    summary: 'Partially update specific fields of a todo record in the session overlay.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Todo ID to patch (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ completed: true }, null, 2),
    responseExample: JSON.stringify({ id: 1, completed: true, _sandbox: "updated" }, null, 2)
  },
  {
    resource: 'todos',
    method: 'DELETE',
    path: '/todos/:id',
    summary: 'Remove a todo record from the requesting session view. The underlying global record is unaffected for other visitors.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Todo ID to delete (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: null,
    responseExample: "204 No Content"
  },
  // AUTH
  {
    resource: 'auth',
    method: 'POST',
    path: '/auth/login',
    summary: 'Authenticate user with username/email & password to receive signed JWT access and refresh tokens.',
    params: [
      { name: 'username', in: 'body', type: 'string', description: 'Username (e.g. Bret or custom registered username).' },
      { name: 'password', in: 'body', type: 'string', description: 'Password string (standard password: Password@123).' }
    ],
    bodyExample: JSON.stringify({ username: "Bret", password: "Password@123" }, null, 2),
    responseExample: JSON.stringify({
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      token_type: "Bearer",
      expires_in: 900,
      user: {
        id: 1,
        name: "Leanne Graham",
        username: "bret",
        email: "sincere@april.biz"
      }
    }, null, 2)
  },
  {
    resource: 'auth',
    method: 'POST',
    path: '/auth/register',
    summary: 'Register a new session user and immediately receive signed JWT access and refresh tokens.',
    params: [
      { name: 'name', in: 'body', type: 'string', description: 'Full name of the user.' },
      { name: 'username', in: 'body', type: 'string', description: 'Unique username.' },
      { name: 'email', in: 'body', type: 'string', description: 'User email address.' }
    ],
    bodyExample: JSON.stringify({ name: "Alice Smith", username: "alice", email: "alice@example.com", password: "Password@123" }, null, 2),
    responseExample: JSON.stringify({
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      token_type: "Bearer",
      expires_in: 900,
      user: {
        id: "local-d4e5f6a7-8901-bcde-f123-456789012345",
        name: "Alice Smith",
        username: "alice",
        email: "alice@example.com",
        _sandbox: "created"
      }
    }, null, 2)
  },
  {
    resource: 'auth',
    method: 'POST',
    path: '/auth/refresh',
    summary: 'Exchange a valid refresh token for a fresh 15-minute JWT access token.',
    params: [
      { name: 'refreshToken', in: 'body', type: 'string', description: 'Valid refresh token string.' }
    ],
    bodyExample: JSON.stringify({ refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6..." }, null, 2),
    responseExample: JSON.stringify({
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      token_type: "Bearer",
      expires_in: 900
    }, null, 2)
  },
  {
    resource: 'auth',
    method: 'GET',
    path: '/auth/me',
    summary: 'Retrieve current authenticated user profile using Authorization: Bearer <access_token>.',
    params: [
      { name: 'Authorization', in: 'header', type: 'string', description: 'Bearer <access_token>' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      id: 1,
      name: "Leanne Graham",
      username: "bret",
      email: "sincere@april.biz"
    }, null, 2)
  },
  {
    resource: 'auth',
    method: 'PATCH',
    path: '/auth/me',
    summary: 'Update current authenticated user profile in the session sandbox using Authorization: Bearer <access_token>.',
    params: [
      { name: 'Authorization', in: 'header', type: 'string', description: 'Bearer <access_token>' }
    ],
    bodyExample: JSON.stringify({ name: "Bret - Updated Profile" }, null, 2),
    responseExample: JSON.stringify({
      id: 1,
      name: "Bret - Updated Profile",
      username: "bret",
      email: "sincere@april.biz",
      _sandbox: "updated"
    }, null, 2)
  },
  // MEDIA (AVATARS & THUMBNAILS)
  {
    resource: 'media',
    method: 'GET',
    path: '/public/avatars/:seed.svg',
    summary: 'Generate deterministic vector SVG avatar for a user seed string or ID with custom size and squircle/circle background.',
    params: [
      { name: 'seed', in: 'path', type: 'string', description: 'Seed string (e.g. bret, alice, user-1) for gradient hashing and initials extraction.' },
      { name: 'size', in: 'query', type: 'integer', description: 'Avatar dimension in pixels (default 128).' },
      { name: 'rounded', in: 'query', type: 'boolean', description: 'Circular vs squircle rendering (default true).' }
    ],
    bodyExample: null,
    responseExample: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect width="128" height="128" rx="64" fill="#059669" />
  <text x="50%" y="54%" font-family="Inter, sans-serif" font-size="54" font-weight="700" fill="#ffffff" text-anchor="middle">BR</text>
</svg>`
  },
  {
    resource: 'media',
    method: 'GET',
    path: '/public/thumbnails/:seed.svg',
    summary: 'Generate 600x400 landscape vector SVG placeholder image with mesh gradient background, custom text, and dimension badge.',
    params: [
      { name: 'seed', in: 'path', type: 'string', description: 'Seed string (e.g. post-1, react-tutorial) for background color hashing.' },
      { name: 'width', in: 'query', type: 'integer', description: 'Thumbnail width in pixels (default 600).' },
      { name: 'height', in: 'query', type: 'integer', description: 'Thumbnail height in pixels (default 400).' },
      { name: 'text', in: 'query', type: 'string', description: 'Custom label text override.' }
    ],
    bodyExample: null,
    responseExample: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <rect width="600" height="400" fill="#4f46e5" />
  <text x="50%" y="46%" font-family="Inter, sans-serif" font-size="33" font-weight="700" fill="#ffffff" text-anchor="middle">Post #1</text>
</svg>`
  },
  // SESSION (SNAPSHOT EXPORT & IMPORT)
  {
    resource: 'session',
    method: 'GET',
    path: '/session/export',
    summary: 'Serializes all session sandbox overlay records (creates, updates, deletes) into a downloadable JSON snapshot file for backups or team sharing.',
    params: [
      { name: 'resource', in: 'query', type: 'string', description: 'Resource filter ("all", "users", "posts", "comments", "todos"). Default: "all".' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      version: "1.0",
      exportedAt: "2026-08-02T23:00:00.000Z",
      identityId: "550e8400-e29b-41d4-a716-446655440000",
      targetResource: "all",
      stats: { totalRecords: 2, creates: 1, updates: 1, deletes: 0 },
      records: [
        { resource: "users", op: "create", targetId: null, data: { name: "Custom User" }, createdAt: "2026-08-02T22:00:00.000Z" }
      ]
    }, null, 2)
  },
  {
    resource: 'session',
    method: 'POST',
    path: '/session/import',
    summary: 'Restores a previously exported JSON snapshot file or payload into your session sandbox overlay with strategy replacement or merge.',
    params: [
      { name: 'strategy', in: 'query', type: 'string', description: 'Import strategy ("replace" or "merge"). Default: "replace".' },
      { name: 'resource', in: 'query', type: 'string', description: 'Target resource restriction. Default: auto-detect.' }
    ],
    bodyExample: JSON.stringify({
      version: "1.0",
      records: [
        { resource: "users", op: "create", data: { name: "Restored User", email: "restored@sandbox.dev" } }
      ]
    }, null, 2),
    responseExample: JSON.stringify({
      message: "Session sandbox snapshot imported successfully.",
      importedRecords: 1,
      strategy: "replace",
      affectedResources: ["users"]
    }, null, 2)
  },
  {
    resource: 'session',
    method: 'DELETE',
    path: '/session/reset',
    summary: 'Purges all created, updated, and deleted overlay mutations for your session identity, resetting your view to clean baseline global data.',
    params: [],
    bodyExample: null,
    responseExample: JSON.stringify({
      message: "Session sandbox overlay purged successfully.",
      purgedRecords: 3
    }, null, 2)
  },
  // CUSTOM (DYNAMIC RESOURCES ENGINE)
  {
    resource: 'custom',
    method: 'GET',
    path: '/custom',
    summary: 'Returns a summary of all active dynamic custom resource collections in your session sandbox with record counts.',
    params: [],
    bodyExample: null,
    responseExample: JSON.stringify({
      totalCollections: 2,
      collections: [
        { name: "products", endpoint: "/custom/products", count: 3, lastUpdated: "2026-08-02T23:30:00.000Z" },
        { name: "orders", endpoint: "/custom/orders", count: 2, lastUpdated: "2026-08-02T23:30:00.000Z" }
      ]
    }, null, 2)
  },
  {
    resource: 'custom',
    method: 'POST',
    path: '/custom/seed',
    summary: 'Instantly populates pre-built domain collections into your session sandbox with one request.',
    params: [
      { name: 'template', in: 'query', type: 'string', description: 'Domain template ("ecommerce", "crm", "saas", "healthcare"). Default: "ecommerce".' }
    ],
    bodyExample: JSON.stringify({ template: "ecommerce" }, null, 2),
    responseExample: JSON.stringify({
      message: "Seeded 5 records across custom collections: products, orders.",
      template: "ecommerce",
      collections: ["products", "orders"],
      totalSeeded: 5
    }, null, 2)
  },
  {
    resource: 'custom',
    method: 'GET',
    path: '/custom/:collection',
    summary: 'Retrieves a paginated list of items from any dynamic custom collection. Supports page, limit, full-text search (?q=), and sorting (?_sort=).',
    params: [
      { name: 'collection', in: 'path', type: 'string', description: 'Custom collection name (e.g. products, orders, notes, leads).' },
      { name: 'page', in: 'query', type: 'integer', description: 'Page number (default 1).' },
      { name: 'limit', in: 'query', type: 'integer', description: 'Records per page (default 10).' },
      { name: 'cursor', in: 'query', type: 'string', description: 'Base64 cursor for infinite scroll pagination.' },
      { name: 'q', in: 'query', type: 'string', description: 'Case-insensitive full-text search term.' },
      { name: '_sort', in: 'query', type: 'string', description: 'Field name to sort by.' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        { id: "local-a1b2c3d4", name: 'MacBook Pro M3', price: 2499, category: 'Laptops', createdAt: "2026-08-02T23:30:00.000Z", _sandbox: "created" }
      ],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false }
    }, null, 2)
  },
  {
    resource: 'custom',
    method: 'POST',
    path: '/custom/:collection',
    summary: 'Creates a new custom record in any arbitrary collection with automatic ID, createdAt, and updatedAt metadata attachment.',
    params: [
      { name: 'collection', in: 'path', type: 'string', description: 'Custom collection name (e.g. products, orders).' }
    ],
    bodyExample: JSON.stringify({ name: "Custom Product Item", price: 99.99, inStock: true }, null, 2),
    responseExample: JSON.stringify({
      id: "local-f9e8d7c6-5432-10ab",
      name: "Custom Product Item",
      price: 99.99,
      inStock: true,
      createdAt: "2026-08-02T23:30:00.000Z",
      updatedAt: "2026-08-02T23:30:00.000Z",
      _sandbox: "created"
    }, null, 2)
  },
  {
    resource: 'custom',
    method: 'DELETE',
    path: '/custom/:collection/:id',
    summary: 'Removes a custom record from your session sandbox.',
    params: [
      { name: 'collection', in: 'path', type: 'string', description: 'Custom collection name.' },
      { name: 'id', in: 'path', type: 'string', description: 'Record ID (e.g. local-uuid).' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      message: "Record 'local-f9e8d7c6' removed from custom collection 'products'"
    }, null, 2)
  },
  // MESSAGES & REALTIME
  {
    resource: 'messages',
    method: 'GET',
    path: '/messages',
    summary: 'Retrieve paginated chat messages for a channel room or universal feed.',
    params: [
      { name: 'room', in: 'query', type: 'string', description: 'Room channel name (e.g. general, support, random).' },
      { name: 'limit', in: 'query', type: 'integer', description: 'Number of messages per page (default 20).' },
      { name: 'cursor', in: 'query', type: 'string', description: 'Base64 cursor for infinite scroll pagination.' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        {
          id: 1,
          room: 'general',
          sender_id: 1,
          sender_name: 'Leanne Graham',
          text: 'Welcome to Playground API live chat simulation! 🚀',
          created_at: '2026-09-19T06:00:00.000Z'
        }
      ],
      pagination: { page: 1, limit: 20, total: 2, hasNextPage: false }
    }, null, 2)
  },
  {
    resource: 'messages',
    method: 'POST',
    path: '/messages',
    summary: 'Publish a chat message that persists in session overlay and broadcasts to WebSocket and Socket.io peers.',
    params: [
      { name: 'room', in: 'body', type: 'string', description: 'Channel room name (e.g. support).' },
      { name: 'sender_name', in: 'body', type: 'string', description: 'Display name of sender.' },
      { name: 'text', in: 'body', type: 'string', description: 'Message body text.' }
    ],
    bodyExample: JSON.stringify({
      room: 'support',
      sender_name: 'Alice',
      text: 'How do I test simulated 429 rate limits?'
    }, null, 2),
    responseExample: JSON.stringify({
      id: 'local-550e8400-e29b-41d4-a716-446655440000',
      room: 'support',
      sender_id: 1,
      sender_name: 'Alice',
      text: 'How do I test simulated 429 rate limits?',
      created_at: '2026-09-19T07:20:00.000Z'
    }, null, 2)
  },
  {
    resource: 'messages',
    method: 'GET',
    path: '/stream/notifications',
    summary: 'Server-Sent Events (SSE) notification stream for real-time background status and activity broadcasts.',
    params: [],
    bodyExample: null,
    responseExample: 'event: notification\ndata: {"id":"notif-1","type":"info","title":"System Ready","message":"Playground API live","timestamp":"2026-09-19T07:20:00.000Z"}\n\n'
  },
  // WEBHOOKS
  {
    resource: 'webhooks',
    method: 'GET',
    path: '/webhooks',
    summary: 'Retrieve all registered webhook receiver endpoints for your session.',
    params: [],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        {
          id: 'local-550e8400-e29b-41d4-a716-446655440000',
          name: 'My Webhook Receiver',
          url: 'https://myapp.ngrok.io/api/webhooks/playground',
          events: ['post.*', 'auth.*'],
          secret: 'whsec_demo_secret_key_123',
          isActive: true,
          created_at: '2026-09-19T07:30:00.000Z'
        }
      ],
      total: 1
    }, null, 2)
  },
  {
    resource: 'webhooks',
    method: 'POST',
    path: '/webhooks',
    summary: 'Register a new webhook URL to receive signed HMAC-SHA256 HTTP POST dispatches on matching events.',
    params: [
      { name: 'url', in: 'body', type: 'string', description: 'Destination HTTP/HTTPS webhook receiver URL.' },
      { name: 'events', in: 'body', type: 'array', description: 'Event pattern subscriptions (e.g. ["post.*", "auth.*", "*"]).' },
      { name: 'secret', in: 'body', type: 'string', description: 'Secret key for HMAC SHA-256 signature verification.' },
      { name: 'name', in: 'body', type: 'string', description: 'Optional display label for webhook.' }
    ],
    bodyExample: JSON.stringify({
      name: 'Local Dev Server Webhook',
      url: 'https://myapp.ngrok.io/api/webhooks/playground',
      events: ['post.*', 'auth.*'],
      secret: 'whsec_demo_secret_key_123'
    }, null, 2),
    responseExample: JSON.stringify({
      id: 'local-550e8400-e29b-41d4-a716-446655440000',
      name: 'Local Dev Server Webhook',
      url: 'https://myapp.ngrok.io/api/webhooks/playground',
      events: ['post.*', 'auth.*'],
      secret: 'whsec_demo_secret_key_123',
      isActive: true,
      created_at: '2026-09-19T07:30:00.000Z'
    }, null, 2)
  },
  {
    resource: 'webhooks',
    method: 'POST',
    path: '/webhooks/test',
    summary: 'Send an immediate test ping webhook to a registered or custom URL.',
    params: [
      { name: 'url', in: 'body', type: 'string', description: 'Target destination URL (optional if testing existing webhook).' },
      { name: 'event', in: 'body', type: 'string', description: 'Event name (default test.ping).' }
    ],
    bodyExample: JSON.stringify({
      url: 'https://httpbin.org/post',
      event: 'test.ping',
      data: { message: 'Hello from Playground API Webhook Tester!' }
    }, null, 2),
    responseExample: JSON.stringify({
      message: 'Webhook dispatched successfully.',
      delivery: {
        id: 'del_550e8400-e29b-41d4-a716-446655440000',
        event: 'test.ping',
        status: 200,
        success: true,
        durationMs: 42,
        timestamp: '2026-09-19T07:30:00.000Z'
      }
    }, null, 2)
  },
  {
    resource: 'webhooks',
    method: 'GET',
    path: '/webhooks/deliveries',
    summary: 'Retrieve recent webhook delivery attempt logs and responses.',
    params: [],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        {
          id: 'del_550e8400-e29b-41d4-a716-446655440000',
          webhookUrl: 'https://httpbin.org/post',
          event: 'post.created',
          status: 200,
          success: true,
          durationMs: 38,
          timestamp: '2026-09-19T07:30:00.000Z'
        }
      ],
      total: 1
    }, null, 2)
  },
  // INBOX & COMMUNICATION (Feature 27)
  {
    resource: 'inbox',
    method: 'POST',
    path: '/emails/send',
    summary: 'Send a virtual transactional email with template interpolation and optional Cloudinary attachments.',
    params: [
      { name: 'to', in: 'body', type: 'string', description: 'Recipient email address.' },
      { name: 'template', in: 'body', type: 'string', description: 'Template ID (e.g. welcome-verification, password-reset, invoice-receipt, 2fa-code).' },
      { name: 'data', in: 'body', type: 'object', description: 'Variables to interpolate into template.' }
    ],
    bodyExample: JSON.stringify({
      to: 'developer@example.com',
      template: 'welcome-verification',
      data: {
        name: 'Alex Developer',
        otp: '482910',
        verification_link: 'https://playground.nileslabs.com/docs/inbox?code=482910',
        expires_in_minutes: 15
      }
    }, null, 2),
    responseExample: JSON.stringify({
      success: true,
      email: {
        id: 'local-msg-7f3b8912-45e6-42d1-b6a8-23456789abcd',
        to: 'developer@example.com',
        from: 'no-reply@playground.nileslabs.com',
        subject: 'Verify your Playground API account',
        template: 'welcome-verification',
        otp_code: '482910',
        created_at: '2026-09-19T07:35:00.000Z'
      }
    }, null, 2)
  },
  {
    resource: 'inbox',
    method: 'GET',
    path: '/emails',
    summary: 'List all emails captured in current sandbox session.',
    params: [],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        {
          id: 'local-msg-7f3b8912-45e6-42d1-b6a8-23456789abcd',
          to: 'developer@example.com',
          from: 'no-reply@playground.nileslabs.com',
          subject: 'Verify your Playground API account',
          otp_code: '482910',
          created_at: '2026-09-19T07:35:00.000Z'
        }
      ]
    }, null, 2)
  },
  {
    resource: 'inbox',
    method: 'POST',
    path: '/sms/send',
    summary: 'Send a simulated SMS message and automatically parse OTP codes.',
    params: [
      { name: 'to', in: 'body', type: 'string', description: 'Recipient phone number.' },
      { name: 'body', in: 'body', type: 'string', description: 'SMS message text.' }
    ],
    bodyExample: JSON.stringify({
      to: '+1 (555) 839-2049',
      body: 'Your verification code is 582910. Valid for 10 minutes.'
    }, null, 2),
    responseExample: JSON.stringify({
      success: true,
      sms: {
        id: 'local-sms-8f3b8912-45e6-42d1-b6a8-23456789abcd',
        to: '+1 (555) 839-2049',
        from: '+1 (555) 019-9000',
        body: 'Your verification code is 582910. Valid for 10 minutes.',
        otp_code: '582910',
        created_at: '2026-09-19T07:36:00.000Z'
      }
    }, null, 2)
  },
  {
    resource: 'inbox',
    method: 'GET',
    path: '/inbox',
    summary: 'Retrieve unified inbox items (emails and SMS) for active sandbox session.',
    params: [
      { name: 'type', in: 'query', type: 'string', description: 'Filter by type: email or sms.' },
      { name: 'to', in: 'query', type: 'string', description: 'Filter by recipient.' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        {
          id: 'local-msg-7f3b8912-45e6-42d1-b6a8-23456789abcd',
          type: 'email',
          to: 'developer@example.com',
          from: 'no-reply@playground.nileslabs.com',
          subject: 'Verify your Playground API account',
          otp_code: '482910',
          created_at: '2026-09-19T07:35:00.000Z'
        }
      ]
    }, null, 2)
  },
  {
    resource: 'inbox',
    method: 'DELETE',
    path: '/inbox',
    summary: 'Clear all virtual emails, SMS messages, and Cloudinary email attachments in session sandbox.',
    params: [],
    bodyExample: null,
    responseExample: JSON.stringify({
      success: true,
      message: 'Inbox cleared successfully.'
    }, null, 2)
  },
  // PAYMENTS & CHECKOUT
  {
    resource: 'payments',
    method: 'POST',
    path: '/payments/charge',
    summary: 'Direct charge helper that creates and confirms a Payment Intent with test card credentials.',
    params: [
      { name: 'amount', in: 'body', type: 'integer', description: 'Amount in smallest currency unit (e.g. cents).' },
      { name: 'cardNumber', in: 'body', type: 'string', description: 'Deterministic test credit card number.' },
      { name: 'expMonth', in: 'body', type: 'integer', description: 'Expiry month (1-12).' },
      { name: 'expYear', in: 'body', type: 'integer', description: 'Expiry year (e.g. 2028).' },
      { name: 'cvc', in: 'body', type: 'string', description: 'Card security code.' }
    ],
    bodyExample: JSON.stringify({
      amount: 2999,
      currency: 'usd',
      cardNumber: '4242424242424242',
      expMonth: 12,
      expYear: 2028,
      cvc: '123',
      receipt_email: 'buyer@example.com'
    }, null, 2),
    responseExample: JSON.stringify({
      id: 'pi_test_a1b2c3d4e5f6g7h8',
      object: 'payment_intent',
      amount: 2999,
      currency: 'usd',
      status: 'succeeded',
      receipt_email: 'buyer@example.com',
      created_at: '2026-09-19T10:55:00.000Z'
    }, null, 2)
  },
  {
    resource: 'payments',
    method: 'POST',
    path: '/payments/intents',
    summary: 'Create a new Payment Intent in requires_payment_method status.',
    params: [
      { name: 'amount', in: 'body', type: 'integer', description: 'Amount in cents.' },
      { name: 'currency', in: 'body', type: 'string', description: '3-letter currency code (usd, eur, gbp).' }
    ],
    bodyExample: JSON.stringify({
      amount: 5000,
      currency: 'usd',
      receipt_email: 'customer@example.com'
    }, null, 2),
    responseExample: JSON.stringify({
      id: 'pi_test_9988776655443322',
      object: 'payment_intent',
      amount: 5000,
      currency: 'usd',
      status: 'requires_payment_method',
      created_at: '2026-09-19T10:55:00.000Z'
    }, null, 2)
  },
  {
    resource: 'payments',
    method: 'POST',
    path: '/payments/refunds',
    summary: 'Issue a full or partial refund for a succeeded Payment Intent.',
    params: [
      { name: 'payment_intent', in: 'body', type: 'string', description: 'Payment Intent ID (pi_test_...).' },
      { name: 'amount', in: 'body', type: 'integer', description: 'Refund amount in cents (optional for full refund).' }
    ],
    bodyExample: JSON.stringify({
      payment_intent: 'pi_test_9988776655443322',
      amount: 2500,
      reason: 'requested_by_customer'
    }, null, 2),
    responseExample: JSON.stringify({
      id: 're_test_ref1234567890',
      object: 'refund',
      amount: 2500,
      currency: 'usd',
      payment_intent: 'pi_test_9988776655443322',
      status: 'succeeded',
      created_at: '2026-09-19T10:56:00.000Z'
    }, null, 2)
  },
  {
    resource: 'payments',
    method: 'POST',
    path: '/checkout/sessions',
    summary: 'Create a hosted checkout session with itemized line items.',
    params: [
      { name: 'customer_email', in: 'body', type: 'string', description: 'Customer email address.' },
      { name: 'line_items', in: 'body', type: 'array', description: 'List of products with amount and quantity.' }
    ],
    bodyExample: JSON.stringify({
      customer_email: 'customer@example.com',
      mode: 'payment',
      line_items: [
        {
          name: 'Pro Subscription',
          amount: 4900,
          quantity: 1,
          currency: 'usd'
        }
      ]
    }, null, 2),
    responseExample: JSON.stringify({
      id: 'cs_test_session_xyz789',
      object: 'checkout_session',
      amount_total: 4900,
      currency: 'usd',
      customer_email: 'customer@example.com',
      payment_status: 'unpaid',
      status: 'open',
      url: 'https://playground.nileslabs.com/checkout/pay/cs_test_session_xyz789',
      created_at: '2026-09-19T10:57:00.000Z'
    }, null, 2)
  },
  // UPLOADS & CLOUD STORAGE
  {
    resource: 'uploads',
    method: 'POST',
    path: '/uploads',
    summary: 'Upload a single multipart/form-data file (max 5 MB) to Cloud CDN.',
    params: [
      { name: 'file', in: 'formData', type: 'file', description: 'The binary file payload.' },
      { name: 'category', in: 'formData', type: 'string', description: 'Optional folder category (avatars, documents, attachments).' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      success: true,
      data: {
        id: 'up_d98f7e2a-1b4c-4e89-8b01-123456789abc',
        original_name: 'profile_picture.png',
        category: 'avatars',
        mime_type: 'image/png',
        size_bytes: 245760,
        size_formatted: '240.0 KB',
        url: 'https://res.cloudinary.com/boc5g8ph/image/upload/v1726744800/playground_api/uploads/avatars/ident_xyz/profile_picture.png',
        created_at: '2026-09-19T11:45:00.000Z'
      }
    }, null, 2)
  },
  {
    resource: 'uploads',
    method: 'POST',
    path: '/uploads/bulk',
    summary: 'Upload multiple files simultaneously (max 25 MB total) with itemized results.',
    params: [
      { name: 'files', in: 'formData', type: 'file[]', description: 'Multiple binary file attachments.' },
      { name: 'category', in: 'formData', type: 'string', description: 'Optional folder category.' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      success: true,
      summary: { total: 2, successful: 2, failed: 0 },
      results: [
        {
          original_name: 'contract.pdf',
          status: 'success',
          id: 'up_a1b2c3d4-e5f6-7890-abcd-112233445566',
          category: 'documents',
          mime_type: 'application/pdf',
          size_bytes: 1048576,
          size_formatted: '1.0 MB',
          url: 'https://res.cloudinary.com/boc5g8ph/image/upload/v1726744800/playground_api/uploads/documents/ident_xyz/contract.pdf',
          created_at: '2026-09-19T11:46:00.000Z'
        }
      ]
    }, null, 2)
  },
  {
    resource: 'uploads',
    method: 'GET',
    path: '/uploads',
    summary: 'List uploaded files in current sandbox identity.',
    params: [
      { name: 'category', in: 'query', type: 'string', description: 'Filter files by category.' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      success: true,
      data: [
        {
          id: 'up_d98f7e2a-1b4c-4e89-8b01-123456789abc',
          original_name: 'profile_picture.png',
          category: 'avatars',
          mime_type: 'image/png',
          size_bytes: 245760,
          size_formatted: '240.0 KB',
          url: 'https://res.cloudinary.com/boc5g8ph/image/upload/v1726744800/playground_api/uploads/avatars/ident_xyz/profile_picture.png',
          created_at: '2026-09-19T11:45:00.000Z'
        }
      ]
    }, null, 2)
  },
  {
    resource: 'uploads',
    method: 'DELETE',
    path: '/uploads/:id',
    summary: 'Delete an uploaded file from sandbox storage and Cloudinary CDN.',
    params: [
      { name: 'id', in: 'path', type: 'string', description: 'Upload ID to delete.' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      success: true,
      message: 'File successfully deleted.'
    }, null, 2)
  },
  // RBAC & AUTH ROLES
  {
    resource: 'auth',
    method: 'GET',
    path: '/auth/roles',
    summary: 'Retrieve all supported RBAC roles, test persona credentials, and default scopes.',
    params: [],
    bodyExample: null,
    responseExample: JSON.stringify({
      success: true,
      roles: ['admin', 'editor', 'viewer', 'guest'],
      personas: {
        admin: { description: 'Full access to all operations', testCredentials: { username: 'admin', password: 'Password@123' }, defaultScopes: ['*'] },
        editor: { description: 'Read, create, update; 403 on delete/reset', testCredentials: { username: 'editor', password: 'Password@123' }, defaultScopes: ['*:read', '*:write'] },
        viewer: { description: 'Read-only access; 403 on mutations', testCredentials: { username: 'viewer', password: 'Password@123' }, defaultScopes: ['*:read'] },
        guest: { description: 'Anonymous / public caller; 401 on protected', testCredentials: null, defaultScopes: ['public:read'] }
      }
    }, null, 2)
  },
  {
    resource: 'auth',
    method: 'GET',
    path: '/auth/permissions',
    summary: 'Retrieve the granular permission matrix, allowed HTTP actions per role, and wildcard scope definitions.',
    params: [],
    bodyExample: null,
    responseExample: JSON.stringify({
      success: true,
      matrix: {
        admin: { description: 'Full unconstrained access', allowedActions: ['read', 'create', 'update', 'delete', 'reset'], scopes: ['*'] },
        editor: { description: 'Content authoring and editing', allowedActions: ['read', 'create', 'update'], scopes: ['*:read', '*:write', 'posts:create', 'posts:update'] },
        viewer: { description: 'Strict read-only access', allowedActions: ['read'], scopes: ['*:read', 'posts:read', 'users:read'] },
        guest: { description: 'Public unauthenticated caller', allowedActions: ['read:public'], scopes: ['public:read'] }
      },
      wildcards: {
        globalAll: '*',
        globalRead: '*:read',
        globalWrite: '*:write',
        globalDelete: '*:delete',
        resourceAll: '<resource>:*',
        resourceRead: '<resource>:read',
        resourceWrite: '<resource>:write',
        resourceDelete: '<resource>:delete'
      }
    }, null, 2)
  },
  // ANALYTICS & TELEMETRY
  {
    resource: 'analytics',
    method: 'POST',
    path: '/analytics/track',
    summary: 'Ingest a single event beacon with user ID, properties, and traits.',
    params: [
      { name: 'event', in: 'body', type: 'string', description: 'Event name (e.g. page_view, button_clicked).' },
      { name: 'userId', in: 'body', type: 'string', description: 'User or distinct identifier.' },
      { name: 'properties', in: 'body', type: 'object', description: 'Custom event metadata properties.' }
    ],
    bodyExample: JSON.stringify({
      event: 'button_clicked',
      userId: 'usr_dev_101',
      properties: { page: '/pricing', plan: 'pro_annual' }
    }, null, 2),
    responseExample: JSON.stringify({
      success: true,
      message: 'Event recorded successfully in session telemetry stream.',
      event: {
        id: 'evt_a8f9c0e123456789',
        event: 'button_clicked',
        userId: 'usr_dev_101',
        properties: { page: '/pricing', plan: 'pro_annual' },
        timestamp: '2026-09-19T14:30:00.000Z'
      }
    }, null, 2)
  },
  {
    resource: 'analytics',
    method: 'POST',
    path: '/analytics/batch',
    summary: 'Ingest a batch of up to 50 event beacons atomically.',
    params: [
      { name: 'batch', in: 'body', type: 'array', description: 'Array of event beacon objects.' }
    ],
    bodyExample: JSON.stringify({
      batch: [
        { event: 'page_view', properties: { path: '/home' } },
        { event: 'button_click', properties: { btn: 'cta_hero' } }
      ]
    }, null, 2),
    responseExample: JSON.stringify({
      success: true,
      summary: { total: 2, processed: 2, failed: 0 },
      events: [
        { id: 'evt_1', event: 'page_view', properties: { path: '/home' } },
        { id: 'evt_2', event: 'button_click', properties: { btn: 'cta_hero' } }
      ]
    }, null, 2)
  },
  {
    resource: 'analytics',
    method: 'GET',
    path: '/analytics/events',
    summary: 'List recorded telemetry stream with optional filtering.',
    params: [
      { name: 'event', in: 'query', type: 'string', description: 'Filter events by exact or partial event name.' },
      { name: 'userId', in: 'query', type: 'string', description: 'Filter events by user ID.' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        {
          id: 'evt_a8f9c0e123456789',
          event: 'button_clicked',
          userId: 'usr_dev_101',
          properties: { page: '/pricing', plan: 'pro_annual' },
          timestamp: '2026-09-19T14:30:00.000Z'
        }
      ],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false }
    }, null, 2)
  },
  {
    resource: 'analytics',
    method: 'GET',
    path: '/analytics/summary',
    summary: 'Retrieve aggregate telemetry metrics and event breakdown.',
    params: [],
    bodyExample: null,
    responseExample: JSON.stringify({
      success: true,
      summary: {
        totalEvents: 42,
        uniqueEventTypes: 6,
        uniqueUsers: 14,
        eventCounts: { page_view: 24, button_click: 12, checkout_completed: 6 },
        topEvents: [
          { event: 'page_view', count: 24, percentage: 57 },
          { event: 'button_click', count: 12, percentage: 29 }
        ]
      }
    }, null, 2)
  },
  {
    resource: 'analytics',
    method: 'DELETE',
    path: '/analytics/events',
    summary: 'Clear all recorded analytics events for this session sandbox.',
    params: [],
    bodyExample: null,
    responseExample: JSON.stringify({
      success: true,
      message: 'Analytics event stream cleared successfully.',
      purgedCount: 42
    }, null, 2)
  }
];


