#!/bin/bash

# Create the blog directory if it doesn't exist
mkdir -p src/content/blog

# Array of post filenames
posts=(
    "2024-02-05-dresden_gathering.md"
    "2024-02-21-dresden_gathering.md"
    "2024-03-05-dresden_gathering.md"
    "2024-03-21-dresden_gathering.md"
)

for post in "${posts[@]}"; do
    echo "Fetching $post..."
    # Get the content from GitHub
    content=$(curl -s "https://raw.githubusercontent.com/ddblock/ddblock.github.io/main/_posts/$post")
    
    # Create new filename
    new_name="blockchain-stammtisch-${post:0:10}.md"
    
    # Extract title and tags
    title=$(echo "$content" | grep "^title:" | cut -d'"' -f2)
    tags=$(echo "$content" | grep "^tags:" | cut -d: -f2 | tr ',' '\n' | sed 's/^ *//' | sed 's/^/  - /')
    
    # Create new frontmatter
    cat > "src/content/blog/$new_name" << EOL
---
title: "$title"
date: ${post:0:10}
description: "Blockchain Stammtisch in Dresden - Ein regelmäßiges Treffen der Blockchain Community Dresden."
categories: ["stammtisch"]
tags:
$tags
---
EOL
    
    # Add the content after frontmatter (skip the original frontmatter)
    echo "$content" | awk 'BEGIN{p=0}/^---/{p++}p==2{p=3;next}p>2' >> "src/content/blog/$new_name"
done

echo "Migration complete!" 