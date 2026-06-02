import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPaperPlane
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      titleKey: "footer.aboutUs.title",
      links: [
        { key: "footer.aboutUs.ourStory", href: "#" },
        { key: "footer.aboutUs.team", href: "#" },
        { key: "footer.aboutUs.careers", href: "#" },
        { key: "footer.aboutUs.press", href: "#" }
      ]
    },
    {
      titleKey: "footer.support.title",
      links: [
        { key: "footer.support.faqs", href: "#" },
        { key: "footer.support.contact", href: "#" },
        { key: "footer.support.privacyPolicy", href: "#" },
        { key: "footer.support.terms", href: "#" }
      ]
    },
    {
      titleKey: "footer.resources.title",
      links: [
        { key: "footer.resources.blog", href: "#" },
        { key: "footer.resources.guides", href: "#" },
        { key: "footer.resources.webinars", href: "#" },
        { key: "footer.resources.helpCenter", href: "#" }
      ]
    }
  ];

  return (
    <footer className="bg-white border-t border-slate-100 text-slate-900">
      <div className="container mx-auto px-10 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-10 bg-cyan-600 shadow-sm" />
              <span className="text-cyan-700 font-black uppercase tracking-[0.4em] text-[10px]">Command Center</span>
            </div>
            <motion.h2
              className="text-4xl font-black text-slate-950 tracking-tighter uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              VOYAGER<span className="text-cyan-600">.</span>
            </motion.h2>
            <p className="text-slate-500 font-bold italic leading-relaxed text-lg">"{t("footer.tagline")}"</p>

            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-4 text-slate-600 hover:text-cyan-600 transition-colors group cursor-pointer">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-cyan-50 transition-colors">
                  <FaPhone className="text-cyan-600" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">{t("footer.phone")}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-600 hover:text-cyan-600 transition-colors group cursor-pointer">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-cyan-50 transition-colors">
                  <FaEnvelope className="text-cyan-600" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">{t("footer.email")}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-600 hover:text-cyan-600 transition-colors group cursor-pointer">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-cyan-50 transition-colors">
                  <FaMapMarkerAlt className="text-cyan-600" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest leading-tight">{t("footer.address")}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          {footerLinks.map((section, index) => (
            <div key={section.titleKey} className="space-y-8">
              <motion.h3
                className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {t(section.titleKey)}
              </motion.h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + linkIndex * 0.05 }}
                  >
                    <a
                      href={link.href}
                      className="text-slate-600 hover:text-cyan-600 transition-all flex items-center gap-3 text-sm font-black uppercase tracking-tight group"
                    >
                      <div className="w-1.5 h-1.5 bg-slate-100 rounded-full group-hover:bg-cyan-500 transition-all duration-300"></div>
                      {t(link.key)}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="space-y-8">
            <motion.h3
              className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {t("footer.newsletter.title")}
            </motion.h3>
            <p className="text-slate-500 font-bold italic leading-relaxed text-sm">Join the global elite broadcast network.</p>

            <motion.div
              className="mt-4 relative group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <input
                type="email"
                placeholder="INPUT FREQUENCY..."
                className="w-full p-6 pr-16 rounded-[2rem] bg-slate-50 border border-slate-100 text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500/30 transition-all outline-none font-bold text-sm shadow-inner"
              />
              <button
                className="absolute right-3 top-3 bg-slate-900 text-white p-3 pr-4 pl-4 rounded-2xl hover:bg-cyan-600 transition-all shadow-lg active:scale-95"
                aria-label={t("footer.newsletter.subscribeButton")}
              >
                <FaPaperPlane className="w-3 h-3" />
              </button>
            </motion.div>

            <div className="flex gap-4 mt-10">
              {[
                { icon: FaFacebook, color: "hover:bg-blue-600", label: "Facebook" },
                { icon: FaTwitter, color: "hover:bg-blue-400", label: "Twitter" },
                { icon: FaInstagram, color: "hover:bg-pink-600", label: "Instagram" },
                { icon: FaLinkedin, color: "hover:bg-blue-700", label: "LinkedIn" },
                { icon: FaYoutube, color: "hover:bg-red-600", label: "YouTube" }
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className={`p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-white transition-all hover:scale-110 shadow-sm border border-slate-50 ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <motion.div
          className="border-t border-slate-100 mt-20"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1 }}
        ></motion.div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t("footer.copyright", { year: currentYear })} | SECURE OPERATIONAL GRID
          </motion.p>
          <motion.div
            className="flex gap-8 mt-6 md:mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <a href="#" className="hover:text-cyan-600 transition-colors uppercase">{t("footer.privacyPolicyLink")}</a>
            <a href="#" className="hover:text-cyan-600 transition-colors uppercase">{t("footer.termsOfServiceLink")}</a>
            <a href="#" className="hover:text-cyan-600 transition-colors uppercase">Security Protocols</a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;