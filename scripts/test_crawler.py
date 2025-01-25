#!/usr/bin/env python3
from meetup_crawler import MeetupCrawler

def main():
    # Initialize crawler with test credentials
    crawler = MeetupCrawler(
        username="your-email@example.com",  # Replace with your email
        password="your-password"            # Replace with your password
    )
    
    # Get just one event as a test
    events = crawler.get_past_events(limit=1)
    
    if events:
        # Create and save the post
        post = crawler.create_markdown_post(events[0])
        crawler.save_posts([post], "src/content/blog")
        print(f"Successfully created post for: {events[0]['name']}")
        
        # Print the post content for preview
        print("\nPost preview:")
        print("=" * 40)
        print(post.content)
    else:
        print("No events found. Make sure your credentials are correct.") 