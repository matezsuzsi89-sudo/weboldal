'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type Client = {
  id: string;
  clientType: 'maganszemely' | 'ceges';
  name: string;
  lastName: string;
  firstName: string;
  address: string;
  postalCode?: string;
  settlement?: string;
  streetAddress?: string;
  phone: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
  updatedAt?: string;
  taxNumber?: string;
  contactLastName?: string;
  contactFirstName?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  billingSameAsAddress?: boolean;
  billingName?: string;
  billingAddress?: string;
  billingTaxNumber?: string;
};

type Process = {
  id: string;
  clientId: string;
  text: string;
  status: 'open' | 'kész' | 'sikertelen';
  createdAt: string;
  closedAt?: string;
  responsibleUserId?: string;
};

type Project = {
  id: string;
  clientId: string;
  name: string;
  status: 'folyamatban' | 'lezárt';
  createdAt: string;
  updatedAt?: string;
};

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

type AuthUser = { id?: string; role: string; name: string; email?: string };

function useAdminAuth() {
  const [secret, setSecret] = useState('');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    const tok = sessionStorage.getItem('admin_secret');
    const usr = sessionStorage.getItem('admin_user');
    if (tok) setSecret(tok);
    if (usr) try { setAuthUser(JSON.parse(usr)); } catch { setAuthUser({ role: 'admin', name: 'Admin' }); }
    else if (tok) setAuthUser({ role: 'admin', name: 'Admin' });
  }, []);
  const login = (token: string, user: AuthUser) => {
    setSecret(token);
    setAuthUser(user);
    sessionStorage.setItem('admin_secret', token);
    sessionStorage.setItem('admin_user', JSON.stringify(user));
  };
  const logout = () => {
    setSecret('');
    setAuthUser(null);
    sessionStorage.removeItem('admin_secret');
    sessionStorage.removeItem('admin_user');
  };
  const isAdmin = !!authUser && (authUser.role === 'admin' || !authUser.role);
  const displayName = authUser?.name || 'Admin';
  const authUserId = authUser?.id ?? null;
  return { secret, isAuthenticated: !!secret, isAdmin, displayName, authUserId, login, logout };
}

function apiFetch(secret: string, url: string, options?: RequestInit) {
  return fetch(`${url}${url.includes('?') ? '&' : '?'}secret=${encodeURIComponent(secret)}`, options);
}

