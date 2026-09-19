'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

interface RequestLog {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  durationMs: number;
  isGranted: boolean;
  role: string;
  scopes: string[];
  response: Record<string, unknown> | null;
  mode: 'header' | 'query' | 'jwt';
}

const AVAILABLE_SCOPES = [
  'posts:read',
  'posts:write',
  'posts:delete',
  'users:read',
  'users:write',
  'users:delete',
  'comments:write',
  'todos:write',
  'analytics:read',
  '*',
];

const PRECONFIGURED_ROLES = [
  {
    id: 'admin',
    name: 'Admin',
    icon: 'ph:shield-chevron-fill',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Full unconstrained access to read, create, update, delete, and reset sandboxes.',
    defaultScopes: ['*'],
  },
  {
    id: 'editor',
    name: 'Editor',
    icon: 'ph:pencil-simple-line-bold',
    color: 'blue',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    description: 'Can read, create, and modify content. Destructive deletes and admin resets return 403.',
    defaultScopes: ['*:read', '*:write', 'posts:create', 'posts:update', 'comments:write', 'todos:write'],
  },
  {
    id: 'viewer',
    name: 'Viewer',
    icon: 'ph:eye-bold',
    color: 'amber',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Read-only access. Any attempt to POST, PUT, PATCH, or DELETE returns 403 Forbidden.',
    defaultScopes: ['*:read', 'posts:read', 'users:read', 'comments:read', 'todos:read'],
  },
  {
    id: 'guest',
    name: 'Guest',
    icon: 'ph:user-minus-bold',
    color: 'rose',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    description: 'Anonymous or unauthenticated. Protected endpoints return 401 Unauthorized.',
    defaultScopes: ['public:read'],
  },
];

const TEST_ACTIONS = [
  {
    method: 'GET',
    endpoint: '/posts',
    label: 'GET /posts (Read Feed)',
    required: 'viewer, editor, or admin (posts:read)',
    body: null,
  },
  {
    method: 'POST',
    endpoint: '/posts',
    label: 'POST /posts (Publish Post)',
    required: 'editor or admin (posts:write)',
    body: { title: 'RBAC Simulated Post', body: 'Testing role capabilities from Live Studio' },
  },
  {
    method: 'PATCH',
    endpoint: '/posts/1',
    label: 'PATCH /posts/1 (Edit Post)',
    required: 'editor or admin (posts:write)',
    body: { title: 'Updated Title by Studio' },
  },
  {
    method: 'DELETE',
    endpoint: '/posts/1',
    label: 'DELETE /posts/1 (Delete Record)',
    required: 'admin only (posts:delete or admin role)',
    body: null,
  },
  {
    method: 'DELETE',
    endpoint: '/session/reset',
    label: 'DELETE /session/reset (Admin Reset)',
    required: 'admin only',
    body: null,
  },
  {
    method: 'GET',
    endpoint: '/auth/me',
    label: 'GET /auth/me (Protected Profile)',
    required: 'authenticated persona (401 for guest)',
    body: null,
  },
];

