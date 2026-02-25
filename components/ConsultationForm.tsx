'use client';

import { useState } from 'react';
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateGdpr,
  type FormErrors,
} from '@/lib/form-validation';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

type FormData = {
  clientType: 'maganszemely' | 'ceges';
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  message: string;
  gdpr: boolean;
  subscribeConsent: boolean;
  // Céges mezők
  companyName: string;
  address: string;
  taxNumber: string;
  contactLastName: string;
  contactFirstName: string;
  contactPhone: string;
  contactEmail: string;
};

const initialFormData: FormData = {
  clientType: 'maganszemely',
  lastName: '',
  firstName: '',
  phone: '',
  email: '',
  message: '',
  gdpr: false,
  subscribeConsent: true,
  companyName: '',
  address: '',
  taxNumber: '',
  contactLastName: '',
  contactFirstName: '',
  contactPhone: '',
  contactEmail: '',
};

export function ConsultationForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.clientType === 'maganszemely') {
      const lastNameErr = validateRequired(formData.lastName, 'A vezetéknév');
      if (lastNameErr) newErrors.lastName = lastNameErr;
      const firstNameErr = validateRequired(formData.firstName, 'A keresztnév');
      if (firstNameErr) newErrors.firstName = firstNameErr;
      const phoneErr = validatePhone(formData.phone);
      if (phoneErr) newErrors.phone = phoneErr;
      const emailErr = validateEmail(formData.email);
      if (emailErr) newErrors.email = emailErr;
    } else {
      const companyErr = validateRequired(formData.companyName, 'A cég neve');
      if (companyErr) newErrors.companyName = companyErr;
      const contactLastNameErr = validateRequired(formData.contactLastName, 'A kapcsolattartó vezetékneve');
      if (contactLastNameErr) newErrors.contactLastName = contactLastNameErr;
      const contactFirstNameErr = validateRequired(formData.contactFirstName, 'A kapcsolattartó keresztneve');
      if (contactFirstNameErr) newErrors.contactFirstName = contactFirstNameErr;
      const contactPhoneErr = validatePhone(formData.contactPhone);
      if (contactPhoneErr) newErrors.contactPhone = contactPhoneErr;
      const contactEmailErr = validateEmail(formData.contactEmail);
      if (contactEmailErr) newErrors.contactEmail = contactEmailErr;
    }

    const gdprErr = validateGdpr(formData.gdpr);
    if (gdprErr) newErrors.gdpr = gdprErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    trackEvent(ANALYTICS_EVENTS.FORM_SUBMIT, { form_id: 'consultation' });

    try {
      const res = await fetch('/api/callback-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientType: formData.clientType,
          lastName: formData.lastName,
          firstName: formData.firstName,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          subscribeConsent: formData.subscribeConsent,
          companyName: formData.companyName,
          address: formData.address,
          taxNumber: formData.taxNumber,
          contactLastName: formData.contactLastName,
          contactFirstName: formData.contactFirstName,
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Sikertelen küldés');
      }

      setIsSuccess(true);
      setFormData(initialFormData);
      setErrors({});
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : 'Hiba történt, próbáld újra.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl bg-card p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
          <svg
            className="h-8 w-8 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-text">
          Köszönjük! Hamarosan hívunk.
        </h3>
        <p className="text-muted text-sm">
          Pár órán belül visszahívunk.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl bg-card p-6 shadow-xl md:p-8"
    >
      <div>
        <span className="mb-2 block text-sm font-medium text-text">Típus</span>
        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="clientType"
              value="maganszemely"
              checked={formData.clientType === 'maganszemely'}
              onChange={(e) => setFormData((p) => ({ ...p, clientType: 'maganszemely' }))}
              className="h-4 w-4 border-gray-200 text-accent focus:ring-accent/50"
            />
            <span className="text-sm text-text">Magánszemély</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="clientType"
              value="ceges"
              checked={formData.clientType === 'ceges'}
              onChange={(e) => setFormData((p) => ({ ...p, clientType: 'ceges' }))}
              className="h-4 w-4 border-gray-200 text-accent focus:ring-accent/50"
            />
            <span className="text-sm text-text">Cég</span>
          </label>
        </div>
      </div>

      {formData.clientType === 'maganszemely' ? (
        <>
        <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="lastName"
            className="mb-2 block text-sm font-medium text-text"
          >
            Vezetéknév <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Pl. Kiss"
            className={`w-full rounded-xl border bg-white px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 ${
              errors.lastName
                ? 'border-red-500 focus:ring-red-500/50'
                : 'border-gray-200 focus:ring-accent/50'
            }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="firstName"
            className="mb-2 block text-sm font-medium text-text"
          >
            Keresztnév <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Pl. János"
            className={`w-full rounded-xl border bg-white px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 ${
              errors.firstName
                ? 'border-red-500 focus:ring-red-500/50'
                : 'border-gray-200 focus:ring-accent/50'
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-text">
          Telefonszám <span className="text-accent">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="06 30 123 4567"
          className={`w-full rounded-xl border bg-white px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-accent/50'}`}
        />
        {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-text">
          Email <span className="text-accent">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@pelda.hu"
          className={`w-full rounded-xl border bg-white px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-accent/50'}`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
      </div>
      </>
        ) : (
        <>
          <div>
            <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-text">
              Cég neve <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Pl. Precisolit Kft."
              className={`w-full rounded-xl border bg-white px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 ${errors.companyName ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-accent/50'}`}
            />
            {errors.companyName && <p className="mt-1 text-sm text-red-400">{errors.companyName}</p>}
          </div>
          <div className="rounded-lg bg-gray-50 p-2 text-sm font-medium text-text">Kapcsolattartó</div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contactLastName" className="mb-2 block text-sm font-medium text-text">
                Vezetéknév <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                id="contactLastName"
                name="contactLastName"
                value={formData.contactLastName}
                onChange={handleChange}
                placeholder="Pl. Kiss"
                className={`w-full rounded-xl border bg-white px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 ${errors.contactLastName ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-accent/50'}`}
              />
              {errors.contactLastName && <p className="mt-1 text-sm text-red-400">{errors.contactLastName}</p>}
            </div>
            <div>
              <label htmlFor="contactFirstName" className="mb-2 block text-sm font-medium text-text">
                Keresztnév <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                id="contactFirstName"
                name="contactFirstName"
                value={formData.contactFirstName}
                onChange={handleChange}
                placeholder="Pl. János"
                className={`w-full rounded-xl border bg-white px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 ${errors.contactFirstName ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-accent/50'}`}
              />
              {errors.contactFirstName && <p className="mt-1 text-sm text-red-400">{errors.contactFirstName}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="contactPhone" className="mb-2 block text-sm font-medium text-text">
              Telefonszám <span className="text-accent">*</span>
            </label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="06 30 123 4567"
              className={`w-full rounded-xl border bg-white px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 ${errors.contactPhone ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-accent/50'}`}
            />
            {errors.contactPhone && <p className="mt-1 text-sm text-red-400">{errors.contactPhone}</p>}
          </div>
          <div>
            <label htmlFor="contactEmail" className="mb-2 block text-sm font-medium text-text">
              Email cím <span className="text-accent">*</span>
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="kapcsolat@ceg.hu"
              className={`w-full rounded-xl border bg-white px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 ${errors.contactEmail ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-accent/50'}`}
            />
            {errors.contactEmail && <p className="mt-1 text-sm text-red-400">{errors.contactEmail}</p>}
          </div>
        </>
      )}

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-text"
        >
          Üzenet <span className="text-muted">(opcionális)</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder="Írd le röviden, miben segíthetünk..."
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="gdpr"
            checked={formData.gdpr}
            onChange={handleChange}
            className="mt-1 h-5 w-5 rounded border-gray-200 bg-white text-accent focus:ring-accent/50"
          />
          <span className="text-sm text-text">
            Elfogadom az{' '}
            <a
              href="#"
              className="text-accent underline hover:text-accent/80"
              onClick={(e) => e.preventDefault()}
            >
              adatkezelési tájékoztatót
            </a>
            . <span className="text-accent">*</span>
          </span>
        </label>
        {errors.gdpr && (
          <p className="mt-1 text-sm text-red-400">{errors.gdpr}</p>
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="subscribeConsent"
            checked={formData.subscribeConsent}
            onChange={handleChange}
            className="mt-1 h-5 w-5 rounded border-gray-200 bg-white text-accent focus:ring-accent/50"
          />
          <span className="text-sm text-text">
            Hozzájárulok, hogy a Precisolit értesítsen híreiről és ajánlatairól.
          </span>
        </label>
        <p className="mt-1 text-xs text-muted">Alapértelmezetten be van jelölve; kikapcsolhatod, ha nem szeretnéd.</p>
      </div>

      {errors.submit && (
        <p className="text-sm text-red-400">{errors.submit}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-accent py-4 text-lg font-semibold text-white transition-colors hover:bg-accent/90 active:bg-accent/80 disabled:opacity-70"
      >
        {isSubmitting ? 'Küldés...' : 'Visszahívást kérek'}
      </button>
    </form>
  );
}
