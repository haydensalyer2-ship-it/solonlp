import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from './lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { AdminPanel } from './components/AdminPanel';
import { 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  CheckCircle2, 
  Home, 
  Star,
  ArrowRight,
  Shield,
  Clock,
  FileText,
  Lock
} from 'lucide-react';

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://tartanbuildersinc.com/wp-content/uploads/2022/06/logo_material_original_900_crop_all_objects_transparent_png.webp" 
            alt="Tartan Builders Inc." 
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </div>
        <div className="hidden md:flex items-center justify-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#process" className="hover:text-red-600 transition-colors">Scope Reviews</a>
          <a href="#reviews" className="hover:text-red-600 transition-colors">Reviews</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:6143240424" className="hidden lg:flex items-center gap-2 text-blue-900 font-bold hover:text-red-600 transition-colors">
            <PhoneCall className="w-5 h-5 text-red-600" />
            (614) 324-0424
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const [claimFiled, setClaimFiled] = useState<string | null>(null);
  const [approved, setApproved] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address || !claimFiled) {
      alert("Please fill out all required fields.");
      return;
    }
    if (claimFiled === 'yes' && !approved) {
      alert("Please indicate if your claim was approved.");
      return;
    }

    setSubmitting(true);
    
    // Generate a random id for the lead
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    try {
      await setDoc(doc(db, 'leads', id), {
        name,
        phone,
        address,
        claimFiled,
        approved: claimFiled === 'yes' ? approved : 'n/a',
        createdAt: serverTimestamp(),
        status: 'new'
      });
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `leads/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden items-center flex min-h-[85vh]">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop" 
          alt="Beautiful Solon Home after Roof Repair" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/90 to-blue-950/40"></div>
        <div className="absolute inset-0 bg-blue-950/40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 w-fit text-sm font-semibold backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <FileText className="w-4 h-4" />
              Insurance Scope Reviews
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-display text-white leading-[1.05]">
              Done with <span className="text-red-500">pushy</span> inspections?
            </h2>
            
            <p className="text-lg sm:text-xl text-slate-300 max-w-xl font-light leading-relaxed">
              Skip the door-knockers. If you are dealing with a Solon hail claim, get a <strong className="text-white font-semibold flex-inline">fast online estimate</strong> and expert <strong className="text-white font-semibold">insurance scope review</strong> directly from GAF Master Elite® certified contractors.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-red-500" />
                We supplement lowballed claims
              </div>
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-red-500" />
                Fast online estimates
              </div>
            </div>
            
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md ml-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="bg-blue-950 px-6 py-5 border-b border-blue-900 text-center">
                <h3 className="text-xl font-bold text-white mb-1">Get Your Online Estimate</h3>
                <p className="text-slate-300 text-sm">Find out what your claim should really cover.</p>
              </div>
              {submitted ? (
                <div className="p-12 text-center text-slate-700 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Request Received</h4>
                    <p className="text-sm">We'll review your details and reach out shortly.</p>
                  </div>
                </div>
              ) : (
                <form className="p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-2">
                  <label className="block text-sm font-bold text-slate-800 mb-3">Have you filed an insurance claim?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setClaimFiled('yes')} className={`py-2 px-4 rounded-lg font-medium border transition-all ${claimFiled === 'yes' ? 'bg-red-600 border-red-700 text-white shadow-sm' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>Yes</button>
                    <button type="button" onClick={() => { setClaimFiled('no'); setApproved(null); }} className={`py-2 px-4 rounded-lg font-medium border transition-all ${claimFiled === 'no' ? 'bg-red-600 border-red-700 text-white shadow-sm' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>No</button>
                  </div>
                </div>

                <AnimatePresence>
                  {claimFiled === 'yes' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-2">
                        <label className="block text-sm font-bold text-slate-800 mb-3">Is your claim approved?</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button type="button" onClick={() => setApproved('yes')} className={`py-2 px-2 rounded-lg font-medium text-sm border transition-all ${approved === 'yes' ? 'bg-red-600 border-red-700 text-white shadow-sm' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>Yes</button>
                          <button type="button" onClick={() => setApproved('no')} className={`py-2 px-2 rounded-lg font-medium text-sm border transition-all ${approved === 'no' ? 'bg-red-600 border-red-700 text-white shadow-sm' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>No</button>
                          <button type="button" onClick={() => setApproved('idk')} className={`py-2 px-2 rounded-lg font-medium text-sm border transition-all ${approved === 'idk' ? 'bg-red-600 border-red-700 text-white shadow-sm' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>I don't know</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all placeholder:text-slate-400" placeholder="Full Name" />
                  </div>
                  <div>
                    <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all placeholder:text-slate-400" placeholder="Phone Number" />
                  </div>
                  <div>
                    <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all placeholder:text-slate-400" placeholder="Property Address (Solon, OH)" />
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={submitting} className={`w-full bg-blue-950 hover:bg-blue-900 text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg text-lg ${submitting ? 'opacity-75 cursor-not-allowed' : ''}`}>
                    {submitting ? 'Submitting...' : <>Get Estimate & Scope Review <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </div>
                <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" /> Secure & Non-Binding.
                </p>
              </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustBanner() {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-100">
          <div className="flex flex-col items-center justify-center gap-2 px-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="font-bold text-blue-950 text-sm lg:text-base">GAF Master Elite®</p>
            <p className="text-xs text-slate-500">Top 2% of Roofers</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 px-4">
            <div className="flex items-center gap-1 mb-2 text-red-600">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
            <p className="font-bold text-blue-950 text-sm lg:text-base">5-Star Rated</p>
            <p className="text-xs text-slate-500">Exceptional Communication</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 px-4">
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-1">
              <FileText className="w-6 h-6" />
            </div>
            <p className="font-bold text-blue-950 text-sm lg:text-base">Scope Reviews</p>
            <p className="text-xs text-slate-500">We catch what adjusters miss</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 px-4">
             <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-1">
              <Clock className="w-6 h-6" />
            </div>
            <p className="font-bold text-blue-950 text-sm lg:text-base">Online Estimates</p>
            <p className="text-xs text-slate-500">Fast pricing directly to you</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InsuranceSection() {
  return (
    <section id="process" className="py-24 bg-slate-50 relative overflow-hidden text-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-red-600 font-bold tracking-wider text-sm uppercase mb-3">Skip the Hassle</h2>
          <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-tight">Already at the funding stage?</h3>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
            If an adjuster has already been out, you don't need another inspection. You need an expert to review the scope and ensure your roof, siding, and gutters are fully restored without cutting corners.
          </p>
        </div>
          
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold mb-3">1. Scope Review</h4>
            <p className="text-slate-600">Send us your insurance estimate. We review it line by line to locate missing items or underpriced materials the insurance company lowballed.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
              <Clock className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold mb-3">2. Online Estimate</h4>
            <p className="text-slate-600">We provide a rapid online estimate for the complete restoration. If your claim is deficient, we handle the supplement negotiation directly.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Home className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold mb-3">3. Premium Install</h4>
            <p className="text-slate-600">Once funded, our certified teams install premium GAF systems. You get the best warranties available, and minimal out-of-pocket costs.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section id="reviews" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-xl font-bold font-display text-blue-900">Reviews</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-blue-950 mb-6 tracking-tight">The difference is in the details.</h3>
          <div className="flex items-center justify-center gap-4 text-slate-600 font-medium">
            <span className="text-4xl font-bold text-blue-950">4.9</span>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1 text-red-600">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Austin W.",
              loc: "Google Review",
              text: "They basically handled the entire insurance process from start to finish. Our roof was denied initially, but Tartan Builders stepped in and did a scope review. They got the entire roof approved. Highly recommend."
            },
            {
              name: "Rachel T.",
              loc: "Google Review",
              text: "I was dealing with a lowball estimate from my insurance after the recent hail storm. Tartan Builders fought for me and supplemented the items the adjuster missed. The new roof looks fantastic."
            },
            {
              name: "Mark J.",
              loc: "Google Review",
              text: "Tartan Builders were prompt, professional, and did a great job on our roof replacement. They left our yard spotless after the tear off. Best roofing contractor we've ever hired."
            }
          ].map((r, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative shadow-sm">
              <div className="flex items-center gap-1 mb-4 text-red-600">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-slate-700 italic mb-6">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold text-blue-950 text-sm">{r.name}</h5>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                     <svg viewBox="0 0 24 24" className="w-3 h-3" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {r.loc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="bg-red-600 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Start Your Scope Review Today.</h2>
        <p className="text-lg md:text-xl font-medium mb-8 text-red-100">Get clarity on your claim without the hassle of another inspection.</p>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-white hover:bg-slate-100 text-blue-950 font-bold px-8 py-4 rounded-lg transition-all shadow-xl flex items-center justify-center gap-2 mx-auto">
          Get Your Online Estimate <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  )
}

function Footer({ onAdminLogin }: { onAdminLogin: () => void }) {
  return (
    <footer className="bg-blue-950 text-slate-400 py-12 border-t border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="mb-6">
            <img 
              src="https://tartanbuildersinc.com/wp-content/uploads/2022/06/logo_material_original_900_crop_all_objects_transparent_png.webp" 
              alt="Tartan Builders Inc." 
              className="h-10 w-auto object-contain invert brightness-0"
            />
          </div>
          <p className="max-w-sm text-sm mb-6">
            A premier roofing contractor based in Dublin, Ohio, serving Solon and surrounding areas. Specializing in storm damage restoration, full roof replacement, and maximizing insurance claims. GAF Master Elite Certified.
          </p>
          <div className="flex gap-4">
            <p className="text-xs">Lic # 123456789</p>
            <p className="text-xs border-l border-blue-900 pl-4">Fully Insured</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4">Contact Info</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-red-600" /> 
              <span>6265 Riverside Drive<br/>Dublin, Ohio 43017</span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-red-600" /> 
              <span>(614) 324-0424</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-blue-900 flex justify-between items-center text-xs">
        <p>&copy; {new Date().getFullYear()} Tartan Builders Inc. All rights reserved.</p>
        <button onClick={onAdminLogin} className="text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 group font-medium" aria-label="Admin Login">
          <Lock className="w-3 h-3 text-slate-600 group-hover:text-red-500" /> Admin Access
        </button>
      </div>
    </footer>
  )
}

export default function App() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    return auth.onAuthStateChanged(setUser);
  }, []);

  const handleAdminLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== 'hsalyer@tartanbuildersinc.com') {
        alert('Access denied. Admin only.');
        await signOut(auth);
      }
    } catch (error: any) {
      console.error(error);
      if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/user-cancelled' && error?.code !== 'auth/popup-blocked') {
        alert('Login failed: ' + error.message);
      } else if (error?.code === 'auth/popup-blocked') {
        alert("Login popup was blocked. Please open this app in a new tab.");
      }
    }
  };

  if (user && user.email === 'hsalyer@tartanbuildersinc.com') {
    return <AdminPanel user={user} />;
  }

  return (
    <div className="min-h-screen font-sans bg-slate-50 selection:bg-red-600 selection:text-white scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <TrustBanner />
        <InsuranceSection />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer onAdminLogin={handleAdminLogin} />
    </div>
  );
}