export function LiveRbacStudio() {
  const [selectedRole, setSelectedRole] = useState<string>('editor');
  const [simulationMode, setSimulationMode] = useState<'header' | 'query' | 'jwt'>('header');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['*:read', '*:write']);
  const [customRoleInput, setCustomRoleInput] = useState<string>('');
  const [selectedActionIndex, setSelectedActionIndex] = useState<number>(3); // Default to DELETE to show 403
  const [jwtToken, setJwtToken] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  const activeAction = TEST_ACTIONS[selectedActionIndex];

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    const roleDef = PRECONFIGURED_ROLES.find((r) => r.id === roleId);
    if (roleDef) {
      setSelectedScopes(roleDef.defaultScopes);
    }
  };

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const loginAsPersona = async (role: string) => {
    setIsLoggingIn(true);
    try {
      const res = await fetch(`${config.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: role === 'admin' ? 'admin' : role === 'editor' ? 'editor' : 'viewer',
          password: `${role}123`,
          role: role,
        }),
      });
      const data = await res.json();
      if (data.access_token) {
        setJwtToken(data.access_token);
        setSelectedRole(role);
        setSimulationMode('jwt');
      }
    } catch (e) {
      console.error('Login persona error:', e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const executeAction = async () => {
    setIsExecuting(true);
    const start = performance.now();
    const effectiveRole = selectedRole === 'custom' ? (customRoleInput.trim() || 'guest') : selectedRole;
    
    let url = `${config.apiUrl}${activeAction.endpoint}`;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'X-Enforce-RBAC': 'true',
    };

    if (activeAction.body) {
      headers['Content-Type'] = 'application/json';
    }

    if (simulationMode === 'header') {
      headers['X-Simulate-Role'] = effectiveRole;
      if (selectedScopes.length > 0) {
        headers['X-Simulate-Scopes'] = selectedScopes.join(',');
      }
    } else if (simulationMode === 'query') {
      const sep = url.includes('?') ? '&' : '?';
      url += `${sep}_role=${encodeURIComponent(effectiveRole)}`;
      if (selectedScopes.length > 0) {
        url += `&_scopes=${encodeURIComponent(selectedScopes.join(','))}`;
      }
    } else if (simulationMode === 'jwt') {
      if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
      } else if (effectiveRole !== 'guest') {
        headers['X-Simulate-Role'] = effectiveRole;
      }
    }

    const localToken = typeof window !== 'undefined' ? localStorage.getItem('pg_identity') : '';
    if (localToken) {
      headers['X-Playground-Identity'] = localToken;
    }

    try {
      const res = await fetch(url, {
        method: activeAction.method,
        headers,
        body: activeAction.body ? JSON.stringify(activeAction.body) : undefined,
        credentials: 'include',
      });

      const durationMs = Math.round(performance.now() - start);
      let responseData: any = null;
      try {
        responseData = await res.json();
      } catch {
        responseData = { message: 'Non-JSON response' };
      }

      const isGranted = res.status >= 200 && res.status < 300;
      const logItem: RequestLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        method: activeAction.method,
        endpoint: activeAction.endpoint,
        status: res.status,
        durationMs,
        isGranted,
        role: effectiveRole,
        scopes: selectedScopes,
        response: responseData,
        mode: simulationMode,
      };

      setLogs((prev) => [logItem, ...prev.slice(0, 15)]);
      setExpandedLogId(logItem.id);
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - start);
      const logItem: RequestLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        method: activeAction.method,
        endpoint: activeAction.endpoint,
        status: 0,
        durationMs,
        isGranted: false,
        role: effectiveRole,
        scopes: selectedScopes,
        response: { error: err.message || 'Network request failed' },
        mode: simulationMode,
      };
      setLogs((prev) => [logItem, ...prev.slice(0, 15)]);
    } finally {
      setIsExecuting(false);
    }
  };

  const copyCurl = () => {
    const effectiveRole = selectedRole === 'custom' ? (customRoleInput.trim() || 'viewer') : selectedRole;
    let curl = `curl -X ${activeAction.method} "${config.apiUrl}${activeAction.endpoint}" \\\n`;
    curl += `  -H "X-Simulate-Role: ${effectiveRole}" \\\n`;
    if (selectedScopes.length > 0) {
      curl += `  -H "X-Simulate-Scopes: ${selectedScopes.join(',')}" \\\n`;
    }
    curl += `  -H "X-Enforce-RBAC: true"`;
    if (activeAction.body) {
      curl += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(activeAction.body)}'`;
    }

    navigator.clipboard.writeText(curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="not-prose my-8 rounded-2xl border border-border/80 bg-linear-to-b from-card/90 to-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
            <Icon icon="ph:shield-check-bold" className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">Interactive RBAC & Scope Permissions Studio</h3>
              <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-400 border border-purple-500/20">
                403 Simulator
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Simulate role hierarchies, custom OAuth scopes, and test 403 Forbidden enforcement in real-time.
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-background/60 p-1 text-xs">
          <button
            onClick={() => setSimulationMode('header')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
              simulationMode === 'header'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon icon="ph:brackets-curly-bold" className="h-3.5 w-3.5" />
            Headers
          </button>
          <button
            onClick={() => setSimulationMode('query')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
              simulationMode === 'query'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon icon="ph:question-bold" className="h-3.5 w-3.5" />
            Query Params
          </button>
          <button
            onClick={() => setSimulationMode('jwt')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
              simulationMode === 'jwt'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon icon="ph:key-bold" className="h-3.5 w-3.5" />
            JWT Bearer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-7 p-6 space-y-6">
          {/* Persona / Role Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
              1. Select Active Persona / Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRECONFIGURED_ROLES.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleChange(role.id)}
                    className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all relative ${
                      isSelected
                        ? 'border-purple-500/80 bg-purple-500/10 shadow-sm shadow-purple-500/10'
                        : 'border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon
                        icon={role.icon}
                        className={`h-4 w-4 ${isSelected ? 'text-purple-400' : 'text-muted-foreground'}`}
                      />
                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-400 ring-2 ring-purple-400/30" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-foreground">{role.name}</span>
                    <span className="text-[10px] text-muted-foreground line-clamp-2 leading-snug">
                      {role.id === 'admin'
                        ? 'Full control'
                        : role.id === 'editor'
                        ? 'Read & write'
                        : role.id === 'viewer'
                        ? 'Read-only'
                        : 'No auth'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Persona Token Generator (JWT Mode) */}
          {simulationMode === 'jwt' && (
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-300">Quick Test Persona Login (Bearer Token)</span>
                {jwtToken && (
                  <button
                    onClick={() => setJwtToken('')}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    Clear Token
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => loginAsPersona('admin')}
                  disabled={isLoggingIn}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <Icon icon="ph:shield-chevron-bold" className="h-3.5 w-3.5" />
                  Login as Admin
                </button>
                <button
                  onClick={() => loginAsPersona('editor')}
                  disabled={isLoggingIn}
                  className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  <Icon icon="ph:pencil-simple-bold" className="h-3.5 w-3.5" />
                  Login as Editor
                </button>
                <button
                  onClick={() => loginAsPersona('viewer')}
                  disabled={isLoggingIn}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
                >
                  <Icon icon="ph:eye-bold" className="h-3.5 w-3.5" />
                  Login as Viewer
                </button>
              </div>
              {jwtToken ? (
                <div className="text-[11px] font-mono text-muted-foreground truncate bg-background/60 p-2 rounded border border-border/40">
                  <span className="text-emerald-400">Bearer </span>
                  {jwtToken}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Click a persona to obtain a live signed JWT token with that role embedded.
                </p>
              )}
            </div>
          )}

          {/* Granular Scope Badges */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                2. Active OAuth Scopes
              </label>
              <button
                onClick={() => setSelectedScopes(AVAILABLE_SCOPES)}
                className="text-[11px] text-purple-400 hover:underline"
              >
                Select All
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_SCOPES.map((scope) => {
                const isActive = selectedScopes.includes(scope);
                return (
                  <button
                    key={scope}
                    onClick={() => toggleScope(scope)}
                    className={`rounded-md px-2.5 py-1 text-xs font-mono transition-all border ${
                      isActive
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-xs'
                        : 'bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    {isActive ? '✓ ' : '+ '}
                    {scope}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Action Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
              3. Test API Action
            </label>
            <div className="space-y-2">
              {TEST_ACTIONS.map((action, idx) => {
                const isSelected = selectedActionIndex === idx;
                const isDelete = action.method === 'DELETE';
                const isPost = action.method === 'POST';
                const isPatch = action.method === 'PATCH';

                const methodBadgeColor = isDelete
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : isPost
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : isPatch
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20';

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedActionIndex(idx)}
                    className={`w-full flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-purple-500/80 bg-purple-500/10 shadow-sm'
                        : 'border-border/60 bg-muted/20 hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold font-mono border ${methodBadgeColor}`}>
                        {action.method}
                      </span>
                      <span className="text-xs font-mono font-medium text-foreground">{action.endpoint}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">
                      Req: <span className="font-mono text-purple-300">{action.required}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={executeAction}
              disabled={isExecuting}
              className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs py-3 px-4 shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isExecuting ? (
                <Icon icon="ph:spinner-bold" className="h-4 w-4 animate-spin" />
              ) : (
                <Icon icon="ph:play-fill" className="h-4 w-4" />
              )}
              {isExecuting ? 'Evaluating RBAC...' : `Dispatch ${activeAction.method} Request`}
            </button>
            <button
              onClick={copyCurl}
              className="rounded-xl border border-border/80 bg-background/60 hover:bg-muted text-foreground text-xs font-medium py-3 px-4 flex items-center gap-1.5 transition-all"
            >
              <Icon icon={copiedCurl ? 'ph:check-bold' : 'ph:copy-bold'} className="h-4 w-4" />
              {copiedCurl ? 'Copied!' : 'Copy cURL'}
            </button>
          </div>
        </div>

        {/* Right Column: Live Inspector & Response Stream */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-muted/10 space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Icon icon="ph:terminal-window-bold" className="h-4 w-4 text-purple-400" />
                Response Inspector
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {logs.length} events logged
              </span>
            </div>

            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <Icon icon="ph:shield-warning-bold" className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground">No Requests Dispatched Yet</p>
                  <p className="text-[11px] text-muted-foreground max-w-xs">
                    Choose a role and action on the left, then click &quot;Dispatch Request&quot; to test 403 Forbidden vs 200 OK.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-120 overflow-y-auto pr-1">
                {logs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  const isForbidden = log.status === 403;
                  const isSuccess = log.status >= 200 && log.status < 300;
                  const isUnauthorized = log.status === 401;

                  return (
                    <div
                      key={log.id}
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isForbidden
                          ? 'border-rose-500/40 bg-rose-500/5'
                          : isUnauthorized
                          ? 'border-amber-500/40 bg-amber-500/5'
                          : 'border-emerald-500/40 bg-emerald-500/5'
                      }`}
                    >
                      {/* Log Header */}
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="w-full flex items-center justify-between p-3 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold border ${
                              isForbidden
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                : isUnauthorized
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}
                          >
                            {log.status} {isForbidden ? 'FORBIDDEN' : isUnauthorized ? 'UNAUTHORIZED' : 'OK'}
                          </span>
                          <span className="text-xs font-mono text-foreground font-semibold">
                            {log.method} {log.endpoint}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {log.durationMs}ms
                          </span>
                          <Icon
                            icon={isExpanded ? 'ph:caret-up-bold' : 'ph:caret-down-bold'}
                            className="h-3 w-3 text-muted-foreground"
                          />
                        </div>
                      </button>

                      {/* Log Payload Details */}
                      {isExpanded && (
                        <div className="border-t border-border/40 p-3 bg-background/80 space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground">Role evaluated:</span>
                            <span className="font-mono font-semibold text-purple-300 capitalize">{log.role}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            <span>Scopes: </span>
                            <span className="font-mono text-foreground">{log.scopes.join(', ') || 'none'}</span>
                          </div>
                          <div className="pt-2">
                            <span className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                              Response Body:
                            </span>
                            <pre className="text-[11px] font-mono p-2.5 rounded-lg bg-black/40 text-emerald-300 border border-border/40 overflow-x-auto">
                              {JSON.stringify(log.response, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Info Box */}
          <div className="rounded-xl border border-border/60 bg-background/40 p-3 flex items-start gap-2.5">
            <Icon icon="ph:info-bold" className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              When <code className="text-purple-300 font-mono">X-Simulate-Role: viewer</code> or custom scopes are sent, any mutating actions (POST/PATCH/DELETE) automatically produce realistic 403 Forbidden envelopes to test your app&apos;s UI error toasts and route guards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
