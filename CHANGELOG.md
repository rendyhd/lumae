# What's new in Lumae

What changed in each Lumae beta build and update, and in each Lumae Radio release. Newest first. An update reaches the build it names by itself; a new build comes through TestFlight on iPhone and Google Play on Android ([how to join the beta](https://lumaemusic.app/beta/)).

The list starts with the updates of late October 2026. Earlier betas aren't listed.

## Lumae Music

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
