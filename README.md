# Blog Aggregator

A TypeScript CLI tool that aggregates RSS feeds, allowing users to add, follow, and manage feeds while storing posts in a PostgreSQL database.

The name comes from **aggreGATOR**! 🐊

##  Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Commands Reference](#commands-reference)
- [Getting Started](#getting-started)
- [Example Workflow](#example-workflow)

##  Features
- Add RSS feeds and store collected posts in a database
- Follow/unfollow feeds from other users
- Multi-user support with authentication
- Browse other users' feeds and aggregated content
- Continuous feed refreshing with customizable intervals

##  Requirements
Before running Gator, ensure you have:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **PostgreSQL** (v12 or higher)

##  Installation

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/Gator.git
cd Gator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up PostgreSQL
Make sure PostgreSQL is running and create the database:
```bash
createdb gator
```

### 4. Run migrations
```bash
npm run migrate
```
This will create all required tables automatically.

### 5. Launch Gator
```bash
npm start
```

##  Commands Reference

###  User Authentication
| Command | Description | Example |
|---------|-------------|---------|
| `register <username>` | Register a new user | `npm run start register john` |
| `login <username>` | Login as an existing user | `npm run start login john` |
| `reset` | Delete your account and all associated data | `npm run start reset` |

###  User Management
| Command | Description | Example |
|---------|-------------|---------|
| `users` | List all registered users | `npm run start users` |
| `follow <username>` | Follow a user's feeds | `npm run start follow jane` |
| `following` | List users you are currently following | `npm run start following` |
| `unfollow <username>` | Unfollow a user | `npm run start unfollow jane` |

###  Feed Management
| Command | Description | Example |
|---------|-------------|---------|
| `addfeed <name> <url>` | Add a new RSS feed (must be logged in) | `npm run start addfeed "Hacker News" "https://hnrss.org/newest"` |
| `feeds` | List your added feeds | `npm run start feeds` |
| `browse` | Browse feeds from users you follow | `npm run start browse` |

###  Aggregated Posts
| Command | Description | Example |
|---------|-------------|---------|
| `agg` | Show aggregated posts from your feeds | `npm run start agg` |
| `agg <interval>` | Auto-refresh posts every X seconds | `npm run start agg 10s` |

##  Getting Started

This guide will walk you through the full workflow of using Gator.

### 1. Launch the CLI
```bash
npm start
```
*You are now in the Gator CLI environment.*

### 2. Create an Account
```bash
npm run start register username
```


### 3. Log In
```bash
npm run start login username
```


### 4. Add Your First Feed
```bash
npm run start addfeed "Feed Name" "Feed URL "
```


### 5. View Your Feeds
```bash
npm run start feeds
```

### 6. Check Aggregated Posts
```bash
npm run start agg
```

### 7. Auto-Refresh Posts
```bash
npm run start agg 10s
```
*Posts will refresh automatically every 10 seconds. Press Ctrl+C to stop.*

##  Example Full Workflow

```bash
# Start Gator
npm start

# Create and login to your account
npm run start register afaf
npm run start login afaf

# Add some feeds
npm run start addfeed "Hacker News" "https://hnrss.org/newest"
npm run start addfeed "TechCrunch" "http://feeds.feedburner.com/TechCrunch"
npm run start addfeed "CSS Tricks" "https://css-tricks.com/feed/"

# View your feeds
npm run start feeds

# See what's new
npm run start agg

# Auto-refresh every 30 seconds
npm run start agg 30s

# Check other users
npm run start users

# Follow another user
npm run start follow johndoe

# Browse their feeds
npm run start browse


# Unfollow if needed
npm run start unfollow johndoe

```

##  Database Schema

The application automatically creates the following tables:
- `users` - Store user information
- `feeds` - Store RSS feed information
- `feed_follows` - Track user-feed relationships
- `posts` - Store aggregated posts from feeds


##  Acknowledgments

- Built with TypeScript and Node.js
- PostgreSQL for data persistence
- RSS parsing for feed aggregation

---

**Happy feed aggregating! 🐊**
