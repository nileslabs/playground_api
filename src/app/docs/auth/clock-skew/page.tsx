'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface SkewPreset {
  id: string;
  label: string;
  skewValue: string;
  driftType: 'future' | 'past' | 'sync';
  desc: string;
}

const PRESETS: SkewPreset[] = [
  {
    id: 'future-120',
    label: '+120s Future Drift (2 Minutes Ahead)',
    skewValue: '+120',
    driftType: 'future',
    desc: 'Simulates client system clock running 2 minutes ahead. Tests Not-Before (nbf) leeway rejection.',
  },
  {
    id: 'past-60',
    label: '-60s Past Drift (1 Minute Behind)',
    skewValue: '-60',
    driftType: 'past',
    desc: 'Simulates client system clock lagging behind. Tests premature expiration on short-lived access tokens.',
  },
  {
    id: 'future-30',
    label: '+30s Tolerance Window',
    skewValue: '+30',
    driftType: 'future',
    desc: 'Simulates minor network transmission drift within standard 60-second verification leeway.',
  },
  {
    id: 'strict-zero',
    label: '0s Exact Clock Sync',
    skewValue: '0',
    driftType: 'sync',
    desc: 'Standard zero-offset token issuance without artificial drift simulation.',
  },
];

export default function ClockSkewPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activePreset, setActivePreset] = useState<SkewPreset>(PRESETS[0]);
  const [activeRecipe, setActiveRecipe] = useState<'node' | 'jose' | 'python'>('node');

  const nodeRecipe = `// Node.js jsonwebtoken with Clock Tolerance Leeway
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_salt_here';

export function verifyTokenWithLeeway(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      // Absorb clock discrepancies up to 60 seconds (prevents nbf and premature exp errors)
      clockTolerance: 60, // 60 seconds leeway
    });
    return decoded;
  } catch (err: any) {
    if (err.name === 'NotBeforeError') {
      console.error('Clock skew detected: Token used before issuance timestamp (nbf)');
    } else if (err.name === 'TokenExpiredError') {
      console.error('Token expired:', err.expiredAt);
    }
    throw err;
  }
}`;

  const joseRecipe = `// Universal / Edge Runtime (jose library)
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

export async function verifyWithJose(jwtString: string) {
  const { payload, protectedHeader } = await jwtVerify(jwtString, secret, {
    // Configure clock leeway (e.g. 60 seconds tolerance)
    clockTolerance: '60s',
  });

  return payload;
}`;

  const pythonRecipe = `# Python PyJWT Leeway Verification
import jwt
from datetime import timedelta

def verify_token(token_string, secret_key):
    try:
        payload = jwt.decode(
            token_string,
            secret_key,
            algorithms=["HS256"],
            # Absorb up to 60 seconds of client/server clock discrepancy
            leeway=timedelta(seconds=60)
        )
        return payload
    except jwt.ImmatureSignatureError:
        print("Clock skew: Signature active in the future")
    except jwt.ExpiredSignatureError:
        print("Token has expired")`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:clock-countdown-bold" className="w-3.5 h-3.5" />
          <span>Auth &amp; Security</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Clock Skew Drift &amp; Leeway Tolerances
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Simulate device time desynchronization across distributed client devices and backend cloud clusters. Inject positive or negative clock drift using the <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">X-Simulate-Clock-Skew</code> header to test token leeway configurations.
        </p>
      </div>

      {/* 2. Interactive Drift Runner */}
      <div id="skew-runner" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Clock Drift Simulator
          </h2>
          <p className="text-sm text-slate-600">
            Select a drift offset below to inject time distortion into the token issuance engine:
          </p>
        </div>

        {/* Preset Drift Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setActivePreset(preset)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                activePreset.id === preset.id
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {preset.label}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      preset.driftType === 'future'
                        ? 'bg-amber-100 text-amber-800'
                        : preset.driftType === 'past'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {preset.skewValue}s
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {preset.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Live Interactive Console */}
        <InteractiveConsole
          key={activePreset.id}
          method="POST"
          path="/auth/login"
          title={`Simulate Clock Skew: ${activePreset.skewValue}s`}
          initialHeaders={{
            'X-Simulate-Clock-Skew': activePreset.skewValue,
          }}
          initialBody={JSON.stringify(
            {
              username: 'admin',
              password: 'Password@123',
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Common Failure Modes & Leeway Solutions */}
      <div id="failure-modes" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Why Test Clock Drift?
          </h2>
          <p className="text-sm text-slate-600">
            Real-world failure modes caused by NTP drift on mobile devices and distributed edge nodes:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Not-Before (nbf) Rejection</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              If client time lags behind the server, tokens generated by the server appear to be issued in the future, triggering premature token rejection errors.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">False-Positive Expirations</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              If a client device clock is ahead by just 30 seconds, a 1-minute access token will prematurely appear expired to the client before the server rejects it.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Leeway Tolerance Cushion</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Configuring a 60-second clock tolerance window in token verification libraries cleanly absorbs clock skew without weakening overall token security.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Multi-Language Leeway Recipes */}
      <div id="client-recipes" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Leeway Configuration Recipes
          </h2>
          <p className="text-sm text-slate-600">
            How to configure clock tolerance across modern JWT verification libraries:
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'node', label: 'Node.js (jsonwebtoken)', icon: 'ph:code-bold' },
              { id: 'jose', label: 'Edge / Web Crypto (jose)', icon: 'ph:lightning-bold' },
              { id: 'python', label: 'Python (PyJWT)', icon: 'ph:terminal-bold' },
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
              activeRecipe === 'node'
                ? nodeRecipe
                : activeRecipe === 'jose'
                ? joseRecipe
                : pythonRecipe
            }
            language={activeRecipe === 'python' ? 'python' : 'typescript'}
            title={`jwtVerifyWithLeeway.${activeRecipe === 'python' ? 'py' : 'ts'}`}
            copyable
          />
        </div>
      </div>
    </div>
  );
}
