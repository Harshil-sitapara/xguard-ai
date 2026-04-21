"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Zap, BarChart3, Lock, AlertCircle, TrendingUp, Activity, Cpu, Waves, GitBranch, Sparkles, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-xl"
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/brand/small.png"
                alt="XGuard-AI"
                width={32}
                height={32}
                className="w-full h-full"
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">XGuard AI</span>
          </div>
          <Link href="/dashboard" className="group inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105">
            Launch App
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-cyan-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950"></div>
        
        {/* Animated orbs - Enhanced */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-300/30 dark:bg-cyan-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-300/20 dark:bg-purple-500/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }}></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 animate-fade-in">
            {/* Badge with animation */}
            <div className="inline-block animate-slide-down" style={{ animationDelay: "0.1s" }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-200 dark:border-cyan-800/50 bg-cyan-50/80 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 text-sm font-medium backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                AI-Powered Security
              </span>
            </div>

            {/* Main Heading with staggered animation */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block text-neutral-900 dark:text-white mb-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>Intelligent Threat</span>
              <span className="block bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent animate-gradient-shift text-6xl sm:text-7xl lg:text-8xl" style={{ animationDelay: "0.3s" }}>Detection System</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: "0.4s" }}>
              Enterprise-grade real-time intrusion detection powered by advanced AI. Detect threats in microseconds with SHAP-explained decisions that security teams can trust.
            </p>

            {/* Stats - Enhanced */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8 animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <div className="px-4 py-3 rounded-lg bg-white/50 dark:bg-neutral-900/50 backdrop-blur border border-neutral-200 dark:border-neutral-800">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{"<1ms"}</div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Inference Time</p>
              </div>
              <div className="px-4 py-3 rounded-lg bg-white/50 dark:bg-neutral-900/50 backdrop-blur border border-neutral-200 dark:border-neutral-800">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">99.2%</div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Detection Rate</p>
              </div>
              <div className="px-4 py-3 rounded-lg bg-white/50 dark:bg-neutral-900/50 backdrop-blur border border-neutral-200 dark:border-neutral-800">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">3</div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">ML Models</p>
              </div>
            </div>

            {/* CTA Buttons - Enhanced */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <Link href="/dashboard" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  <Zap className="w-5 h-5 group-hover:animate-pulse" />
                  Launch Dashboard
                </span>
              </Link>
              <a href="#features" className="group inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all duration-300">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Learn More
              </a>
            </div>
          </div>

          {/* Hero Image - Enhanced */}
          <div className="mt-16 relative group animate-slide-up" style={{ animationDelay: "0.7s" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-2xl blur-3xl group-hover:blur-4xl transition-all duration-500 group-hover:from-cyan-500/40 group-hover:to-blue-500/40"></div>
            <div className="relative bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl p-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500 group-hover:border-cyan-500/50 dark:group-hover:border-cyan-500/50">
              <div className="bg-white dark:bg-neutral-950 rounded-xl p-8 min-h-96 flex items-center justify-center relative">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="text-center space-y-4 relative z-10">
                  <div className="flex justify-center mb-4">
                    <BarChart3 className="w-24 h-24 text-cyan-500 animate-bounce-slow group-hover:text-blue-500 transition-colors duration-500" />
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 font-medium">Real-time threat monitoring dashboard</p>
                  <p className="text-xs text-neutral-500">Click Launch Dashboard to explore live alerts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4 animate-fade-in">
              Enterprise-Grade Features
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-4 rounded-full animate-scale-in"></div>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Comprehensive threat detection tailored for modern security operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-neutral-800 rounded-xl p-8 border border-neutral-200 dark:border-neutral-700 hover:border-cyan-500 dark:hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  Lightning-Fast Detection
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Sub-millisecond inference latency processes 1M+ flows daily with zero performance degradation.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-neutral-800 rounded-xl p-8 border border-neutral-200 dark:border-neutral-700 hover:border-cyan-500 dark:hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Cpu className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  Multi-Model Ensemble
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  XGBoost, LSTM, and Random Forest work in tandem for maximum accuracy and reliability.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-neutral-800 rounded-xl p-8 border border-neutral-200 dark:border-neutral-700 hover:border-cyan-500 dark:hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  Explainable Alerts
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  SHAP-powered explanations reveal exactly why threats were detected with feature importance scores.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-neutral-800 rounded-xl p-8 border border-neutral-200 dark:border-neutral-700 hover:border-cyan-500 dark:hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  Real-Time Analytics
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Live dashboards with comprehensive threat intelligence, statistics, and attack pattern analysis.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-neutral-800 rounded-xl p-8 border border-neutral-200 dark:border-neutral-700 hover:border-cyan-500 dark:hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  Enterprise Security
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  API key authentication, encrypted transmission, and audit logs for compliance requirements.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-neutral-800 rounded-xl p-8 border border-neutral-200 dark:border-neutral-700 hover:border-cyan-500 dark:hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Waves className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  Kafka Integration
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Seamless streaming integration for continuous threat monitoring without infrastructure changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4 animate-fade-in">
              Built on Modern Technology
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-4 rounded-full animate-scale-in"></div>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Enterprise-grade infrastructure for reliability, performance, and scale
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {[
              { name: "FastAPI", emoji: "⚡", color: "from-amber-400 to-orange-500" },
              { name: "Next.js", emoji: "▲", color: "from-black to-gray-700" },
              { name: "PostgreSQL", emoji: "🐘", color: "from-blue-400 to-blue-600" },
              { name: "Kafka", emoji: "📨", color: "from-red-400 to-red-600" },
              { name: "XGBoost", emoji: "🎯", color: "from-emerald-400 to-emerald-600" },
              { name: "LSTM", emoji: "🧠", color: "from-purple-400 to-purple-600" },
              { name: "SHAP", emoji: "📊", color: "from-pink-400 to-rose-600" },
              { name: "Docker", emoji: "🐳", color: "from-blue-400 to-blue-600" },
            ].map((tech, idx) => (
              <div
                key={idx}
                className="group text-center p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-cyan-500 dark:hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 animate-fade-in-up bg-white dark:bg-neutral-800/50 backdrop-blur"
                style={{ animationDelay: `${0.05 * idx}s` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300 inline-block">
                  {tech.emoji}
                </div>
                <p className="font-semibold text-neutral-900 dark:text-white text-sm line-clamp-2">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-2xl blur-3xl opacity-50"></div>
            <div className="relative bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-12 sm:p-16 border border-neutral-200 dark:border-neutral-700 text-center overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl -z-0"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl -z-0"></div>
              
              <div className="relative z-10 animate-fade-in">
                <div className="flex justify-center mb-6">
                  <Shield className="w-12 h-12 text-cyan-500 animate-bounce-slow" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                  Protect Your Network Today
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                  Deploy XGuard AI in minutes. Get real-time threat intelligence with explainable AI that your security team can trust and act upon immediately.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard" className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105">
                    <Zap className="w-5 h-5 group-hover:animate-pulse" />
                    Get Started Now
                  </Link>
                  <a href="#features" className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all duration-300">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/brand/small.png"
                  alt="XGuard AI"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span className="font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">XGuard AI</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Enterprise-grade IDS powered by ML</p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="#features" className="hover:text-cyan-500 transition-colors">Features</a></li>
                <li><a href="/dashboard" className="hover:text-cyan-500 transition-colors">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Security</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="#" className="hover:text-cyan-500 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-cyan-500 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="#" className="hover:text-cyan-500 transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-cyan-500 transition-colors">Documentation</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                © 2024 XGuard AI. Advanced Intrusion Detection System powered by Machine Learning.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 md:mt-0 text-sm text-neutral-500 dark:text-neutral-500">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Enterprise Security Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scaleX(0);
            opacity: 0;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slide-down {
          animation: slideDown 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
          transform-origin: center;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }

        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.5);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.8);
        }
      `}</style>
    </>
  );
}
