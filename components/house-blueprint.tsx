export default function HouseBlueprint() {
  return <div className="house-blueprint" aria-hidden="true">
    <svg viewBox="0 0 440 380" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" stroke="currentColor" strokeWidth=".5" opacity=".13"/></pattern>
        <pattern id="blueprint-bricks" width="24" height="14" patternUnits="userSpaceOnUse"><path d="M0 0H24M0 7H24M12 0V7M0 7V14M24 7V14" stroke="currentColor" strokeWidth=".7" opacity=".35"/></pattern>
      </defs>
      <rect width="440" height="380" fill="url(#blueprint-grid)"/>
      <g stroke="currentColor" strokeWidth="1" opacity=".35">
        <path strokeDasharray="4 5" d="M52 36V213M388 36V213M32 186H410M158 32V208"/>
        <path d="M52 42H388M48 46L56 38M384 46L392 38M32 64V186M28 68L36 60M28 190L36 182"/>
      </g>
      <g stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
        <path d="M64 113V186H376V113" fill="var(--paper)"/>
        <path d="M64 113V186H376V113" fill="url(#blueprint-bricks)"/>
        <path d="M52 113L158 58L264 113H388L326 66H174"/>
        <path d="M52 120L158 65L264 120H388M158 65V58M264 113V120M388 113V120"/>
        <path d="M288 66V45H310V66M284 45H314"/>
        <path d="M138 186V132H177V186" fill="var(--paper)"/>
        <path d="M143 181V137H172V181M166 158V165"/>
        <path d="M84 134H117V166H84ZM204 134H237V166H204ZM286 133H351V164H286Z" fill="var(--paper)"/>
        <path d="M100 134V166M84 150H117M220 134V166M204 150H237M308 133V164M330 133V164M286 149H351M80 170H121M200 170H241M282 168H355"/>
        <circle cx="158" cy="102" r="11" fill="var(--paper)"/>
        <path d="M147 102H169M158 91V113M58 186H382M132 191H183M126 196H189"/>
      </g>
      <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M73 245H287V347H206M178 347H73V245Z" fill="var(--paper)"/>
        <path d="M79 251H281V341H206M178 341H79V251M155 251V289M155 315V341M79 299H127M155 299H214M240 299H281"/>
        <g strokeWidth=".8" opacity=".65">
          <path d="M155 289H181A26 26 0 0 1 155 315M214 299V273A26 26 0 0 1 240 299M178 347V319A28 28 0 0 1 206 347"/>
          <rect x="91" y="261" width="48" height="26" rx="2"/>
          <path d="M96 261V287M99 264H110V284H99Z"/>
          <rect x="183" y="259" width="47" height="10" rx="2"/>
          <rect x="193" y="278" width="27" height="11" rx="3"/>
          <path d="M248 257H273V286H264V266H248Z"/>
          <path d="M85 315H119V335H85ZM85 320H119M90 320V335M114 320V335"/>
        </g>
        <path strokeWidth="3" d="M97 248H127M198 248H227M284 266V282M76 310V327" stroke="var(--clay)"/>
      </g>
      <g stroke="currentColor" strokeWidth="1" opacity=".45">
        <path d="M73 359H287M73 354V364M287 354V364M304 245V347M299 245H309M299 347H309"/>
        <circle cx="367" cy="292" r="22"/>
        <path d="M367 260V324M335 292H399M367 272L361 292H373Z"/>
      </g>
      <g fill="currentColor" fontFamily="Arial, sans-serif" fontSize="10" letterSpacing="2">
        <text x="64" y="224">FRONT ELEVATION</text>
        <text x="73" y="238">FLOOR PLAN</text>
        <text x="363" y="252">N</text>
      </g>
    </svg>
  </div>;
}
