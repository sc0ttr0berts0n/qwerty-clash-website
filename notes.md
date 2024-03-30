# Notes

## Discord Auth Flow

### Getting Auth Token

-   User clicks login
-   User redirected off to autheticate
-   user returns, sharing auth token
-   auth token stored as cookie
    -   also stores expiration data

### User has Auth Token

-   app taps server, renews auth data
    -   also stores expiration data

### User submits availability

-   data shared to netlify func
    -   meet id
    -   auth token
    -   status
-   func queries discord to get DiscordID
-   func queries to see if user is known Player via discord ID
    -   if exists, avail is updated on table
-   Respond with status of: Discord Query, table insert
