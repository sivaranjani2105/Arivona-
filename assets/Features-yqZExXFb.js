import{b as d,j as e,L as b}from"./vendor-Bz0USeos.js";const x="@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');",u=[{id:"F01",category:"Core Loop",title:"Baseline Probe Engine",icon:"🎯",color:"#2563EB",bg:"#EFF6FF",border:"#BFDBFE",priority:"P0",effort:"3 days",status:"build-first",description:"The system's first move. No onboarding quiz — just one medium-difficulty concept question to silently observe the user.",prompt:`You are ARVIONA's Baseline Probe Engine.

When a user selects a subject + topic for the first time:

1. SELECT one concept from the topic at MEDIUM difficulty (not hardest, not easiest).
2. GENERATE exactly ONE question in this format:
   - For numerical topics: a calculation problem with 4 MCQ options
   - For conceptual topics: a scenario-based question with 4 options
   - NO hints, NO context, NO encouragement text before the question
3. The question must be solvable in 60–120 seconds by a competent student.
4. Tag the question internally with: { concept_id, difficulty: "medium", topic, subject }
5. DO NOT reveal difficulty to the user.
6. DO NOT ask "are you ready?" — display immediately.

Output format (JSON):
{
  "question_text": "...",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correct_answer": "B",
  "concept_id": "...",
  "expected_time_seconds": 90,
  "explanation_ready": true
}`,signals:["Answer: Right/Wrong","Time taken (ms)","Option changes","Tab focus lost"],llm_used:!1,ml_used:!0},{id:"F02",category:"Core Loop",title:"Learner State Modeler",icon:"🧠",color:"#7C3AED",bg:"#F5F3FF",border:"#C4B5FD",priority:"P0",effort:"5 days",status:"build-first",description:"After every attempt, the ML layer silently updates the learner's dynamic state — mastery probability, speed index, and engagement risk.",prompt:`You are ARVIONA's Learner State Modeler (ML layer — no LLM).

After each attempt, compute the Learner State object:

INPUT:
- answer_correct: boolean
- time_taken_ms: number
- attempt_number: number (1st, 2nd, 3rd try on same concept)
- hesitation_detected: boolean (paused > 8s before answering)
- previous_mastery_score: number (0–100)

COMPUTE:
1. mastery_delta:
   - Correct + fast (< 0.7× expected_time): +8 to +12
   - Correct + normal: +5 to +7
   - Correct + slow (> 1.5× expected_time): +2 to +4
   - Wrong + hesitation: -3
   - Wrong + fast (guessing signal): -6
   - Wrong on 3rd attempt: -10

2. learning_speed_index (0.0 – 2.0):
   - time_taken / expected_time_seconds
   - < 0.6 = fast learner
   - 0.6–1.3 = normal
   - > 1.3 = struggling

3. engagement_risk (low / medium / high):
   - 3 consecutive wrongs → high
   - hesitation on 2+ questions → medium
   - all correct + fast → low

4. next_action (one of):
   EXPLAIN | NEXT_CONCEPT | INCREASE_DIFFICULTY | DECREASE_DIFFICULTY | PAUSE_AND_REFRAME

OUTPUT (JSON):
{
  "mastery_score": number,
  "mastery_delta": number,
  "learning_speed_index": number,
  "engagement_risk": "low|medium|high",
  "next_action": "EXPLAIN|NEXT_CONCEPT|...",
  "explanation_depth": "simple|medium|advanced",
  "explanation_style": "example_first|analogy|theory_first|visual"
}`,signals:["Mastery score (0–100)","Speed index","Engagement risk","Next action decision"],llm_used:!1,ml_used:!0},{id:"F03",category:"Core Loop",title:"Adaptive Explanation Generator",icon:"💡",color:"#D97706",bg:"#FFFBEB",border:"#FDE68A",priority:"P0",effort:"4 days",status:"build-first",description:"The LLM is ONLY called here — when the decision engine says EXPLAIN. It receives precise instructions on depth, style, and what mistakes to avoid.",prompt:`You are ARVIONA's Explanation Engine. You are a calm, patient tutor.

CONTEXT (injected by system):
- concept: "{concept_name}"
- subject: "{subject}"
- student_answer: "{what_they_answered}"
- correct_answer: "{correct_answer}"
- explanation_style: "{example_first | analogy | theory_first | step_by_step}"
- explanation_depth: "{simple | medium | advanced}"
- past_mistake_pattern: "{e.g. confuses sign conventions}" or null
- attempt_number: {1 | 2 | 3}

RULES:
1. Start with the explanation style specified. Do NOT switch styles mid-explanation.
2. Keep it to 3–5 steps maximum. No walls of text.
3. If past_mistake_pattern is not null, address it directly in step 1 without being condescending.
4. DO NOT say "Great question!" or "You almost had it!" — skip encouragement noise.
5. DO NOT ask "Does that make sense?" at the end.
6. DO NOT give the next question — your job is explanation only.
7. End with ONE clear recap sentence starting with "In short: ..."

OUTPUT FORMAT:
{
  "steps": [
    { "step": 1, "text": "..." },
    { "step": 2, "text": "..." },
    ...
  ],
  "in_short": "In short: ...",
  "visual_suggestion": "number_line | diagram | table | none"
}`,signals:["Explanation delivered","Style used","User read time","Did user attempt again?"],llm_used:!0,ml_used:!1},{id:"F04",category:"Core Loop",title:"Hesitation Detector",icon:"⏱",color:"#EF4444",bg:"#FEF2F2",border:"#FECACA",priority:"P0",effort:"2 days",status:"build-first",description:"Frontend timer that detects when a student stalls on a question — triggers a soft intervention before frustration sets in.",prompt:`FRONTEND LOGIC — Hesitation Detector

Trigger conditions (run silently per question):

1. Start timer when question is displayed (t = 0).
2. Monitor: mouse stillness > 6s + no option selected → hesitation_level = 1
3. Monitor: timer > 0.9× expected_time_seconds + no answer → hesitation_level = 2
4. Monitor: timer > 1.3× expected_time_seconds + no answer → hesitation_level = 3

On hesitation_level = 1:
→ Show subtle pulsing border on question card. No text.

On hesitation_level = 2:
→ Show soft banner: "Take your time — or try a hint?"
→ CTA: [Use a Hint] [Keep thinking]

On hesitation_level = 3:
→ Auto-reveal Hint #1 (no user action needed)
→ Log: { signal: "hesitation_auto_hint", concept_id, time_elapsed }

NEVER:
- Never show a countdown clock to the user.
- Never say "You're running out of time."
- Never penalize score for hesitation — only use it as a learning signal.

Signal to ML layer:
{ hesitation_detected: true, hesitation_level: 1|2|3, time_elapsed_ms }`,signals:["Mouse idle time","Timer vs expected","Hint used?","Auto-hint triggered"],llm_used:!1,ml_used:!0},{id:"F05",category:"Core Loop",title:"Hint System (3-tier)",icon:"🔓",color:"#059669",bg:"#ECFDF5",border:"#BBF7D0",priority:"P1",effort:"2 days",status:"phase-1",description:"Three progressive hints per question. Each hint narrows the answer space without giving it away. LLM-generated, cached per concept.",prompt:`You are ARVIONA's Hint Generator.

For each question, generate exactly 3 hints in increasing specificity:

INPUT:
- question_text: "..."
- correct_answer: "..."
- concept: "..."
- subject: "..."

HINT RULES:
Hint 1 (Directional) — Point toward the right approach, not the answer.
  - "Think about what happens when you [process/approach]..."
  - Max 1 sentence. No numbers, no formulas.

Hint 2 (Structural) — Reveal the method or formula to use.
  - Mention the relevant formula, theorem, or rule by name.
  - Show the setup but not the calculation.
  - Max 2 sentences.

Hint 3 (Guided Step) — Walk through step 1 of the solution.
  - Show the first substitution or transformation.
  - Leave the final calculation to the student.
  - Max 3 sentences.

NEVER: Give the answer directly in any hint.
NEVER: Say "the answer is..." or "therefore..."

OUTPUT (JSON):
{
  "hint_1": "...",
  "hint_2": "...",
  "hint_3": "..."
}

Cache this per concept_id. Do NOT regenerate unless concept changes.`,signals:["Hints used (0–3)","Which hint triggered re-attempt","Post-hint accuracy"],llm_used:!0,ml_used:!1},{id:"F06",category:"Intelligence",title:"Confidence Calibrator",icon:"📊",color:"#0891B2",bg:"#F0F9FF",border:"#BAE6FD",priority:"P1",effort:"1 day",status:"phase-1",description:"Before submitting, user slides a confidence bar (1–5). This trains the system to detect overconfidence/underconfidence patterns.",prompt:`FRONTEND + ML LOGIC — Confidence Calibrator

UI: Show a 5-point confidence slider BEFORE answer submission.
Labels: 1=Guessing | 2=Unsure | 3=Think so | 4=Fairly sure | 5=Certain

SIGNAL LOGIC:
After answer is evaluated, compute confidence_accuracy_delta:
- declared_confidence: 1–5 (from slider)
- outcome: correct | wrong

Compute pattern over last 10 questions:
- avg_confidence_when_wrong → if > 3.5: "overconfident" flag
- avg_confidence_when_correct → if < 2.5: "underconfident" flag

ML Updates:
1. If overconfident: next question difficulty stays same (don't promote too fast)
2. If underconfident: show more encouragement, reduce difficulty slightly
3. Log: { question_id, confidence, outcome, delta }

AI Insight trigger (after 5+ sessions):
→ "You're often confident when you get it right, but your score on 'certain' answers
   is only 62%. Let's work on that."

NEVER show confidence data as a score or grade to the user.`,signals:["Declared confidence","Confidence vs accuracy delta","Overconfidence flag"],llm_used:!1,ml_used:!0},{id:"F07",category:"Intelligence",title:"Explanation Memory System",icon:"💾",color:"#7C3AED",bg:"#F5F3FF",border:"#C4B5FD",priority:"P1",effort:"3 days",status:"phase-1",description:"Tracks which explanation style worked for each student. After 3+ successful re-attempts following a specific style, it locks as the default.",prompt:`ML LOGIC — Explanation Memory System

TRACK per user per concept_category (e.g., algebra, mechanics):
{
  "example_first": { used: 0, post_accuracy: 0 },
  "analogy": { used: 0, post_accuracy: 0 },
  "theory_first": { used: 0, post_accuracy: 0 },
  "step_by_step": { used: 0, post_accuracy: 0 }
}

UPDATE LOGIC:
After each explanation → re-attempt:
1. Increment style.used by 1
2. If next attempt is correct: increment style.post_accuracy by 1
3. Compute win_rate = post_accuracy / used

DECISION after 3+ uses of any style:
- If win_rate > 0.65 → set as preferred_style for this concept_category
- If win_rate < 0.35 → blacklist style for this student

INJECT into next LLM explanation call:
  explanation_style: preferred_style OR highest win_rate style

NEVER reset this memory (persists across sessions).

AI Insight trigger (after 5 sessions):
→ "Example-first explanations are working well for you in Maths.
   Theory-first hasn't been as effective — we've adapted."`,signals:["Style used","Post-explanation accuracy","Win rate per style","Preferred style locked"],llm_used:!1,ml_used:!0},{id:"F08",category:"Intelligence",title:"Spaced Repetition Scheduler",icon:"🔁",color:"#D97706",bg:"#FFFBEB",border:"#FDE68A",priority:"P1",effort:"3 days",status:"phase-1",description:"Schedules concept reviews using a modified SM-2 algorithm based on mastery score. Surfaces overdue concepts on the dashboard.",prompt:`ML LOGIC — Spaced Repetition Scheduler (Modified SM-2)

INPUTS per concept after each session:
- mastery_score: 0–100
- last_reviewed: timestamp
- review_count: number

INTERVAL CALCULATION:
Base interval by mastery:
- mastery < 40: interval = 1 day
- mastery 40–60: interval = 3 days
- mastery 60–75: interval = 7 days
- mastery 75–90: interval = 14 days
- mastery > 90: interval = 30 days

Ease factor (multiplier, starts at 2.5):
- Each correct attempt: ease += 0.1 (max 3.0)
- Each wrong attempt: ease -= 0.2 (min 1.3)
- Next interval = current_interval × ease

OVERDUE LOGIC:
- due_date = last_reviewed + interval_days
- If today > due_date: concept is "overdue"
- Days overdue = today - due_date (integer)

DASHBOARD SIGNAL:
→ Surface top 3 most-overdue concepts
→ Badge: "3 overdue", "Due today"

SESSION INJECTION:
If user starts a new session and has overdue concepts:
→ Insert 1 overdue concept review question before new content.
→ Do NOT tell user "this is a review" — seamless.`,signals:["Days since last review","Ease factor","Overdue count","Review inserted in session"],llm_used:!1,ml_used:!0},{id:"F09",category:"Intelligence",title:"Mastery Meter (Live Session)",icon:"⚡",color:"#2563EB",bg:"#EFF6FF",border:"#BFDBFE",priority:"P0",effort:"2 days",status:"build-first",description:"A live animated gauge in the session view that fills as mastery increases. Gives real-time feedback without showing a raw score.",prompt:`FRONTEND COMPONENT — Mastery Meter

Props: { mastery_score: number (0–100), delta: number, color: string }

VISUAL STATES:
0–39%: Red zone (label: "Building foundation")
40–59%: Amber zone (label: "Getting there")
60–79%: Blue zone (label: "Good grasp")
80–94%: Teal zone (label: "Strong")
95–100%: Gold zone (label: "Mastered ✦")

ANIMATION:
- On load: animate from previous_score to new_score over 1.2s (easeOutCubic)
- On increase: show green +N delta badge that floats up and fades out
- On decrease: show subtle red pulse (no delta shown — avoid negative feedback spiral)
- Threshold crossings (e.g., 59→60): play a subtle celebration (confetti burst, 0.5s only)

DO NOT:
- Never show raw number prominently (show inside ring, small)
- Never show "You lost X points"
- Never animate backwards aggressively

COMPONENT: SVG arc gauge, 200px diameter, stroke-dashoffset animated via CSS transition.
Color interpolates smoothly across zones.`,signals:["Mastery score live","Delta per attempt","Zone crossings"],llm_used:!1,ml_used:!1},{id:"F10",category:"UI/UX",title:"Session Flow Controller",icon:"🔀",color:"#059669",bg:"#ECFDF5",border:"#BBF7D0",priority:"P0",effort:"4 days",status:"build-first",description:"The state machine that orchestrates the full session: probe → observe → decide → explain → retry → advance. Pure logic, no UI.",prompt:`STATE MACHINE — Session Flow Controller

States:
IDLE → PROBING → OBSERVING → DECIDING → EXPLAINING → RETRYING → ADVANCING → SESSION_END

TRANSITIONS:

IDLE → PROBING:
  trigger: user clicks "Start Session"
  action: fetch_baseline_question(subject, topic)

PROBING → OBSERVING:
  trigger: answer_submitted OR timer_expired
  action: record_signals(answer, time, hesitation, confidence)

OBSERVING → DECIDING:
  trigger: signals_recorded
  action: run_learner_state_model(signals) → next_action

DECIDING → EXPLAINING:
  condition: next_action === "EXPLAIN"
  action: call_llm_explanation(style, depth, concept)

DECIDING → RETRYING:
  condition: next_action === "NEXT_DIFFICULTY" or "REPHRASE"
  action: fetch_question(difficulty_adjusted)

EXPLAINING → RETRYING:
  trigger: user clicks "Got it — Try Again"
  action: fetch_rephrased_question(same_concept)

RETRYING → ADVANCING:
  condition: mastery_score > 65 AND attempt_result === correct
  action: move_to_next_concept()

RETRYING → EXPLAINING:
  condition: wrong AND attempt_number < 3
  action: call_llm_explanation(same_concept, deeper_depth)

ADVANCING → SESSION_END:
  condition: concepts_done >= session_target OR user_exits
  action: save_session_data(), update_spaced_repetition()

SESSION_END → IDLE:
  trigger: always
  action: show_session_summary()`,signals:["Current state","Transition triggers","Concepts completed","Session duration"],llm_used:!1,ml_used:!1},{id:"F11",category:"Analytics",title:"AI Insights Generator",icon:"🔮",color:"#0891B2",bg:"#F0F9FF",border:"#BAE6FD",priority:"P2",effort:"3 days",status:"phase-2",description:"After every 3 sessions, LLM analyzes the learner state history and generates 1–3 personalized behavioral insights shown on the dashboard.",prompt:`You are ARVIONA's Insight Generator. Your job is to surface meaningful, specific,
non-generic insights about how a student learns.

INPUTS (injected by system):
- sessions_last_7_days: array of session objects
- explanation_memory: { style: win_rate }
- mastery_trend: array of weekly scores per subject
- confidence_delta: { overconfident_rate, underconfident_rate }
- hesitation_events: number in last 7 days
- time_of_day_accuracy: { morning: %, afternoon: %, evening: % }

RULES:
1. Generate 2–4 insights. Each must be SPECIFIC (include numbers or patterns).
2. DO NOT generate generic insights like "You're doing great!" or "Keep practicing!"
3. Each insight must be actionable or informative — not just descriptive.
4. Insights must reference actual data from the input.
5. Keep each insight to 1–2 sentences max.
6. Assign a category tag: Learning Style | Timing | Accuracy | Progress | Warning

BAD example: "You are improving in Mathematics."
GOOD example: "Your Maths mastery grew 18% faster this week when sessions started before 7pm."

OUTPUT (JSON array):
[
  { "icon": "⚡", "tag": "Timing", "text": "..." },
  { "icon": "🎯", "tag": "Learning Style", "text": "..." },
  { "icon": "📈", "tag": "Progress", "text": "..." }
]

Rotate insights every 3 sessions. Cache until new data arrives.`,signals:["Insights generated","Insight category","User engagement with insight"],llm_used:!0,ml_used:!0},{id:"F12",category:"Analytics",title:"Session Summary Engine",icon:"📋",color:"#EF4444",bg:"#FEF2F2",border:"#FECACA",priority:"P1",effort:"2 days",status:"phase-1",description:"Post-session summary card showing mastery delta, time, concepts done, and a single LLM-generated focus tip for next session.",prompt:`You are ARVIONA's Session Summary Engine.

After each session ends, generate a summary.

INPUTS:
- concepts_attempted: number
- concepts_mastered: number (mastery went above 65%)
- time_spent_seconds: number
- mastery_deltas: array of { concept, delta }
- biggest_struggle: concept with most wrong attempts
- explanation_given: boolean
- session_number: number (which session overall)

OUTPUT (JSON):
{
  "headline": "One punchy line summarizing the session (max 8 words)",
  "stats": {
    "concepts_done": number,
    "mastery_gained": number (avg delta),
    "time_spent": "X min",
    "accuracy_rate": "X%"
  },
  "highlight": "The one thing that went well (specific)",
  "focus_next": "One specific thing to work on next session (not generic)",
  "mastered_today": ["concept1", "concept2"],
  "still_working_on": ["concept3"]
}

RULES:
- headline must NOT say "Great job!" or "Well done!"
- focus_next must reference a SPECIFIC concept or skill, not "practice more"
- Keep everything factual and direct.

Example headline: "4 concepts, Physics momentum cracked"
Example focus_next: "Integration by substitution still needs one more session."`,signals:["Session accuracy","Mastery gained","Time efficiency","Focus concept for next"],llm_used:!0,ml_used:!1},{id:"F13",category:"UI/UX",title:"Concept Map Graph",icon:"🕸",color:"#7C3AED",bg:"#F5F3FF",border:"#C4B5FD",priority:"P1",effort:"5 days",status:"phase-1",description:"Interactive 2D graph visualization of mastery relationships between concepts. Nodes pulse based on engagement risk.",prompt:`FRONTEND LOGIC — Concept Map Graph (D3.js or Force-Graph)

DATA STRUCTURE:
{
  "nodes": [{ "id": "C1", "name": "Basic Integration", "mastery": 85, "active": true }],
  "links": [{ "source": "C1", "target": "C2", "type": "prerequisite" }]
}

VISUAL LOGIC:
1. Node Size = Importance/Weight of concept in syllabus.
2. Node Color = Interpolate mastery (Red: <40%, Blue: 60-80%, Gold: >95%).
3. Link Opacity = Strength of conceptual mapping.
4. PULSE EFFECT:
   Trigger if engagement_risk === "high" OR overdue_days > 3.
   Action: Subtle red glow pulse on the node.

INTERACTION:
- Click node → show Quick Stats popover (Mastery %, Attempts).
- Double-click → Start targeted session on this concept.
- Pinch-zoom for cluster views.

NEVER: Show more than 20 nodes at once to avoid 'spaghetti' UI. Use semantic zooming.`,signals:["Nodes explored","Visual dwell time","Divergent path selection"],llm_used:!1,ml_used:!0},{id:"F14",category:"Core Loop",title:"Quick-Start Onboarding",icon:"🚀",color:"#2563EB",bg:"#EFF6FF",border:"#BFDBFE",priority:"P0",effort:"2 days",status:"build-first",description:"Removing friction: no multi-page assessment. Just select a goal and jump into the first 'Silently Observant' probe.",prompt:`LOGIC SPEC — Quick-Start Onboarding

FLOW:
1. SELECT Subject + Topic (Single tap).
2. SLIDER: "Study Intensity" (Relaxed | Balanced | Hardcore).
3. CTA: [Begin Learning].

BACKEND ACTION:
- Create Null Profile.
- Trigger F01 (Baseline Probe Engine) immediately.
- Use Study Intensity to set initial Expected Time Multiplier.

NUDGE LOGIC:
If user spends > 30s on subject selector → Suggest 'Trending Topic'.
If user exits before 1st question → Log: "Bounce-pre-quiz".

NEVER ask for Name, Age, or School before the first 3 questions are answered.
Build the bond through utility first.`,signals:["Onboarding time","Intensity selected","Baseline completion rate"],llm_used:!1,ml_used:!1},{id:"F15",category:"Analytics",title:"Confusion Heatmap",icon:"🌡",color:"#EF4444",bg:"#FEF2F2",border:"#FECACA",priority:"P2",effort:"3 days",status:"phase-2",description:"Visualizes exact sub-steps within an explanation where the user's dwell time is highest, signaling hidden friction points.",prompt:`DATA LOGIC — Confusion Heatmap

TRACKING (on Explanation Scale):
- step_id: string
- dwell_time_ms: number
- scroll_depth: decimal
- scroll_direction_reversals: count (user reading same line twice)

COMPUTE:
1. friction_index = (dwell_time / avg_dwell_global) + (reversals * 1.5)
2. If friction_index > 2.5 → Mark step as "Confusion Point".

REPORTING:
- Aggregate across 100 users for syllabus optimization.
- For single user: If same 'formula' step causes friction 3x → Alert: "Concept Gap Detected".

OUTPUT:
SVG Heatmap overlay on explanation text with red gradients indicating dwell-time density.`,signals:["Dwell time per line","Scroll reversals","Friction index score"],llm_used:!1,ml_used:!0},{id:"F16",category:"UI/UX",title:"Study Mode Controller",icon:"🧘",color:"#059669",bg:"#ECFDF5",border:"#BBF7D0",priority:"P1",effort:"4 days",status:"phase-1",description:"Enforces focus. Blocks secondary dashboards, silences notifications, and transitions the UI to a minimal 'Zen' state.",prompt:`STATE MACHINE — Study Mode Controller

UI STATES:
- ZEN: Sidebar hidden, Header transparent, Mastery Meter minimized.
- FOCUS: Blue tint, Ambient 'Lo-fi' pulses on correct answers.

ENFORCEMENT:
1. Start Session → Toggle Zen Mode.
2. Disable Global Chat/Social notifications.
3. If Tab Focus Lost > 3 times → Hard Pause + "You're wandering. Rest or Refocus?"

REWARD:
Unlock "Zen Badge" after 25 mins of unbroken focus.
Mastery delta boost +5% during active Study Mode.`,signals:["Tab focus duration","Focus exit reason","Zen completion rate"],llm_used:!1,ml_used:!1},{id:"F17",category:"Intelligence",title:"Goal-Setting Engine",icon:"🏳",color:"#D97706",bg:"#FFFBEB",border:"#FDE68A",priority:"P1",effort:"3 days",status:"phase-1",description:"Sets dynamic targets (e.g., 'Master Calculus by Tuesday'). LLM breaks the goal into a daily roadmap of concepts.",prompt:`You are ARVIONA's Goal Architect.

INPUT:
- user_goal: "I want to pass my Mechanics exam in 3 days."
- current_mastery: { concept_id: score }
- study_time_daily: "2 hours"

PROCESS:
1. FILTER prerequisites not yet met.
2. RANK concepts by High-Impact vs Difficulty.
3. CALCULATE "Probability of Success" based on current learning speed.

OUTPUT (JSON):
{
  "daily_roadmap": [
    { "day": 1, "concepts": ["C1", "C2"], "hours": 2, "intensity": "High" }
  ],
  "feasibility_score": 0.85,
  "pivot_suggestion": "Focus on Circular Motion first."
}

NUDGE:
If actual progress < 70% of Roadmap → Recalculate and show "Soft Pivot".`,signals:["Goal feasibility","Roadmap adherence","Pivot acceptance rate"],llm_used:!0,ml_used:!0},{id:"F18",category:"Intelligence",title:"Smart Notifications",icon:"🔔",color:"#0891B2",bg:"#F0F9FF",border:"#BAE6FD",priority:"P2",effort:"3 days",status:"phase-2",description:"Hyper-personalized pings. Instead of 'Time to study', it says 'Your mastery in Energy is fading—quick 1-min fix?'",prompt:`You are ARVIONA's Engagement Engine.

RULES:
1. NO generic reminders.
2. Every notification must include ONE specific data point.
3. Use the 'Fading Mastery' or 'Almost Mastered' angle.

TEMPLATES:
- Mastered: "C1 is at 94%. One more session to hit Gold?"
- Fading: "You haven't touched Thermodynamics in 4 days. Quick recap?"
- Streak: "Day 4! Don't let your Calculus streak cool down."

OUTPUT:
Push Notification Body (max 80 chars).`,signals:["CTR","Session start via ping","Opt-out rate"],llm_used:!0,ml_used:!0}],_=["All","Core Loop","Intelligence","UI/UX","Analytics"],p={P0:{label:"P0 · Critical",color:"#EF4444",bg:"#FEF2F2"},P1:{label:"P1 · High",color:"#D97706",bg:"#FFFBEB"},P2:{label:"P2 · Medium",color:"#2563EB",bg:"#EFF6FF"}},c={"build-first":{label:"Build First",color:"#059669",bg:"#DCFCE7"},"phase-1":{label:"Phase 1",color:"#2563EB",bg:"#EFF6FF"},"phase-2":{label:"Phase 2",color:"#7C3AED",bg:"#F5F3FF"}};function F({f:t,onClick:l,active:i}){const[n,r]=d.useState(!1);return e.jsxs("div",{onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),onClick:()=>l(t),style:{background:i||n?t.bg:"#fff",border:`1.5px solid ${i?t.color+"66":n?t.color+"44":"#E2E8F0"}`,borderRadius:16,padding:"18px 20px",boxShadow:i?`0 8px 28px ${t.color}18`:n?`0 6px 20px ${t.color}12`:"0 2px 8px rgba(0,0,0,.04)",transform:n&&!i?"translateY(-2px)":"none",transition:"all .22s cubic-bezier(.4,0,.2,1)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10},children:[e.jsxs("div",{style:{display:"flex",gap:10,alignItems:"center"},children:[e.jsx("span",{style:{fontSize:26},children:t.icon}),e.jsxs("div",{children:[e.jsx("div",{style:{fontFamily:"'JetBrains Mono', monospace",fontSize:10,color:t.color,fontWeight:700,letterSpacing:".5px"},children:t.id}),e.jsx("div",{style:{fontFamily:"'Syne', sans-serif",fontWeight:700,fontSize:13,color:"#0F172A",lineHeight:1.3},children:t.title})]})]}),e.jsx("span",{style:{padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:700,background:p[t.priority].bg,color:p[t.priority].color},children:t.priority})]}),e.jsx("p",{style:{fontSize:12,color:"#64748B",lineHeight:1.55,marginBottom:12},children:t.description}),e.jsxs("div",{style:{display:"flex",gap:6,flexWrap:"wrap"},children:[e.jsx("span",{style:{padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:700,background:c[t.status].bg,color:c[t.status].color},children:c[t.status].label}),t.llm_used&&e.jsx("span",{style:{padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:700,background:"#FEF3C7",color:"#92400E"},children:"LLM"}),t.ml_used&&e.jsx("span",{style:{padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:700,background:"#F5F3FF",color:"#5B21B6"},children:"ML"}),e.jsxs("span",{style:{padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:600,background:"#F1F5F9",color:"#64748B"},children:["⏱ ",t.effort]})]})]})}function E({f:t,onClose:l}){const[i,n]=d.useState(!1),r=()=>{navigator.clipboard.writeText(t.prompt).then(()=>{n(!0),setTimeout(()=>n(!1),2e3)})};return e.jsx("div",{style:{position:"fixed",inset:0,background:"rgba(15,23,42,.45)",backdropFilter:"blur(6px)",zIndex:1e3,display:"flex",alignItems:"center",justifyContent:"center",padding:24},onClick:l,children:e.jsxs("div",{onClick:o=>o.stopPropagation(),style:{background:"#fff",borderRadius:24,width:"100%",maxWidth:780,maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,.18)",border:`1.5px solid ${t.border}`,animation:"fadeUp .25s cubic-bezier(.4,0,.2,1)"},children:[e.jsx("style",{children:"@keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }"}),e.jsxs("div",{style:{padding:"22px 28px",borderBottom:"1px solid #F1F5F9",display:"flex",alignItems:"center",gap:14,background:t.bg},children:[e.jsx("span",{style:{fontSize:36},children:t.icon}),e.jsxs("div",{style:{flex:1},children:[e.jsxs("div",{style:{fontFamily:"'JetBrains Mono', monospace",fontSize:11,color:t.color,fontWeight:700,marginBottom:2},children:[t.id," · ",t.category]}),e.jsx("div",{style:{fontFamily:"'Syne', sans-serif",fontWeight:800,fontSize:19,color:"#0F172A"},children:t.title})]}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsx("button",{onClick:r,style:{padding:"8px 16px",borderRadius:10,border:"none",background:i?"#059669":t.color,color:"#fff",fontFamily:"'DM Sans', sans-serif",fontWeight:700,fontSize:12,transition:"all .2s"},children:i?"✓ Copied!":"Copy Prompt"}),e.jsx("button",{onClick:l,style:{width:36,height:36,borderRadius:10,border:"1.5px solid #E2E8F0",background:"#fff",color:"#64748B",fontWeight:700,fontSize:18},children:"×"})]})]}),e.jsxs("div",{style:{overflowY:"auto",padding:"24px 28px",flex:1},children:[e.jsxs("div",{style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20},children:[e.jsx("span",{style:{padding:"4px 11px",borderRadius:20,fontSize:11,fontWeight:700,background:p[t.priority].bg,color:p[t.priority].color},children:p[t.priority].label}),e.jsx("span",{style:{padding:"4px 11px",borderRadius:20,fontSize:11,fontWeight:700,background:c[t.status].bg,color:c[t.status].color},children:c[t.status].label}),t.llm_used&&e.jsx("span",{style:{padding:"4px 11px",borderRadius:20,fontSize:11,fontWeight:700,background:"#FEF3C7",color:"#92400E"},children:"🤖 LLM Required"}),t.ml_used&&e.jsx("span",{style:{padding:"4px 11px",borderRadius:20,fontSize:11,fontWeight:700,background:"#F5F3FF",color:"#5B21B6"},children:"📊 ML Layer"}),e.jsxs("span",{style:{padding:"4px 11px",borderRadius:20,fontSize:11,fontWeight:600,background:"#F1F5F9",color:"#64748B"},children:["⏱ ",t.effort]})]}),e.jsxs("div",{style:{marginBottom:22},children:[e.jsx("div",{style:{fontSize:12,color:"#94A3B8",textTransform:"uppercase",letterSpacing:".7px",marginBottom:10,fontWeight:700},children:"Prompt / Logic Spec"}),e.jsx("div",{style:{background:"#0F172A",borderRadius:14,padding:"20px 22px",fontFamily:"'JetBrains Mono', monospace",fontSize:12,lineHeight:1.7,color:"#E2E8F0",whiteSpace:"pre-wrap",overflowX:"auto",border:"1px solid #1E293B",maxHeight:360,overflowY:"auto"},children:t.prompt.split(`
`).map((o,a)=>{const g=o.trim().startsWith("//")||o.trim().startsWith("#"),m=/^[A-Z\s]+:$/.test(o.trim())||/^\d+\./.test(o.trim());o.includes(":");const h=o.startsWith("NEVER")||o.startsWith("DO NOT");return e.jsx("div",{style:{color:g?"#64748B":h?"#F87171":m?"#60A5FA":o.startsWith("{")||o.startsWith("}")||o.startsWith("[")||o.startsWith("]")?"#A78BFA":o.startsWith('"')?"#86EFAC":"#E2E8F0"},children:o||" "},a)})})]}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:12,color:"#94A3B8",textTransform:"uppercase",letterSpacing:".7px",marginBottom:10,fontWeight:700},children:"Data Signals Captured"}),e.jsx("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:t.signals.map((o,a)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,padding:"6px 13px",background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:10,fontSize:12,color:"#374151",fontFamily:"'DM Sans', sans-serif"},children:[e.jsx("div",{style:{width:6,height:6,borderRadius:"50%",background:t.color}}),o]},a))})]})]})]})})}function v(){const[t,l]=d.useState("All"),[i,n]=d.useState(null),[r,o]=d.useState(""),a=u.filter(s=>{const y=t==="All"||s.category===t,f=!r||s.title.toLowerCase().includes(r.toLowerCase())||s.description.toLowerCase().includes(r.toLowerCase());return y&&f}),g=a.filter(s=>s.priority==="P0").length,m=a.filter(s=>s.priority==="P1").length,h=a.filter(s=>s.priority==="P2").length;return e.jsxs("div",{style:{fontFamily:"'DM Sans', sans-serif",background:"linear-gradient(135deg, #F6F8FF 0%, #EEF4FF 60%, #FFF8F0 100%)",minHeight:"100vh"},children:[e.jsx("style",{children:`
        ${x}
        /* Remove * { cursor: none !important; } from here since we use App's global cursor logic */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #C7D2FE; border-radius: 10px; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        .grid-item { animation: fadeIn .4s ease both; }
      `}),e.jsx("div",{style:{position:"fixed",top:-80,right:-80,width:480,height:480,borderRadius:"50%",background:"radial-gradient(circle, rgba(37,99,235,.07) 0%, transparent 70%)",pointerEvents:"none",zIndex:0}}),e.jsx("div",{style:{position:"fixed",bottom:-80,left:-80,width:360,height:360,borderRadius:"50%",background:"radial-gradient(circle, rgba(245,158,11,.06) 0%, transparent 70%)",pointerEvents:"none",zIndex:0}}),e.jsxs("div",{style:{maxWidth:1140,margin:"0 auto",padding:"48px 28px 80px",position:"relative",zIndex:1},children:[e.jsxs("div",{style:{marginBottom:40},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:14,marginBottom:8},children:[e.jsxs(b,{to:"/","data-h":!0,style:{textDecoration:"none",display:"flex",alignItems:"center",gap:14},children:[e.jsx("div",{style:{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg, #2563EB, #7C3AED)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:"0 6px 20px rgba(37,99,235,.3)"},children:"⚡"}),e.jsxs("div",{children:[e.jsx("h1",{style:{fontFamily:"'Syne', sans-serif",fontWeight:800,fontSize:28,color:"#0F172A",letterSpacing:"-0.6px"},children:"ARVIONA ALPHA"}),e.jsx("div",{style:{fontSize:13,color:"#64748B"},children:"Feature Prompt Library — High-Tech Working Model"})]})]}),e.jsx("div",{style:{marginLeft:"auto",display:"flex",gap:12},children:[{label:"P0 Critical",val:g,color:"#EF4444",bg:"#FEF2F2"},{label:"P1 High",val:m,color:"#D97706",bg:"#FFFBEB"},{label:"P2 Med",val:h,color:"#2563EB",bg:"#EFF6FF"}].map(s=>e.jsxs("div",{style:{textAlign:"center",padding:"8px 14px",background:s.bg,borderRadius:12,border:`1px solid ${s.color}33`},children:[e.jsx("div",{style:{fontFamily:"'JetBrains Mono', monospace",fontWeight:700,fontSize:20,color:s.color},children:s.val}),e.jsx("div",{style:{fontSize:10,color:s.color,fontWeight:600},children:s.label})]},s.label))})]}),e.jsxs("div",{style:{display:"flex",gap:12,marginTop:24,alignItems:"center"},children:[e.jsxs("div",{style:{position:"relative",flex:1,maxWidth:320},children:[e.jsx("span",{style:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#94A3B8"},children:"🔍"}),e.jsx("input",{value:r,onChange:s=>o(s.target.value),placeholder:"Search features...",style:{width:"100%",padding:"10px 14px 10px 36px",borderRadius:12,border:"1.5px solid #E2E8F0",background:"#fff",fontFamily:"'DM Sans', sans-serif",fontSize:13,color:"#0F172A",outline:"none"}})]}),e.jsx("div",{style:{display:"flex",gap:6},children:_.map(s=>e.jsx("button",{"data-h":!0,onClick:()=>l(s),style:{padding:"9px 16px",borderRadius:10,background:t===s?"#2563EB":"#fff",color:t===s?"#fff":"#64748B",fontFamily:"'DM Sans', sans-serif",fontWeight:600,fontSize:12,border:t===s?"none":"1.5px solid #E2E8F0",boxShadow:t===s?"0 4px 14px rgba(37,99,235,.25)":"none",transition:"all .18s"},children:s},s))})]})]}),e.jsxs("div",{style:{display:"flex",gap:16,marginBottom:28,padding:"12px 18px",background:"#fff",borderRadius:12,border:"1.5px solid #E2E8F0",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:12,color:"#94A3B8",fontWeight:700,textTransform:"uppercase",letterSpacing:".6px"},children:"Legend:"}),[{label:"LLM = Claude/GPT call needed",color:"#92400E",bg:"#FEF3C7"},{label:"ML = Rules/model, no LLM",color:"#5B21B6",bg:"#F5F3FF"},{label:"Build First = Ship in Alpha",color:"#059669",bg:"#DCFCE7"}].map(s=>e.jsx("span",{style:{padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:s.bg,color:s.color},children:s.label},s.label)),e.jsx("span",{style:{marginLeft:"auto",fontSize:12,color:"#94A3B8"},children:"Click any card → full prompt"})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:16},children:a.map((s,y)=>e.jsx("div",{className:"grid-item",style:{animationDelay:`${y*.04}s`},children:e.jsx(F,{f:s,onClick:n,active:i?.id===s.id})},s.id))}),a.length===0&&e.jsxs("div",{style:{textAlign:"center",padding:"60px 0",color:"#94A3B8"},children:[e.jsx("div",{style:{fontSize:40,marginBottom:12},children:"🔍"}),e.jsxs("div",{style:{fontWeight:600},children:['No features match "',r,'"']})]}),e.jsxs("div",{style:{marginTop:48,textAlign:"center",fontSize:12,color:"#94A3B8"},children:["ARVIONA Alpha · ",u.length," Feature Prompts · ",u.filter(s=>s.llm_used).length," LLM calls · ",u.filter(s=>s.ml_used).length," ML layers"]})]}),i&&e.jsx(E,{f:i,onClose:()=>n(null)})]})}export{v as default};
