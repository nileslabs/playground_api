'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/docs/CodeBlock';

export default function ThreeDSAuthenticationPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState<'prompt' | 'processing' | 'approved' | 'rejected'>('prompt');
  const [otpCode, setOtpCode] = useState('123456');
  const [intentId, setIntentId] = useState('pi_test_3ds_98234ab1c');

  const startSimulation = () => {
    setModalStage('prompt');
    setModalOpen(true);
  };

  const handleApprove = () => {
    setModalStage('processing');
    setTimeout(() => {
      setModalStage('approved');
    }, 1200);
  };

  const handleReject = () => {
    setModalStage('processing');
    setTimeout(() => {
      setModalStage('rejected');
    }, 1200);
  };

  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Page Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold uppercase tracking-wider border border-amber-200">
          <Icon icon="ph:shield-warning-bold" className="w-3.5 h-3.5" />
          <span>Mock Commerce & Billing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          3D Secure (3DS 2.0 / SCA) Challenge
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
          Simulate Strong Customer Authentication (SCA) as mandated by European PSD2 regulations. Test how your application
          intercepts <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-amber-700">requires_action</code>,
          mounts the issuer Access Control Server (ACS) modal or iframe, and finalizes authorization.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={startSimulation}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-xs cursor-pointer"
          >
            <Icon icon="ph:play-bold" className="w-4 h-4" />
            Launch Visual 3DS Challenge
          </button>
          <a
            href="#card-rules"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:cards-bold" className="w-4 h-4" />
            3DS Test Cards
          </a>
          <a
            href="#interactive-consoles"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:terminal-window-bold" className="w-4 h-4" />
            API Consoles
          </a>
        </div>
      </div>

      {/* 2. Interactive Visual 3DS Modal Simulation Sandbox */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Live 3DS Challenge Sandbox</h2>
            <p className="text-xs text-slate-500">
              Trigger a realistic simulated ACS popup to test user approval and cancellation events.
            </p>
          </div>
          <button
            type="button"
            onClick={startSimulation}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Icon icon="ph:shield-check-bold" className="w-4 h-4 text-emerald-400" />
            Open 3DS Bank Dialog
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Challenge Card</span>
            <div className="font-mono font-bold text-slate-900 text-sm">4000 0000 0000 0341</div>
            <p className="text-slate-500 text-[11px]">Triggers mandatory SCA OTP prompt.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Frictionless Card</span>
            <div className="font-mono font-bold text-slate-900 text-sm">4000 0000 0000 0317</div>
            <p className="text-slate-500 text-[11px]">Bypasses challenge; auto-authenticated.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Post-Challenge URL</span>
            <div className="font-mono text-slate-800 text-[11px] truncate">POST /payments/intents/:id/confirm-3ds</div>
            <p className="text-slate-500 text-[11px]">Finalizes intent state to succeeded.</p>
          </div>
        </div>
      </div>

      {/* 3. Modal Overlay for 3DS Simulation */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="logos:visa" className="w-7 h-7" />
                <span className="text-xs font-semibold text-slate-300">Verified by Visa (Simulated)</span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <Icon icon="ph:x-bold" className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {modalStage === 'prompt' && (
                <>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">Purchase Authentication</h3>
                    <p className="text-xs text-slate-500">
                      We sent a one-time passcode to your registered mobile number ending in <span className="font-semibold text-slate-700">•••• 8821</span>.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Merchant:</span>
                      <span className="font-semibold text-slate-900">Playground Store Inc.</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Amount:</span>
                      <span className="font-semibold text-slate-900">$50.00 USD</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Card Number:</span>
                      <span className="font-mono text-slate-900">•••• 0341</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Enter One-Time Passcode</label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="6-digit code"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <p className="text-[11px] text-slate-400 text-center">
                      (Test simulator: any 6-digit code or default works)
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      Authenticate (Approve)
                    </button>
                    <button
                      type="button"
                      onClick={handleReject}
                      className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Reject / Cancel
                    </button>
                  </div>
                </>
              )}

              {modalStage === 'processing' && (
                <div className="py-12 text-center space-y-3">
                  <Icon icon="ph:spinner-bold" className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">Contacting issuing bank network...</p>
                </div>
              )}

              {modalStage === 'approved' && (
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Icon icon="ph:check-bold" className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">3DS Authentication Successful!</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Payment Intent transitioned to <code className="font-mono text-emerald-700 font-bold">succeeded</code>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              )}

              {modalStage === 'rejected' && (
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <Icon icon="ph:x-bold" className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Challenge Failed or Canceled</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Intent transitioned back to <code className="font-mono text-rose-700 font-bold">requires_payment_method</code> with error code <code className="font-mono text-rose-700">3ds_failed</code>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. API Interactive Consoles */}
      <div id="interactive-consoles" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Interactive API Execution
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Test the two-step 3DS API endpoints against your sandbox session.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Step 1: Direct Charge with 3DS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              1. Trigger 3DS Challenge Charge
            </h3>
            <InteractiveConsole
              method="POST"
              path="/payments/charge"
              title="Trigger 3DS Challenge"
              initialBody={JSON.stringify(
                {
                  amount: 5000,
                  currency: 'usd',
                  card_number: '4000000000000341',
                  exp_month: 12,
                  exp_year: 2028,
                  cvc: '123',
                  description: 'Subscription requiring SCA check',
                },
                null,
                2
              )}
            />
          </div>

          {/* Step 2: Confirm 3DS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              2. Confirm Challenge Result
            </h3>
            <InteractiveConsole
              method="POST"
              path={`/payments/intents/${intentId}/confirm-3ds`}
              title="Confirm 3DS Challenge"
              initialBody={JSON.stringify(
                {
                  challenge_response: 'success',
                },
                null,
                2
              )}
            />
          </div>
        </div>
      </div>

      {/* 5. Frictionless vs Challenge Flow */}
      <div id="card-rules" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            3DS 2.0 Architectural Flow: Challenge vs Frictionless
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Modern 3DS 2.0 uses risk-based authentication to minimize checkout friction while shifting fraud liability to the card issuer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-600">
              <Icon icon="ph:shield-warning-bold" className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Challenge Flow (<code className="font-mono text-xs">...0341</code>)</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When the bank deems the transaction higher risk (or required by PSD2 SCA), the intent transitions to <code className="font-mono text-amber-600">requires_action</code>. The frontend must display an OTP entry or biometric prompt to the cardholder before charging the card.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-600">
              <Icon icon="ph:shield-check-bold" className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Frictionless Flow (<code className="font-mono text-xs">...0317</code>)</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Device telemetry, IP reputation, and behavioral analytics allow the issuer to verify identity passively in the background without prompting the customer. The payment transitions directly to <code className="font-mono text-emerald-600">succeeded</code> with full liability shift.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Production Integration Recipes */}
      <div id="recipes" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Integration Handling Recipes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Handling 3DS actions with Stripe.js and vanilla JavaScript.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:javascript" className="w-4 h-4" />
              Handling <code className="font-mono text-xs text-amber-700">requires_action</code> in Frontend
            </h3>
            <CodeBlock
              language="javascript"
              code={`// Process intent response from backend
async function handlePaymentResponse(intent) {
  if (intent.status === 'requires_action') {
    // 1. Bank requires 3DS SCA
    const challengeUrl = intent.next_action?.redirect_to_url?.url;
    
    // 2. Open popup modal or redirect
    const popup = window.open(challengeUrl, '3ds-challenge', 'width=480,height=600');
    
    // 3. Listen for postMessage or poll intent
    window.addEventListener('message', async (event) => {
      if (event.data === '3ds_complete') {
        popup.close();
        // Check final status
        const refreshed = await fetch(\`/api/payments/intents/\${intent.id}\`);
        const finalData = await refreshed.json();
        if (finalData.status === 'succeeded') {
          showSuccessScreen();
        }
      }
    });
  } else if (intent.status === 'succeeded') {
    showSuccessScreen();
  }
}`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:react" className="w-4 h-4" />
              Stripe.js SDK Equivalent
            </h3>
            <CodeBlock
              language="typescript"
              code={`import { useStripe } from '@stripe/react-stripe-js';

export function CheckoutButton({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();

  const handleConfirm = async () => {
    if (!stripe) return;

    // stripe.js automatically detects requires_action
    // and launches the bank challenge modal in an iframe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret);

    if (error) {
      console.error('3DS or Card Error:', error.message);
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Payment authenticated and captured!');
    }
  };

  return <button onClick={handleConfirm}>Pay Now</button>;
}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
