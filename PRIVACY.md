# Lumae Privacy Policy

Last updated: October 11, 2026

This policy covers Lumae, the music player for Android phones and iPhone; Lumae
Radio, the radio you run on your own Raspberry Pi; and this website,
lumaemusic.app. Lumae and Lumae Radio work with servers you run yourself. There is no Lumae account and no developer-operated music,
analytics or advertising backend.

Lumae's developer does not receive your music library, listening history,
sign-ins or taste profile. The exceptions are app-update checks handled by
Expo, the data Google's Cast SDK collects (see [Google Cast](#google-cast)), and
anything you choose to send for support.

## The short version

- Your library, your listening history and your taste stay on your phone and
  on servers you run.
- Passwords, tokens and keys are kept in your phone's secure storage.
- AI, Koito and Last.fm album suggestions are off until you turn them on, and
  each receives only what its feature needs.
- Stealth keeps what you play out of your history, your taste and your server.
  Lumae Radio is always in Stealth.
- No ads, no tracking, no selling of data.

## What Lumae keeps on your phone

Depending on the features you use, Lumae stores:

- Your library's details, artwork, lyrics, playlists, ratings, favorites and
  library membership.
- Sound analysis from AudioMuse-AI: embeddings, mood and audio features, and
  map coordinates.
- Your play history, skips and other taste signals; Vibes, Collections,
  shelves, Obsessions, your Want List, album memories and feedback; your
  preferences and EQ presets.
- AI-written titles and the details used for AI album suggestions, if you use
  AI.
- Music and artwork you keep offline, and photos you choose as covers.
- A clip you record with Search by Recording, only until that search is done.
- Server addresses, usernames and settings; for each Lumae Radio you add, its
  address, name, security fingerprint and password.
- Short-lived diagnostic and performance logs.

This information makes playback, offline listening, sync, recommendations and
the rest of the app work. Chats with AI are not saved: they are kept in memory
and cleared after four hours without use, or when you start a new chat.

## How your sign-ins are stored

Passwords, tokens and API keys you enter, for your music server, AudioMuse-AI,
Koito, Last.fm, AI services and Lumae Radio, are kept in your phone's secure
storage: the iOS Keychain, or on Android, storage encrypted with a key held in
the Android Keystore. On iPhone they stay on that phone and are not restored to
a new one. For Jellyfin, Lumae keeps an access token, never your password.

Server addresses, usernames and other settings are kept in the app's private
storage, which the operating system protects but does not separately encrypt.
When you sign in to AudioMuse-AI with a username and password, its session
cookie is kept in the system's cookie store.

## Your own servers

### AudioMuse-AI and Lumae Analysis

Lumae needs AudioMuse-AI with the Lumae Analysis plugin, and one music server:
Navidrome, or Jellyfin 12.0 or later. Lumae sends these servers the sign-ins and
requests it needs to browse and stream your library, fetch artwork and lyrics,
sync sound analysis, download music, and check that AudioMuse-AI and your music
server describe the same library.

Lumae Analysis also keeps your personal Lumae data in step across your phones.
Lumae sends it:

- What you listen to: each finished listen (track, album and artist, and the
  time), the item you pick from search results (not what you typed), and the
  suggestions you view or rate. Plays in Stealth are not sent.
- Your Vibes (name, kind and recipe), Collections (name, description, albums
  and tracks), shelves, and the covers and photos you choose for them.
- Your Want List, album memories including the text you write, and your
  feedback on suggestions.
- Lookups, such as sound searches, similar-album requests and album-detail
  checks that include artist and album names.
- A clip you record with Search by Recording (see below).

If you sign in to AudioMuse-AI with a shared API token, everything synced this
way is shared with everyone who uses that token.

### Your music server

By default, Lumae sends each play (track and time), and your ratings and
favorites, to your music server, and saves playlist changes there. You can turn
off plays and ratings in Settings → Servers & accounts → Scrobbling. Lumae does
not tell your music server what is playing right now.

On Jellyfin, your server's dashboard lists Lumae as a device, with a random
device ID and the app version. Reset configuration (in Settings → Servers &
accounts) signs this phone out of Jellyfin.

### What your servers do on their own

