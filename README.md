# Gator – Blog Aggregator
Gator is a TypeScript CLI tool that aggregates RSS feeds, allowing users to add, follow, and manage feeds while storing posts in a PostgreSQL database. 
With Gator, you can easily keep up with your favorite blogs, news sites, podcasts, and more—all from the terminal.

The name comes from aggreGATOR! 🐊

# Features :
- Add RSS feeds and store collected posts in a database .
- Follow/unfollow feeds from other users.
- Multi-user support with authentication.
- Browse other users’ feeds and aggregated content.

  # Requirements :
 ## Before running Gator, ensure you have: 
 - Node.js
 - npm
 - PostgreSQL

   # Installation :
   1- Clone the repository:
                           git clone https://github.com/<your-username>/Gator.git
                            cd Gator
   2- Install dependencies:
                           npm install
   3- Set up your PostgreSQL database :
   Make sure PostgreSQL is running and the gator database exists. The schema is included in the project, so tables will be created automatically.
   4- Run migrations :
   Run npm run migrate to create the required tables in your PostgreSQL database.
   
   

