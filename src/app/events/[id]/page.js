"use client";
import { useState, use } from "react";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Ticket, 
  ArrowLeft, 
  Share2, 
  Heart, 
  CheckCircle2, 
  Star,
  Clock,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { MOCK_EVENTS } from "@/lib/data";

const REVIEWS = [
  { user: "Sarah Khan", rating: 5, text: "Incredible event! Completely mind-blowing experience. The sessions were fantastic." },
  { user: "Ali Ahmed", rating: 4, text: "Well organized. Looking forward to the next one. Great networking opportunities." },
  { user: "Fatima Noor", rating: 5, text: "Best conference I've attended in years. Highly recommend to everyone in the industry." },
  { user: "Usman Tariq", rating: 5, text: "The hands-on workshops were incredibly valuable. Learned so much in just one day." },
  { user: "Zainab Ali", rating: 4, text: "Amazing atmosphere and crowd. Great venue and the speakers were very approachable." },
  { user: "Bilal Qureshi", rating: 5, text: "Game-changing insights from the industry leaders. I took so many notes!" }
];

export default function EventDetails({ params }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState('standard');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const unwrappedParams = use(params);
  const eventId = unwrappedParams?.id || '1';
  
  const event = MOCK_EVENTS.find(e => e.id === parseInt(eventId)) || MOCK_EVENTS[0];

  const handleContinue = (e) => {
    e.preventDefault();
    router.push(`/events/${eventId}/checkout`);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-950 dark:text-slate-50 transition-colors duration-300 overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl z-50 border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/events" className="flex items-center gap-2 group">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </Button>
              <span className="hidden sm:block text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-brand-blue transition-colors">Back to Events</span>
            </Link>
            <Link href="/">
              <h1 className="text-xl sm:text-2xl font-black text-brand-blue tracking-tighter italic cursor-pointer">Eventify</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Share2 size={18} className="text-slate-600 dark:text-slate-300" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Heart size={18} className="text-slate-600 dark:text-slate-300" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="pt-32 pb-20 px-6 sm:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        <div className="lg:col-span-2">
          <div className="aspect-[16/9] sm:aspect-[21/9] bg-slate-200 dark:bg-slate-800 rounded-3xl sm:rounded-[3rem] mb-10 overflow-hidden relative group shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all animate-in fade-in zoom-in-95 duration-1000 fill-mode-both">
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
              <Badge className="bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-900 dark:text-white px-4 py-2 sm:px-6 sm:py-2 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest border-none shadow-xl">
                {event.category}
              </Badge>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-[1] tracking-tighter">
              {event.title.split(' ').slice(0, -1).join(' ')} <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-emerald-500 animate-pulse">{event.title.split(' ').slice(-1).join(' ')}</span>
            </h2>

            <div className="flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-12 mb-12 py-8 sm:py-10 border-y border-slate-200 dark:border-slate-800">
              <InfoItem icon={<Calendar size={20} className="text-brand-blue" />} label="Date & Time" value={`${event.date} • ${event.time}`} />
              <InfoItem icon={<MapPin size={20} className="text-brand-green" />} label="Location" value={event.location} />
              <InfoItem icon={<Users size={20} className="text-brand-purple" />} label="Attendance" value={`${event.attendees} Expected`} />
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 fill-mode-both">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">About this event</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-lg sm:text-xl mb-10">
              {event.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-16">
              <FeatureItem text="Interactive Workshops" />
              <FeatureItem text="Keynote by Industry Leaders" />
              <FeatureItem text="Networking Mixer" />
              <FeatureItem text="Hands-on Demo Sessions" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Event Agenda</h3>
            <div className="space-y-0 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-1 before:bg-slate-200 dark:before:bg-slate-800 mb-16">
              <AgendaItem time="10:00 AM" title="Opening Ceremony" speaker={event.speakers[0] || "Host"} />
              <AgendaItem time="11:30 AM" title="Main Keynote" speaker={event.speakers[1] || "Guest Speaker"} />
              <AgendaItem time="01:00 PM" title="Networking Lunch" speaker="Main Hall" />
              <AgendaItem time="02:30 PM" title="Interactive Session" speaker="Special Guest" />
            </div>
          </div>
        </div>

        {/* Registration Sidebar */}
        <div className="lg:sticky lg:top-32 h-fit animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 fill-mode-both">
          <Card className="relative rounded-[2.5rem] sm:rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-2xl shadow-slate-200/60 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all duration-500 hover:shadow-brand-blue/10 overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-[80px] -z-10 group-hover:bg-brand-blue/10 dark:group-hover:bg-brand-blue/20 transition-colors duration-700" />
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Registration</h3>
              <Badge className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/20">Open</Badge>
            </div>

            <div className="space-y-4 mb-10">
              <div 
                onClick={() => setSelectedTicket('standard')}
                className={`p-6 sm:p-8 rounded-[2rem] border-2 cursor-pointer transition-all ${
                  selectedTicket === 'standard' 
                    ? 'bg-slate-50 dark:bg-slate-950 border-brand-blue shadow-md shadow-brand-blue/10 dark:shadow-none' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-brand-blue/30'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className={`font-black uppercase text-xs tracking-widest ${selectedTicket === 'standard' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>Standard Access</span>
                  <span className={`font-black text-xl sm:text-2xl ${selectedTicket === 'standard' ? 'text-brand-blue' : 'text-slate-600 dark:text-slate-400'}`}>{event.price}</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">Includes all main sessions, networking, and digital certificate.</p>
              </div>
              
              <div 
                onClick={() => setSelectedTicket('vip')}
                className={`p-6 sm:p-8 rounded-[2rem] border-2 cursor-pointer transition-all ${
                  selectedTicket === 'vip' 
                    ? 'bg-slate-50 dark:bg-slate-950 border-brand-purple shadow-md shadow-brand-purple/10 dark:shadow-none' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-brand-purple/30'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className={`font-black uppercase text-xs tracking-widest ${selectedTicket === 'vip' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>VIP Experience</span>
                  <span className={`font-black text-xl sm:text-2xl ${selectedTicket === 'vip' ? 'text-brand-purple' : 'text-slate-600 dark:text-slate-400'}`}>PKR 199.00</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">Includes premium seating, exclusive networking, and VIP lunch.</p>
              </div>
            </div>

            <Button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-brand-blue hover:bg-blue-600 text-white h-16 sm:h-20 rounded-[1.5rem] font-black text-xl sm:text-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 mb-6"
            >
              Register Now
            </Button>
            <p className="text-center text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
              <CheckCircle2 size={14} /> Secure checkout by Eventify
            </p>
          </Card>
          
          <Card className="mt-8 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-[2rem] p-6 sm:p-8 border border-brand-blue/10 dark:border-brand-blue/20 flex gap-5 items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-blue/5 shrink-0">
              <Ticket size={28} className="text-brand-blue" />
            </div>
            <div>
              <p className="text-[10px] font-black text-brand-blue dark:text-blue-400 uppercase tracking-[0.2em] mb-1">Early Bird Special</p>
              <p className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 tracking-tight leading-tight">Save 20% before May 30!</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Full Width Attendee Reviews Marquee */}
      <div className="pb-32 pt-8 sm:pt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-10 sm:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-800"></div>
            <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight text-center">What Attendees Say</h3>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-800"></div>
          </div>
          <p className="text-center text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">Join thousands of happy professionals</p>
        </div>
        
        {/* Animated Marquee Container */}
        <div className="relative w-full overflow-hidden mask-edges pb-8 pt-4">
          <style>{`
            .mask-edges {
              mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
              -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
            }
          `}</style>
          <div className="flex w-[200%] animate-marquee gap-6 sm:gap-8 items-stretch px-4">
            {[...REVIEWS, ...REVIEWS].map((review, i) => (
              <div key={i} className="w-[320px] sm:w-[400px] shrink-0 h-full">
                <ReviewCard user={review.user} rating={review.rating} text={review.text} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{event.title}</h3>
                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                  Registration • {selectedTicket === 'vip' ? 'VIP Experience' : 'Standard Access'}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
                <X size={24} className="text-slate-500 dark:text-slate-400" />
              </Button>
            </div>
            <div className="px-6 sm:px-8 py-4 bg-brand-blue/5 dark:bg-brand-blue/10 border-b border-brand-blue/10 flex items-center gap-3">
              <Calendar size={16} className="text-brand-blue" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{event.date} • {event.time}</span>
            </div>
            <form onSubmit={handleContinue} className="p-6 sm:p-8 space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Full Name</label>
                  <Input 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe" 
                    className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-brand-blue focus:ring-brand-blue/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
                  <Input 
                    required 
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com" 
                    className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-brand-blue focus:ring-brand-blue/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Phone Number</label>
                  <Input 
                    required 
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000" 
                    className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-brand-blue focus:ring-brand-blue/20"
                  />
                </div>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-black text-slate-500 dark:text-slate-400 uppercase text-xs tracking-widest">Total Amount</span>
                  <span className="font-black text-2xl text-slate-900 dark:text-white">{selectedTicket === 'vip' ? 'PKR 199.00' : event.price}</span>
                </div>
                <Button type="submit" className="w-full bg-brand-blue hover:bg-blue-600 text-white h-14 sm:h-16 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-brand-blue/20 transition-all">
                  Proceed to Payment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-0.5 sm:mb-1">{label}</p>
        <p className="text-slate-900 dark:text-white font-black text-base sm:text-lg tracking-tight leading-tight">{value}</p>
      </div>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 py-1">
      <div className="bg-emerald-50 dark:bg-emerald-500/10 p-2 rounded-lg border border-emerald-100 dark:border-emerald-500/20 shrink-0">
        <CheckCircle2 size={18} className="text-brand-green dark:text-emerald-400" />
      </div>
      <span className="text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-widest leading-snug">{text}</span>
    </div>
  );
}

function AgendaItem({ time, title, speaker }) {
  return (
    <div className="relative pl-12 sm:pl-16 pb-10 sm:pb-12 last:pb-0">
      <div className="absolute left-0 top-1.5 w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-slate-900 border-[3px] sm:border-4 border-brand-blue rounded-full z-10 shadow-lg shadow-brand-blue/20"></div>
      <p className="text-[10px] sm:text-xs font-black text-brand-blue dark:text-blue-400 mb-1.5 sm:mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
        <Clock size={12} /> {time}
      </p>
      <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{title}</h4>
      <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2">
        <Users size={12} /> with {speaker}
      </p>
    </div>
  );
}

function ReviewCard({ user, rating, text }) {
  return (
    <Card className="p-6 sm:p-8 h-full bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center font-black text-brand-blue dark:text-blue-400 text-sm border border-brand-blue/20">
            {user.split(' ').map(w => w[0]).join('')}
          </div>
          <span className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">{user}</span>
        </div>
        <div className="flex gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5" fill={i < rating ? "currentColor" : "none"} />
          ))}
        </div>
      </div>
      <p className="text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic flex-1">"{text}"</p>
    </Card>
  );
}