Your servers may contact other services themselves: Navidrome's and Jellyfin's
metadata agents (for artist pictures, biographies and popular tracks), and
Lumae Analysis's MusicBrainz lookups for album details and credits. Those
requests come from your server and follow its settings, not from the Lumae app.

## Koito

Koito is optional and off by default. If you connect a Koito server, Lumae sends
it each play (artist, title, album, length and time) and what is playing now. It
can import your Koito history, including a daily check for plays you made in
other apps.

Lumae does not currently scrobble to Last.fm, ListenBrainz or Maloja.

## Albums to discover with Last.fm

Albums to discover can use Last.fm to suggest albums you don't own yet. It is
off by default and needs three things from you: the Last.fm switch, your own
Last.fm API key, and Share music details. When it runs (at most once a day),
Lumae sends Last.fm the artist and album names it is looking up, with your key.
Covers for those suggestions load from Last.fm's image servers and the Cover
Art Archive. Covers already saved on your Want List can keep showing after you
turn sharing off.

See the [Last.fm Privacy Policy](https://www.last.fm/legal/privacy). The Cover
Art Archive is run by MetaBrainz:
see the [MetaBrainz Privacy Policy](https://metabrainz.org/privacy).

## AI

AI is off by default. You can connect Anthropic, OpenAI, OpenRouter, or a
self-hosted server such as Ollama, Open WebUI, LM Studio or another
OpenAI-compatible server. Lumae sends requests straight to that service, with
your key.

Discuss with AI and Extend with AI run when you use them. Once a service is
connected, AI-written titles (The Pulse's headline, Home mix descriptions and
Comfort mix names) run on their own, also in the background, until you turn
off AI-written titles. Daily AI album suggestions run only if you also turn on
AI album suggestions and Share music details.

Depending on the feature, a request can contain:

- Your messages.
- The current local time, weekday and season, and the track you last played.
- Track and album IDs and details: titles, artists, albums, years, genres and
  your ratings.
- Playlist and Collection names.
- Labels from sound analysis: mood, energy, tempo and similarity.
- Artists you've played recently or often, and favorite songs with rough
  periods, such as "your 2024 song".
- Albums you rated or saved, and memories you chose to share.

Lumae never sends audio, raw sound analysis (embeddings), map coordinates,
exact play counts or exact listening times. Don't put sensitive personal
information in chat messages.

OpenRouter forwards requests to the model provider you choose. OpenAI requests
are sent with storage turned off. A self-hosted server's own setup decides
whether data goes anywhere else, and an `http://` address is not encrypted.
Retention, model training and international transfers are up to each provider:
read [Anthropic's policy](https://www.anthropic.com/legal/privacy),
[OpenAI's API data controls](https://platform.openai.com/docs/models/default-usage-policies-by-endpoint)
or [OpenRouter's policy](https://openrouter.ai/privacy) before you connect one.

## Speakers, casting and the car

When you play on Chromecast, AirPlay, Sonos, HEOS, Android Auto, CarPlay or
Lumae Radio, Lumae shares track details, artwork and the queue with that device
or system. Chromecast and HEOS speakers also receive stream links that include a
sign-in value for your music server, so they can fetch the audio themselves.

Lumae searches your network for speakers when you open the output picker. It
uses Wi-Fi and local-network access for this, never your location.

For Sonos, Lumae can run a small relay on your phone so the speaker can fetch
the audio. It serves only the tracks queued for that speaker, only on your local
network, and stops when the speaker disconnects. If you run the optional Sonos
companion yourself, it uses its own Navidrome sign-in and logs which tracks it
streams.

On Android, only Android Auto, the Google app and your car's assistant (checked
by their signing certificates), and trusted system controls, can browse your
library through Lumae's media session.

### Google Cast

To support Chromecast, Lumae includes Google's Cast SDK. It starts with the
app, even if you never cast. Google declares that on iPhone the SDK collects a
device identifier, diagnostics and casting-usage data, for analytics and to
provide casting, not linked to your identity and not used for tracking. On
iPhone it may also use Bluetooth to find nearby Chromecast devices. Cast devices
may separately send Google usage information or crash reports, depending on
their own settings. See [Google's Privacy Policy](https://policies.google.com/privacy)
and [Google's Cast privacy information](https://support.google.com/chromecast/answer/6279421).

## Lumae Radio

Lumae Radio is in beta. You download it from GitHub's release pages, which fall
under [GitHub's privacy statement](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement);
the radio itself never contacts GitHub or the developer.

### On your phone

Lumae looks for radios on your Wi-Fi (Bonjour, `_lumae-radio._tcp`) only while
Settings → Servers & accounts → Lumae Radio is open. It talks to a radio over
HTTPS, tied to that radio's own security certificate the first time you add it.
If the certificate changes, Lumae won't connect.

When you adopt a radio, Lumae makes its password and keeps it, with the radio's
address, name and security fingerprint, in your phone's secure storage. It is
never included in a backup. Lumae then sends the radio your server details so
you don't have to type them:

- Navidrome: the address, username and password.
- AudioMuse-AI: the address and your API token, or your username and password.
- Jellyfin: the address, user and server ID only. The radio signs in to
  Jellyfin with its own sign-in, which you approve from your phone with Quick
  Connect. Your phone's Jellyfin token stays on your
  phone; Lumae never keeps your Jellyfin password.

The remote reads the radio only while it is open on your screen. Pictures from
the radio are cached on your phone (up to 400). Nothing the remote shows enters
your history, scrobbles or The Pulse. Forget removes a radio from your phone
only.

### On the radio

Lumae Radio runs on your own Raspberry Pi and talks only to the music server
and AudioMuse-AI you set it up with. It has no cloud service, no analytics, no
crash reporting and no automatic update check.

It is always in Stealth: it never reports plays, what is playing now, ratings,
play counts or favorites to your servers. It reads your favorites and playlists
to shape stations. The only thing it writes is a Vibe, when you save a station
as a Vibe or edit a Vibe that a station follows.

The radio stores your sign-ins (for Navidrome a token instead of the password,
for Jellyfin a token, for AudioMuse-AI your API token or username and
password), its stations and schedules, a copy of your library with its sound
analysis, a cache of music, and a radio-only play history of about 57 days.
These are protected by the Pi's file permissions, not encrypted.

Its web page and API answer only on your local network, over HTTPS, and need the
radio's password or an API key you made. Until a radio has an owner, anyone on
your network can adopt it, so adopt it soon after installing, on a network you
trust.

## App updates

Lumae uses Expo Application Services to check for and download app updates, at
launch and when the app comes back to the foreground. Expo may receive your IP
address, a random installation identifier, your phone's operating system, the
app and update versions, and occasionally technical details of an app launch
that failed, as described in the [Expo Privacy Policy](https://expo.dev/privacy).

## Permissions

| Permission | Why Lumae asks |
| --- | --- |
| Local network, Wi-Fi and multicast; nearby Wi-Fi devices on Android | Reach your servers, Lumae Radio and speakers on your network. Never used for location. |
| Notifications | Show progress while music downloads and your library syncs. |
| Background audio and background work | Keep music playing, and let downloads and library sync finish with the app in the background. |
| Photos | Only when you choose a photo as a cover. The camera is never used. |
| Bluetooth (iPhone) | Used by Google's Cast SDK to find Chromecast devices. |
| Microphone (iPhone) and Record audio (Android) | Only when you tap Record in Search by Recording on Discover. Lumae never listens in the background. |
| CarPlay | Show Lumae on your car's screen. |

Lumae does not use your location. Libraries Lumae is built with can declare
permissions Lumae itself never uses, such as fingerprint unlock for secure
storage.

## Search by Recording

When you tap Record in Search by Recording on Discover, Lumae pauses your music
and records about 20 seconds of the music playing near you; it listens only
while the countdown runs. When the countdown ends, Lumae sends the clip to your
AudioMuse-AI server, which looks for the closest songs in your library. It sends
the clip again only if you tap Send again after a search that did not finish.
The clip is a small audio file in the app's cache, which is never backed up. Lumae deletes it
when you leave the screen or no longer need it for the search, and removes any
clip left behind by a crash the next time you open the screen. The clip goes
nowhere else, and Lumae's developer never receives it.

## Photos and covers

When you choose a photo as a cover, Lumae crops it square and saves it as a
small JPEG, which drops its location and camera details. It keeps the photo on
your phone and uploads it to Lumae Analysis on your AudioMuse-AI server, so your
other phones can show it. Lumae Radio shows covers but does not store them.

## Device backups

On Android, Lumae joins Android's backup only on Android 9 or later, and only
when the backup is encrypted with your screen lock or you transfer directly to
a new phone. A cloud backup includes your preferences, your settings without
passwords, tokens or keys, your personal data (ratings, Vibes, Collections, your
Want List, memories and similar), and EQ presets. A direct phone-to-phone
transfer also includes your library database and play history. Passwords,
tokens, keys and downloaded music are never backed up.

On iPhone, Lumae leaves its settings, listening journal and caches out of
backups, and its sign-ins never leave the phone. Your library database
(including play history and ratings), your personal discovery data, music you
keep offline and cover photos are included in iCloud and computer backups.

## Sharing a Vibe

When you share a Vibe code, the code contains the Vibe's name, the titles,
artists, albums, playlists and Collections it is built from, and a summary of
its sound. It goes only where you send it.

## Diagnostics and support

Diagnostic logs stay on your phone unless you export and share them. An exported
log contains the app version, phone model and operating-system version, the
server type with a scrambled address, network status, library counts, recent
sync history and recent performance events. Titles, names, sign-ins, addresses
and file paths are removed, and other identifiers are scrambled. Look it over
before you share it.

Issues opened on GitHub are public and fall under GitHub's privacy statement, so
don't post logs or personal details there. Email them to
`apps@rendyjansen.com` instead. When you email, the developer receives your
email address and whatever you send, and uses it only to help you, look into
problems and keep necessary support records.

## Stealth

While Stealth is on, Lumae doesn't add what you play to your history, doesn't
send it to your music server, Koito or Lumae Analysis, and doesn't learn your
taste from it. Lumae Radio is always in Stealth.

## Keeping and deleting

Information on your phone stays until you delete it, it is replaced during sync,
you clear it in the app, or the operating system removes it. Some is cleared on
its own: detailed listening observations after 90 days, collection sync records
after 30 days, unused cover photos after 2 days. Play history and preferences
stay until you clear them.

Reset configuration keeps your synced library, downloads and ratings. To remove
everything, clear Lumae's app data or uninstall it. Device backups, and on
iPhone the Keychain, can keep some information after you uninstall.

Disconnecting a service stops future requests but doesn't delete what that
service already has. Use its own account controls to manage or delete it, and
revoke keys you no longer use.

## Security

Use HTTPS for servers you reach over the internet. Lumae allows plain HTTP for
self-hosted servers: on iPhone only for addresses on your local network, on
Android for any server. Traffic security then depends on your network. Use
trusted networks, a screen lock, strong passwords, and a VPN or HTTPS when you
connect over the internet.

## Ads, analytics and selling data

Lumae contains no advertising SDKs and no analytics or crash-reporting SDK of
its own; Google's Cast SDK is described above. The developer does not sell,
rent or use your personal information for advertising or cross-app tracking.

## Your choices

You decide which servers and optional services Lumae uses. You can:

- Turn AI off, clear its key, or turn off AI-written titles.
- Turn off music server sync, disconnect Koito, or turn off Last.fm suggestions
  and Share music details.
- Use Stealth, reset your taste profile, remove downloads, or reset the
  configuration.
- Forget a Lumae Radio, revoke its API keys, or sign out every browser.

The developer can't see or delete data that lives only on your phones and your
own servers. Requests about information held by an AI service, Koito, Last.fm,
Google, Expo or a casting service should go to that provider.

For questions or privacy requests about information the developer holds, email
`apps@rendyjansen.com`.

## This website

lumaemusic.app is a static site. It sets no cookies, runs no analytics and loads
nothing from other companies: its fonts, images and scripts come from the site
itself. If you switch between the light and dark theme, that choice is saved in your
browser's local storage, not in a cookie, and never sent anywhere.

The site is hosted on GitHub Pages. Like any web host, GitHub may log your IP
address and browser details to deliver and protect the site; see
[GitHub's privacy statement](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement).
The beta sign-up is a Google Form, under
[Google's privacy policy](https://policies.google.com/privacy): what you enter
there goes to the developer and is used to invite you to the beta. To have your
sign-up deleted, email `apps@rendyjansen.com`.

## Changes

This policy changes when Lumae's features or data practices do. The date at the
top shows when it last changed.

## Contact

Questions about this policy: `apps@rendyjansen.com`.
