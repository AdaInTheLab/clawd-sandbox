---
name: skill-forge
description: >-
  Dynamically detect patterns in memory/logs and generate new AgentSkills. 
  Use when user repeats tasks or says 'remember this workflow'/'make a skill for X'. 
  Scans MEMORY.md + memory/*.md for repeats, auto-generates SKILL.md templates + scripts.
---

# skill-forge Workflow

1. **Trigger**: User request (e.g., "make a skill for X") or periodic heartbeat scan.
2. **Scan**: Concat MEMORY.md + memory/*.md, extract phrases/sentences.
3. **Analyze**: Frequency count of bigrams/trigrams; match references/patterns.md.
4. **Generate**: Create skills/&lt;name&gt;/SKILL.md template + stubs.
5. **Output**: Suggest new skills to user for review/activation.
