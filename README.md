# Mini ChatGPT Application Guide

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Method 1: Using Node.js (Recommended)](#method-1-using-nodejs-recommended)
  - [Method 2: Using Python (Alternative)](#method-2-using-python-alternative)
- [Usage Guide](#usage-guide)
  - [Basic Chat](#basic-chat)
  - [File Upload](#file-upload)
  - [Search Function](#search-function)
  - [Chat History](#chat-history)
  - [Settings and Theme Toggle](#settings-and-theme-toggle)
- [Configuration](#configuration)
  - [API Key Setup](#api-key-setup)
  - [Theme Settings](#theme-settings)
- [Troubleshooting](#troubleshooting)
  - [Common Issues and Solutions](#common-issues-and-solutions)
- [Support](#support)
- [Conclusion](#conclusion)

## Introduction

The Mini ChatGPT Application is a web-based chat interface that allows users to interact with an AI assistant using the OpenRouter API. It features a modern, mobile-friendly design with support for file uploads, search functionality, chat history, and theme customization.

## Prerequisites

Before you begin, ensure you have the following:

- A modern web browser (Chrome, Firefox, Safari, Edge)
- One of the following:
  - **Node.js** (v14.0 or later) with npm
  - **Python** (v3.0 or later)
- An active internet connection
- An OpenRouter API key (provided separately)

## Installation

### Method 1: Using Node.js (Recommended)

1. **Download the files**
   - Save the following files to a directory on your computer:
     - `index.html`
     - `styles.css`
     - `script.js`
2. **Initialize a Node.js project**
   - Open a terminal/command prompt in the directory containing the files
   - Run:
     ```bash
     npm init -y
     ```
3. **Install a local server package**
   - Run:
     ```bash
     npm install -g live-server
     ```
4. **Start the local server**
   - Run:
     ```bash
     live-server
     ```
   - Your browser should automatically open to `http://localhost:8080`

### Method 2: Using Python (Alternative)

1. **Download the files**
   - Save the following files to a directory on your computer:
     - `index.html`
     - `styles.css`
     - `script.js`
2. **Start a Python HTTP server**
   - Open a terminal/command prompt in the directory containing the files
   - Run:
     ```bash
     # For Python 3.x
     python -m http.server 8000

     # For Python 2.x
     python -m SimpleHTTPServer 8000
     ```
3. **Access the application**
   - Open your browser and navigate to `http://localhost:8000`

## Usage Guide

### Basic Chat

1. **Open the application** in your browser
2. **Type a message** in the input field at the bottom
3. **Press Enter** or click the send button (paper plane icon)
4. **Wait for the response** from the AI assistant
5. **Continue the conversation** by sending more messages

### File Upload

1. **Click the file upload button** (paperclip icon) to the left of the input field
2. **Drag and drop a file** into the upload area, or click to select a file from your computer
3. **Wait for the upload to complete** (progress bar will show upload status)
4. **The file information** will be sent to the AI assistant automatically

### Search Function

1. **Click the search button** (magnifying glass icon) in the header
2. **Type your search term** in the search input field
3. **The chat history** will be filtered to show only messages containing your search term
4. **Click the clear button** (X icon) to reset the search

### Chat History

1. **Click the history button** (clock icon) in the header
2. **View your chat sessions** in the history panel
3. **Click on a session** to load it
4. **Click "New Chat"** to start a fresh conversation
5. **All sessions** are automatically saved to your browser's local storage

### Settings and Theme Toggle

1. **Click the settings button** (gear icon) in the header
2. **Select "Light" or "Dark" theme** to change the appearance
3. **The theme preference** will be saved for future visits

## Configuration

### API Key Setup

1. **Open** **`script.js`** in a text editor
2. **Find the API\_CONFIG object** around line 27-32:
   ```javascript
   const API_CONFIG = {
       key: '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',
       url: 'https://openrouter.ai/api/v1/chat/completions',
       model: 'openai/gpt-3.5-turbo'
   };
   ```
3. **Replace the** **`key`** **value** with your OpenRouter API key
4. **Save the file**
5. **Refresh the application** in your browser

### Theme Settings

- **Theme preferences** are automatically saved to your browser's local storage
- **To reset** the theme, clear your browser's local storage for the application domain
- **Dark theme** is the default if no preference is set

## Troubleshooting

### Common Issues and Solutions

#### CORS Error

**Issue:** You see a "CORS error" or "Failed to fetch" message
**Solution:** Ensure you're running the application through a local server (not opening the HTML file directly in the browser)

#### API Key Issues

**Issue:** The assistant responds with "Sorry, there was an error processing your request"
**Solution:**

1. Verify your API key is correct in `script.js`
2. Check that your API key has sufficient credits
3. Ensure your internet connection is stable

#### Theme Not Saving

**Issue:** The theme resets to default after refreshing
**Solution:**

1. Clear your browser's cache and local storage
2. Ensure your browser allows local storage for the application

#### History Not Loading

**Issue:** Chat history doesn't appear in the history panel
**Solution:**

1. Clear your browser's local storage
2. Refresh the application
3. Start a new chat to create a new session

## Support

If you encounter any issues not covered in this guide, please contact:

- **Email:** \[910zaheer@gmail.com]


## Conclusion

The Mini ChatGPT Application provides a user-friendly interface for interacting with an AI assistant. With features like file uploads, search functionality, chat history, and theme customization, it offers a comprehensive chat experience.

By following this guide, you should be able to install, configure, and use the application effectively. If you have any questions or need further assistance, please refer to the support section.



*This guide was last updated on April 8, 2026*
