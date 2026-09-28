'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Key,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { Button, Card, StatusBadge, Badge, Modal, CopyButton } from '@tech-inject/ui';
import { AdminApi } from '@/lib/api';

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // New generated key modal state (only shown once!)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const loadCustomer = async () => {
    setIsLoading(true);
    const res = await AdminApi.getCustomer(id);
    if (res.success && res.data) {
      setCustomer(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) loadCustomer();
  }, [id]);

  const handleGrantPremium = async () => {
    setActionLoading(true);
    const res = await AdminApi.grantPremium(id);
    setActionLoading(false);

    if (res.success && res.data?.licenseKey) {
      setGeneratedKey(res.data.licenseKey);
      setShowKeyModal(true);
      loadCustomer();
    } else {
      alert(res.error || 'Failed to grant premium access');
    }
  };

  const handleRevokePremium = async () => {
    if (!confirm('Are you sure you want to revoke premium access? All active licenses will be invalidated.')) {
      return;
    }

    setActionLoading(true);
    const res = await AdminApi.revokePremium(id);
    setActionLoading(false);

    if (res.success) {
      loadCustomer();
    } else {
      alert(res.error || 'Failed to revoke premium access');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-slate-400">Customer account not found.</p>
        <a href="/customers" className="text-xs text-indigo-400 hover:underline mt-2 inline-block">
          Back to customers
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <a
          href="/customers"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Customers</span>
        </a>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{customer.email}</h1>
            <p className="text-xs font-mono text-slate-500 mt-0.5">Customer ID: {customer.id}</p>
          </div>

          <div className="flex items-center gap-3">
            {customer.premiumAccess ? (
              <Button
                variant="danger"
                size="sm"
                isLoading={actionLoading}
                leftIcon={<ShieldAlert className="w-4 h-4" />}
                onClick={handleRevokePremium}
              >
                Revoke Premium Access
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                isLoading={actionLoading}
                leftIcon={<Key className="w-4 h-4" />}
                onClick={handleGrantPremium}
              >
                Grant Premium Access
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Customer Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 block mb-1">Account Role</span>
          <StatusBadge status={customer.role} />
        </Card>

        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 block mb-1">Premium Tier Status</span>
          <span
            className={`text-sm font-semibold ${
              customer.premiumAccess ? 'text-amber-300' : 'text-slate-400'
            }`}
          >
            {customer.premiumAccess ? 'Active Premium' : 'Free Customer'}
          </span>
        </Card>

        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 block mb-1">Account Created</span>
          <span className="text-xs text-slate-300 font-mono">
            {new Date(customer.createdAt).toLocaleDateString()}
          </span>
        </Card>
      </div>

      {/* Licenses Audit Log */}
      <Card className="p-6 border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">License Records & History</h3>
            <p className="text-xs text-slate-400">
              Only hashed representations are stored in PostgreSQL. Raw keys are never stored.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 border-b border-slate-800 font-mono text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">License ID</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Issued Date</th>
                <th className="px-4 py-3 font-semibold">Revocation / Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {customer.licenses && customer.licenses.length > 0 ? (
                customer.licenses.map((lic: any) => (
                  <tr key={lic.id} className="hover:bg-slate-900/40">
                    <td className="px-4 py-3 font-mono text-slate-400">{lic.id}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lic.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(lic.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {lic.revokedAt ? (
                        <span className="text-rose-400">
                          Revoked {new Date(lic.revokedAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span>No expiration</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    No licenses have been issued to this customer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ONE-TIME RAW LICENSE KEY MODAL */}
      <Modal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        title="Premium License Key Generated"
        description="This raw key is cryptographically hashed with SHA-256 before storage and will only be shown once."
        footer={
          <Button variant="primary" onClick={() => setShowKeyModal(false)}>
            I Have Saved This Key
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <span>
              <strong>Crucial Security Notice:</strong> Provide this key to the customer. Once this dialog is closed, the raw key cannot be retrieved again from the server.
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-950 border border-indigo-500/30 p-3.5 rounded-xl font-mono text-sm text-indigo-300">
            <span>{generatedKey}</span>
            {generatedKey && <CopyButton textToCopy={generatedKey} label="Copy Key" />}
          </div>
        </div>
      </Modal>
    </div>
  );
}
