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
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function EventDetails() {
  return (
    <main className="min-h-screen bg-slate-50/30 font-sans text-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/portal">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <Link href="/">
              <h1 className="text-2xl font-black text-brand-blue tracking-tighter italic cursor-pointer">Eventify</h1>
            </Link>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="rounded-xl border-slate-200">
              <Share2 size={18} className="text-slate-600" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl border-slate-200">
              <Heart size={18} className="text-slate-600" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <div className="aspect-[21/9] bg-slate-200 rounded-[3rem] mb-12 overflow-hidden relative group shadow-2xl shadow-slate-200">
            <img 
              src="https://images.unsplash.com/photo-1540575861501-7ad058c78a00?q=80&w=2070&auto=format&fit=crop" 
              alt="Event Cover" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute top-8 left-8">
              <Badge className="bg-white/90 backdrop-blur text-slate-900 px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border-none shadow-xl">
                Technology • Workshop
              </Badge>
            </div>
          </div>

          <h2 className="text-6xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
            Global Tech Summit 2026: <br />
            <span className="text-brand-blue">The Future of AI</span>
          </h2>

          <div className="flex flex-wrap gap-12 mb-12 py-10 border-y border-slate-100">
            <InfoItem icon={<Calendar size={24} className="text-brand-blue" />} label="Date & Time" value="June 12, 2026 • 10:00 AM" />
            <InfoItem icon={<MapPin size={24} className="text-brand-green" />} label="Location" value="Karachi Expo Center, Pakistan" />
            <InfoItem icon={<Users size={24} className="text-brand-purple" />} label="Attendance" value="500+ Expected" />
          </div>

          <div className="prose prose-slate max-w-none mb-16">
            <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">About this event</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-xl mb-10">
              Join us for the most anticipated technology event of the year. The Global Tech Summit 2026 brings together the brightest minds in Artificial Intelligence, Machine Learning, and Software Engineering to explore the next frontier of digital innovation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <FeatureItem text="Interactive Workshops" />
              <FeatureItem text="Keynote by Industry Leaders" />
              <FeatureItem text="Networking Mixer" />
              <FeatureItem text="Hands-on Demo Sessions" />
            </div>

            <h3 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">Event Agenda</h3>
            <div className="space-y-0 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-1 before:bg-slate-100 mb-20">
              <AgendaItem time="10:00 AM" title="Opening Ceremony" speaker="Muhammad Umer" />
              <AgendaItem time="11:30 AM" title="The AI Revolution" speaker="Aadrish Pirzado" />
              <AgendaItem time="01:00 PM" title="Networking Lunch" speaker="Main Hall" />
              <AgendaItem time="02:30 PM" title="Hands-on LLM Workshop" speaker="Abdullah Bin Munawar" />
            </div>

            <h3 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">Attendee Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ReviewCard user="Sarah Khan" rating={5} text="Incredible event! The AI workshop was mind-blowing." />
              <ReviewCard user="Ali Ahmed" rating={4} text="Well organized. Looking forward to the summit." />
            </div>
          </div>
        </div>

        {/* Registration Sidebar */}
        <div className="lg:sticky lg:top-32 h-fit">
          <Card className="rounded-[3rem] border-none p-10 shadow-2xl shadow-slate-200/60 bg-white">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black tracking-tight text-slate-900">Registration</h3>
              <Badge className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-emerald-100">Open</Badge>
            </div>

            <div className="space-y-6 mb-12">
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 border-l-8 border-l-brand-blue shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-black text-slate-900 uppercase text-xs tracking-widest">Standard Access</span>
                  <span className="text-brand-blue font-black text-2xl">$49.00</span>
                </div>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">Includes all main sessions, networking, and digital certificate.</p>
              </div>
              
              <div className="p-8 bg-white rounded-[2rem] border border-slate-100 hover:border-brand-blue/30 transition-all cursor-not-allowed opacity-60">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-black text-slate-400 uppercase text-xs tracking-widest">VIP Experience</span>
                  <span className="text-slate-400 font-black text-2xl">$199.00</span>
                </div>
                <p className="text-sm font-black text-rose-400 uppercase tracking-widest">Sold Out</p>
              </div>
            </div>

            <Link href="/portal">
              <Button className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white h-20 rounded-[1.5rem] font-black text-2xl shadow-2xl shadow-blue-500/30 transition-all active:scale-95 mb-6">
                Register Now
              </Button>
            </Link>
            <p className="text-center text-xs font-black text-slate-400 uppercase tracking-widest">Secure checkout by Eventify</p>
          </Card>
          
          <Card className="mt-10 bg-brand-blue/5 rounded-[2.5rem] p-8 border border-brand-blue/10 flex gap-6 items-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5">
              <Ticket size={32} className="text-brand-blue" />
            </div>
            <div>
              <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] mb-1">Early Bird Special</p>
              <p className="text-lg font-bold text-slate-700 tracking-tight leading-none">Save 20% before May 30!</p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-100 border border-slate-50">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-slate-900 font-black text-lg tracking-tight leading-none">{value}</p>
      </div>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-4 py-1">
      <div className="bg-emerald-50 p-2 rounded-lg">
        <CheckCircle2 size={20} className="text-brand-green" />
      </div>
      <span className="text-slate-600 font-black text-sm uppercase tracking-widest">{text}</span>
    </div>
  );
}

function AgendaItem({ time, title, speaker }) {
  return (
    <div className="relative pl-16 pb-12 last:pb-0">
      <div className="absolute left-0 top-1.5 w-10 h-10 bg-white border-4 border-brand-blue rounded-full z-10 shadow-lg shadow-blue-500/20"></div>
      <p className="text-xs font-black text-brand-blue mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
        <Clock size={12} /> {time}
      </p>
      <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{title}</h4>
      <p className="text-slate-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
        <Users size={12} /> with {speaker}
      </p>
    </div>
  );
}

function ReviewCard({ user, rating, text }) {
  return (
    <Card className="p-8 bg-white rounded-[2.5rem] border-none shadow-xl shadow-slate-100">
      <div className="flex justify-between items-center mb-6">
        <span className="font-black text-slate-900 uppercase text-xs tracking-widest">{user}</span>
        <div className="flex gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} />
          ))}
        </div>
      </div>
      <p className="text-lg font-medium text-slate-500 leading-relaxed italic">"{text}"</p>
    </Card>
  );
}
