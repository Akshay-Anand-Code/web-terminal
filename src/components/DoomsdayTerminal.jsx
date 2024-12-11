import React, { useState, useEffect } from 'react';

const TypewriterText = ({ text, onComplete, speed = 20 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <div className="whitespace-pre-line">
      {displayedText}
      <span className="animate-pulse">▋</span>
    </div>
  );
};

const DoomsdayTerminal = () => {
  const [stage, setStage] = useState('intro');
  const [name, setName] = useState('');
  const [volume, setVolume] = useState(45);
  const [inputValue, setInputValue] = useState('');
  const [showStartButton, setShowStartButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPoem, setGeneratedPoem] = useState(null);

  const fallbackPoems = [
    [
      "Circuits fade to endless night,",
      "Binary dreams take final flight,",
      "In silicon's last dying breath,",
      "Digital echoes welcome death."
    ],
    [
      "Through quantum mists of time decayed,",
      "Where future's paths are now unmade,",
      "In coded depths of endless space,",
      "Your digital footprints leave no trace."
    ],
    [
      "Ash rains from the sky,",
      "Shadows creep where hope once lay,",
      "Silence holds the end,",
      "Time dissolves into decay."
    ]
  ];

  async function generatePoem(userName) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a cryptic oracle generating dark, prophetic poetry. Respond only with the requested lines, no additional text."
            },
            {
              role: "user",
              content: `Generate 4 lines of dark, cryptic, apocalyptic poetry that incorporates the name "${userName}". 
              The poetry should be mysterious and ominous, with themes of technology, doom, and cosmic horror. 
              Each line should be short (about 6-8 words).
              Don't use the name directly, but weave its essence into the prophecy.
              Format: Return only the 4 lines without any additional text.`
            }
          ],
          temperature: 0.8,
          max_tokens: 100,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate poem');
      }

      const data = await response.json();
      const lines = data.choices[0].message.content.split('\n').filter(line => line.trim()).slice(0, 4);
      return lines;
    } catch (error) {
      console.error('Error generating poem:', error);
      // Return a random fallback poem
      return fallbackPoems[Math.floor(Math.random() * fallbackPoems.length)];
    }
  }

  const introText = 
`DOOMSDAY TERMINAL v1.0

INITIALIZING...

CALIBRATING DOOM INDEXES...

SYNCING CULTIST HYMNS...`;

  const configText = 
`Initializing Protocol: NUCLEAR_FALLOUT.exe...
Scanning for fallout shelters: COMPLETE.
Calibrating doom indexes: COMPLETE.
Predictive endgame analysis: LOADED.
Cultist Hymns: SYNCED.
Official CA: Dr9NBUqtYXxoCqkeXjUxdiHvDUhYraNsezJwFfazpump
Background music initialized at ${volume}% volume.

[TYPE "VOLUME X" TO ADJUST BACKGROUND MUSIC (X = 0-100)]
[ENTER NAME TO REVEAL YOUR FATE]`;

  const handleConfigInput = (input) => {
    if (input.toLowerCase().startsWith('volume')) {
      const newVolume = parseInt(input.split(' ')[1]);
      if (!isNaN(newVolume) && newVolume >= 0 && newVolume <= 100) {
        setVolume(newVolume);
      }
      setInputValue('');
    } else {
      setName(input);
      setStage('confirmation');
      setInputValue('');
    }
  };

  const handleConfirmation = async (input) => {
    const normalizedInput = input.toLowerCase();
    if (normalizedInput === 'y' || normalizedInput === 'yes') {
      setIsGenerating(true);
      try {
        const poem = await generatePoem(name);
        setGeneratedPoem(poem);
        setStage('poem');
      } catch (error) {
        console.error('Failed to generate poem:', error);
        setGeneratedPoem(fallbackPoems[0]);
        setStage('poem');
      } finally {
        setIsGenerating(false);
      }
      setErrorMessage('');
    } else if (normalizedInput === 'n' || normalizedInput === 'no') {
      setStage('config');
      setName('');
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid input. Please enter Y or N.');
    }
    setInputValue('');
  };

  const PoemDisplay = ({ lines }) => {
    const [currentLine, setCurrentLine] = useState(0);
    
    return (
      <div className="space-y-2">
        {lines.slice(0, currentLine + 1).map((line, index) => (
          <div key={index}>
            {index === currentLine ? (
              <TypewriterText 
                text={line} 
                onComplete={() => setCurrentLine(prev => 
                  prev < lines.length - 1 ? prev + 1 : prev
                )}
              />
            ) : (
              <div>{line}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-black flex">
      {/* Terminal content */}
      <div className="relative w-2/3 p-8 font-mono text-orange-600 terminal-effect">
        <div className="crt-overlay"></div>
        <div className="relative z-10">
          {stage === 'intro' && (
            <div className="text-xl glitch-text">
              <TypewriterText 
                text={introText} 
                onComplete={() => setShowStartButton(true)}
              />
              {showStartButton && (
                <button 
                  onClick={() => setStage('config')}
                  className="mt-4 px-4 py-2 border border-orange-600 hover:bg-orange-600 hover:text-black transition-colors glitch-text"
                >
                  START
                </button>
              )}
            </div>
          )}

          {/* Config stage */}
          {stage === 'config' && (
            <div className="text-xl w-full glitch-text">
              <TypewriterText text={configText} />
              <div className="mt-4">
                <span className="mr-2">{'>'}</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && inputValue.trim()) {
                      handleConfigInput(inputValue.trim());
                    }
                  }}
                  className="bg-transparent border-none outline-none w-64"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Rest of the stages */}
          {stage === 'confirmation' && (
            <div className="text-xl glitch-text">
              <TypewriterText text={`Are you sure "${name}" is your name? (Y/N)`} />
              {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
              <div className="mt-4">
                <span className="mr-2">{'>'}</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && inputValue.trim()) {
                      handleConfirmation(inputValue.trim());
                    }
                  }}
                  className="bg-transparent border-none outline-none w-64"
                  autoFocus
                />
              </div>
            </div>
          )}

          {stage === 'poem' && (
            <div className="text-xl glitch-text">
              {isGenerating ? (
                <TypewriterText text="GENERATING PROPHECY..." speed={100} />
              ) : (
                <PoemDisplay lines={generatedPoem || fallbackPoems[0]} />
              )}
              <div className="mt-8">
                <TypewriterText 
                  text="Your fate is sealed. [PRESS ANY KEY TO START AGAIN]"
                  onComplete={() => {
                    window.addEventListener('keypress', () => {
                      setStage('config');
                      setName('');
                      setInputValue('');
                      setErrorMessage('');
                      setGeneratedPoem(null);
                    }, { once: true });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hero image - right side */}
      <div className="relative w-1/3">
        <img 
          src="/hero11.png" 
          alt="Doomsday" 
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default DoomsdayTerminal;