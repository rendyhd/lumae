# Lumae

Lumae is an AudioMuse-AI-first music player for people who want to rediscover
the music they already own.

It is a third-party app and a separate project from AudioMuse-AI. You need your
own AudioMuse-AI instance and a self-hosted music server to use it. The app is
still early, Android-first, and currently only works with Navidrome.

## Why This Exists

Lumae started from one question:

> What could a music player do if it treated the data from AudioMuse-AI as the
> starting point, not as a bonus feature?

Most music players begin with a library view: artists, albums, recently added,
recently played, maybe a radio button. That is useful, and Lumae still has a
real library. But the center of the app is different. Lumae starts from the idea
that your library is a landscape: full of forgotten corners, strange bridges,
albums you meant to hear, tracks that belong together for reasons a genre tag
cannot explain, and moods that are easier to feel than to name.

The app is built around three pillars:

- **Discovery**: find your way back into your own collection.
- **Vibes**: build and save listening shapes using AudioMuse-AI embeddings, not
  only genres or static playlists.
- **Deep Listen**: turn the clever parts off, play an album from beginning to
  end, and decide what it means to you.

This is a niche app on purpose. It is not trying to be the most flexible music
client or the prettiest library browser. It is trying to make a self-hosted
music library feel alive, personal, and explorable.

## Current Status

- Android and iPhone apps are in beta
- iPad is out of scope for now.
- Smoothfade is still in its improvement phase. If you use it and find any issues please export the log from the Now Playing screen.

If you are testing Lumae, expect beta edges. Feedback is very welcome, but
please open issues in this repository, not in the AudioMuse-AI project.

## Requirements

You need:

- A running AudioMuse-AI instance with your library analyzed.
- A Navidrome server or compatible Subsonic/OpenSubsonic provider.

Optional, but recommended:

- An AI provider such as OpenRouter, OpenAI, Anthropic, or Ollama for AI
  discovery text and chat.
- Navidrome external metadata configuration for artist bios and popular tracks.
- Koito if you want self-hosted ListenBrainz-style history/scrobbling.

## Setup

### 1. AudioMuse-AI

Lumae syncs sonic analysis from AudioMuse-AI, so you need to log in with your AudioMuse-AI instance

### 2. Navidrome / Music Provider

Configure your music server in onboarding or Settings.

Lumae currently works best with Navidrome through the Subsonic/OpenSubsonic API.
The app uses the provider for:

- Streaming.
- Album and track metadata not supplied by AudioMuse-AI.
- Album art.
- Playlists.
- Ratings and play sync where supported.
- Artist metadata and popular tracks when Navidrome is configured for it.

### 3. Navidrome Popular Tracks and Artist Bios

Lumae can show artist bios, provider popular tracks, and album hot-track markers
when Navidrome has external metadata available.

For best results, enable Navidrome external services and metadata agents. Your
Navidrome setup should include these concepts/settings:

- `EnableExternalServices`
- `Agents`
- `deezer,lastfm,listenbrainz`
- `LastFM.ApiKey`
- `LastFM.Secret`
- `ND_LASTFM_APIKEY`
- `ND_LASTFM_SECRET`
- MusicBrainz IDs
- Restart or rescan Navidrome after changing metadata settings.

Exact configuration depends on how you run Navidrome. For Docker-style setups,
this usually means setting the Last.fm API key and secret as environment
variables and making sure the metadata agents are enabled. Without this setup,
Lumae still works, but artist bios, provider popular tracks, and some global
popularity signals may be missing. Local listening heat and AudioMuse-AI-based
similarity still work.

### 4. AI Discovery With OpenRouter

AI is optional and off by default.

To use OpenRouter:

1. Open **Settings**.
2. Go to **AI Discovery**.
3. Select **OpenRouter**.
4. Enter the model name you want to use.
5. Paste your OpenRouter API key.
6. Tap **Save & Test**.

AI Discovery is used for:

