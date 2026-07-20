import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import useInView from '../hooks/useInView';
import Reveal from './Reveal';

// No backend wired up yet — submit handler is a local stub. Replace with a
// real endpoint (or CRM/webhook) before launch.
export default function LeadForm({ compact = false, id = 'lead-form' }) {
  const { isRu } = useLanguage();
  const [form, setForm] = useState({ name: '', phone: '', time: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formRef, formInView] = useInView(0.15);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError(isRu ? 'Укажите имя и телефон.' : 'Please provide your name and phone number.');
      return;
    }
    setError('');
    // Stub: no real backend. In production this would POST to a CRM/webhook.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id={id} className={compact ? 'py-16 bg-baden-base' : 'relative bg-baden-panel py-24 md:py-32'}>
        {!compact && (
          <div
            className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-baden-base to-transparent"
            aria-hidden
          />
        )}
        <div className="max-w-xl mx-auto px-6 md:px-10 text-center animate-[fadein_500ms_ease_both]">
          <p className="font-display text-2xl md:text-3xl text-baden-gold-bright mb-3">
            {isRu ? 'Спасибо!' : 'Thank you!'}
          </p>
          <p className="text-baden-muted">
            {isRu
              ? 'Мы получили ваш запрос и свяжемся с вами в ближайшее время.'
              : "We've received your request and will be in touch shortly."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className={compact ? 'py-16 bg-baden-base' : 'relative bg-baden-panel py-24 md:py-32'}>
      {!compact && (
        <div
          className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-baden-base to-transparent"
          aria-hidden
        />
      )}
      <div className="max-w-xl mx-auto px-6 md:px-10">
        {!compact && (
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl text-baden-cream mb-3">
              {isRu
                ? 'Узнайте, подходит ли вам эта резиденция'
                : 'Find out if this residence is right for you.'}
            </h2>
            <p className="text-baden-muted mb-10">
              {isRu
                ? 'Оставьте контакт — мы подберём вариант и свяжемся с вами для короткого разговора.'
                : "Leave your contact — we'll find the right option and reach out for a short conversation."}
            </p>
          </Reveal>
        )}
        {compact && (
          <h3 className="font-display text-xl md:text-2xl text-baden-cream mb-6">
            {isRu ? 'Получить консультацию по этой резиденции' : 'Get a consultation on this residence'}
          </h3>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div
            className={formInView ? '' : 'opacity-0'}
            style={{
              animation: formInView ? 'rise 600ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both' : 'none',
            }}
          >
            <label htmlFor={`${id}-name`} className="block text-xs tracking-widest2 uppercase text-baden-gold mb-2">
              {isRu ? 'Имя' : 'Name'}
            </label>
            <input
              id={`${id}-name`}
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              className="w-full bg-transparent border-b border-baden-muted/40 focus:border-baden-gold outline-none py-2 text-baden-cream placeholder:text-baden-muted/50 transition-colors duration-200"
              placeholder={isRu ? 'Ваше имя' : 'Your name'}
            />
          </div>

          <div
            className={formInView ? '' : 'opacity-0'}
            style={{
              animation: formInView ? 'rise 600ms cubic-bezier(0.22, 1, 0.36, 1) 170ms both' : 'none',
            }}
          >
            <label htmlFor={`${id}-phone`} className="block text-xs tracking-widest2 uppercase text-baden-gold mb-2">
              {isRu ? 'Телефон / WhatsApp' : 'Phone / WhatsApp'}
            </label>
            <input
              id={`${id}-phone`}
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              className="w-full bg-transparent border-b border-baden-muted/40 focus:border-baden-gold outline-none py-2 text-baden-cream placeholder:text-baden-muted/50 transition-colors duration-200"
              placeholder="+7 900 000 00 00"
            />
          </div>

          <div
            className={formInView ? '' : 'opacity-0'}
            style={{
              animation: formInView ? 'rise 600ms cubic-bezier(0.22, 1, 0.36, 1) 260ms both' : 'none',
            }}
          >
            <label htmlFor={`${id}-time`} className="block text-xs tracking-widest2 uppercase text-baden-gold mb-2">
              {isRu ? 'Удобное время звонка (необязательно)' : 'Preferred callback time (optional)'}
            </label>
            <input
              id={`${id}-time`}
              type="text"
              value={form.time}
              onChange={handleChange('time')}
              className="w-full bg-transparent border-b border-baden-muted/40 focus:border-baden-gold outline-none py-2 text-baden-cream placeholder:text-baden-muted/50 transition-colors duration-200"
              placeholder={isRu ? 'Например, вечером по будням' : 'e.g. weekday evenings'}
            />
          </div>

          {error && <p className="text-sm text-baden-gold-bright">{error}</p>}

          <button
            type="submit"
            className={`mt-2 self-start text-sm md:text-base tracking-wide text-baden-gold bg-transparent px-7 py-3 border border-baden-gold hover:bg-baden-gold hover:text-baden-base transition-colors duration-200 ${
              formInView ? '' : 'opacity-0'
            }`}
            style={{
              animation: formInView ? 'rise 600ms cubic-bezier(0.22, 1, 0.36, 1) 350ms both' : 'none',
            }}
          >
            {isRu ? 'Получить консультацию' : 'Get a consultation'}
          </button>
        </form>
      </div>
    </section>
  );
}
