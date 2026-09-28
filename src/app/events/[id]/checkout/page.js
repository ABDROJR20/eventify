"use client";
import { useState, useEffect, use, Suspense } from "react";
import { ArrowLeft, CreditCard, Lock, ShieldCheck, Ticket, Wallet, Landmark, User, Mail, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { MOCK_EVENTS } from "@/lib/data";

function CheckoutContent({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unwrappedParams = use(params);
  const eventId = unwrappedParams?.id || '1';
  const event = MOCK_EVENTS.find(e => e.id === parseInt(eventId)) || MOCK_EVENTS[0];

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedGateway, setSelectedGateway] = useState('stripe'); // Default to Stripe
  const [selectedWallet, setSelectedWallet] = useState('SadaPay');
  const [selectedBank, setSelectedBank] = useState('HBL');

  // Form field state for card / payment
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [walletPhone, setWalletPhone] = useState('');
  const [bankDetails, setBankDetails] = useState({ title: '', iban: '' });

  // Dynamic attendee info
  const [attendeeInfo, setAttendeeInfo] = useState({
    registrationId: searchParams.get('regId') || '',
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    phone: searchParams.get('phone') || '',
    tier: searchParams.get('tier') || 'standard',
    amount: searchParams.get('amount') || (event.price || 'PKR 49.00')
  });

  useEffect(() => {
    let resolvedName = searchParams.get('name') || '';
    let resolvedEmail = searchParams.get('email') || '';
    let resolvedPhone = searchParams.get('phone') || '';
    let resolvedRegId = searchParams.get('regId') || '';
    let resolvedTier = searchParams.get('tier') || 'standard';
    let resolvedAmount = searchParams.get('amount') || (event.price || 'PKR 49.00');

    // 1. Check sessionStorage
    try {
      const saved = sessionStorage.getItem("eventify_checkout_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!resolvedName && parsed.name) resolvedName = parsed.name;
        if (!resolvedEmail && parsed.email) resolvedEmail = parsed.email;
        if (!resolvedPhone && parsed.phone) resolvedPhone = parsed.phone;
        if (!resolvedRegId && parsed.registrationId) resolvedRegId = parsed.registrationId;
        if (parsed.ticketTier) resolvedTier = parsed.ticketTier;
        if (parsed.amountDisplay || parsed.amount) resolvedAmount = parsed.amountDisplay || parsed.amount;
      }
    } catch (e) {
      // Ignore
    }

    // 2. Fetch logged in session if still missing details
    async function fetchCurrentUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          if (!resolvedName) resolvedName = data.user.name || 'Attendee';
          if (!resolvedEmail) resolvedEmail = data.user.email || '';
        }
      } catch (err) {
        // Not logged in
      }

      const finalName = resolvedName || 'Attendee Member';
      const finalEmail = resolvedEmail || 'attendee@eventify.com';

      setAttendeeInfo({
        registrationId: resolvedRegId,
        name: finalName,
        email: finalEmail,
        phone: resolvedPhone,
        tier: resolvedTier,
        amount: resolvedAmount
      });

      setCardDetails(prev => ({ ...prev, name: prev.name || finalName }));
      if (resolvedPhone) setWalletPhone(prev => prev || resolvedPhone);
      setBankDetails(prev => ({ ...prev, title: prev.title || finalName }));
    }

    fetchCurrentUser();
  }, [searchParams, event]);

  const isVip = attendeeInfo.tier === 'vip';
  const ticketTitle = isVip ? 'VIP Pass' : 'Standard Access';
  const numericAmount = isVip ? 199 : 49;
  const formattedPrice = isVip ? 'PKR 199.00' : (typeof event.price === 'string' && event.price.includes('PKR') ? event.price : `PKR ${attendeeInfo.amount}`);

  const handlePayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsProcessing(true);

    try {
      // 1. If Stripe Gateway is selected, redirect to Stripe Hosted Checkout
      if (selectedGateway === 'stripe') {
        const res = await fetch(`/api/stripe/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: eventId,
            registrationId: attendeeInfo.registrationId,
            name: attendeeInfo.name,
            email: attendeeInfo.email,
            phone: attendeeInfo.phone,
            ticketType: ticketTitle,
            amount: numericAmount,
            currency: "pkr"
          })
        });

        const data = await res.json();

        if (!res.ok || !data.success || !data.url) {
          throw new Error(data.message || "Failed to initialize Stripe checkout session.");
        }

        // Redirect directly to Stripe Checkout
        window.location.href = data.url;
        return;
      }

      // 2. Direct payment methods (Wallet / Bank)
      const res = await fetch(`/api/events/${eventId}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: attendeeInfo.registrationId,
          paymentMethod: selectedGateway,
          paymentDetails: {
            gateway: selectedGateway,
            wallet: selectedGateway === 'paypal' ? selectedWallet : undefined,
            bank: selectedGateway === 'bank' ? selectedBank : undefined
          },
          name: attendeeInfo.name,
          email: attendeeInfo.email,
          phone: attendeeInfo.phone,
          ticketType: ticketTitle,
          amount: numericAmount
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Payment processing failed.");
      }

      // Store success state
      if (typeof window !== "undefined") {
        sessionStorage.setItem("eventify_confirmed_ticket", JSON.stringify({
          ticketCode: data.ticketCode,
          registration: data.registration,
          qrUrl: data.qrUrl,
          name: attendeeInfo.name,
          email: attendeeInfo.email,
          phone: attendeeInfo.phone,
          event: event
        }));
      }

      const query = new URLSearchParams({
        regId: data.registration?.id || attendeeInfo.registrationId || '',
        name: attendeeInfo.name,
        email: attendeeInfo.email,
        phone: attendeeInfo.phone || '',
        tier: ticketTitle,
        code: data.ticketCode || '',
        amount: formattedPrice
      });

      router.push(`/events/${eventId}/success?${query.toString()}`);
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage(err.message || "Failed to process payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-950 dark:text-slate-50 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-8 flex justify-between items-center shadow-sm z-10 relative">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href={`/events/${eventId}`}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-xl font-black text-brand-blue tracking-tighter italic">Eventify</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-bold">
            <Lock size={16} /> Secure Checkout
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 sm:py-12 px-4 sm:px-8">
        
        {/* Payment Form */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Payment Details</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium">Complete your registration by providing your payment details.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none">
            
            {/* Gateway Selection */}
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Select Payment Gateway</label>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
              
              {/* Stripe Option */}
              <div 
                onClick={() => setSelectedGateway('stripe')}
                className={`border-2 rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center gap-2 sm:gap-3 cursor-pointer transition-all ${
                  selectedGateway === 'stripe' 
                    ? 'border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF] dark:text-[#7a73ff] shadow-md shadow-[#635BFF]/15 ring-2 ring-[#635BFF]/30' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-[#635BFF]/40 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#635BFF] text-white flex items-center justify-center font-black text-xs shadow-sm">
                  S
                </div>
                <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-center leading-tight">
                  Stripe<br className="hidden sm:block"/> <span className="text-[10px] opacity-75 lowercase font-normal">(cards/pay)</span>
                </span>
              </div>
              
              {/* Digital Wallet Option */}
              <div 
                onClick={() => setSelectedGateway('paypal')}
                className={`border-2 rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center gap-2 sm:gap-3 cursor-pointer transition-all ${
                  selectedGateway === 'paypal' 
                    ? 'border-[#003087] bg-[#003087]/5 dark:bg-[#003087]/20 text-[#003087] dark:text-blue-400 shadow-md shadow-blue-500/10 ring-2 ring-[#003087]/30' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Wallet size={24} />
                <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-center leading-tight">Digital<br className="hidden sm:block"/> Wallet</span>
              </div>

              {/* Bank Transfer Option */}
              <div 
                onClick={() => setSelectedGateway('bank')}
                className={`border-2 rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center gap-2 sm:gap-3 cursor-pointer transition-all ${
                  selectedGateway === 'bank' 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/30' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Landmark size={24} />
                <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-center leading-tight">Bank<br className="hidden sm:block"/> Transfer</span>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              
              {errorMessage && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold">
                  {errorMessage}
                </div>
              )}

              {/* Stripe Form Details / Redirection Notice */}
              {selectedGateway === 'stripe' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-5 rounded-2xl bg-linear-to-br from-[#635BFF]/10 via-[#635BFF]/5 to-transparent border border-[#635BFF]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#635BFF] text-white flex items-center justify-center font-black text-xs">
                          S
                        </div>
                        <span className="font-black text-slate-900 dark:text-white text-base">Stripe Secure Checkout</span>
                      </div>
                      <span className="text-[10px] font-black tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      When you click the button below, you will be securely redirected to the <strong className="text-slate-900 dark:text-white">Stripe Checkout Hosted Page</strong> to complete your payment with Credit/Debit Card, Apple Pay, or Google Pay.
                    </p>

                    <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Converted Amount for Stripe:</span>
                      <span className="text-[#635BFF] dark:text-[#7a73ff] font-black">
                        ${Math.max(0.50, Number((numericAmount / 278.50).toFixed(2))).toFixed(2)} USD <span className="text-slate-400 font-normal">({formattedPrice})</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#635BFF]/20 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      <span>Supported:</span>
                      <span className="bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Visa</span>
                      <span className="bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Mastercard</span>
                      <span className="bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">American Express</span>
                      <span className="bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Apple / Google Pay</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span>Attendee: {attendeeInfo.name}</span>
                    <span className="text-slate-400">{attendeeInfo.email}</span>
                  </div>
                </div>
              )}

              {/* Digital Wallet Form */}
              {selectedGateway === 'paypal' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 text-[#003087] dark:text-blue-400 font-bold mb-4 bg-[#003087]/5 dark:bg-[#003087]/20 p-3 rounded-xl text-xs sm:text-sm">
                    <Wallet size={18} /> Select your preferred Digital Wallet
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {['SadaPay', 'JazzCash', 'EasyPaisa', 'NayaPay'].map((wallet) => (
                      <div 
                        key={wallet}
                        onClick={() => setSelectedWallet(wallet)}
                        className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center font-black text-xs sm:text-sm ${
                          selectedWallet === wallet 
                            ? 'border-[#003087] bg-[#003087]/5 text-[#003087] dark:text-blue-400 shadow-sm' 
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-[#003087]/30'
                        }`}
                      >
                        {wallet}
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">{selectedWallet} Account Mobile Number</label>
                    <Input 
                      required 
                      value={walletPhone || attendeeInfo.phone}
                      onChange={e => setWalletPhone(e.target.value)}
                      placeholder="0300 1234567" 
                      className="h-12 sm:h-14 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-[#003087]/20 placeholder:text-slate-400 shadow-sm text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Bank Transfer Form */}
              {selectedGateway === 'bank' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-4 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl text-xs sm:text-sm">
                    <Landmark size={18} /> Select your Bank Transfer
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {['HBL', 'Meezan Bank', 'Bank Alfalah', 'Allied Bank'].map((bank) => (
                      <div 
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center font-black text-xs sm:text-sm text-center leading-tight ${
                          selectedBank === bank 
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-sm' 
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-emerald-500/30'
                        }`}
                      >
                        {bank}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Account Title</label>
                      <Input 
                        required 
                        value={bankDetails.title || attendeeInfo.name}
                        onChange={e => setBankDetails({ ...bankDetails, title: e.target.value })}
                        placeholder="Account Title" 
                        className="h-12 sm:h-14 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-emerald-500/20 placeholder:text-slate-400 shadow-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Account / IBAN Number</label>
                      <Input 
                        required 
                        value={bankDetails.iban}
                        onChange={e => setBankDetails({ ...bankDetails, iban: e.target.value })}
                        placeholder="PKXX XXXX XXXX XXXX" 
                        className="h-12 sm:h-14 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-emerald-500/20 placeholder:text-slate-400 shadow-sm text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button 
                  type="submit" 
                  disabled={isProcessing}
                  className={`w-full text-white h-14 sm:h-16 rounded-2xl font-black text-lg sm:text-xl transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed ${
                    selectedGateway === 'stripe' ? 'bg-[#635BFF] hover:bg-[#5349e4] shadow-[#635BFF]/30' :
                    selectedGateway === 'paypal' ? 'bg-[#003087] hover:bg-blue-800 shadow-blue-500/20' :
                    'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  }`}
                >
                  {isProcessing ? 'Connecting to Stripe...' : 
                   selectedGateway === 'stripe' ? `Proceed to Stripe ($${Math.max(0.50, Number((numericAmount / 278.50).toFixed(2))).toFixed(2)} USD)` :
                   selectedGateway === 'paypal' ? `Pay ${formattedPrice} via ${selectedWallet}` :
                   `Confirm ${selectedBank} Transfer (${formattedPrice})`}
                  {!isProcessing && selectedGateway === 'stripe' && <ExternalLink size={20} />}
                  {!isProcessing && selectedGateway !== 'stripe' && <Lock size={20} />}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-xs sm:text-sm font-bold justify-center pt-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            Instant QR ticket pass delivered to attendee email upon payment confirmation.
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-slate-100/50 dark:bg-slate-900/50 rounded-[2.5rem] p-6 sm:p-8 lg:p-10 sticky top-28 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-6 sm:mb-8">Order Summary</h3>
            
            <div className="flex gap-4 sm:gap-5 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-blue/10 rounded-2xl flex items-center justify-center shrink-0">
                <Ticket size={28} className="text-brand-blue dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-slate-900 dark:text-white text-base sm:text-lg leading-tight mb-1 truncate">{event.title}</h4>
                <p className="text-xs font-bold text-brand-blue dark:text-blue-400 uppercase tracking-wider mb-1">{ticketTitle}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">{event.date} • {event.location?.split(',')[0]}</p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>{ticketTitle} (1x)</span>
                <span className="text-slate-900 dark:text-white">{formattedPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee & Tax</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE (PKR 0.00)</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <span className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">Total Amount</span>
              <span className="font-black text-2xl sm:text-4xl text-[#635BFF] dark:text-[#7a73ff] tracking-tight">{formattedPrice}</span>
            </div>

            {/* Dynamic Attendee Details Card */}
            <div className="bg-white dark:bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 border border-brand-blue/20 flex items-center justify-center shrink-0">
                <span className="font-black text-brand-blue dark:text-blue-400 text-xs">
                  {attendeeInfo.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'AT'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Attendee Details</p>
                  {isVip && (
                    <span className="bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 text-[10px] font-black px-2 py-0.5 rounded-md">VIP</span>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{attendeeInfo.name}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                  <Mail size={12} className="shrink-0" /> {attendeeInfo.email}
                </p>
                {attendeeInfo.phone && (
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                    <Phone size={12} className="shrink-0" /> {attendeeInfo.phone}
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}

export default function CheckoutPage({ params }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-sm font-bold text-slate-500 animate-pulse">Loading Checkout...</div>
      </div>
    }>
      <CheckoutContent params={params} />
    </Suspense>
  );
}
