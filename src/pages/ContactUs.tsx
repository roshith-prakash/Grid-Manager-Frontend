import { useEffect } from "react";
import {
  Mail,
  Github,
  MessageCircle,
  Users,
  Clock,
  MapPin,
} from "lucide-react";

const Contact = () => {
  useEffect(() => {
    document.title = "Contact Us | Grid Manager";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Support",
      description:
        "Get in touch with our support team for any questions or issues",
      action: "Send Email",
      href: "mailto:roshithprakash07@gmail.com",
      color: "slate",
      details: "We typically respond within 24 hours",
    },
    {
      icon: <Github className="w-8 h-8" />,
      title: "GitHub Repository",
      description:
        "Report bugs, request features, or contribute to the project",
      action: "View on GitHub",
      href: "https://github.com/roshith-prakash/grid-manager-frontend",
      color: "slate",
      details: "Open source and community driven",
    },
  ];

  const supportInfo = [
    {
      icon: <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />,
      title: "Response Time",
      description:
        "We aim to respond to all inquiries within 24 hours during business days.",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Community Support",
      description:
        "Join our community discussions on GitHub for peer-to-peer help.",
    },
    {
      icon: (
        <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
      ),
      title: "Feature Requests",
      description:
        " We'd love to hear your suggestions for improving Grid Manager.",
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-cta/10 dark:bg-cta/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-cta dark:cta" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have questions, feedback, or need support? We're here to help make
            your Grid Manager experience amazing.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 p-8 hover:shadow-xl transition-all group"
            >
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                  method.color === "blue"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {method.icon}
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {method.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {method.description}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
                {method.details}
              </p>

              <a
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  method.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  method.color === "blue"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-600 hover:bg-slate-700 text-white"
                }`}
              >
                {method.action}
                {method.href.startsWith("http") && (
                  <span className="text-sm">↗</span>
                )}
              </a>
            </div>
          ))}
        </div>

        {/* Support Information */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Support Information
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Here's what you can expect when reaching out to us
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {supportInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center"
              >
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {info.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-cta/5 dark:bg-cta/20 rounded-2xl border border-cta/5 dark:border-cta/20 p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Looking for Quick Answers?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Check out our FAQ section for answers to common questions about
              Grid Manager.
            </p>
            <a
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cta hover:bg-hovercta text-white font-semibold rounded-lg transition-colors"
            >
              Visit FAQ
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 p-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              <span className="text-slate-700 dark:text-slate-200 font-medium">
                Grid Manager Team
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              Built by F1 fans, for F1 fans. We're passionate about creating the
              best fantasy racing experience possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
