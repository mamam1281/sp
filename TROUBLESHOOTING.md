# Gemini Sports Club - Troubleshooting Guide

This document provides solutions to common problems that may arise during the development or testing of the Gemini Sports Club application.

## 1. Authentication & Login Issues

### Problem: I can't log in, or the login page keeps appearing.

-   **Cause 1: Incorrect Credentials**
    -   You may be using the wrong email or password.
-   **Solution:**
    -   Double-check your credentials. The default test accounts are:
        -   **Admin:** `admin@test.com` (pw: `password123`)
        -   **Premium:** `premium@test.com` (pw: `password123`)
        -   **User:** `user@test.com` (pw: `password123`)

-   **Cause 2: Corrupted `localStorage` Data**
    -   Sometimes, browser data can become corrupted, causing issues with session validation.
-   **Solution:**
    1.  Open your browser's Developer Tools (usually by pressing F12).
    2.  Go to the "Application" (or "Storage") tab.
    3.  Find "Local Storage" in the left-hand menu.
    4.  Right-click on the entry for this site and select "Clear".
    5.  Refresh the page. The application will re-seed the initial data, and you should be able to log in again.

## 2. AI Functionality Issues

### Problem: AI analysis is not generating, and I see an error related to an "API key".

-   **Cause: Gemini API Key Not Set or Invalid**
    -   The application requires a valid Google Gemini API key, which it expects to find in an environment variable (`process.env.API_KEY`).
-   **Solution:**
    -   Ensure your `API_KEY` is correctly set in your development environment's "Secrets" or "Environment Variables" section. For detailed instructions for different environments (AI Studio, local command line, VS Code with `.env`), refer to the **[➡️ 에셋 관리 가이드](./ASSETS_GUIDE.md)**.
    -   Verify your API key is correct and has not exceeded its usage quota on the [Google AI Studio dashboard](https://aistudio.google.com/app/apikey).

### Problem: I'm a premium member, but I can't see the premium analysis.

-   **Cause:** The premium analysis feature is located on the dedicated Match Details page and is generated on-demand.
-   **Solution:**
    1.  From the Home screen, click on any match card to navigate to its details page.
    2.  On the details page, you will find the "👑 프리미엄 심층 분석" section.
    3.  Click the "최신 심층 분석 보기" button to generate and view the analysis. This ensures you always receive the most up-to-date insights from the AI.

### Problem: The Match Detail page was slow the first time, but now it's very fast.

-   **Cause: AI Analysis Caching**
    -   This is expected behavior and a feature for performance optimization. The first time you visit a match detail page, the app calls the Gemini API to generate the AI summary and (if applicable) the premium analysis. This can take a few seconds.
-   **Solution:**
    -   The generated analysis is then cached in your browser's `localStorage`.
    -   Any subsequent time you visit the same match detail page, the app will instantly load the analysis from the cache instead of calling the API again. This results in a much faster experience and reduces unnecessary API calls. The cache is cleared when an administrator uses the "Reset All Data" function.

## 3. Admin Dashboard Issues

### Problem: I made a change in the Admin Dashboard (e.g., edited a user, resolved a bet), but the data seems incorrect or hasn't updated.

-   **Cause: `localStorage` Data Conflict**
    -   While the dashboard is designed to be robust, complex manual edits could potentially lead to an inconsistent state in the browser's local storage.
-   **Solution: Reset Application Data**
    -   The quickest way to resolve data corruption is to reset it to its initial state.
    1.  Log in as an administrator (`admin@test.com`).
    2.  Navigate to the **Admin** page.
    3.  Find and click the **"Reset All Data"** button in the top-right corner of the `AdminPage.tsx` file (this is a placeholder for where the button would be). This will clear all user, bet, and match data and re-seed the original three test users.
    4.  You may need to refresh the page or log in again after the reset. This will provide a clean slate for testing.

## 4. UI and Content Display Issues

### Problem: A page is not loading, or I see a "No routes matched location" error.

-   **Cause: Routing Configuration**
    -   This application uses `HashRouter` from `react-router-dom` for compatibility with various deployment environments that may not support server-side routing for SPAs. An error might occur if a link is malformed.
-   **Solution:**
    -   Ensure you are using the navigation elements (like the bottom navigation bar) to move between pages.
    -   If you are manually typing a URL, make sure it follows the hash-based pattern (e.g., `.../#/events`, `.../#/match/real-kbo-1`).

### Problem: Some team logos are not displaying correctly.

-   **Cause: Limitation of the Logo API**
    -   Team logos are fetched dynamically from a free third-party service (`logo.clearbit.com`). This service is not always reliable and may fail to find logos for some teams.
-   **Solution:**
    -   This is a known limitation of the prototype. For a production version, logos should be managed locally. See the **[➡️ 에셋 관리 가이드](./ASSETS_GUIDE.md)** for instructions on how to add local logo files.