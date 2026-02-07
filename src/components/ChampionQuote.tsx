import { useEffect, useState } from 'react';
import './ChampionQuote.css';

// Famous champion quotes (a curated selection of iconic lines)
const CHAMPION_QUOTES: Record<string, string[]> = {
  'Aatrox': ['I must destroy even hope.', 'Death is the only true freedom.', 'In peace, vigilance.'],
  'Ahri': ["Don't you trust me?", "Let's go for a spin.", "I'm not looking for friends, I'm looking for playthings."],
  'Akali': ['The Black Fist takes Nami for a ride.', 'Balance is power.', 'Follow the rules. Break them.'],
  'Alistar': ['Trample the weak.', 'Herd strong, trample weak!', 'You cant stop the stampede!'],
  'Amumu': ['Im lonely... please be my friend.', 'Will you be my friend?', 'Okay...'],
  'Annie': ["You're my friend now! Isn't that fun?", 'Tibbers says hi!', 'Fire burns bad guys!'],
  'Aphelios': ['...', 'Only the moonlight hears me.', 'Sister...'],
  'Ashe': ['The dream is real. Frost, focus, fortune.', 'Shoot true.'],
  'Bard': ['Je mmmvaayyyy!', 'Inter dimensionaaal!', 'Biiimmm!'],
  'Blitzcrank': ['Catch of the day!', 'GOTCHA!', 'Powering up.'],
  'Brand': ['I am the fire!', 'Burn!', 'The world will burn.'],
  'Braum': ['My heart and shield are one.', 'Trust in the warmth.', 'This is going to be fun!'],
  'Caitlyn': ['In the pursuit of justice, we all make sacrifices.', 'Keep your head down, Piltover.'],
  'Camille': ['Order requires enforcement.', 'Progress must be enforced.', 'I have my own code.'],
  'Darius': ['They will break before me!', 'My foes are many. But my axe is sharp.', 'Noxus!'],
  'Diana': ['The moon will rise. The sun will fall.', 'I bring the dawn.'],
  'Draven': ['Welcome to the League of Draven.', 'My axe, my rules.', 'Draven doesnt do support.'],
  'Ekko': ['Time is on my side.', 'I can do this all day.', 'Every second counts.'],
  'Ezreal': ['Time to shine!', 'What do you get when you combine a girl and a laser? Myself.'],
  'Fiora': ['Never give up.', 'I have so much to learn.', 'Underestimate me, and youll be embarrassed.'],
  'Garen': ['Justice will be served!', 'Demacia!', 'Victory is within our grasp.'],
  'Jinx': ['Get Jinxed!', "I'm crazy! Got a problem with that?", 'Rules are made to be broken!'],
  'Katarina': ['Violence solves everything.', 'Never doubt me.', 'A little blood never hurt anyone.'],
  'Kayn': ['Conquer and command.', 'Rhaast grows hungry.', 'Edges are sharp.'],
  'Leona': ['Stand firm.', 'Burn bright!', 'The dawn has arrived.'],
  'Lux': ['Light up the world!', 'Stay positive!', 'Demacia brings hope!'],
  'MasterYi': ['Training is important. My blade is sharp.', 'I have waited for you.'],
  'MissFortune': ['Fortune favors the bold.', 'Brought to heel.', 'Revenge is a dish best served with cannon fire.'],
  'Morgana': ["It's always been me.", 'Sin is a burden.', 'You have been judged.'],
  'Nasus': ['Your soul is mine.', 'The cycle is eternal.', 'Death is only the beginning.'],
  'Nautilus': ['There is no escape.', 'The deep calls for you.', 'The ocean has shown me mercy.'],
  'Nidalee': ['The spear knows the heart.', 'Trust your instincts.'],
  'Nocturne': ["I am the darkness.", 'The dark is nothing to fear.', 'Your fear is delicious.'],
  'Olaf': ['I live for the battle!', 'Ragnarok is coming!', 'Death is my goal!'],
  'Orianna': ['We will protect you.', 'Clockwork precision.', 'Life is not perfect.'],
  'Pantheon': ['I am the shield of the Rakkor.', 'War is the only true freedom.', 'A mans conquest is never done.'],
  'Pyke': ["Don't let the ocean eat you.", 'I like my knuckles bloody.'],
  'Riven': ['A broken blade is more than enough.', 'I am the will of the people.', 'Actions speak louder than words.'],
  'Senna': ['I bring the light.', 'Our light will not fade.', 'There is no surrender.'],
  'Sona': ['Your harmony suits my melody.', 'Music soothes the soul.', 'A symphony of steel and shadow.'],
  'Soraka': ['I will heal you.', 'Love is the only power.', 'Do not fear the darkness.'],
  'Sylas': ["Break the chains!", 'The mages will rise.', 'Your magic is mine.'],
  'Syndra': ['I will have my power.', 'Bow to my will!', 'The weak are doomed.'],
  'Talon': ['Fear the assassin blade.', 'Shut down.', 'Kill confirmed.'],
  'Teemo': ['Captain Teemo on duty!', 'Swiftly!', 'Never underestimate the power of the Scouts code.'],
  'Thresh': ['Relax.', 'Your soul is mine.', 'Come a little closer.'],
  'Tristana': ['Explosive expert, at your service!', 'Time for a blast!', 'The target is acquired.'],
  'Tryndamere': ['My rage knows no bounds!', 'Barbarian wrath!', 'I swing my sword.'],
  'TwistedFate': ['Lady luck is smiling.', 'Deal me in.', 'The house always wins.'],
  'Vayne': ['Let us hunt.', 'The night is mine.', 'Evil meets its match.'],
  'Veigar': ['I will be the greatest wizard ever!', 'Power overwhelming!', 'Darkness falls.'],
  'Vi': ['Punch first. Ask questions while punching.', 'Looks like I have to do everything myself.'],
  'Viktor': ['Glorious evolution.', 'A wonderful error.', 'I embrace the machine.'],
  'Yasuo': ['Death is like the wind, always by my side.', 'Honor is mine to claim.', 'A wind is blowing.'],
  'Yone': ['One life, one blade.', 'The hunt is over.', 'I am the wind.'],
  'Zed': ['Precision is the difference between a butcher and a surgeon.', 'Shadow is my ally.', 'No balance.'],
  'Ziggs': ['All natural!', 'Oops, my hand slipped.', 'Let me help you blow this up!'],
  'Zilean': ['Time is on my side.', 'Clock management is key.', 'The time is now!'],
  'Zoe': ["I'm not a kid, I'm cosmic!", 'You know what time it is? Adventure time!'],
  'Zyra': ['Nature will rise again.', 'The forest speaks.', 'I am the thorn in your side.'],
};

