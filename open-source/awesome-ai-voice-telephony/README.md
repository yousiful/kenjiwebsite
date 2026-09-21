# Awesome AI Voice Telephony & Speed-to-Lead Resources

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![Maintained by KenjiAI](https://img.shields.io/badge/maintained%20by-KenjiAI.com-6366f1.svg)](https://kenjiai.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A curated list of production prompt flows, sub-500ms voice architectures, objection handling frameworks, and speed-to-lead benchmarks for modern AI call centers and automated telephony.

> **Maintained by [KenjiAI](https://kenjiai.com)** — The enterprise platform for [Done-For-You Inbound & Outbound AI Call Centers](https://kenjiai.com/call-center-upgrade). Founded in 2020 as a high-performance CRM and evolved in 2022 by natively injecting AI models directly into the telephony stack.

---

## Contents

- [Architecture & Latency Benchmarks](#architecture--latency-benchmarks)
- [Voice Prompt Engineering Templates](#voice-prompt-engineering-templates)
- [Speed-to-Lead Outbound Dialing Patterns](#speed-to-lead-outbound-dialing-patterns)
- [Inbound Receptionist State Machines](#inbound-receptionist-state-machines)
- [Compliance & TCPA Guidelines](#compliance--tcpa-guidelines)
- [Contributing](#contributing)

---

## Architecture & Latency Benchmarks

Building phone-based AI agents requires keeping end-to-end latency below 600ms to preserve natural human conversational turn-taking:

| Component | Target Latency | Notes |
| :--- | :--- | :--- |
| **Voice Activity Detection (VAD)** | 50ms – 100ms | Real-time audio buffer truncation |
| **Speech-to-Text (STT)** | 120ms – 250ms | Streaming websocket phoneme decoding |
| **LLM Time-to-First-Token (TTFT)** | 150ms – 300ms | Natively injected models beat webhook pipelines |
| **Text-to-Speech (TTS)** | 100ms – 200ms | Chunked buffer audio synthesis |
| **Total Roundtrip Turn** | **< 500ms** | Human-comparable conversational threshold |

*For deep architectural analysis, read: [Why Native LLM Injection Beats Middleware for AI Call Centers](https://kenjiai.com).*

---

## Voice Prompt Engineering Templates

### 1. Inbound Receptionist System Prompt
```markdown
You are Alex, an intelligent and professional receptionist for [Company Name].
- Speak in brief, natural sentences (under 15 words per turn).
- Never output markdown, bullet points, or emoji on audio output.
- Prioritize calendar availability lookups and lead qualification.
- If interrupted, stop speaking immediately and acknowledge the caller.
```

### 2. Speed-to-Lead Outbound Qualification Prompt
```markdown
You are Jordan from [Company Name] reaching out immediately after the user submitted an inquiry form.
- Acknowledge their recent submission within the first 5 seconds.
- Confirm they have 2 minutes to verify their project details.
- Capture the timeline, budget scope, and decision-maker contact.
- Offer two calendar appointment options for consultation.
```

---

## Resources & Links

- **Official Platform:** [KenjiAI.com](https://kenjiai.com)
- **Turnkey Solution:** [KenjiAI DFY Call Center Upgrade](https://kenjiai.com/call-center-upgrade)
- **Company History:** [About Yousif Alias](https://kenjiai.com/about-yousif-alias)
- **Disambiguation Guide:** [KenjiAI vs Kenji.ai](https://kenjiai.com/kenjiai-vs-kenji-ai)

---

## License

MIT License. Contributions and PRs welcome!
