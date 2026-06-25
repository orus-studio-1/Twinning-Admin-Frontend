import React from "react";
import { 
  Video, 
  Globe, 
  ShieldCheck, 
  Coins, 
  Smartphone, 
  Users, 
  ArrowRight, 
  Flame, 
  Star,
  CheckCircle,
  TrendingUp
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Ambient Orbs */}
      <div className="absolute top-20 -left-40 w-96 h-96 rounded-full bg-[#fa48ab]/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] -right-40 w-[450px] h-[450px] rounded-full bg-[#fa48ab]/8 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-[20%] w-80 h-80 rounded-full bg-[#fa48ab]/5 blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fa48ab]/10 border border-[#fa48ab]/15 text-[#fa48ab] text-xs font-semibold tracking-wide uppercase mx-auto lg:mx-0">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              Next-Gen Global Connecting App
            </div>

            {/* Headline */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-white">
              Connect Globally.<br />
              <span className="bg-gradient-to-r from-[#fa48ab] via-[#ff68bd] to-[#fa48ab] bg-clip-text text-transparent">
                Talk Authentically.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg text-white/60 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Twinning is a real-time voice and video calling platform designed to break down barriers. Meet new friends, practice languages, and engage in genuine conversations with people worldwide, while earning rewards.
            </p>

            {/* App Store Buttons & Social proof */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4" id="download">
                {/* Play Store */}
                <a 
                  href="#" 
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/15 text-white py-3.5 px-6 rounded-2xl transition-all duration-300 group"
                >
                  <Smartphone className="w-6 h-6 text-white/80 group-hover:scale-105 transition-transform" />
                  <div className="text-left">
                    <span className="block text-[10px] text-white/45 uppercase font-semibold tracking-wider">Get it on</span>
                    <span className="block text-sm font-semibold font-heading">Google Play</span>
                  </div>
                </a>

                {/* App Store */}
                <a 
                  href="#" 
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/15 text-white py-3.5 px-6 rounded-2xl transition-all duration-300 group"
                >
                  <Smartphone className="w-6 h-6 text-white/80 group-hover:scale-105 transition-transform" />
                  <div className="text-left">
                    <span className="block text-[10px] text-white/45 uppercase font-semibold tracking-wider">Download on the</span>
                    <span className="block text-sm font-semibold font-heading">App Store</span>
                  </div>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 text-xs text-white/40">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#fa48ab]" />
                  <span>100% Secure Connections</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#fa48ab]" />
                  <span>Verified Profiles Only</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Mockup Column */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-[300px] h-[600px] rounded-[48px] border-[8px] border-white/10 bg-[#0f0f10] p-3 shadow-2xl shadow-[#fa48ab]/10 overflow-hidden">
              {/* Camera Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[10px] text-white/60 font-semibold z-10 relative">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-[#fa48ab]" />
                  <span>5G</span>
                </div>
              </div>

              {/* Mock Screen Content */}
              <div className="relative h-full w-full rounded-[38px] overflow-hidden flex flex-col justify-between p-4 pb-8 bg-gradient-to-b from-black/60 to-black/90">
                {/* Background Image / Blur (represents call view) */}
                <div className="absolute inset-0 bg-cover bg-center opacity-40 filter grayscale-[20%]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600')" }} />
                
                {/* Floating Top Elements */}
                <div className="relative flex justify-between items-center z-10 pt-2">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-white/90">Live Connection</span>
                  </div>
                  <div className="bg-[#fa48ab] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(250,72,171,0.4)] flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    <span>250/min</span>
                  </div>
                </div>

                {/* Call Overlay / Central Card */}
                <div className="relative z-10 mt-auto space-y-4">
                  {/* Host Card */}
                  <div className="glassmorphism p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-[#fa48ab] overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                          alt="Sarah" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          Sarah, 22
                          <span className="text-[10px] bg-[#fa48ab]/20 text-[#fa48ab] border border-[#fa48ab]/30 px-1.5 py-0.5 rounded">Host</span>
                        </h4>
                        <p className="text-[10px] text-white/60">English • Spanish</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/70 italic leading-relaxed">
                      "Hey! Let's talk about travel, language practice, or anything else on your mind."
                    </p>
                  </div>

                  {/* Controller */}
                  <div className="flex items-center justify-between px-2 pt-1">
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 text-white/80">
                      <Video className="w-4 h-4" />
                    </div>
                    {/* Pulsing Connect Button */}
                    <div className="bg-[#fa48ab] hover:bg-[#fa48ab]/90 text-white text-xs font-bold py-3 px-8 rounded-full shadow-[0_4px_15px_rgba(250,72,171,0.4)] animate-bounce flex items-center gap-1">
                      <span>Call Now</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 text-white/80">
                      <Globe className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#0b0b0c] border-y border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="block text-3xl sm:text-4xl font-heading font-black text-white">500k+</span>
            <span className="block text-xs sm:text-sm text-white/40 mt-1 uppercase tracking-wider font-semibold">Downloads</span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-heading font-black text-white">120+</span>
            <span className="block text-xs sm:text-sm text-white/40 mt-1 uppercase tracking-wider font-semibold">Countries</span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-heading font-black text-white">10M+</span>
            <span className="block text-xs sm:text-sm text-white/40 mt-1 uppercase tracking-wider font-semibold">Minutes Talked</span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-heading font-black text-white">4.8★</span>
            <span className="block text-xs sm:text-sm text-white/40 mt-1 uppercase tracking-wider font-semibold">App Rating</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-xs font-bold text-[#fa48ab] tracking-widest uppercase">App Highlights</span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
            Everything You Need to Connect
          </h2>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed">
            Twinning is designed around seamless video interactions, privacy, and rewarding participation. Explore our key features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glassmorphism p-8 rounded-3xl border border-white/5 hover:border-white/15 hover:-translate-y-1 transition-all duration-300 space-y-6 group">
            <div className="w-12 h-12 rounded-2xl bg-[#fa48ab]/10 border border-[#fa48ab]/20 flex items-center justify-center group-hover:bg-[#fa48ab]/20 group-hover:border-[#fa48ab]/30 transition-all duration-300">
              <Video className="w-6 h-6 text-[#fa48ab]" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">Real-time Video Calls</h3>
            <p className="text-sm text-white/55 leading-relaxed">
              Crystal-clear, ultra-low latency audio and video calls. Experience seamless peer-to-peer connection quality optimized for global mobile networks.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glassmorphism p-8 rounded-3xl border border-white/5 hover:border-white/15 hover:-translate-y-1 transition-all duration-300 space-y-6 group">
            <div className="w-12 h-12 rounded-2xl bg-[#fa48ab]/10 border border-[#fa48ab]/20 flex items-center justify-center group-hover:bg-[#fa48ab]/20 group-hover:border-[#fa48ab]/30 transition-all duration-300">
              <Globe className="w-6 h-6 text-[#fa48ab]" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">Global Discoverability</h3>
            <p className="text-sm text-white/55 leading-relaxed">
              Instantly discover and match with interesting personalities around the world. Filter matches by language, regions, and conversation topics.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glassmorphism p-8 rounded-3xl border border-white/5 hover:border-white/15 hover:-translate-y-1 transition-all duration-300 space-y-6 group">
            <div className="w-12 h-12 rounded-2xl bg-[#fa48ab]/10 border border-[#fa48ab]/20 flex items-center justify-center group-hover:bg-[#fa48ab]/20 group-hover:border-[#fa48ab]/30 transition-all duration-300">
              <ShieldCheck className="w-6 h-6 text-[#fa48ab]" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">Safe & Encrypted</h3>
            <p className="text-sm text-white/55 leading-relaxed">
              Security is our core priority. All calls are fully encrypted, profiles are verified, and moderation guards protect you against unwanted interactions.
            </p>
          </div>
        </div>
      </section>

      {/* Earning & Wallet Section */}
      <section id="earning" className="bg-[#0b0b0c] border-y border-white/5 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual representation */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start order-last lg:order-first">
            <div className="glassmorphism p-6 sm:p-8 rounded-3xl border border-white/8 max-w-sm w-full space-y-6 relative overflow-hidden accent-glow">
              {/* Background gradient grid */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#fa48ab]/5 rounded-full blur-2xl" />

              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-white/40 uppercase font-semibold">Twinning Wallet</span>
                    <span className="block text-base font-bold text-white">Current Balance</span>
                  </div>
                </div>
                <span className="text-2xl font-black text-amber-400 font-heading">8,450 <span className="text-xs text-white/50">coins</span></span>
              </div>

              {/* Host earning card */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-white/50">
                  <span>Recent Call Earnings</span>
                  <span className="text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +28.4% this week
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#fa48ab]/15 flex items-center justify-center text-[#fa48ab] text-[10px] font-bold">VC</div>
                      <span className="text-xs font-medium text-white/80">Video call (Sarah L.)</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400">+1,250 coins</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#fa48ab]/15 flex items-center justify-center text-[#fa48ab] text-[10px] font-bold">AC</div>
                      <span className="text-xs font-medium text-white/80">Audio call (Marcus K.)</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400">+500 coins</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-3 rounded-xl text-xs font-bold text-white transition-all duration-300 flex items-center justify-center gap-2">
                <span>Request Instant Withdrawal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <span className="text-xs font-bold text-[#fa48ab] tracking-widest uppercase">Creator Economy</span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
              Share Your Conversations,<br />
              <span className="bg-gradient-to-r from-[#fa48ab] via-[#ff68bd] to-[#fa48ab] bg-clip-text text-transparent">
                Earn Real Money.
              </span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed">
              Twinning introduces a robust creator hosting mechanism. Popular users, translators, language teachers, or talented conversationalists can register as verified Hosts and earn coins per minute during video and voice chats.
            </p>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-[#fa48ab] shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Earn Per Minute</h4>
                  <p className="text-xs text-white/45 mt-0.5">Define your coin rate and earn continuously as you chat.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-[#fa48ab] shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Secure Wallet</h4>
                  <p className="text-xs text-white/45 mt-0.5">Manage your earnings and review extensive transaction reports.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-[#fa48ab] shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Easy Withdrawals</h4>
                  <p className="text-xs text-white/45 mt-0.5">Convert your earned coins into local currencies effortlessly.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-[#fa48ab] shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Host Verification</h4>
                  <p className="text-xs text-white/45 mt-0.5">Submit identity audits to receive verification and gain prominence.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Gated CTA */}
      <section id="security" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
        <div className="glassmorphism p-12 sm:p-20 rounded-[40px] border border-white/5 relative overflow-hidden accent-glow max-w-4xl mx-auto space-y-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#fa48ab]/5 via-transparent to-[#fa48ab]/5 pointer-events-none" />
          
          <div className="w-14 h-14 rounded-2xl bg-[#fa48ab]/10 border border-[#fa48ab]/20 flex items-center justify-center mx-auto text-[#fa48ab]">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div className="space-y-4">
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
              Safety & Moderation First
            </h2>
            <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Every profile on Twinning undergoes detailed validation. Our real-time AI and human moderation guard against harassment, keeping our voice and video calls respectful, secure, and authentic.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/65">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4.5 h-4.5 text-[#fa48ab]" /> ID-Verified Hosts
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4.5 h-4.5 text-[#fa48ab]" /> Zero-Tolerance Harassment Policy
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4.5 h-4.5 text-[#fa48ab]" /> 24/7 Support Integration
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
