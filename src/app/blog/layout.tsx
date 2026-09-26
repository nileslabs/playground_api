import React from 'react';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Dedicated Editorial Magazine Container — zero doc sidebar, zero doc pagination */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
