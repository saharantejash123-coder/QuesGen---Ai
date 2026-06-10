import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Database, Lock, UserCheck, Globe, Mail } from 'lucide-react';

const sections = [
  {
    icon: Eye,
    title: '1. Information We Collect',
    content: [
      {
        subtitle: 'Personal Information',
        text: 'When you register for a QuesGen account, we collect information such as your full name, email address, phone number, school name, registration number, role (student, teacher, or school administrator), and subject specialization where applicable.',
      },
      {
        subtitle: 'Usage Data',
        text: 'We automatically collect information about how you interact with our platform, including pages visited, features used, assessment data, generated content, timestamps, IP addresses, browser type, and device information.',
      },
      {
        subtitle: 'AI-Generated Content',
        text: 'We store question papers, assessments, and other educational content generated through our AI tools on your behalf. This content is associated with your account for retrieval and management purposes.',
      },
    ],
  },
  {
    icon: Database,
    title: '2. How We Use Your Information',
    content: [
      {
        text: 'We use the information we collect for the following purposes:',
      },
      {
        text: '• To create and manage your account and provide access to our platform.\n• To generate AI-powered educational content tailored to your needs.\n• To improve and personalize your experience on QuesGen.\n• To communicate with you about your account, updates, and new features.\n• To analyze usage patterns and improve our services and AI models.\n• To ensure the security and integrity of our platform.\n• To comply with legal obligations and enforce our terms.',
      },
    ],
  },
  {
    icon: Lock,
    title: '3. Data Security',
    content: [
      {
        text: 'We implement industry-standard security measures to protect your personal information, including encryption of data in transit (TLS/SSL) and at rest, secure authentication mechanisms, regular security audits, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.',
      },
    ],
  },
  {
    icon: UserCheck,
    title: '4. Data Sharing & Third Parties',
    content: [
      {
        text: 'We do not sell your personal information to third parties. We may share your information in the following limited circumstances:',
      },
      {
        text: '• With service providers who assist us in operating our platform (e.g., cloud hosting, analytics).\n• With your school or institution if you are registered under their account.\n• When required by law, regulation, or legal process.\n• To protect the rights, property, or safety of QuesGen, our users, or the public.\n• With your explicit consent.',
      },
    ],
  },
  {
    icon: Globe,
    title: '5. Cookies & Tracking',
    content: [
      {
        text: 'QuesGen uses cookies and similar tracking technologies to maintain your session, remember your preferences, and analyze platform usage. You can control cookie settings through your browser, but disabling cookies may affect your experience on our platform.',
      },
    ],
  },
  {
    icon: Shield,
    title: '6. Your Rights',
    content: [
      {
        text: 'Depending on your location, you may have the following rights regarding your personal data:',
      },
      {
        text: '• Access: Request a copy of the personal data we hold about you.\n• Correction: Request correction of inaccurate or incomplete data.\n• Deletion: Request deletion of your personal data, subject to legal obligations.\n• Portability: Request a copy of your data in a structured, machine-readable format.\n• Objection: Object to the processing of your data for certain purposes.\n• Withdrawal of Consent: Withdraw consent at any time where processing is based on consent.',
      },
    ],
  },
  {
    icon: UserCheck,
    title: "7. Children's Privacy",
    content: [
      {
        text: 'QuesGen is designed for use in educational settings and may be used by students under the age of 18. We collect only the minimum information necessary for account creation and platform functionality. If you are a parent or guardian and believe your child has provided us with personal information without your consent, please contact us immediately.',
      },
    ],
  },
  {
    icon: Mail,
    title: '8. Changes to This Policy',
    content: [
      {
        text: 'We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our platform and updating the "Last Updated" date. Your continued use of QuesGen after any changes constitutes your acceptance of the updated policy.',
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#000000]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Login
          </Link>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-3.5 h-3.5 bg-black rounded-sm" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">QuesGen</span>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.03] to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
            <Shield className="w-3.5 h-3.5" />
            Your Data, Your Rights
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            We are committed to protecting your privacy. This policy explains how QuesGen
            collects, uses, and safeguards your personal information.
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            Last Updated: June 5, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="space-y-6">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <div
                key={i}
                className="bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-6 sm:p-8 relative overflow-hidden group hover:border-white/[0.1] transition-colors"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/15 transition-colors">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-white mb-4">
                      {section.title}
                    </h2>
                    <div className="space-y-4">
                      {section.content.map((block, j) => (
                        <div key={j}>
                          {block.subtitle && (
                            <h3 className="text-sm font-semibold text-zinc-300 mb-1.5">
                              {block.subtitle}
                            </h3>
                          )}
                          <p className="text-sm leading-relaxed text-zinc-400 whitespace-pre-line">
                            {block.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-[#0a0a0a] rounded-2xl border border-white/[0.06] p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <Mail className="w-8 h-8 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Questions About Your Privacy?
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto mb-4">
            If you have any questions or concerns about this Privacy Policy or our data
            practices, please don't hesitate to reach out.
          </p>
          <a
            href="mailto:privacy@quesgen.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all"
          >
            <Mail className="w-4 h-4" />
            privacy@quesgen.com
          </a>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-zinc-500">
          <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
            Terms & Conditions
          </Link>
          <span className="hidden sm:inline">•</span>
          <Link to="/login" className="text-zinc-400 hover:text-white transition-colors">
            Back to Login
          </Link>
          <span className="hidden sm:inline">•</span>
          <Link to="/register" className="text-zinc-400 hover:text-white transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
