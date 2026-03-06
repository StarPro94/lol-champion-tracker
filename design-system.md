# Chosen Design System - Vibe 5 (Balanced)

```tsx
<VibeSection 
  id="vibe-5" 
  title="Maximalist Chaos" 
  description="A controlled riot of color, stickers, and grids. This is for the person who treats every level-up like a festival. High energy, zero apologies."
  className="bg-black text-pink-400 overflow-hidden"
>
  <div className="relative rotate-[-1deg]">
    <div className="absolute -top-10 -left-10 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black -rotate-12 z-20 shadow-xl border-4 border-black">NEW!</div>
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-400 rounded-xl flex items-center justify-center text-black font-black rotate-12 z-20 shadow-xl border-4 border-black text-center leading-none text-xl">DANCE<br />ON!</div>

    <div className="bg-pink-500 text-black border-[4px] border-white p-2 rounded-[40px] shadow-[20px_20px_0px_rgba(236,72,153,0.3)]">
      <div className="bg-zinc-900 text-white rounded-[32px] p-10 space-y-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-7xl font-black italic tracking-tighter leading-none bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 bg-clip-text text-transparent uppercase">LUXURY</h3>
            <div className="inline-block bg-pink-500 text-black px-4 py-1 font-black skew-x-[-12deg]">CHAMPION TRACKER</div>
          </div>

          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-8 border-pink-500 text-6xl">*</div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute inset-0 border-t-8 border-cyan-400 rounded-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/10 hover:bg-pink-500 hover:text-black p-6 rounded-[20px] transition-all cursor-crosshair border-2 border-transparent hover:border-black group">
              <p className="text-3xl font-black mb-2">{i}0%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">Stat Label</p>
            </div>
          ))}
        </div>

        <div className="h-16 bg-zinc-800 rounded-full relative border-4 border-white overflow-hidden">
          <motion.div 
            animate={{ x: [-1000, 0] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute inset-0 flex items-center whitespace-nowrap opacity-20 pointer-events-none"
          >
            <span className="text-2xl font-black mx-4">MAXIMALIST MODE ACTIVE * DANCE PARTY PENDING *</span>
            <span className="text-2xl font-black mx-4">MAXIMALIST MODE ACTIVE * DANCE PARTY PENDING *</span>
          </motion.div>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "72%" }}
            className="h-full bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500 relative z-10 border-r-4 border-white"
          />
        </div>

        <div className="flex justify-between items-center bg-white text-black p-6 rounded-[24px]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-3xl animate-bounce">DW</div>
            <div>
              <p className="font-black text-xl italic uppercase leading-none">The Dwarf</p>
              <p className="font-bold text-xs uppercase tracking-widest opacity-60">Status: Waiting...</p>
            </div>
          </div>
          <button className="bg-black text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:scale-110 transition-transform">
            Validate
          </button>
        </div>
      </div>
    </div>
  </div>
</VibeSection>
```

## Visual cues to preserve
- Maximalist but readable composition with strong contrast and black foundations.
- Hot pink, cyan, yellow, and white as primary accent palette.
- Thick borders, sticker-like floating badges, playful tilt, and loud CTA hierarchy.
- Big italic uppercase headlines with gradient text treatments.
- Rounded heavy cards and pill controls with premium but chaotic energy.
- Celebration UI should feel absurd and joyful, never subtle.
- The dancing dwarf is a headline moment, not a tiny secondary icon.