- Discuss-with-AI chat in Discover.
- Optional AI-written Pulse and Right Now copy.

The actual recommendation candidates are grounded in your local library. The AI
helps interpret and phrase intent; Lumae still resolves tracks from your own
synced music.

## What Lumae Does

### Discovery

Discovery is the part of Lumae that asks: what should I hear from my own
library next?

Current discovery features include:

- **Right Now**: a daily pick based on local listening context and sonic fit.
- **The Pulse**: a time-of-day aware smart mix built from your taste profile.
- **Discover Chat**: describe what you want and get grounded suggestions from
  your own library.
- **Drift**: start from a track and move through nearby sonic space.
- **Sonic Bridge**: pick two tracks and let Lumae build a path between them.
- **Rabbit Hole**: follow a chain of related tracks and fork when something
  catches your ear.
- **Memory Lane**: use listening history to revisit periods, favorites, and old
  habits.

Discovery is powered by AudioMuse-AI embeddings, local play history, ratings,
library membership, and Lumae's own queue-building logic.

### Vibes

Vibes are saved listening shapes. They can come from text, seeds, Sonic DNA, or
combinations of existing palettes.

Current vibe tools include:

- **Mood Compass**: describe a vibe in words and generate a queue.
- **Palette Builder**: mix tracks, albums, and playlists as weighted seeds.
- **DNA Vibe**: shape a vibe with Sonic DNA sliders.
- **Sonic Fingerprint**: turn recent listening into a saveable sonic mirror.
- **Vibe Alchemy**: blend two saved palettes and explore the space between
  them.
- **Saved Vibes**: play, edit, pin, export, import, and replay saved vibes.
- **Context Vibes**: quick-launch vibes for situations like focus, workouts,
  dinner, or driving.

Vibe import/export uses portable vibe codes. Imports can preserve exact anchors
when possible or resolve to local sonic anchors when libraries differ.

### Deep Listen

Deep Listen is the intentional album mode.

It plays an album in order, preserves the album experience, and suppresses the
more playful queue mutation features. At the end, Lumae invites you to rate the
album and capture what the listen meant.

Deep Listen tracks:

- Which tracks were actually heard.
- Listened seconds.
- Completion threshold.
- Rating ceremony eligibility.
- Album sessions over time.

It is meant to be a small act of commitment: less infinite radio, more sitting
with a record.

### Album Intelligence

Lumae treats albums as more than a centroid.

Recent album intelligence work added:

- **Sonically Similar Albums** on album pages.
- Album hot-track markers using provider popularity or local listening heat.
- Shape-preserving album-end autoqueue so wide albums do not collapse into
  generic calm recommendations.

This means Lumae can distinguish a compact album from a wide, multi-pole album
even when their average sound is deceptively close.

### Artist Intelligence

Artist pages combine provider metadata, your own listening, and AudioMuse-AI sonic
analysis.

Current artist features include:

- Artist discography by era.
- Artist play/shuffle actions.
- Appears-on sections.
- Artist bio when provider metadata is available.
- Provider popular tracks.
- Your local top tracks.
- Playable popular/highlight tracks.
- Sonic similar artists computed locally from AudioMuse-AI embeddings.
- Artist images and cached artwork where available.

Sonic similar artists are not pulled from Last.fm or another public catalog.
They are computed from the music in your own library.

### Search

Search is global and local-first.

It supports:

- Tracks.
- Albums.
- Artists.
- Playlists.
- Cross-field token matching.
- Exact artist/title improvements.
- Personalized result boosting from your selection history.
- Structured search selection history.
- Cached local search work for faster repeated queries.
- Promotion of likely top results.

Search can also feed Quick Vibe and discovery pickers.

### Playback

Lumae includes a full player surface, not just recommendation screens.

Playback features include:

