# What's new in Lumae

What changed in each Lumae beta build and update, and in each Lumae Radio release. Newest first. An update reaches the build it names by itself; a new build comes through TestFlight on iPhone and Google Play on Android ([how to join the beta](https://lumaemusic.app/beta/)).

The list starts with the updates of late October 2026. Earlier betas aren't listed.

## Lumae Music

### November 20, 2026 {#music-2026-11-20}

> Android 1.0.0 (45) on Google Play, iPhone 1.0.0 (37) and (38) on TestFlight

iPhone 38 followed the same day: the same app, built with Apple's newer developer tools.

#### Better

- **The Pulse changes from day to day.** It draws its 20 songs from the 600 that fit best, at most two per artist. Before, it took the nearest 20, which were nearly the same every day.
- **A Pulse song rests after you hear it.** Played or skipped, it stays off the card for 14 days and comes back gradually over about a month. A small library, or only your downloads while offline, shortens the rest.
- **The Pulse takes turns between the sides of your taste**, so one side no longer leads every card.

#### Fixed

- Home tiles and the offline Pulse keep their covers.
- Setup's history step says that Navidrome 0.64 or later tells Lumae when each play happened.

### November 19, 2026 {#music-2026-11-19}

> Android 1.0.0 (44) on Google Play, iPhone 1.0.0 (35) on TestFlight

On iPhone, this build also brings everything in Android's November 15 build below.

#### New

- **Foldables.** On Android, an unfolded screen shows Now Playing docked beside the app, and pop-ups stay on the side they were opened from. A short window, such as a flip phone's cover screen, puts the cover beside the song's details.
- **Gemini** is an AI service you can connect, next to Anthropic and OpenAI.

#### Better

- **Offline is a mark on the player**, not a banner over every screen. With no network, Lumae says once that only downloads will play. An unreachable music server keeps its banner, which you can now close.
- **Home.** Search is a field, and Quick Vibe is a row with three slots for the songs you pick.
- **One version of a song.** A queue Lumae builds plays a song once across its studio and live versions, and counts a band once across its credits.
- **Auto quality follows the connection.** When a Wi-Fi network can't carry the original, Auto streams Opus 192 (MP3 192 on iPhone) for 30 minutes. Lossless, downloads and speakers are left alone.

#### Fixed

- Scrubbing in a transcoded song goes where you drop it. It could play the song from its beginning while the clock showed the new position.
- On iPhone, a streamed song no longer drops to near silence with a crawling clock.
- On Android, a song on a slow connection stops to load and plays on. It used to stop for good after about 20 seconds.
- On Android, a batch of downloads shows one notification, not a row of blank ones.
- Music you start from your library replaces an Undertone session; it no longer plays inside Undertone's player.

### November 15, 2026 {#music-2026-11-15}

> Android 1.0.0 (43) on Google Play

On Android, this build also brings everything in the iPhone's November 14 build below. iPhone got the changes here with 1.0.0 (35).

#### New

- **Artists in a Palette.** Add an artist to a Palette and it brings every song the artist is credited on. The Add an item sheet searches as Search does.
- **Save a walk.** Wander gains Save as playlist, and Sonic Bridge has it beside Play.
- **Play at 44.1 kHz**, on Android. For music players such as the HiBy R4 that go silent for a moment before every song change. Settings → Sound → Compatibility.

#### Better

- **The Vibe player shows its queue**: how many tracks it holds and how many are to go, their real playing time, and the next four songs.
- **Play from any track.** In a Vibe builder's list, tap a track to play from there, or hold it for its menu.
- **Builders remember for 15 minutes.** Leave Mood Compass, DNA Vibe, Palette Builder, the Sonic Fingerprint, Vibe Alchemy, Wander, Sonic Bridge or Memory Lane and come back to what you were building, songs included. The Vibe builders, Wander and Sonic Bridge have Reset.
- **One track count and time on every list**, from the songs' real lengths.
- **Palette items show their covers and names.**
- **An Undertone preset's editor shows what it plays**, with Keep offline near the top.

#### Fixed

- Moving a slider in the Vibe player keeps every song of the vibe. It could leave 4 of 20.
- A queue that came up short says so and offers Try again.
- On Android, Settings pages lift above the keyboard.

### November 14, 2026 {#music-2026-11-14}

> iPhone 1.0.0 (33) on TestFlight

Android got these with 1.0.0 (43).

#### New

- **Navidrome play history, with dates.** With Navidrome 0.64 or later, Lumae reads when each play happened, at setup and on every sync, so plays from other apps show in Play History. Settings → Servers & accounts → Scrobbling → Keep syncing plays from my music server.

#### Better

- **A Comfort Mix plays one version of a song**, not the studio take and the live one in a row.
- **An Undertone session comes back.** If the phone ended Lumae while a session played, the session plays again when you open Lumae, if it was playing within the last 6 hours and its timer hasn't run out.
- **Lumae uses less memory** with the screen off.

#### Fixed

- Pause during a stalled stream stays paused.
- A failed answer from your music server is never taken for an empty one: libraries, ratings and play history stay as they were.
- Chromecast plays are counted with the phone locked.
- Downloads left over from a closed Lumae no longer hold up new ones.
- On Android 15 and older, music downloaded to an SD card keeps its files, and files lost before download again.
- On Android, the equalizer keeps its filters and preamp when the sound moves to another output.

### November 11, 2026 {#music-2026-11-11}

> Android 1.0.0 (39) on Google Play, and updates on November 11 and 12 for Android 1.0.0 (38) and (39) and iPhone 1.0.0 (32)

#### New

- **Keep offline in Undertone.** Albums, groups and presets have Keep offline. Downloaded tracks play from the phone when you're online too, so a night of sleep sounds doesn't stream for hours.

#### Better

- **Setup is shorter.** Listening history is one choice, the AI step connects one service, and setup ends on one screen that shows the first sync. The tour is optional.
- **Downloads and the mirror pick up again** after the connection drops for a moment, in the background too.

#### Fixed

- On Android, Undertone no longer stops overnight when Android clears Lumae from the recent apps by itself. Needs build 39.
- With no AI service set up, the AI DJ points to Settings → Taste & discovery → AI Discovery.
- Choosing Anthropic as your AI service starts with Claude Haiku 5.5. A model you chose is kept.

### November 10, 2026 {#music-2026-11-10}

> Update for Android 1.0.0 (38) and iPhone 1.0.0 (32)

#### New

- **AI DJ.** In Discuss with AI, switch from Quick picks to AI DJ and talk about the moment: who's there, how it should feel, what to leave out. The DJ asks a question or two, proposes a mix from your library, and plays it as a live set you can keep steering from the queue. Needs your own AI service.
- **Undertone plays as one session.** One player for a session, with its loop, details and stars. Stars sync with Undertone's music server, track rows show the album and tags, and the library is a tap away.

#### Better

- **A song you start stays in charge.** The songs queued after a song you start stay closer to it.
- **Undertone's filter** hides choices that would find nothing, and categories with the same name fold into one.
- **A repeating track keeps playing** in Undertone, and a preset you tap after its session ended starts again.

#### Fixed

- In the car, a song your music server won't stream plays from downloads when it's kept offline.
- Moving Undertone's library never deletes the details you added.

### November 7, 2026 {#music-2026-11-07}

> Android 1.0.0 (38) on Google Play, iPhone 1.0.0 (32) on TestFlight

On Android, this build also brings everything in the iPhone's October 27 build below, and on a speaker the volume buttons move by the step you choose in Settings.

#### New

- **Undertone.** Focus, study and sleep music, kept apart from your library: pick an album, folder or track and it plays on repeat, with presets in categories, a timer and an alarm. The alarm needs Android's alarm permission, or iOS 26 or later on iPhone. Undertone is always off the record.
- **Home-screen widgets.** The Lumae Radio widget on Android and iPhone (iOS 17 or later), and a Now playing widget for Lumae itself on Android.
- **Search the words.** Find a track by a line you remember, and start it at that line when its lyrics are synced. When AudioMuse-AI has analyzed lyrics, Search also finds songs about what you type, and Mood Compass and Discuss with AI use it too.
- **Sonic Bridge** plays a path from one song to another. Choose its length and route, swap or pin a stop, and save the path as a playlist or a journey.
- **Wander** (formerly Drift in Discover) walks outward from one track, says how far each step goes, and can keep going from the last song.
- **Rabbit Hole** deals six choices as covers, in lanes for direction, mood and era, and lets you go back to an earlier track.
- **UPnP/DLNA speakers** on Android, next to Sonos and Marantz: TVs, streamers, receivers, Kodi. Mark speakers as favorites or hide them.
- **Ease loud starts.** When a quiet ending runs into a much louder opening, the next song comes in lower and rises to its level after the fade. Settings → Sound.
- **Playlists sync by themselves** whenever Lumae syncs, sets up or opens.

#### Better

- **Offline means downloaded.** With Offline mode on, lists, search, suggestions and the Vibe tools show only songs on this phone.
- **Downloads** stop before the phone's storage fills, every downloaded album keeps its cover, and changing mirror quality swaps files without a gap.
- **Home has a speaker button**, so you can choose a speaker before choosing music.
- **Sonic DNA and the Sonic Fingerprint** draw a radar and a chart that follow the sliders.
- **Quick Vibe** opens as a sheet, and every sheet closes with a swipe down.
- **On Android**, tapping the media notification opens the player.

#### Fixed

- A resumed queue keeps getting songs, for whatever it was playing.
- A Back by accident keeps what you were building: tool pages, radio stations and Undertone presets.
- A cover changed on your music server replaces the one Lumae saved.
- While casting to a UPnP/DLNA speaker, Next moves one track and the screen stays lit.
- The radio remote's clock no longer jumps back.
- Android Auto no longer shows an error when a second tap replaces the first.

### October 27, 2026 {#music-2026-10-27}

> iPhone 1.0.0 (30) on TestFlight, and an update the same day

Android got these with 1.0.0 (38).

#### New

- **Journeys.** Put albums in an order and play them chapter by chapter. Grow a journey with new releases, keep the next chapter offline, and pick it up with Continue journey in the car. Journeys sync between phones with Lumae Analysis 1.9.0 or newer.
- **Lyrics on Now Playing**, with the cover shrunk into a header row.
- **Volume leveling.** Quiet, Normal or Loud in Settings → Sound, with album gain over whole albums. Lumae reads loudness from Lumae Analysis, ReplayGain tags or Jellyfin. Casting says it isn't leveled.
- **Lumae Radio from the phone.** Play an album, playlist or collection on the radio from its sheet, and tune the radio's Parametric EQ and Room tuning from the remote.

#### Better

- **Fades avoid two singers at once** when lyrics are synced.
- **Comfort and Momentum mixes** order songs by tempo and key.
- **Every replay sounds different.** A single, album or vibe continues differently each time, and songs heard in the last four hours rank lower everywhere.
- **Sync status** opens with the health of your servers and the last sync.

#### Fixed

- Plays heard with the screen locked reach your music server.
- A song whose clock freezes while playing recovers by itself on iPhone.
- AirPlay plays the music, never a video of it.
- The Album Shelf and Artist Shelf open with their art drawn.

## Lumae Radio

Radios on 0.5.1 or later update themselves within a day. The [Lumae Radio guide](https://lumaemusic.app/radio/docs/#upgrade) shows how to upgrade by hand.

### 0.6.16 {#radio-0-6-16}

> November 24, 2026 · [Files on GitHub](https://github.com/rendyhd/lumae/releases/tag/radio-v0.6.16)

- **Library sync works when AudioMuse-AI skips one of your libraries.** If your music server account can open a library that AudioMuse-AI doesn't analyze, such as one you keep for Undertone, every sync stopped with "The radio couldn't prove it reaches the same music library as your phone." The radio now leaves that library out and syncs the rest.
- **The sync card keeps its numbers after a failed sync.** The track count and the time of the last sync that worked stay on the radio's page and in the app.

### 0.6.15 {#radio-0-6-15}

> November 22, 2026 · [Files on GitHub](https://github.com/rendyhd/lumae/releases/tag/radio-v0.6.15)

- **The radio stays reachable on Wi-Fi.** After days on one connection, a Raspberry Pi's Wi-Fi can stop hearing the network: the radio plays on, but phones can't find it. The radio now keeps Wi-Fi power saving off and reconnects when that happens. It needs the `iw` package: `sudo apt install iw`.
- **Fewer stops in the middle of a song.** The music could go quiet for 5 to 20 seconds while the radio began downloading songs ahead. That work is now small and paced, and a song that was cut off plays on after about 5 seconds.

### 0.6.14 {#radio-0-6-14}

> November 15, 2026 · [Files on GitHub](https://github.com/rendyhd/lumae/releases/tag/radio-v0.6.14)

- **A Palette's artists play on the radio.** A station that follows a Vibe with an artist in its Palette plays that artist's songs. The station's notes count the artists that aren't in the radio's library.

### 0.6.13 {#radio-0-6-13}

> November 13, 2026 · [Files on GitHub](https://github.com/rendyhd/lumae/releases/tag/radio-v0.6.13)

- **Stop, Pause, Skip and Volume answer at once.** While the radio downloaded songs ahead, a press could wait up to half a minute. Playback now goes first.
- **A slow clock check no longer pauses the music.** The radio keeps playing when it can't read the time for a moment.
- **A list moves on from a song that won't play.** After three tries the radio passes over the song, and it downloads a damaged file again.
- **A library that shrinks by more than half is held.** The radio keeps the music it has and says so. Press Sync now again to accept the smaller library; the automatic sync never accepts it.

### 0.6.12 {#radio-0-6-12}

> November 7, 2026 · [Files on GitHub](https://github.com/rendyhd/lumae/releases/tag/radio-v0.6.12)

- **The remote's clock stays put.** While the radio filled its queue or prepared a station, the phone's timeline could jump back. The radio now says where the song is right now.

### 0.6.11 {#radio-0-6-11}

> November 6, 2026 · [Files on GitHub](https://github.com/rendyhd/lumae/releases/tag/radio-v0.6.11)

- **One song, however many copies.** A song you own on several albums counts as one song, even when the tags spell it differently. Once it plays, every copy rests.
- **Songs on many albums still come round more often**, so the songs you own most stay on the air.
- **Ban and Rest follow the song** to every copy on that station. Favor and Less still apply to the one track.

### 0.6.10 {#radio-0-6-10}

> November 4, 2026 · [Files on GitHub](https://github.com/rendyhd/lumae/releases/tag/radio-v0.6.10)

- **Check a station's songs.** The station editor deals 10 songs with clips. Answer Keep, Ban or Skip, and the radio shows what it guessed and why it asked.
- **Loud starts come in gently**: up to 6 dB lower, rising over 8 seconds after the fade. Preferences → SmoothFade → Ease loud starts. Party mode leaves it off.
- **Songs between two regions play again.** A song in two of a station's regions counts by whichever is most due.
- **Shuffle weighs sound**, not only how well two songs fade.
- **The radio says why a Vibe or collection has no music**, and names each music server.
- **The album year** reaches the remote and the home-screen widget.

### 0.6.8 {#radio-0-6-8}

> October 27, 2026 · [Files on GitHub](https://github.com/rendyhd/lumae/releases/tag/radio-v0.6.8)

- **Smoother song changes.** Among the songs a station would play next anyway, it picks the one that fades best from the song before.
- **Calm hours stay calm, not silent.** A station's energy margin follows its own range of songs.
- **No more near-silent starts.** A station passes over a song whose first 30 seconds are near silence. Lists still play every song.
- **Cache fills leave room on the Wi-Fi**, so the remote stays quick while they run.

### 0.6.7 {#radio-0-6-7}

> October 25, 2026 · [Files on GitHub](https://github.com/rendyhd/lumae/releases/tag/radio-v0.6.7)

- **Parametric EQ.** Shape the radio's sound for your speakers and room: presets of up to 10 filters, a response graph, and Compare. Import AutoEq, Equalizer APO or REW files. The EQ never makes the radio louder.
- **Room tuning.** With a USB measurement microphone on the radio, Room tuning measures your speakers at your seat and makes a preset that cuts the room's bass peaks. The radio keeps no recording.
- **Signing in again.** When a session ends, the radio's page asks you to sign in, and the app's remote signs in again by itself.
