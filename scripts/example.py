#!/usr/bin/env python3
import os
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import time
from pathlib import Path
import frontmatter
import yaml
import re

class MeetupCrawler:
    def __init__(self, username=None, password=None):
        self.username = username or os.getenv("MEETUP_USERNAME")
        self.password = password or os.getenv("MEETUP_PASSWORD")
        if not self.username or not self.password:
            raise ValueError("MEETUP_USERNAME and MEETUP_PASSWORD environment variables are required")
        
        self.session = requests.Session()
        self.login()
    
    def login(self):
        """Login to Meetup using credentials."""
        print(f"Logging in as {self.username}...")
        
        # Modern Meetup uses OAuth flow
        login_url = "https://secure.meetup.com/oauth2/authorize"
        params = {
            "client_id": "3ro2gm5fh276meq3h3pd1kljbo",
            "response_type": "token",
            "redirect_uri": "https://www.meetup.com/",
            "scope": "basic"
        }
        
        # Get initial OAuth page
        response = self.session.get(login_url, params=params)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the login form
        form = soup.find('form', {'id': 'login-form'})
        if not form:
            print("Login form not found. The page structure might have changed.")
            return
        
        # Get the action URL and any hidden fields
        action_url = form.get('action', login_url)
        hidden_fields = {
            field.get('name'): field.get('value')
            for field in form.find_all('input', type='hidden')
        }
        
        # Add credentials
        login_data = {
            **hidden_fields,
            'email': self.username,
            'password': self.password
        }
        
        # Submit login form
        response = self.session.post(
            action_url,
            data=login_data,
            headers={'Referer': response.url}
        )
        
        if not response.ok or "error" in response.url:
            raise Exception("Login failed")
        print("Login successful!")
    
    def get_past_events(self, group_urlname="blockchainmeetupsaxony", limit=None):
        """Fetch past events from the group using web scraping."""
        print(f"Fetching past events from {group_urlname}...")
        events = []
        page = 0
        
        while True:
            url = f"https://www.meetup.com/{group_urlname}/events/past/"
            params = {'page': page}
            
            response = self.session.get(url, params=params)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find event cards
            event_cards = soup.find_all('div', {'data-testid': 'event-card'})
            if not event_cards:
                break
                
            for card in event_cards:
                event = self._parse_event_card(card)
                if event:
                    print(f"Found event: {event['name']}")
                    events.append(event)
                    
                    # Get detailed event info
                    event.update(self._get_event_details(event['link']))
                    
                    if limit and len(events) >= limit:
                        return events
            
            page += 1
            time.sleep(1)  # Be nice to the server
        
        return events
    
    def _parse_event_card(self, card):
        """Extract information from an event card."""
        try:
            title = card.find('h2').text.strip()
            link = card.find('a')['href']
            date_elem = card.find('time')
            date = date_elem['datetime'] if date_elem else None
            
            return {
                'name': title,
                'link': f"https://www.meetup.com{link}",
                'local_date': date.split('T')[0] if date else None,
                'local_time': date.split('T')[1][:5] if date else None,
            }
        except Exception as e:
            print(f"Error parsing event card: {e}")
            return None
    
    def _get_event_details(self, event_url):
        """Fetch detailed information for an event."""
        print(f"Getting details from {event_url}")
        response = self.session.get(event_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        details = {}
        
        # Get description
        description_elem = soup.find('div', {'data-testid': 'event-description'})
        if description_elem:
            details['description'] = description_elem.text.strip()
        
        # Get venue
        venue_elem = soup.find('div', {'data-testid': 'venue-info'})
        if venue_elem:
            details['venue'] = {
                'name': venue_elem.find('h3').text.strip() if venue_elem.find('h3') else 'Rausch Dresden',
                'address': venue_elem.find('address').text.strip() if venue_elem.find('address') else 'Bürgerstraße 36',
                'city': 'Dresden'
            }
        
        # Get attendee count
        attendees_elem = soup.find('span', {'data-testid': 'attendee-count'})
        if attendees_elem:
            count_text = attendees_elem.text.strip()
            count_match = re.search(r'\d+', count_text)
            if count_match:
                details['yes_rsvp_count'] = int(count_match.group())
        
        return details
    
    def create_markdown_post(self, event):
        """Convert event data to a markdown post."""
        print(f"Creating markdown post for {event['name']}")
        
        # Extract topics/tags from description if available
        description = event.get("description", "")
        topics = []
        if "Themenvorschläge" in description:
            try:
                topics_section = description.split("Themenvorschläge")[1].split("\n\n")[0]
                topics = [t.strip("- ") for t in topics_section.split("\n") if t.strip("- ")]
            except:
                topics = []
        
        # Create frontmatter
        post = frontmatter.Post("")
        post.metadata = {
            "title": event["name"],
            "date": event["local_date"],
            "description": event.get("description", "").split("\n")[0][:160] if event.get("description") else "Blockchain Stammtisch in Dresden - Ein regelmäßiges Treffen der Blockchain Community Dresden.",
            "categories": ["stammtisch"],
            "tags": topics if topics else ["blockchain", "cryptocurrency", "web3"],
            "meetup_url": event["link"],
            "venue": event.get("venue", {
                "name": "Rausch Dresden",
                "address": "Bürgerstraße 36",
                "city": "Dresden",
            }),
            "attendees": event.get("yes_rsvp_count", 0),
        }
        
        # Create content
        content = f"""# {event["name"]}

- 📍 [{post.metadata["venue"]["name"]}, {post.metadata["venue"]["address"]}](https://maps.app.goo.gl/7GBfjxZkRS2JtahC8)
- 📅 {event["local_date"]} - {event.get("local_time", "19:00")} Uhr
- 🔗 [Meetup Event]({event["link"]})
- 👥 {post.metadata["attendees"]} Teilnehmer

{event.get("description", "")}
"""
        post.content = content
        
        return post
    
    def save_posts(self, posts, output_dir):
        """Save posts to markdown files."""
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        for post in posts:
            date = post.metadata["date"]
            filename = output_dir / f"blockchain-stammtisch-{date}.md"
            
            print(f"Saving post to {filename}")
            with open(filename, "w", encoding="utf-8") as f:
                f.write("---\n")
                yaml.dump(post.metadata, f, allow_unicode=True, sort_keys=False)
                f.write("---\n\n")
                f.write(post.content)

def main():
    # Initialize crawler with test credentials
    crawler = MeetupCrawler(
        username=os.getenv("MEETUP_USERNAME"),
        password=os.getenv("MEETUP_PASSWORD")
    )
    
    # Get just one event as a test
    events = crawler.get_past_events(limit=1)
    
    if events:
        # Create and save the post
        post = crawler.create_markdown_post(events[0])
        crawler.save_posts([post], "src/content/blog")
        print(f"\nSuccessfully created post for: {events[0]['name']}")
        
        # Print the post content for preview
        print("\nPost preview:")
        print("=" * 40)
        print(post.content)
    else:
        print("No events found. Make sure your credentials are correct.")

if __name__ == "__main__":
    main() 