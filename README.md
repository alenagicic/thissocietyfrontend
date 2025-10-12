📝 SlowReads — Minimal React CMS Frontend

Live demo:
    🌐 www.slowreads.se

Test credentials:  
    📧 alenagicic@gmail.com  
    🔐 Verysecurepassword123!

✨ Overview

    This is the frontend for a lightweight, serverless CMS built with React and powered by AWS Lambda, API Gateway, and DynamoDB. Users can create, manage, and filter articles with custom tags, leave nested comments, and manage their profiles — all through a clean, minimal interface.

🔧 Tech Stack

    Frontend: React (Vite)

    Backend: AWS Lambda + API Gateway (Python)

    Database: DynamoDB

    Storage: S3 for image uploads (via pre-signed URLs)

    Auth: Token-based (JWT)

    Traffic Control: API Gateway usage plans with API keys for throttling and request management

✅ Features

    📰 Article Creation & Management

        Users can create rich text articles with optional image attachments

        Set custom tags — single words or full sentences

        Tags are used for flexible filtering and searching

    🔍 Tag-Based Filtering

        All tags are user-defined (no pre-set categories)

        Filter articles by any tag or partial tag match

        Autocomplete suggestions powered by a dedicated DynamoDB GSI

    💬 Nested Comments with Notifications

        Authenticated users can:

        Comment on articles

        Reply to other comments (supports deep nesting)

        See if your article or comment received a response

        Works across all signed-in users

        Vote on comments

    🧑 Account Settings

        Retrieve all articles created by the logged-in user

        Update account settings:

        Change username

        Change password

    🖼️ Image Upload

        Secure image uploads using S3 pre-signed URLs

        Users can attach multiple images per article or comment

    🔐 Security

        JWT-based authentication stored in localStorage

        API Gateway usage plans with API keys on all critical endpoints

        Used for throttling, monitoring, and traffic control

        DynamoDB condition expressions used for safe, atomic updates
