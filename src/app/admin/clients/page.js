'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Plus, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Tag, 
  PlayCircle, 
  ArrowUpRight, 
  CheckCircle2, 
  X,
  Search
} from 'lucide-react';

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    websiteUrl: '',
    businessType: 'Dental Clinic',
    city: 'Pune',
    state: 'Maharashtra',
    targetKeyword: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.websiteUrl) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({
          name: '',
          contactPerson: '',
          email: '',
          phone: '',
          websiteUrl: '',
          businessType: 'Dental Clinic',
          city: 'Pune',
          state: 'Maharashtra',
          targetKeyword: ''
        });
        setSuccessMessage('Client successfully registered!');
        setTimeout(() => setSuccessMessage(''), 4000);
        fetchClients();
      }
    } catch (err) {
      console.error('Error creating client:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.businessType.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.websiteUrl.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Client Directory</h1>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full">
              {clients.length} Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage business locations, audit schedules, target keywords, and automated WhatsApp recipients.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Client
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMessage}
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, website, business sector, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-transparent border-0 focus:ring-0 text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{client.name}</h2>
                  <span className="inline-block text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded mt-1">
                    {client.businessType}
                  </span>
                </div>
                {client.latestScore ? (
                  <div className="text-right">
                    <span className="text-base font-extrabold text-teal-700">{client.latestScore}</span>
                    <span className="text-[10px] text-slate-400">/100</span>
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">SEO Score</div>
                  </div>
                ) : (
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded">
                    No Audit
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <a href={client.websiteUrl} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline truncate">
                    {client.websiteUrl}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{client.city}, {client.state}, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="font-mono text-[11px] text-slate-700 truncate">
                    &ldquo;{client.targetKeyword || 'local search'}&rdquo;
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{client.phone} (WhatsApp ready)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <Link
                href={`/client?clientId=${client.id}`}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
              >
                Client View <ArrowUpRight className="w-3 h-3" />
              </Link>
              <Link
                href={`/admin/audits/new?clientId=${client.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 text-xs font-semibold transition-colors"
              >
                <PlayCircle className="w-3.5 h-3.5 text-teal-600" />
                Run Audit
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900">Add New Business Account</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure client target URL, local market, and target keywords for automated crawls.
            </p>

            <form onSubmit={handleAddClient} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Business / Clinic Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Pune Orthodontics Center"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Website URL *</label>
                <input
                  type="url"
                  name="websiteUrl"
                  required
                  placeholder="https://example-dental-clinic.com"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Business Sector</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="Dental Clinic">Dental Clinic</option>
                    <option value="Healthcare & Hospital">Healthcare & Hospital</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Legal & Financial">Legal & Financial</option>
                    <option value="Local Service">Local Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Target Keyword</label>
                  <input
                    type="text"
                    name="targetKeyword"
                    placeholder="e.g. dental clinic pune"
                    value={formData.targetKeyword}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Contact Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="doctor@clinic.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">WhatsApp Phone</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91 98200 12345"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Register Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