export default function AdminPage() {
  const { secret, isAuthenticated, isAdmin, displayName, authUserId, login, logout } = useAdminAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'ugyfelek' | 'projektek' | 'arajanlatok' | 'alvallalkozok' | 'marketing' | 'statisztika' | 'felhasznalok'>('ugyfelek');
  const [view, setView] = useState<'list' | 'add' | 'detail'>('list');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [clientTypeFilter, setClientTypeFilter] = useState<'osszes' | 'ceges' | 'maganszemely'>('osszes');
  const [clientStatusFilter, setClientStatusFilter] = useState<string>('osszes');
  const [users, setUsers] = useState<{ id: string; email: string; role: string; name: string; createdAt: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [myTasksModalOpen, setMyTasksModalOpen] = useState(false);
  const [adminName, setAdminName] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('admin_name') || '';
    }
    return '';
  });
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_name');
    if (saved) setAdminName(saved);
  }, []);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const loadClients = useCallback(() => {
    if (!secret) return;
    setLoading(true);
    apiFetch(secret, '/api/clients')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Hibás jelszó'))))
      .then(setClients)
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, [secret]);

  const loadStatuses = useCallback(() => {
    if (!secret) return;
    apiFetch(secret, '/api/settings/statuses')
      .then((r) => (r.ok ? r.json() : []))
      .then(setStatuses)
      .catch(() => setStatuses(['érdeklődő', 'ajánlat kész', 'szerződés', 'lezárva']));
  }, [secret]);

  const loadUsers = useCallback(() => {
    if (!secret) return;
    setLoadingUsers(true);
    apiFetch(secret, '/api/users')
      .then((r) => (r.ok ? r.json() : []))
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));
  }, [secret]);

  useEffect(() => {
    if (secret) {
      loadClients();
      loadStatuses();
    }
  }, [secret, loadClients, loadStatuses]);

  useEffect(() => {
    if (secret && tab === 'felhasznalok') loadUsers();
  }, [secret, tab, loadUsers]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const body = loginEmail.trim() ? { email: loginEmail.trim(), password } : { password };
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Hibás belépés');
      login(data.token, data.user || { role: 'admin', name: 'Admin' });
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Hibás belépés.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleDeleteFromList = async (e: React.MouseEvent, client: Client) => {
    e.stopPropagation();
    if (!window.confirm('Biztosan törölni szeretnéd?')) return;
    setDeletingClientId(client.id);
    try {
      const res = await apiFetch(secret, `/api/clients/${client.id}`, { method: 'DELETE' });
      if (res.ok) loadClients();
    } finally {
      setDeletingClientId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
        >
          <h1 className="mb-6 text-xl font-bold text-gray-900">Belépés</h1>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            E-mail <span className="text-gray-400">(opcionális – admin jelszóval belépéshez hagyd üresen)</span>
          </label>
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="email@pelda.hu"
            className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Jelszó
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Jelszó"
            className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          {loginError && (
            <p className="mb-4 text-sm text-red-600">{loginError}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent py-3 font-semibold text-white hover:bg-accent/90 disabled:opacity-70"
          >
            {loading ? 'Belépés...' : 'Belépés'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: 'linear-gradient(to right, #08080E 0%, #14161b 100%)',
        }}
      >
        <div className="relative mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 pl-4 pr-0 sm:gap-4 md:h-20">
          <div className="-ml-28 flex min-w-0 items-center gap-2 sm:-ml-32">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-300 hover:bg-white/10 md:hidden"
              aria-label="Menü"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <img src="/logo/precisolit-logo-3.png" alt="Precisolit" className="h-9 w-auto max-w-[140px] object-contain sm:h-10 md:h-11" />
              <span className="cursor-default text-base font-bold text-white sm:text-xl">CRM</span>
            </div>
          </div>
          <div className="hidden justify-center md:flex">
            <button
              type="button"
              onClick={() => setMyTasksModalOpen(true)}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 sm:px-5 sm:py-2.5"
            >
              FELADATAIM
            </button>
          </div>
          <div className="-mr-28 flex items-center justify-end gap-2 sm:-mr-32">
            <button
              type="button"
              onClick={() => setMyTasksModalOpen(true)}
              className="rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 md:hidden"
            >
              FELADATAIM
            </button>
            <div className="relative shrink-0" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((o) => !o)}
                  className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-lg px-2 py-2 text-gray-200 hover:bg-white/10 sm:px-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/30 text-sm font-medium text-accent">{(adminName || displayName).charAt(0).toUpperCase()}</span>
                  <span className="hidden text-sm font-medium text-white sm:inline">{adminName || displayName}</span>
                  <svg className={`hidden h-4 w-4 shrink-0 text-gray-400 transition-transform sm:block ${profileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-gray-700 bg-black py-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setProfileOpen(true);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-800"
                    >
                      Profil beállítása
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        logout();
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-400 hover:bg-gray-800"
                    >
                      Kilépés
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white shadow-xl transition-transform duration-200 md:static md:inset-auto md:z-auto md:w-56 md:translate-x-0 md:shadow-none ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4 md:hidden">
            <span className="font-semibold text-gray-900">Menü</span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Menü bezárása"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col p-2">
            {(
              [
                { id: 'ugyfelek' as const, label: 'Ügyfelek' },
                { id: 'projektek' as const, label: 'Projektek' },
                { id: 'arajanlatok' as const, label: 'Árajánlatok' },
                { id: 'alvallalkozok' as const, label: 'Alvállalkozók' },
                { id: 'marketing' as const, label: 'Marketing' },
                { id: 'statisztika' as const, label: 'Statisztika' },
                { id: 'felhasznalok' as const, label: 'Felhasználók' },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setTab(id);
                  setView('list');
                  setSelectedClient(null);
                  setSidebarOpen(false);
                }}
                className={`rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors md:py-2.5 ${
                  tab === id ? 'bg-accent/10 text-accent' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-auto px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8">
        {tab === 'ugyfelek' && view === 'list' && (
          <div className="mx-auto flex w-full max-w-6xl gap-6">
          <div className="min-w-0 flex-1">
            {(() => {
              const q = clientSearch.trim().toLowerCase();
              let filtered = clients;
              if (q) {
                filtered = filtered.filter((c) => {
                  const str = [
                    c.name, c.firstName, c.lastName, c.phone, c.email,
                    c.address, c.postalCode, c.settlement, c.streetAddress,
                    c.contactName, c.contactPhone, c.contactEmail,
                    c.billingName, c.billingAddress,
                  ].filter(Boolean).join(' ').toLowerCase();
                  return str.includes(q);
                });
              }
              if (clientTypeFilter !== 'osszes') {
                filtered = filtered.filter((c) => c.clientType === clientTypeFilter);
              }
              if (clientStatusFilter !== 'osszes') {
                filtered = filtered.filter((c) => c.status === clientStatusFilter);
              }
              return (
            <>
            <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Ügyfelek ({filtered.length}{(clientSearch.trim() || clientTypeFilter !== 'osszes' || clientStatusFilter !== 'osszes') ? ` / ${clients.length}` : ''})</h2>
              <button onClick={() => setView('add')} className="min-h-[44px] shrink-0 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent/90 sm:py-2">
                + Új ügyfél
              </button>
            </div>
            <div className="mb-4 space-y-3 lg:hidden">
              <input
                type="search"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Keresés: név, tél., email, cím, irányítószám..."
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <div className="flex gap-3">
                <div className="min-w-0 flex-1">
                  <select
                    value={clientTypeFilter}
                    onChange={(e) => setClientTypeFilter(e.target.value as 'osszes' | 'ceges' | 'maganszemely')}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="osszes">Mind (típus)</option>
                    <option value="ceges">Cég</option>
                    <option value="maganszemely">Magánszemély</option>
                  </select>
                </div>
                <div className="min-w-0 flex-1">
                  <select
                    value={clientStatusFilter}
                    onChange={(e) => setClientStatusFilter(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="osszes">Mind (státusz)</option>
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {loading ? (
              <p className="text-center text-gray-500">Betöltés...</p>
            ) : clients.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow">
                <p className="text-gray-500">Még nincs ügyfél.</p>
                <p className="mt-2 text-sm text-gray-400">A visszahívás kérések automatikusan létrehoznak ügyfelet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => { setSelectedClient(client); setView('detail'); }}
                    className="cursor-pointer rounded-2xl bg-white p-4 shadow transition hover:shadow-lg"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${client.clientType === 'ceges' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                          {client.clientType === 'ceges' ? 'Cég' : 'Magán'}
                        </span>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${client.status === 'érdeklődő' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}>
                        {client.status}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-600 sm:overflow-visible sm:whitespace-normal">{client.phone} · {client.email}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-xs text-gray-400">
                        {formatDate(client.createdAt)}
                        {client.source === 'callback' && ' · Visszahívás kérés'}
                      </p>
                      <span className="shrink-0 text-xs" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setView('detail'); }}
                          className="text-gray-600 hover:underline"
                        >
                          Statisztikák
                        </button>
                        <span className="mx-1 text-gray-400">|</span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteFromList(e, client)}
                          disabled={deletingClientId === client.id}
                          className="text-red-600 hover:underline disabled:opacity-50"
                        >
                          {deletingClientId === client.id ? 'Törlés...' : 'Törlés'}
                        </button>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </>
            );
            })()}
          </div>
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <label className="mb-2 block text-sm font-medium text-gray-700">Keresés</label>
              <input
                type="search"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Név, telefonszám, email, cím, irányítószám..."
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <p className="mt-2 text-xs text-gray-500">
                Keresés névre, telefonszámra, e-mail címre, címre vagy irányítószámra.
              </p>
              <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Típus</label>
                  <select
                    value={clientTypeFilter}
                    onChange={(e) => setClientTypeFilter(e.target.value as 'osszes' | 'ceges' | 'maganszemely')}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="osszes">Mind</option>
                    <option value="ceges">Cég</option>
                    <option value="maganszemely">Magánszemély</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Státusz</label>
                  <select
                    value={clientStatusFilter}
                    onChange={(e) => setClientStatusFilter(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="osszes">Mind</option>
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </aside>
          </div>
        )}

        {tab === 'ugyfelek' && view === 'add' && (
          <div className="mx-auto max-w-4xl">
          <AddClientForm
            secret={secret}
            onSuccess={() => { loadClients(); setView('list'); }}
            onCancel={() => setView('list')}
          />
          </div>
        )}

        {tab === 'ugyfelek' && view === 'detail' && selectedClient && (
          <div className="mx-auto max-w-4xl">
          <ClientDetail
            client={selectedClient}
            secret={secret}
            statuses={statuses}
            onUpdate={(updated) => { setSelectedClient(updated); loadClients(); }}
            onBack={() => { setView('list'); setSelectedClient(null); }}
            onDelete={() => { setView('list'); setSelectedClient(null); loadClients(); }}
          />
          </div>
        )}

        {tab === 'projektek' && (
          <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <h2 className="text-lg font-semibold text-gray-900">Projektek</h2>
            <p className="mt-2 text-sm text-gray-500">Ez a menüpont szerkesztés alatt.</p>
          </div>
          </div>
        )}

        {tab === 'arajanlatok' && (
          <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <h2 className="text-lg font-semibold text-gray-900">Árajánlatok</h2>
            <p className="mt-2 text-sm text-gray-500">Ez a menüpont szerkesztés alatt.</p>
          </div>
          </div>
        )}

        {tab === 'alvallalkozok' && (
          <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <h2 className="text-lg font-semibold text-gray-900">Alvállalkozók</h2>
            <p className="mt-2 text-sm text-gray-500">Ez a menüpont szerkesztés alatt.</p>
          </div>
          </div>
        )}

        {tab === 'marketing' && (
          <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <h2 className="text-lg font-semibold text-gray-900">Marketing</h2>
            <p className="mt-2 text-sm text-gray-500">Ez a menüpont szerkesztés alatt.</p>
          </div>
          </div>
        )}

        {tab === 'statisztika' && (
          <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <h2 className="text-lg font-semibold text-gray-900">Statisztika</h2>
            <p className="mt-2 text-sm text-gray-500">Ez a menüpont szerkesztés alatt.</p>
          </div>
          </div>
        )}

        {tab === 'felhasznalok' && (
          <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-6 shadow">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Felhasználók ({users.length})</h2>
              {isAdmin && (
                <button
                  onClick={() => setAddUserModalOpen(true)}
                  className="shrink-0 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90"
                >
                  + Új felhasználó
                </button>
              )}
            </div>
            {loadingUsers ? (
              <p className="py-8 text-center text-gray-500">Betöltés...</p>
            ) : users.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                Még nincs felhasználó.{isAdmin && ' Az admin adhat hozzá új felhasználót.'}
              </p>
            ) : (
              <div className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 p-4"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{u.name || u.email}</p>
                      <p className="text-sm text-gray-600">{u.email}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role === 'admin' ? 'Admin' : 'Felhasználó'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        )}

        {addUserModalOpen && (
          <AddUserModal
            secret={secret}
            onSuccess={() => { loadUsers(); setAddUserModalOpen(false); }}
            onClose={() => setAddUserModalOpen(false)}
          />
        )}
        </main>
      </div>

      {settingsOpen && (
        <StatusSettingsModal
          secret={secret}
          statuses={statuses}
          onSave={(newStatuses) => { setStatuses(newStatuses); setSettingsOpen(false); }}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {myTasksModalOpen && (
        <MyTasksModal
          secret={secret}
          clients={clients}
          isAdmin={isAdmin}
          authUserId={authUserId}
          users={users}
          loadUsers={loadUsers}
          onSelectClient={(client) => {
            setSelectedClient(client);
            setTab('ugyfelek');
            setView('detail');
            setSidebarOpen(false);
            setMyTasksModalOpen(false);
          }}
          onClose={() => setMyTasksModalOpen(false)}
        />
      )}

      {profileOpen && (
        <ProfileModal
          adminName={adminName || displayName}
          onSave={(name) => {
            setAdminName(name);
            sessionStorage.setItem('admin_name', name);
            setProfileOpen(false);
          }}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </div>
  );
}

type MyTask = Process & { clientName: string };

function MyTasksModal({
  secret,
  clients,
  isAdmin,
  authUserId,
  users,
  loadUsers,
  onSelectClient,
  onClose,
}: {
  secret: string;
  clients: Client[];
  isAdmin: boolean;
  authUserId: string | null;
  users: { id: string; email: string; role: string; name: string }[];
  loadUsers: () => void;
  onSelectClient: (client: Client) => void;
  onClose: () => void;
}) {
  const [tasks, setTasks] = useState<MyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'osszes' | 'folyamatban' | 'lezart'>('osszes');
  const [responsibleFilter, setResponsibleFilter] = useState<string>('');

  useEffect(() => {
    if (!secret) return;
    if (isAdmin) loadUsers();
  }, [secret, isAdmin, loadUsers]);

  useEffect(() => {
    if (!secret) return;
    setLoading(true);
    const url = responsibleFilter
      ? `/api/my-tasks?responsibleUserId=${encodeURIComponent(responsibleFilter)}`
      : '/api/my-tasks';
    apiFetch(secret, url)
      .then((r) => (r.ok ? r.json() : []))
      .then(setTasks)
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [secret, responsibleFilter]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleCloseProcess = async (procId: string, closeStatus: 'kész' | 'sikertelen') => {
    try {
      const res = await apiFetch(secret, `/api/processes/${procId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: closeStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks((prev) => prev.map((p) => (p.id === procId ? { ...updated, clientName: (prev.find((x) => x.id === procId) as MyTask)?.clientName ?? '–' } : p)));
      }
    } catch {
      const url = responsibleFilter
        ? `/api/my-tasks?responsibleUserId=${encodeURIComponent(responsibleFilter)}`
        : '/api/my-tasks';
      const r = await apiFetch(secret, url);
      if (r.ok) setTasks(await r.json());
    }
  };

  const filteredTasks =
    statusFilter === 'osszes'
      ? tasks
      : statusFilter === 'folyamatban'
      ? tasks.filter((t) => t.status === 'open')
      : tasks.filter((t) => t.status === 'kész' || t.status === 'sikertelen');

  const handleClientClick = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) onSelectClient(client);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" onClick={onClose}>
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Feladataim</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Bezárás"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter('osszes')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${statusFilter === 'osszes' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Összes
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('folyamatban')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${statusFilter === 'folyamatban' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Folyamatban lévő
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('lezart')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${statusFilter === 'lezart' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Lezárt
          </button>
          <div className="ml-2 border-l border-gray-200 pl-2">
            <label className="mr-2 text-sm text-gray-600">Felelős:</label>
            <select
              value={responsibleFilter}
              onChange={(e) => setResponsibleFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">{authUserId ? 'Saját' : '— Válassz —'}</option>
              {isAdmin &&
                users
                  .filter((u) => !authUserId || u.id !== authUserId)
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.email}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="py-8 text-center text-gray-500">Betöltés...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            {tasks.length === 0 ? 'Nincs hozzárendelt feladat.' : 'Nincs találat a szűrés alapján.'}
          </p>
        ) : (
          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-xl border p-4 ${
                  task.status === 'kész'
                    ? 'border-green-200 bg-green-50/50'
                    : task.status === 'sikertelen'
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleClientClick(task.clientId)}
                    className="text-left text-sm font-medium text-accent hover:underline"
                  >
                    {task.clientName}
                  </button>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    task.status === 'open' ? 'bg-amber-100 text-amber-800' :
                    task.status === 'kész' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-gray-800">{task.text}</p>
                <p className="mt-1 text-xs text-gray-500">{formatDate(task.createdAt)}</p>
                {task.status === 'open' && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleCloseProcess(task.id, 'kész')}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                    >
                      Kész
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCloseProcess(task.id, 'sikertelen')}
                      className="rounded-lg bg-gray-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-600"
                    >
                      Sikertelen
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AddClientForm({ secret, onSuccess, onCancel }: { secret: string; onSuccess: () => void; onCancel: () => void }) {
  const [clientType, setClientType] = useState<'maganszemely' | 'ceges' | null>(null);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [name, setName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [settlement, setSettlement] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [contactLastName, setContactLastName] = useState('');
  const [contactFirstName, setContactFirstName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const addr = [postalCode, settlement, streetAddress].filter(Boolean).join(', ');
      const body = clientType === 'ceges'
        ? {
            clientType: 'ceges',
            name,
            address: addr,
            postalCode,
            settlement,
            streetAddress,
            taxNumber,
            phone,
            email,
            contactLastName,
            contactFirstName,
            contactPhone,
            contactEmail,
          }
        : { clientType: 'maganszemely', lastName, firstName, address: addr, postalCode, settlement, streetAddress, phone, email };
      const res = await apiFetch(secret, '/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Hiba');
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba történt');
    } finally {
      setSubmitting(false);
    }
  };

  if (clientType === null) {
    return (
      <div className="overflow-hidden rounded-2xl bg-white p-4 shadow sm:p-6">
        <h2 className="mb-4 text-xl font-semibold sm:mb-6">Új ügyfél</h2>
        <p className="mb-4 text-sm text-gray-600">Válaszd ki az ügyfél típusát:</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <button
            type="button"
            onClick={() => setClientType('maganszemely')}
            className="min-h-[48px] rounded-xl border-2 border-accent bg-accent/10 px-6 py-4 font-semibold text-accent transition-colors hover:bg-accent/20 sm:px-8"
          >
            Magánszemély
          </button>
          <button
            type="button"
            onClick={() => setClientType('ceges')}
            className="min-h-[48px] rounded-xl border-2 border-gray-300 px-6 py-4 font-semibold text-gray-700 transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent sm:px-8"
          >
            Céges ügyfél
          </button>
        </div>
        <button type="button" onClick={onCancel} className="mt-6 text-sm text-gray-600 hover:text-gray-900">
          ← Mégse
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white p-4 shadow sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Új ügyfél – {clientType === 'maganszemely' ? 'Magánszemély' : 'Céges ügyfél'}</h2>
        <button
          type="button"
          onClick={() => setClientType(null)}
          className="min-h-[44px] text-left text-sm text-gray-500 hover:text-gray-900 sm:text-right"
        >
          Típus váltása
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {clientType === 'maganszemely' ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Vezetéknév *</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Keresztnév *</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Irányítószám</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onBlur={async (e) => {
                    const v = e.target.value.replace(/\D/g, '').trim();
                    if (v.length === 4) {
                      try {
                        const res = await fetch(`/api/postal-code/${v}`);
                        if (res.ok) {
                          const { settlement: s } = await res.json();
                          if (s) setSettlement(s);
                        }
                      } catch { /* ignore */ }
                    }
                  }}
                  className="w-24 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="1011"
                />
              </div>
              <div className="w-48 max-w-[220px]">
                <label className="mb-1 block text-sm font-medium text-gray-700">Település</label>
                <input type="text" value={settlement} onChange={(e) => setSettlement(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Település" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Utca, házszám</label>
              <input type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Utca, házszám" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Telefonszám *</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </>
        ) : (
          <>
            <div className="rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-700">Cég adatai</div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Cég neve *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Irányítószám</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onBlur={async (e) => {
                    const v = e.target.value.replace(/\D/g, '').trim();
                    if (v.length === 4) {
                      try {
                        const res = await fetch(`/api/postal-code/${v}`);
                        if (res.ok) {
                          const { settlement: s } = await res.json();
                          if (s) setSettlement(s);
                        }
                      } catch { /* ignore */ }
                    }
                  }}
                  className="w-24 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="1011"
                />
              </div>
              <div className="w-48 max-w-[220px]">
                <label className="mb-1 block text-sm font-medium text-gray-700">Település</label>
                <input type="text" value={settlement} onChange={(e) => setSettlement(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Település" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Utca, házszám</label>
              <input type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Utca, házszám" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Adószám</label>
              <input type="text" value={taxNumber} onChange={(e) => setTaxNumber(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="12345678-1-42" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Telefonszám *</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email cím *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-700">Kapcsolattartó</div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Vezetéknév *</label>
              <input type="text" value={contactLastName} onChange={(e) => setContactLastName(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Keresztnév *</label>
              <input type="text" value={contactFirstName} onChange={(e) => setContactFirstName(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Telefonszám *</label>
              <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email cím *</label>
              <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="rounded-xl bg-accent px-6 py-2 font-semibold text-white hover:bg-accent/90 disabled:opacity-70">
            {submitting ? 'Mentés...' : 'Mentés'}
          </button>
          <button type="button" onClick={onCancel} className="rounded-xl border border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-50">
            Mégse
          </button>
        </div>
      </form>
    </div>
  );
}

type DetailSubTab = 'adatok' | 'folyamatok' | 'projektek' | 'ajanlatok' | 'uzenetek';

function ClientDetail({ client, secret, statuses, onUpdate, onBack, onDelete }: { client: Client; secret: string; statuses: string[]; onUpdate: (c: Client) => void; onBack: () => void; onDelete: () => void }) {
  const [detailSubTab, setDetailSubTab] = useState<DetailSubTab>('adatok');
  const [editedClient, setEditedClient] = useState(client);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loadingProcesses, setLoadingProcesses] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [processFilter, setProcessFilter] = useState<'osszes' | 'folyamatban' | 'lezárt'>('osszes');
  const [projectFilter, setProjectFilter] = useState<'osszes' | 'folyamatban' | 'lezárt'>('osszes');
  const [status, setStatus] = useState(client.status);
  const [saving, setSaving] = useState(false);
  const [addProcessMenuOpen, setAddProcessMenuOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [customProcessModalOpen, setCustomProcessModalOpen] = useState(false);
  const [addingProcess, setAddingProcess] = useState(false);
  const [customProcessText, setCustomProcessText] = useState('');
  const [customProcessResponsible, setCustomProcessResponsible] = useState('');
  const [customProcessStart, setCustomProcessStart] = useState('');
  const [customProcessEnd, setCustomProcessEnd] = useState('');
  const [customProcessNoTimeLimit, setCustomProcessNoTimeLimit] = useState(false);
  const [customProcessImportance, setCustomProcessImportance] = useState<'nem' | 'atlag' | 'nagy'>('atlag');
  const [newProjectName, setNewProjectName] = useState('');
  const [addingProject, setAddingProject] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [processUsers, setProcessUsers] = useState<{ id: string; email: string; name: string }[]>([]);

  const loadProcesses = useCallback(() => {
    if (!secret || !client.id) return;
    setLoadingProcesses(true);
    apiFetch(secret, `/api/clients/${client.id}/processes`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setProcesses)
      .finally(() => setLoadingProcesses(false));
  }, [secret, client.id]);

  const loadProjects = useCallback(() => {
    if (!secret || !client.id) return;
    setLoadingProjects(true);
    apiFetch(secret, `/api/clients/${client.id}/projects`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setProjects)
      .finally(() => setLoadingProjects(false));
  }, [secret, client.id]);

  const loadProcessUsers = useCallback(() => {
    if (!secret) return;
    apiFetch(secret, '/api/users')
      .then((r) => (r.ok ? r.json() : []))
      .then(setProcessUsers)
      .catch(() => setProcessUsers([]));
  }, [secret]);

  useEffect(() => { loadProcesses(); }, [loadProcesses]);
  useEffect(() => {
    if (detailSubTab === 'folyamatok') loadProcessUsers();
  }, [detailSubTab, loadProcessUsers]);
  useEffect(() => {
    if (detailSubTab === 'projektek') loadProjects();
  }, [detailSubTab, loadProjects]);
  useEffect(() => { setEditedClient(client); setStatus(client.status); }, [client]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  const isProcessUrgent = (proc: Process) =>
    proc.status === 'open' && (Date.now() - new Date(proc.createdAt).getTime() > THREE_HOURS_MS);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setSaving(true);
    try {
      const res = await apiFetch(secret, `/api/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated);
      }
    } finally {
      setSaving(false);
    }
  };

  const editableFields = [
    'name', 'lastName', 'firstName', 'address', 'postalCode', 'settlement', 'streetAddress',
    'taxNumber', 'phone', 'email', 'contactLastName', 'contactFirstName', 'contactPhone', 'contactEmail',
    'billingSameAsAddress', 'billingName', 'billingAddress', 'billingTaxNumber',
  ] as const;

  const hasUnsavedChanges = editableFields.some((f) => {
    const a = (editedClient as Record<string, unknown>)[f];
    const b = (client as Record<string, unknown>)[f];
    const av = a === undefined || a === null ? '' : String(a);
    const bv = b === undefined || b === null ? '' : String(b);
    return av !== bv;
  });

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;
    setSaving(true);
    try {
      const updates: Record<string, unknown> = {};
      editableFields.forEach((f) => {
        const a = (editedClient as Record<string, unknown>)[f];
        const b = (client as Record<string, unknown>)[f];
        const av = a === undefined || a === null ? '' : (typeof a === 'boolean' ? a : String(a));
        const bv = b === undefined || b === null ? '' : (typeof b === 'boolean' ? b : String(b));
        if (av !== bv) updates[f] = a;
      });
      if (Object.keys(updates).length === 0) return;
      const res = await apiFetch(secret, `/api/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBackClick = () => {
    if (hasUnsavedChanges && !window.confirm('Nem mentett változtatások vannak. Biztosan elhagyja az oldalt?')) return;
    onBack();
  };

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  const handleFieldBlur = (_field: keyof Client, _value: string | boolean) => {
    /* Nincs auto-mentés, csak Mentés gombbal */
  };

  const handleDelete = async () => {
    if (!window.confirm('Biztosan törölni szeretnéd?')) return;
    setDeleting(true);
    try {
      const res = await apiFetch(secret, `/api/clients/${client.id}`, { method: 'DELETE' });
      if (res.ok) onDelete();
    } finally {
      setDeleting(false);
    }
  };

  const handleAddCustomProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customProcessText.trim()) return;
    setAddingProcess(true);
    try {
      const res = await apiFetch(secret, `/api/clients/${client.id}/processes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: customProcessText.trim(),
          ...(customProcessResponsible ? { responsibleUserId: customProcessResponsible } : {}),
        }),
      });
      if (res.ok) {
        const proc = await res.json();
        setProcesses((prev) => [proc, ...prev]);
        setCustomProcessModalOpen(false);
        setCustomProcessText('');
        setCustomProcessResponsible('');
        setCustomProcessStart('');
        setCustomProcessEnd('');
        setCustomProcessNoTimeLimit(false);
        setCustomProcessImportance('atlag');
      }
    } finally {
      setAddingProcess(false);
    }
  };

  const handleCloseProcess = async (procId: string, closeStatus: 'kész' | 'sikertelen') => {
    try {
      const res = await apiFetch(secret, `/api/processes/${procId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: closeStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProcesses((prev) => prev.map((p) => (p.id === procId ? updated : p)));
      }
    } catch {
      loadProcesses();
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingProject(true);
    try {
      const res = await apiFetch(secret, `/api/clients/${client.id}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName.trim() || 'Projekt' }),
      });
      if (res.ok) {
        const proj = await res.json();
        setProjects((prev) => [proj, ...prev]);
        setNewProjectName('');
      }
    } finally {
      setAddingProject(false);
    }
  };

  const handleProjectStatusChange = async (projId: string, newStatus: 'folyamatban' | 'lezárt') => {
    try {
      const res = await apiFetch(secret, `/api/projects/${projId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === projId ? updated : p)));
      }
    } catch {
      loadProjects();
    }
  };

  const isCeges = client.clientType === 'ceges';

  const filteredProcesses = processFilter === 'osszes'
    ? processes
    : processFilter === 'folyamatban'
    ? processes.filter((p) => p.status === 'open')
    : processes.filter((p) => p.status === 'kész' || p.status === 'sikertelen');

  const filteredProjects = projectFilter === 'osszes'
    ? projects
    : projectFilter === 'folyamatban'
    ? projects.filter((p) => p.status === 'folyamatban')
    : projects.filter((p) => p.status === 'lezárt');

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl bg-white p-4 shadow sm:p-6">
        <button onClick={handleBackClick} className="mb-4 min-h-[44px] text-sm text-gray-600 hover:text-gray-900">← Vissza</button>
        <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6 sm:gap-3">
          <h2 className="text-xl font-semibold text-gray-900">{editedClient.name}</h2>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${isCeges ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
            {isCeges ? 'Céges' : 'Magánszemély'}
          </span>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={saving}
            className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-70"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            type="button"
            className="min-h-[36px] rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Statisztikák
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="min-h-[36px] rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70"
          >
            {deleting ? 'Törlés...' : 'Törlés'}
          </button>
        </div>

        <nav className="-mx-4 mb-4 overflow-x-auto border-b border-gray-200 px-4 sm:mx-0 sm:mb-6 sm:overflow-visible sm:px-0">
          <div className="flex min-w-max gap-1 sm:min-w-0">
          {(['adatok', 'folyamatok', 'projektek', 'ajanlatok', 'uzenetek'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                if (detailSubTab === 'adatok' && hasUnsavedChanges && t !== 'adatok' && !window.confirm('Nem mentett változtatások vannak. Biztosan elhagyja az ügyfél adatait?')) return;
                setDetailSubTab(t);
              }}
              className={`min-h-[44px] shrink-0 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors sm:min-h-0 sm:py-2 ${
                detailSubTab === t
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {t === 'adatok' ? 'Ügyfél adatai' : t === 'folyamatok' ? 'Folyamatok' : t === 'projektek' ? 'Projektek' : t === 'ajanlatok' ? 'Ajánlatok' : 'Üzenetek'}
            </button>
          ))}
          </div>
        </nav>

        {detailSubTab === 'adatok' && (
        <div className="space-y-4">
          {hasUnsavedChanges && (
            <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium text-amber-800">Nem mentett változtatások</span>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-70"
              >
                {saving ? 'Mentés...' : 'Mentés'}
              </button>
            </div>
          )}
          {isCeges ? (
            <div>
              <label className="text-sm font-medium text-gray-600">Cég neve</label>
              <input
                type="text"
                value={editedClient.name}
                onChange={(e) => setEditedClient((p) => ({ ...p, name: e.target.value }))}
                onBlur={(e) => handleFieldBlur('name', e.target.value)}
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent sm:max-w-md"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-gray-600">Vezetéknév</label>
                <input
                  type="text"
                  value={editedClient.lastName ?? ''}
                  onChange={(e) => setEditedClient((p) => ({ ...p, lastName: e.target.value }))}
                  onBlur={(e) => handleFieldBlur('lastName', e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent sm:max-w-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Keresztnév</label>
                <input
                  type="text"
                  value={editedClient.firstName ?? ''}
                  onChange={(e) => setEditedClient((p) => ({ ...p, firstName: e.target.value }))}
                  onBlur={(e) => handleFieldBlur('firstName', e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent sm:max-w-md"
                />
              </div>
            </>
          )}
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Irányítószám</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={editedClient.postalCode ?? ''}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setEditedClient((p) => ({ ...p, postalCode: v }));
                }}
                onBlur={async (e) => {
                  const v = e.target.value.replace(/\D/g, '').trim();
                  if ((editedClient.postalCode ?? '') !== v) await handleFieldBlur('postalCode', v);
                  if (v.length === 4) {
                    try {
                      const res = await fetch(`/api/postal-code/${v}`);
                      if (res.ok) {
                        const { settlement } = await res.json();
                        if (settlement && (editedClient.settlement ?? '') !== settlement) {
                          setEditedClient((p) => ({ ...p, settlement }));
                          await handleFieldBlur('settlement', settlement);
                        }
                      }
                    } catch {
                      /* ignore */
                    }
                  }
                }}
                className="mt-1 block w-24 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="1011"
              />
            </div>
            <div className="w-48 max-w-[220px]">
              <label className="text-sm font-medium text-gray-600">Település</label>
              <input
                type="text"
                value={editedClient.settlement ?? ''}
                onChange={(e) => setEditedClient((p) => ({ ...p, settlement: e.target.value }))}
                onBlur={(e) => handleFieldBlur('settlement', e.target.value)}
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Település"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Utca, házszám</label>
            <input
              type="text"
              value={editedClient.streetAddress ?? ''}
              onChange={(e) => setEditedClient((p) => ({ ...p, streetAddress: e.target.value }))}
              onBlur={(e) => handleFieldBlur('streetAddress', e.target.value)}
              className="mt-1 block w-full max-w-md rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Utca, házszám"
            />
          </div>
          {isCeges && (
            <div>
              <label className="text-sm font-medium text-gray-600">Adószám</label>
              <input
                type="text"
                value={editedClient.taxNumber ?? ''}
                onChange={(e) => setEditedClient((p) => ({ ...p, taxNumber: e.target.value }))}
                onBlur={(e) => handleFieldBlur('taxNumber', e.target.value)}
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent sm:max-w-md"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-600">{isCeges ? 'Cég telefonszáma' : 'Telefonszám'}</label>
            <input
              type="tel"
              value={editedClient.phone}
              onChange={(e) => setEditedClient((p) => ({ ...p, phone: e.target.value }))}
              onBlur={(e) => handleFieldBlur('phone', e.target.value)}
              className="mt-1 block w-full max-w-md rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">{isCeges ? 'Cég email címe' : 'Email'}</label>
            <input
              type="email"
              value={editedClient.email}
              onChange={(e) => setEditedClient((p) => ({ ...p, email: e.target.value }))}
              onBlur={(e) => handleFieldBlur('email', e.target.value)}
              className="mt-1 block w-full max-w-md rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={editedClient.billingSameAsAddress !== false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setEditedClient((p) => ({ ...p, billingSameAsAddress: checked }));
                  handleFieldBlur('billingSameAsAddress', checked);
                }}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span className="text-sm font-medium text-gray-700">Számlázási adatok ugyanazok</span>
            </label>
            {editedClient.billingSameAsAddress === false && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Számlázási név</label>
                  <input
                    type="text"
                    value={editedClient.billingName ?? ''}
                    onChange={(e) => setEditedClient((p) => ({ ...p, billingName: e.target.value }))}
                    onBlur={(e) => handleFieldBlur('billingName', e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent sm:max-w-md"
                    placeholder="Számlázási név"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Számlázási cím</label>
                  <input
                    type="text"
                    value={editedClient.billingAddress ?? ''}
                    onChange={(e) => setEditedClient((p) => ({ ...p, billingAddress: e.target.value }))}
                    onBlur={(e) => handleFieldBlur('billingAddress', e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent sm:max-w-md"
                    placeholder="Számlázási cím"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Számlázási adószám</label>
                  <input
                    type="text"
                    value={editedClient.billingTaxNumber ?? ''}
                    onChange={(e) => setEditedClient((p) => ({ ...p, billingTaxNumber: e.target.value }))}
                    onBlur={(e) => handleFieldBlur('billingTaxNumber', e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent sm:max-w-md"
                    placeholder="12345678-1-42"
                  />
                </div>
              </div>
            )}
          </div>

          {isCeges && (
            <>
              <div className="rounded-lg bg-gray-50 p-2 text-sm font-medium text-gray-700">Kapcsolattartó</div>
              <div>
                <label className="text-sm font-medium text-gray-600">Vezetéknév</label>
                <input
                  type="text"
                  value={editedClient.contactLastName ?? ''}
                  onChange={(e) => setEditedClient((p) => ({ ...p, contactLastName: e.target.value }))}
                  onBlur={(e) => handleFieldBlur('contactLastName', e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent sm:max-w-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Keresztnév</label>
                <input
                  type="text"
                  value={editedClient.contactFirstName ?? ''}
                  onChange={(e) => setEditedClient((p) => ({ ...p, contactFirstName: e.target.value }))}
                  onBlur={(e) => handleFieldBlur('contactFirstName', e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent sm:max-w-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Telefonszám</label>
                <input
                  type="tel"
                  value={editedClient.contactPhone ?? ''}
                  onChange={(e) => setEditedClient((p) => ({ ...p, contactPhone: e.target.value }))}
                  onBlur={(e) => handleFieldBlur('contactPhone', e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent sm:max-w-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email cím</label>
                <input
                  type="email"
                  value={editedClient.contactEmail ?? ''}
                  onChange={(e) => setEditedClient((p) => ({ ...p, contactEmail: e.target.value }))}
                  onBlur={(e) => handleFieldBlur('contactEmail', e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent sm:max-w-md"
                />
              </div>
            </>
          )}
          <div>
            <label className="text-sm font-medium text-gray-600">Létrehozva</label>
            <p className="text-gray-600">
              {formatDate(client.createdAt)}
              {client.source === 'callback' && ' · Visszahívás kérésből'}
            </p>
          </div>
        </div>
        )}

        {detailSubTab === 'folyamatok' && (
        <>
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setProcessFilter('osszes')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${processFilter === 'osszes' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Összes
          </button>
          <button
            type="button"
            onClick={() => setProcessFilter('folyamatban')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${processFilter === 'folyamatban' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Folyamatban lévő
          </button>
          <button
            type="button"
            onClick={() => setProcessFilter('lezárt')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${processFilter === 'lezárt' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Lezárt
          </button>
        </div>

        <div className="relative mb-6">
          <button
            type="button"
            onClick={() => setAddProcessMenuOpen((o) => !o)}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90"
          >
            + Folyamat hozzáadása
          </button>
          {addProcessMenuOpen && (
            <>
              <div className="absolute left-0 top-full z-10 mt-1 w-56 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => { setAddProcessMenuOpen(false); setTemplateModalOpen(true); }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Sablon folyamat
                </button>
                <button
                  type="button"
                  onClick={() => { setAddProcessMenuOpen(false); setCustomProcessModalOpen(true); }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Egyedi folyamat
                </button>
              </div>
              <div className="fixed inset-0 z-0" onClick={() => setAddProcessMenuOpen(false)} aria-hidden="true" />
            </>
          )}
        </div>

        {/* Sablon folyamat modal */}
        {templateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setTemplateModalOpen(false)}>
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-gray-900">Sablon folyamat</h3>
              <p className="mt-2 text-sm text-gray-500">A sablonok hamarosan elérhetőek lesznek.</p>
              <button
                type="button"
                onClick={() => setTemplateModalOpen(false)}
                className="mt-4 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Bezárás
              </button>
            </div>
          </div>
        )}

        {/* Egyedi folyamat modal */}
        {customProcessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" onClick={() => setCustomProcessModalOpen(false)}>
            <form onSubmit={handleAddCustomProcess} className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Egyedi folyamat</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Folyamat szövege *</label>
                  <textarea
                    value={customProcessText}
                    onChange={(e) => setCustomProcessText(e.target.value)}
                    placeholder="Folyamat leírása..."
                    rows={3}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Folyamat felelőse</label>
                  <select
                    value={customProcessResponsible}
                    onChange={(e) => setCustomProcessResponsible(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">— Nincs kijelölve</option>
                    {processUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name ? `${u.name} (${u.email})` : u.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={customProcessNoTimeLimit}
                      onChange={(e) => setCustomProcessNoTimeLimit(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Időkorlát nélkül
                  </label>
                </div>
                {!customProcessNoTimeLimit && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Kezdete</label>
                      <input
                        type="datetime-local"
                        value={customProcessStart}
                        onChange={(e) => setCustomProcessStart(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Vége</label>
                      <input
                        type="datetime-local"
                        value={customProcessEnd}
                        onChange={(e) => setCustomProcessEnd(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Fontosság</label>
                  <select
                    value={customProcessImportance}
                    onChange={(e) => setCustomProcessImportance(e.target.value as 'nem' | 'atlag' | 'nagy')}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="nem">Nem sürgős</option>
                    <option value="atlag">Átlagosan sürgős</option>
                    <option value="nagy">Nagyon sürgős</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <button
                  type="submit"
                  disabled={addingProcess || !customProcessText.trim()}
                  className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-70"
                >
                  {addingProcess ? 'Hozzáadás...' : 'Folyamat hozzáadása'}
                </button>
                <button
                  type="button"
                  onClick={() => setCustomProcessModalOpen(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Mégse
                </button>
              </div>
            </form>
          </div>
        )}

        {loadingProcesses ? (
          <p className="text-sm text-gray-500">Betöltés...</p>
        ) : filteredProcesses.length === 0 ? (
          <p className="text-sm text-gray-500">Nincs folyamat{processFilter !== 'osszes' ? ' a szűrés alapján' : ''}.</p>
        ) : (
          <div className="space-y-4">
            {filteredProcesses.map((proc) => (
              <div
                key={proc.id}
                className={`rounded-xl border p-4 ${
                  isProcessUrgent(proc)
                    ? 'border-red-300 bg-red-50'
                    : proc.status === 'kész'
                    ? 'border-green-200 bg-green-50/50'
                    : proc.status === 'sikertelen'
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500">{formatDate(proc.createdAt)}</span>
                    {proc.responsibleUserId && (() => {
                      const u = processUsers.find((x) => x.id === proc.responsibleUserId);
                      return u ? <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">Felelős: {u.name || u.email}</span> : null;
                    })()}
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    proc.status === 'open' ? 'bg-amber-100 text-amber-800' :
                    proc.status === 'kész' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {proc.status}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-gray-800">{proc.text}</p>
                {proc.status === 'open' && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleCloseProcess(proc.id, 'kész')}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                    >
                      Kész
                    </button>
                    <button
                      onClick={() => handleCloseProcess(proc.id, 'sikertelen')}
                      className="rounded-lg bg-gray-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-600"
                    >
                      Sikertelen
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </>
        )}

        {detailSubTab === 'projektek' && (
        <>
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setProjectFilter('osszes')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${projectFilter === 'osszes' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Összes
          </button>
          <button
            type="button"
            onClick={() => setProjectFilter('folyamatban')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${projectFilter === 'folyamatban' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Folyamatban lévő
          </button>
          <button
            type="button"
            onClick={() => setProjectFilter('lezárt')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${projectFilter === 'lezárt' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Lezárt
          </button>
        </div>

        <form onSubmit={handleAddProject} className="mb-6">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Projekt neve..."
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={addingProject}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-70"
            >
              {addingProject ? 'Hozzáadás...' : '+ Projekt'}
            </button>
          </div>
        </form>

        {loadingProjects ? (
          <p className="text-sm text-gray-500">Betöltés...</p>
        ) : filteredProjects.length === 0 ? (
          <p className="text-sm text-gray-500">Nincs projekt{projectFilter !== 'osszes' ? ' a szűrés alapján' : ''}.</p>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className={`rounded-xl border p-4 ${
                  proj.status === 'folyamatban' ? 'border-amber-200 bg-amber-50/50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-medium text-gray-900">{proj.name}</h4>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    proj.status === 'folyamatban' ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {proj.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{formatDate(proj.createdAt)}</p>
                <div className="mt-3 flex gap-2">
                  {proj.status === 'folyamatban' ? (
                    <button
                      onClick={() => handleProjectStatusChange(proj.id, 'lezárt')}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                    >
                      Lezárás
                    </button>
                  ) : (
                    <button
                      onClick={() => handleProjectStatusChange(proj.id, 'folyamatban')}
                      className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
                    >
                      Újranyitás
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </>
        )}

        {detailSubTab === 'ajanlatok' && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900">Ajánlatok</h3>
            <p className="mt-2 text-sm text-gray-500">Ez a menüpont szerkesztés alatt.</p>
          </div>
        )}

        {detailSubTab === 'uzenetek' && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900">Üzenetek</h3>
            <p className="mt-2 text-sm text-gray-500">Ez a menüpont szerkesztés alatt.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AddUserModal({ secret, onSuccess, onClose }: { secret: string; onSuccess: () => void; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('E-mail megadása kötelező.'); return; }
    if (password.length < 6) { setError('A jelszónak legalább 6 karakter hosszúnak kell lennie.'); return; }
    setSubmitting(true);
    try {
      const res = await apiFetch(secret, '/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, name: name.trim(), role }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Hiba történt');
      setEmail('');
      setPassword('');
      setName('');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba történt');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" onClick={onClose}>
      <form onSubmit={handleSubmit} className="my-8 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Új felhasználó</h3>
        <p className="mb-4 text-sm text-gray-500">A felhasználó ezzel az e-mail címmel és jelszóval tud majd belépni.</p>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">E-mail *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@pelda.hu"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Jelszó *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Legalább 6 karakter"
              required
              minLength={6}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Név</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Megjelenített név"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Jogosultság</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="user">Felhasználó</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-70"
          >
            {submitting ? 'Hozzáadás...' : 'Felhasználó hozzáadása'}
          </button>
          <button type="button" onClick={onClose} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Mégse
          </button>
        </div>
      </form>
    </div>
  );
}

function ProfileModal({ adminName, onSave, onClose }: { adminName: string; onSave: (name: string) => void; onClose: () => void }) {
  const [name, setName] = useState(adminName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6">
        <h3 className="mb-4 text-lg font-semibold">Profil beállítása</h3>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Név</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Admin"
          />
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={() => onSave(name)} className="rounded-xl bg-accent px-4 py-2 font-semibold text-white hover:bg-accent/90">
            Mentés
          </button>
          <button onClick={onClose} className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">
            Mégse
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusSettingsModal({ secret, statuses, onSave, onClose }: { secret: string; statuses: string[]; onSave: (s: string[]) => void; onClose: () => void }) {
  const [edited, setEdited] = useState<string[]>(statuses);
  const addStatus = () => setEdited([...edited, 'Új státusz']);
  const removeStatus = (i: number) => setEdited(edited.filter((_, idx) => idx !== i));
  const updateStatus = (i: number, v: string) => setEdited(edited.map((s, idx) => (idx === i ? v : s)));

  const handleSave = async () => {
    const filtered = edited.filter((s) => s.trim());
    if (filtered.length === 0) return;
    try {
      const res = await apiFetch(secret, '/api/settings/statuses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtered),
      });
      if (res.ok) onSave(await res.json());
    } catch {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6">
        <h3 className="mb-4 text-lg font-semibold">Státuszok beállítása</h3>
        <p className="mb-4 text-sm text-gray-600">Az első státusz kerül automatikusan az új (visszahívásból jött) ügyfelekre.</p>
        <div className="space-y-2">
          {edited.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={s} onChange={(e) => updateStatus(i, e.target.value)} className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm" />
              <button type="button" onClick={() => removeStatus(i)} className="rounded-lg px-2 text-red-600 hover:bg-red-50">×</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addStatus} className="mt-2 text-sm text-accent hover:underline">+ Státusz hozzáadása</button>
        <div className="mt-6 flex gap-3">
          <button onClick={handleSave} className="rounded-xl bg-accent px-4 py-2 font-semibold text-white hover:bg-accent/90">Mentés</button>
          <button onClick={onClose} className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">Mégse</button>
        </div>
      </div>
    </div>
  );
}