// Fallback quotes based on champion characteristics
// Reserved for future use
// const TAG_QUOTES: Record<string, string[]> = { ... };

export const getChampionQuote = (championName: string): string => {
  // First try exact match
  const quotes = CHAMPION_QUOTES[championName];
  if (quotes && quotes.length > 0) {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  // Return generic quote
  const generics = [
    'For glory!',
    'To battle!',
    'Victory awaits!',
    'I fight for my people!',
    'A challenge awaits!',
    'Destiny calls!',
  ];
  return generics[Math.floor(Math.random() * generics.length)];
};

interface ChampionQuoteProps {
  championName: string;
  championImage: string;
  championTitle: string;
  show?: boolean;
  onHide?: () => void;
}

export const ChampionQuote: React.FC<ChampionQuoteProps> = ({
  championName,
  championImage,
  championTitle: _championTitle,
  show = true,
  onHide,
}) => {
  const [quote, setQuote] = useState<string>('');

  useEffect(() => {
    if (show) {
      setQuote(getChampionQuote(championName));
    }
  }, [championName, show]);

  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onHide?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [show, onHide]);

  if (!show || !quote) return null;

  return (
    <div className="champion-quote-toast">
      <button className="champion-quote-toast-close" onClick={onHide}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <div className="champion-quote-toast-content">
        <img src={championImage} alt={championName} className="champion-quote-toast-avatar" />
        <div className="champion-quote-toast-text">
          <p className="champion-quote-toast-quote">"{quote}"</p>
          <span className="champion-quote-toast-author">{championName}</span>
        </div>
      </div>
    </div>
  );
};
