function GlucoseIllustration() {
  return (
    <svg className="h-full w-full" viewBox="0 0 540 350" role="img" aria-label="Blood glucose meter and reading chart">
      <defs>
        <linearGradient id="meter" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7457dc" />
          <stop offset="1" stopColor="#41238d" />
        </linearGradient>
        <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#91ead1" />
          <stop offset="1" stopColor="#50c9b4" />
        </linearGradient>
        <linearGradient id="drop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fa80a9" />
          <stop offset="1" stopColor="#ed4b85" />
        </linearGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="13" stdDeviation="12" floodColor="#3d257c" floodOpacity=".2" />
        </filter>
      </defs>

      <path d="M43 222C19 164 49 86 119 48c65-35 163-29 216 15 47 39 76 112 44 167-35 60-134 80-216 71-57-6-100-32-120-79Z" fill="#d9cbff" opacity=".76" />
      <circle cx="105" cy="73" r="11" fill="#c7b3ff" />
      <circle cx="402" cy="85" r="7" fill="#ad96f7" />
      <circle cx="451" cy="258" r="10" fill="#c7b3ff" />

      <g opacity=".94">
        <path d="M62 251c35-35 74-61 121-76M93 268c15-47 39-91 75-127" fill="none" stroke="#5fcab6" strokeLinecap="round" strokeWidth="5" />
        <path d="M80 220c-36 2-53-17-56-42 31-4 53 9 56 42ZM107 193c-5-35 12-56 37-63 10 29 0 54-37 63ZM119 246c-33 14-58 2-70-21 28-15 54-9 70 21ZM145 174c-1-32 16-50 40-54 5 29-8 50-40 54Z" fill="url(#leaf)" />
      </g>

      <g transform="translate(187 57) rotate(-11 90 119)" filter="url(#shadow)">
        <rect x="22" y="18" width="142" height="242" rx="34" fill="url(#meter)" />
        <rect x="45" y="50" width="96" height="78" rx="12" fill="#f4f1ff" />
        <text x="93" y="93" textAnchor="middle" fill="#342078" fontFamily="Arial, sans-serif" fontSize="35" fontWeight="700">110</text>
        <text x="93" y="113" textAnchor="middle" fill="#74659f" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="600">mg/dL</text>
        <circle cx="93" cy="166" r="22" fill="#8d76dd" />
        <circle cx="93" cy="166" r="10" fill="#c5b8fa" />
        <rect x="78" y="258" width="30" height="57" rx="7" fill="#efedf9" />
        <path d="M81 280h24" stroke="#d4cfeb" strokeWidth="3" />
      </g>

      <path d="M286 30c0 0-22 28-22 43a22 22 0 0 0 44 0c0-15-22-43-22-43Z" fill="url(#drop)" filter="url(#shadow)" />
      <path d="M278 66c2-8 7-14 12-20" fill="none" stroke="#ffb4ca" strokeLinecap="round" strokeWidth="5" />

      <g transform="translate(336 126)" filter="url(#shadow)">
        <rect width="172" height="121" rx="18" fill="#fff" fillOpacity=".94" />
        <path d="M25 91h126M25 64h126M25 37h126" stroke="#e8e2fb" strokeWidth="2" />
        <path d="m27 82 28-25 29 12 29-38 32 17" fill="none" stroke="#7355d6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
        <g fill="#fff" stroke="#7355d6" strokeWidth="5">
          <circle cx="27" cy="82" r="6" /><circle cx="55" cy="57" r="6" /><circle cx="84" cy="69" r="6" /><circle cx="113" cy="31" r="6" /><circle cx="145" cy="48" r="6" />
        </g>
      </g>

      <g opacity=".9">
        <path d="M403 288c7-27 21-50 43-68M418 294c21-12 41-18 63-18" fill="none" stroke="#58c9b6" strokeLinecap="round" strokeWidth="5" />
        <path d="M432 254c-6-25 5-42 24-49 10 22 3 40-24 49ZM448 279c13-22 32-27 51-18-10 22-27 31-51 18ZM418 274c-22-5-32-19-29-37 22 1 35 13 29 37Z" fill="url(#leaf)" />
      </g>
    </svg>
  )
}

export default GlucoseIllustration
