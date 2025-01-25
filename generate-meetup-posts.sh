#!/bin/bash

# Array of past events with their dates and meetup URLs
# Format: "DATE|TITLE|MEETUP_URL"
events=(
    "2023-12-06|Blockchain Stammtisch #12 - 2023|https://www.meetup.com/de-DE/blockchainmeetupsaxony/events/297553095"
    "2023-11-15|Blockchain Stammtisch #11 - 2023|https://www.meetup.com/de-DE/blockchainmeetupsaxony/events/297553072"
    "2023-10-18|Blockchain Stammtisch #10 - 2023|https://www.meetup.com/de-DE/blockchainmeetupsaxony/events/296553862"
    "2023-09-20|Blockchain Stammtisch #9 - 2023|https://www.meetup.com/de-DE/blockchainmeetupsaxony/events/295953862"
    "2023-08-16|Blockchain Stammtisch #8 - 2023|https://www.meetup.com/de-DE/blockchainmeetupsaxony/events/295353862"
    "2023-07-19|Blockchain Stammtisch #7 - 2023|https://www.meetup.com/de-DE/blockchainmeetupsaxony/events/294753862"
    "2023-06-21|Blockchain Stammtisch #6 - 2023|https://www.meetup.com/de-DE/blockchainmeetupsaxony/events/294153862"
    "2023-05-17|Blockchain Stammtisch #5 - 2023|https://www.meetup.com/de-DE/blockchainmeetupsaxony/events/293553862"
    "2023-04-19|Blockchain Stammtisch #4 - 2023|https://www.meetup.com/de-DE/blockchainmeetupsaxony/events/292953862"
    "2023-03-15|Blockchain Stammtisch #3 - 2023|https://www.meetup.com/de-DE/blockchainmeetupsaxony/events/292353862"
    "2023-02-15|Blockchain Stammtisch #2 - 2023|https://www.meetup.com/de-DE/blockchainmeetupsaxony/events/291753862"
    "2023-01-18|Blockchain Stammtisch #1 - 2023|https://www.meetup.com/de-DE/blockchainmeetupsaxony/events/291153862"
)

for event in "${events[@]}"; do
    # Split the event string into variables
    IFS='|' read -r date title meetup_url <<< "$event"
    
    # Create filename
    filename="src/content/blog/blockchain-stammtisch-${date}.md"
    
    echo "Generating post for $title..."
    
    # Create the post content
    cat > "$filename" << EOL
---
title: "$title"
date: $date
description: "Blockchain Stammtisch in Dresden - Ein regelmäßiges Treffen der Blockchain Community Dresden."
categories: ["stammtisch"]
tags:
  - blockchain
  - cryptocurrency
  - web3
---

# $title

- 📍 [Rausch Dresden, Bürgerstraße 36](https://maps.app.goo.gl/7GBfjxZkRS2JtahC8)
- 📅 ${date} - 19:00 Uhr
- 🔗 [Meetup Event]($meetup_url)

Wir treffen uns in loser Runde im Restaurant Rausch, in Dresden Bürgerstrasse 36. 
Meldet Euch gerne via [Meetup.com]($meetup_url) an. Ein Tisch ist reserviert.

Themenvorschläge sind:

- Aktuelle Entwicklungen in der Blockchain-Technologie
- Diskussion über neue Projekte und Anwendungsfälle
- Erfahrungsaustausch und Networking
- Und natürlich alles, was Euch interessiert - bringt Themen mit!

Kommt vorbei und lasst uns gemeinsam über die spannende Welt der Blockchain-Technologie diskutieren!
EOL

done

echo "Generated $(echo "${events[@]}" | wc -w) posts for past events." 