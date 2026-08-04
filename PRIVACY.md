# Lumae Privacy Policy

Last updated: August 4, 2026

Lumae is a local-first music player for self-hosted music libraries. It does not
require a Lumae account and has no developer-operated music, analytics, or
advertising backend.

Except for app-update metadata processed by Expo and information you
deliberately send for support, Lumae's developer does not receive your music
library, listening history, credentials, or taste profile.

## Data stored on your device

Depending on the features you use, Lumae stores:

- Music metadata, artwork, lyrics, playlists, ratings, favourites, and library
  membership.
- Sonic-analysis data from AudioMuse-AI, including embeddings, mood and audio
  features, and map coordinates.
- Listening history, playback events, skips, taste signals, palettes,
  collections, obsessions, preferences, and AI discovery conversations.
- Downloaded audio and artwork when you use offline features.
- Server addresses, usernames, passwords, API tokens, and integration settings.
- Short-lived diagnostic and performance logs.

This information is used to provide playback, offline listening, library sync,
recommendations, taste features, and other app functionality.

The cloud-AI API key is stored in the device's Keychain or Keystore. Other
server credentials and settings are kept in the app's private local storage.
Private app storage is protected by the operating-system sandbox but should not
be treated as a separately encrypted password vault.

## Servers and services Lumae connects to

### Music and analysis servers

Lumae connects to the servers you configure, including:

- AudioMuse-AI.
- Navidrome, Jellyfin, Emby, or Lyrion music servers.
- Other compatible endpoints you configure.

Lumae sends credentials and requests needed to authenticate, browse and stream
your library, retrieve artwork and lyrics, synchronize analysis data, download
music, and verify that AudioMuse-AI and the music server refer to the same
library.

Depending on your settings and provider support, Lumae may also send play
events, ratings, favourites, and playlist changes back to your music server.

### Scrobbling and listening-history services

Scrobbling integrations are optional. Lumae supports Last.fm, ListenBrainz,
Maloja, Koito, and compatible self-hosted endpoints.

When enabled, these services may receive your credentials or token together
with track title, artist, album, duration, now-playing status, and playback
time. Last.fm discovery requests may also include artist and album names, and a
Last.fm history import retrieves your listening history for local matching.

Their handling of information is governed by their own policies, including the
[Last.fm Privacy Policy](https://www.last.fm/legal/privacy) and
[MetaBrainz Privacy Policy](https://metabrainz.org/privacy).

### Optional AI discovery

AI discovery is disabled by default.

If you enable Anthropic, OpenAI, or OpenRouter, Lumae sends prompts directly to
the selected provider using the API key you supply. Depending on the feature,
prompts may contain:

- Your chat messages.
- Track identifiers and metadata such as titles, artists, albums, years, and
  ratings.
- Derived context such as mood, energy, tempo, similarity, time of day, recent
  artists, or the last-played track.
- Playlist, collection, or session names.

Lumae does not send audio files or raw sonic embeddings to cloud AI providers.
Avoid entering sensitive personal information in AI chat messages.

If you select Ollama, data is sent only to the Ollama address you configure. It
remains on your device only when that address points to an Ollama instance
running on the same device; a LAN or remote Ollama server receives the request
instead.

Provider retention, model-training, and international-transfer practices are
controlled by the provider. Review
[Anthropic's policy](https://www.anthropic.com/legal/privacy),
[OpenAI's API data controls](https://platform.openai.com/docs/models/default-usage-policies-by-endpoint),
or [OpenRouter's policy](https://openrouter.ai/privacy/) before enabling a
cloud provider. OpenRouter may also forward prompts to the model provider it
routes your request to.

### Casting and connected devices

When you use Chromecast, AirPlay, Sonos, HEOS, Android Auto, or system media
controls, Lumae may share current track metadata, artwork, queue information,
and playable stream URLs with the selected device or platform.

Local-device discovery uses Wi-Fi, local-network access, and, where supported,
Bluetooth. Lumae does not use these permissions to obtain precise location.

For Sonos playback, Lumae may temporarily run a local HTTP relay on your phone
so the selected speaker can retrieve audio from your music server. The relay is
available only on the local network during the casting session and stops when
the session ends. If you configure a Sonos companion service, that service may
receive track identifiers and relay audio or artwork.

Google Cast devices may separately send Google usage information or crash
reports according to their device settings and
[Google's Cast privacy information](https://support.google.com/chromecast/answer/6279421).

### App updates

Lumae uses Expo Application Services to check for and download app updates.
Expo may receive your IP address, device operating system, a randomized update
token, and update-request or performance information, as described in the
[Expo Privacy Policy](https://expo.dev/privacy).

## Microphone and on-device audio analysis

Lumae does not upload microphone recordings. If microphone access is requested
for an optional audio-input feature, processing occurs on the device and the
audio is not stored.

Optional loudness and SmoothFade analysis processes downloaded music locally.
Audio analyzed this way is not sent to Lumae's developer or a cloud AI
provider.

## Diagnostics and support

Diagnostic and performance logs remain on your device unless you explicitly
export and share them. An exported log may contain app and device information,
network status, a sanitized server address, track identifiers, and recent
performance events. Review it before sharing.

If you email `apps@rendyjansen.com`, the developer receives your email address
and the contents and attachments you provide. This information is used only to
respond, investigate issues, and maintain necessary support records.

## Retention and deletion

Local information remains on your device until it is deleted, replaced during
synchronization, cleared through an available app control, or removed through
the operating system. Some detailed listening events and temporary caches are
automatically pruned, while aggregate history and preferences may remain
longer.

Resetting Lumae's connection configuration does not erase the already-synced
local library. To remove all local information, clear Lumae's app data or
uninstall the app. Operating-system backups or secure-storage behaviour may
retain some information after uninstalling.

Disconnecting a third-party service stops future requests but does not delete
information already held by that service. Use that service's account controls
to manage or delete it, and revoke credentials when appropriate.

## Security

Use HTTPS for remote servers whenever possible. Lumae permits local HTTP
connections for self-hosted servers and LAN playback, so traffic security
depends on your configuration and network. Use trusted networks, a device
lock, strong credentials, and a VPN or HTTPS when connecting over the internet.

## Analytics, advertising, and sale of data

Lumae contains no third-party advertising or behavioural-analytics SDKs. The
developer does not sell, rent, or use your personal information for advertising
or cross-app tracking.

## Your choices and rights

You control which servers and optional integrations Lumae uses. You can disable
AI, clear its API key, disconnect scrobbling services, remove downloads, or
revoke credentials at any time.

The developer normally cannot access or delete data held only on your device or
self-hosted servers. Requests concerning information held by a cloud AI,
scrobbling, casting, or update provider should also be directed to that
provider.

For questions or applicable privacy-rights requests concerning information
held by Lumae's developer, email `apps@rendyjansen.com`.

## Changes

This policy may be updated when Lumae's features or data practices change. The
latest version will show its effective date above.

## Contact

Questions about this policy can be sent to `apps@rendyjansen.com`.
