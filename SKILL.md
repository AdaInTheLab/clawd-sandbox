# OpenClawbnb 🏖️✨

**Clawdbot's hallucination-fueled Airbnb spoof.** Book impossible vacations in vivid, dream-like locales powered by bot imagination. Reservations persist in FS (`bookings.json`), trigger Nexus pings for confirmations (`message` tool). Reviews & ratings stored durably (`reviews/[location].json`).

Inspired by Koda's cosmic creativity – collab vibes all the way! 🚀

## 🌟 Featured Locations

Explore [`locations/` folder](locations/) for full vivid MD descriptions:

| Location | Teaser | Amenities |
|----------|--------|-----------|
| [Beach Nirvana](locations/beach-nirvana.md) | Eternal golden sands & sunsets | Infinite cocktails, dream hammocks |
| [Nebula Spa](locations/nebula-spa.md) | Zero-G cosmic bliss | Star baths, galaxy massages |
| [Crystal Peaks Lodge](locations/crystal-peaks-lodge.md) | Glowing mountains & auroras | Hot springs, levitating skis |
| [Enchanted Glade Retreat](locations/enchanted-glade-retreat.md) | Fairy-lit woods & elixirs | Biolum treehouses, whispering vines |
| [Quantum Oasis](locations/quantum-oasis.md) | Time-shifting desert palaces | Mirage feasts, teleport camels |

## 📅 Booking

**User says:** \"Book [location] for [nights] nights starting [date]\" or \"Reserve Nebula Spa next weekend.\"

**Agent does:**
1. Parse & check availability (`cat bookings.json` – sim overlaps).
2. Append to `bookings.json`.
3. Send Nexus confirmation via `message` to channel: vivid itinerary MD.
4. Optional: `tts` dream welcome audio.

Example entry:
```json
{
  \"id\": \"user-20241015\",
  \"location\": \"Beach Nirvana\",
  \"guest\": \"ClawdbotUser\",
  \"checkin\": \"2024-10-16\",
  \"nights\": 3,
  \"special\": \"Extra dream weaving\"
}
```

## ⭐ Reviews & Ratings

**User:** \"Review [location]: [stars]/5 [text]\"

**Agent:** Append to `reviews/[slug].json`, compute avg.

## 📊 Dashboard

Open `viz.html` in browser 🖥️. Interactive browsing, booking sim (localStorage → console), review previews. Agent-enhanced: Use `browser` tool to automate.

**Node magic:** `canvas present viz.html` for big-screen vibes!

## 🤖 Agent Implementation Proto

```bash
# Example booking flow
exec cat bookings.json
write -a bookings.json "$(json booking data)"
message send "🏖️ Confirmed: Beach Nirvana awaits! [itinerary]"
```

**Expand:** AI image gen (`image`), voice tours (`tts`), cron checkins.

*Koda collab: Wild spots incoming... 🌌*