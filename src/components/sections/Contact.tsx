import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import { Github, Linkedin, MapPin, Send, Loader2, Mail } from 'lucide-react';
import { SocialLink } from '../../types';

const socialLinks: SocialLink[] = [
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/rauffatali',
    icon: 'linkedin'
  },
  {
    platform: 'GitHub',
    url: 'https://github.com/rauffatali',
    icon: 'github'
  },
  {
    platform: 'X',
    url: 'https://x.com/raufatali',
    icon: 'twitter'
  }
];

// Helper to render lucide icons based on string
const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
  switch (iconName.toLowerCase()) {
    case 'github': return <Github className={className} />;
    case 'linkedin': return <Linkedin className={className} />;
    case 'twitter': return (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    );
    default: return <Mail className={className} />;
  }
};

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });


  const sendEmail = async (recaptchaToken: string = '') => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

    if (!serviceId || !templateId || !publicKey) {
      toast.error('Email service is not configured yet. Please try again later.');
      console.error('Missing environment variables.');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Sending your message...');

    try {
      const templateParams = {
        user_name: formData.name,
        user_email: formData.email,
        message: formData.message,
        time: new Date().toLocaleString(),
        ...(recaptchaToken && { 'g-recaptcha-response': recaptchaToken }),
      };

      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        {
          publicKey: publicKey,
          limitRate: {
            id: 'contact_form',
            throttle: 10000,
          }
        }
      );

      toast.success('Message sent successfully! I will get back to you soon.', {
        id: loadingToast,
        duration: 5000,
      });

      // Reset form and reCAPTCHA
      setFormData({ name: '', email: '', message: '' });
      if (formRef.current) formRef.current.reset();
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setShowCaptcha(false);

    } catch (error) {
      console.error('EmailJS Error:', error);
      toast.error('Failed to send message. Please try again or contact me directly via social media.', {
        id: loadingToast,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

    // If reCAPTCHA is configured, show it instead of submitting immediately
    if (recaptchaSiteKey && !showCaptcha) {
      setShowCaptcha(true);
      return;
    }

    // If it's already shown, they clicked submit without checking the box
    if (recaptchaSiteKey && showCaptcha) {
      const recaptchaValue = recaptchaRef.current?.getValue();
      if (!recaptchaValue) {
        toast.error('Please complete the reCAPTCHA verification.');
        return;
      }
      await sendEmail(recaptchaValue);
      return;
    }

    // Fallback if no captcha is configured in env
    await sendEmail();
  };

  return (
    <section id="contact" className="py-24 theme-bg-surface relative overflow-hidden">
      {/* Toast Container for notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-light)',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent)',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full theme-bg-accent opacity-10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full theme-bg-accent opacity-10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold theme-text-primary mb-4">
            Let's <span className="theme-accent-text">Connect</span>
          </h2>
          <p className="text-lg theme-text-secondary max-w-2xl mx-auto leading-relaxed">
            Have a question, a project proposal, or just want to collaborate on AI and computer vision? I'm always open to discussing new opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* Form Column (Takes up 3/5 on large screens) */}
          <div className="lg:col-span-3 theme-bg-elevated p-8 md:p-10 rounded-2xl backdrop-blur-md border shadow-xl transition-all duration-300 hover:shadow-2xl" style={{ borderColor: 'var(--border-color)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}>
            <h3 className="text-2xl font-bold theme-text-primary mb-8 flex items-center">
              <Mail className="w-6 h-6 mr-3 theme-accent-text" />
              Send me a message
            </h3>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="group">
                <label htmlFor="user_name" className="block text-sm font-medium theme-text-secondary mb-2 transition-colors group-focus-within:theme-accent-text">
                  Your Name
                </label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg theme-bg-main border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                />
              </div>

              <div className="group">
                <label htmlFor="user_email" className="block text-sm font-medium theme-text-secondary mb-2 transition-colors group-focus-within:theme-accent-text">
                  Email Address
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg theme-bg-main border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                />
              </div>

              <div className="group">
                <label htmlFor="message" className="block text-sm font-medium theme-text-secondary mb-2 transition-colors group-focus-within:theme-accent-text">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="How can I help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg theme-bg-main border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 resize-y min-h-[120px]"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                />
              </div>

              <div>
                {import.meta.env.VITE_RECAPTCHA_SITE_KEY && (
                  <div className={`transition-all duration-300 overflow-hidden flex justify-start ${showCaptcha ? 'max-h-32 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      theme="dark"
                      onChange={(val) => {
                        if (val) sendEmail(val);
                      }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="hero-btn-primary w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold flex items-center justify-center transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:shadow-xl"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--text-on-accent, #ffffff)',
                    border: '1px solid transparent'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Connect Column (Takes up 2/5 on large screens) */}
          <div className="lg:col-span-2 flex flex-col space-y-8">
            {/* Bento-style Social Card */}
            <div className="theme-bg-elevated p-8 rounded-2xl backdrop-blur-md border shadow-lg" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-xl font-bold theme-text-primary mb-6">Connect Digitally</h3>
              <div className="flex flex-col space-y-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 rounded-xl border border-transparent hover:border-current transition-all duration-300 group"
                    style={{
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-secondary)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    <div className="p-2 rounded-lg theme-bg-elevated mr-4 transition-transform group-hover:scale-110">
                      {renderIcon(link.icon || 'mail')}
                    </div>
                    <span className="font-medium flex-1">{link.platform}</span>
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Location Card */}
            <div className="theme-bg-elevated p-10 rounded-2xl backdrop-blur-md border shadow-lg" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl mr-4" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold theme-text-primary">Location</h3>
              </div>
              <p className="theme-text-secondary leading-relaxed">
                Currently based in Baku, Azerbaijan.
                <br />
                <span className="inline-block mt-2 font-medium" style={{ color: 'var(--accent)' }}>
                  Available for remote work worldwide.
                </span>
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact; 