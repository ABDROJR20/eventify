"use client";
import { useState, use } from "react";
import { ArrowLeft, CreditCard, Lock, ShieldCheck, Ticket, Wallet, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { MOCK_EVENTS } from "@/lib/data";

export default function CheckoutPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const eventId = unwrappedParams?.id || '1';
  const event = MOCK_EVENTS.find(e => e.id === parseInt(eventId)) || MOCK_EVENTS[0];
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState('credit_card');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate network delay
    setTimeout(() => {
      router.push(`/events/${eventId}/success`);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-950 dark:text-slate-50 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-8 flex justify-between items-center shadow-sm z-10 relative">
        <div className="flex items-center gap-6">
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

      <div className="flex-1 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 py-12 px-4 sm:px-8">
        
        {/* Payment Form */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Payment Details</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Complete your registration by providing your payment details.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none">
            
            {/* Gateway Selection */}
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Select Payment Gateway</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div 
                onClick={() => setSelectedGateway('credit_card')}
                className={`border-2 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  selectedGateway === 'credit_card' 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/10' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <CreditCard size={28} />
                <span className="font-black text-sm uppercase tracking-wider text-center leading-tight">Credit<br/>Card</span>
              </div>
              
              <div 
                onClick={() => setSelectedGateway('paypal')}
                className={`border-2 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  selectedGateway === 'paypal' 
                    ? 'border-[#003087] bg-[#003087]/5 dark:bg-[#003087]/20 text-[#003087] dark:text-blue-400 shadow-md shadow-blue-500/10' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Wallet size={28} />
                <span className="font-black text-sm uppercase tracking-wider text-center leading-tight">Digital<br/>Wallet</span>
              </div>

              <div 
                onClick={() => setSelectedGateway('bank')}
                className={`border-2 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  selectedGateway === 'bank' 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/10' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Landmark size={28} />
                <span className="font-black text-sm uppercase tracking-wider text-center leading-tight">Bank<br/>Transfer</span>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              
              {/* Conditional Form Rendering */}
              {selectedGateway === 'credit_card' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-4 bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-xl">
                    <ShieldCheck size={18} /> Secure Stripe Processing
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Card Information</label>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm">
                      <Input 
                        required 
                        placeholder="Card Number" 
                        className="h-14 border-0 rounded-none border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus-visible:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      />
                      <div className="flex">
                        <Input 
                          required 
                          placeholder="MM / YY" 
                          className="h-14 border-0 rounded-none border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus-visible:ring-0 w-1/2 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                        <Input 
                          required 
                          placeholder="CVC" 
                          className="h-14 border-0 rounded-none bg-white dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus-visible:ring-0 w-1/2 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Name on Card</label>
                    <Input 
                      required 
                      placeholder="John Doe" 
                      className="h-14 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-indigo-500/20 placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>
              )}

              {selectedGateway === 'paypal' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 text-[#003087] dark:text-blue-400 font-bold mb-4 bg-[#003087]/5 dark:bg-[#003087]/20 p-3 rounded-xl">
                    <Wallet size={18} /> Select your preferred Digital Wallet
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {['SadaPay', 'JazzCash', 'EasyPaisa', 'NayaPay'].map((wallet) => (
                      <div 
                        key={wallet}
                        onClick={() => setSelectedWallet(wallet)}
                        className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center font-black text-sm ${
                          selectedWallet === wallet 
                            ? 'border-[#003087] bg-[#003087]/5 text-[#003087] dark:text-white shadow-sm' 
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-[#003087]/30'
                        }`}
                      >
                        {wallet}
                      </div>
                    ))}
                  </div>

                  {selectedWallet && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">{selectedWallet} Account Number</label>
                      <Input 
                        required 
                        placeholder="03XX XXXXXXX" 
                        className="h-14 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-[#003087]/20 placeholder:text-slate-400 shadow-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {selectedGateway === 'bank' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-4 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl">
                    <Landmark size={18} /> Select your Bank
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {['HBL', 'Meezan Bank', 'Bank Alfalah', 'Allied Bank'].map((bank) => (
                      <div 
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center font-black text-sm text-center leading-tight ${
                          selectedBank === bank 
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-white shadow-sm' 
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-emerald-500/30'
                        }`}
                      >
                        {bank}
                      </div>
                    ))}
                  </div>

                  {selectedBank && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Account Title</label>
                        <Input 
                          required 
                          placeholder="John Doe" 
                          className="h-14 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-emerald-500/20 placeholder:text-slate-400 shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">IBAN / Account Number</label>
                        <Input 
                          required 
                          placeholder="PKXX XXXX XXXX XXXX" 
                          className="h-14 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-emerald-500/20 placeholder:text-slate-400 shadow-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button 
                  type="submit" 
                  disabled={isProcessing}
                  className={`w-full text-white h-16 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed ${
                    selectedGateway === 'credit_card' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20' :
                    selectedGateway === 'paypal' ? 'bg-[#003087] hover:bg-blue-800 shadow-blue-500/20' :
                    'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  }`}
                >
                  {isProcessing ? 'Processing Payment...' : 
                   selectedGateway === 'credit_card' ? `Pay ${event.price} with Card` :
                   selectedGateway === 'paypal' ? (selectedWallet ? `Pay via ${selectedWallet}` : 'Select a Wallet') :
                   (selectedBank ? `Confirm ${selectedBank} Transfer` : 'Select a Bank')}
                  {!isProcessing && selectedGateway === 'credit_card' && <Lock size={20} />}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-sm font-bold justify-center pt-4">
            <ShieldCheck size={20} className="text-emerald-500" />
            Payments are secure and encrypted by Stripe
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-slate-100/50 dark:bg-slate-900/50 rounded-[2.5rem] p-8 lg:p-10 sticky top-32 border border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Order Summary</h3>
            
            <div className="flex gap-5 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
              <div className="w-20 h-20 bg-brand-blue/10 rounded-2xl flex items-center justify-center shrink-0">
                <Ticket size={32} className="text-brand-blue dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-lg leading-tight mb-1">{event.title}</h4>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Event Registration</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{event.date} • {event.location.split(',')[0]}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Selected Ticket x 1</span>
                <span className="text-slate-900 dark:text-white">{event.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span className="text-slate-900 dark:text-white">PKR 0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">Total Amount</span>
              <span className="font-black text-4xl text-indigo-600 dark:text-indigo-400 tracking-tight">{event.price}</span>
            </div>

            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                <span className="font-black text-slate-400 dark:text-slate-500 text-xs">JD</span>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Attendee</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">John Doe</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">john@example.com</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