- Global MiniPlayer.
- Now Playing screen with large album art.
- Queue peek and queue sheet.
- Swipe removal for upcoming queue items.
- Anti-shuffle ordering.
- Autoplay continuation.
- Steering chips to bend a queue brighter, darker, calmer, or more intense.
- Lyrics overlay when provider lyrics are available.
- Track ratings.
- SmoothFade for smart transitions.
- Loudness normalization.
- Streaming format controls.
- Lock-screen and media-session controls.

Anti-shuffle is central to the app. The goal is not randomness. The goal is a
sequence that makes musical sense.

### Library

The Library tab is still there when you want the familiar view.

It includes:

- Albums.
- Artists.
- Playlists.
- Saved Vibes.
- Obsessions.
- Want List.
- Album sorting by recent, A-Z, year, and rating.
- Album filters for rated, 5-star, journey, downloads, and unrated albums.
- Active library filtering for multi-library setups.
- Album detail pages with tracks, ratings, Deep Listen, Rabbit Hole, similar
  albums, and hot-track markers.

### Offline and Caching

Lumae is increasingly designed to keep useful screens alive even when the server
is slow or unavailable.

Current offline and cache features include:

- Manual downloads.
- Offline pins.
- Smart Downloads.
- Full-library mirror.
- SD-card/external storage support on Android.
- Offline mode: auto, forced offline, or always online.
- Download network policy.
- Cache format controls.
- Persistent artist metadata cache.
- Persistent provider popular-track cache.
- Persistent similar-artist result cache.
- Persistent artwork file cache.
- Local artist and album view snapshots.
- Stale-while-revalidate behavior for artist and album pages.
- Cache cleanup and invalidation on sync/provider changes.

The intended behavior is simple: if Lumae knows enough to render something, it
should render it immediately and refresh quietly in the background.

### Taste Learning

Lumae learns from explicit and implicit signals.

Signals include:

- Plays.
- Skips.
- Ratings.
- Obsession outcomes.
- Deep Listen completions.
- Pulse dismissals.
- Queue steering.
- Vibe usage.

These feed:

- Personalized weighting.
- Sonic DNA.
- Pulse behavior.
- Discovery ranking.
- Momentum cards.
- Consensus checks.

There is also **Stealth Mode**, which temporarily prevents listens from being
recorded into history, scrobbles, Pulse, Momentum, or taste learning.

### Casting and Output

Lumae supports several output paths:

- Local playback.
- Chromecast.
- AirPlay route picker on iOS.
- Sonos / UPnP LAN casting.
- Marantz / HEOS-style DLNA rendering.
- Manual LAN device entries.
- Optional Sonos companion relay.

LAN casting is one of the more advanced areas and may still need real-device
testing across different setups.

### In-Car - EARLY ALPHA

Android Auto support is included through a config plugin and native bridge.

Current in-car work includes:

- Browsable media tree.
- Pulse.
- Right Now.
- Continue.
- Palettes and context vibes.
- Albums.
- Shuffle.
- Voice search.
- Configurable in-car pins.

CarPlay is planned as a later phase, gated on Apple's audio entitlement and a
runnable iPhone port.

## Relationship to AudioMuse-AI

Lumae depends on AudioMuse-AI, but it is not part of the AudioMuse-AI project.

Please do not report Lumae bugs to AudioMuse-AI unless you have confirmed the
problem is actually in the AudioMuse-AI server/API. Lumae issues, feature requests,
and beta feedback belong in this repository.

## Roadmap

This section is intentionally left for the maintainer to shape. The likely
themes are:

- [ ] Android Auto / Carplay
- [ ] Headless Pi
- [ ] Desktop

## Feedback

If you are trying Lumae, the most useful feedback is specific:

- What music server are you using?
- How large is your library?
- What did Lumae recommend that felt surprisingly right?
- What felt wrong, repetitive, slow, or confusing?
- Which screen did you want to use again?
- Which screen did you ignore?

The app is still exploring its own shape a little. That is part of the fun, but
also exactly why tester feedback matters.
