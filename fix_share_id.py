import re

# Update Arena.tsx share link
with open('src/components/Arena.tsx', 'r') as f:
    arena_content = f.read()

arena_content = arena_content.replace(
    "const shareUrl = window.location.origin;",
    "const shareUrl = `${window.location.origin}/add/${currentUserUid}`;"
)
arena_content = arena_content.replace(
    "Ayo main KoinKita bareng! Tambahkan aku dengan ID: ${userData?.displayName || userData?.name}#${userData?.tag}",
    "Ayo main KoinKita bareng! Tambahkan aku: ${shareUrl}"
)
arena_content = arena_content.replace(
    "Let's play KoinKita! Add me with ID: ${userData?.displayName || userData?.name}#${userData?.tag}",
    "Let's play KoinKita! Add me: ${shareUrl}"
)

with open('src/components/Arena.tsx', 'w') as f:
    f.write(arena_content)

# Update UserProfile.tsx QRCode link
with open('src/components/UserProfile.tsx', 'r') as f:
    profile_content = f.read()

profile_content = profile_content.replace(
    "<QRCodeSVG value={`${window.location.origin}/add/${userTag}`} size={70} />",
    "<QRCodeSVG value={`${window.location.origin}/add/${user.uid}`} size={70} />"
)

with open('src/components/UserProfile.tsx', 'w') as f:
    f.write(profile_content)

print("Share URLs updated to use UID")
