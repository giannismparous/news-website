# Syntaktes.gr

A modern Greek news site built with React, Firebase, and Netlify.

Authors; [Giannis Mparous](https://github.com/giannismparous "Giannis Mparous")

## Introduction

## 🚀 Overview

**Syntaktes.gr** is a real-world news platform featuring:

- 🔥 **Trending**, **Latest**, and **Category**-based article feeds
- 👥 User authentication & role management (via Firebase Auth)
- ✍️ Article creation, editing, deletion (with rich-text editor)
- 📧 Newsletter integration (MailerLite)
- 🗺️ Dynamic `sitemap.xml` generation
- 🖼️ Automatic image compression & upload (Firebase Storage)
- 🔍 Full-text search over article titles
- ⚙️ Serverless functions on Netlify (sending emails, newsletters…)
- 📈 SEO optimization & Open Graph meta tags
- 📊 Google Analytics

---

## 📁 Project Structure

### `src/components`

- **`Article.js`**  
  Full-width article previews (e.g. on homepage, category pages).  
- **`SmallArticle.js`**  
  Compact article cards (sidebars, related lists).  
- **`ArticleView.js`**  
  Detailed single-article rendering with social-share buttons.  
- **`Category.js`**  
  Paginated list of articles in a given category.  
- **`Search.js`**  
  Title-based search input with “ngram” filtering.  
- **`Navbar.js`**, **`Footer.js`**  
  Global layout components.  
- **`Login.js`**  
  Admin login form (Firebase Email/Password).  
- **`SubscribePopup.js`**  
  Newsletter signup modal.  
- **`ArticleEditor.js`**  
  Rich-text editor for admin article management.  
- **`CustomClipboard.js`**  
  Paste-sanitizer for ReactQuill.

### `src/pages`

- **`Home.js`** — Landing page  
- **`About.js`** — Static “About us”  
- **`Contact.js`** — Contact form  
- **`Terms.js`** — Terms & Privacy  
- **`Radio.js`**, **`Podcasts.js`**, **`VideoTV.js`** — Media pages  
- **`Admin.js`** — Admin dashboard entry

### `src/firebase`

- **`firebaseConfig.js`**  
  — Firebase App & Firestore setup  
  — CRUD helpers (articles, “info” doc, pagination)  
  — Auth helpers  
  — MailerLite newsletter hooks

### `netlify/functions`

- **`sendNewsletter.js`**  
  Sends a newsletter to selected MailerLite groups  
- **`sendContactEmail.js`**  
  Routes “Contact” form submissions  
- **`getLanguages.js`** (demo) — e.g. fetches locales

---

## 📸 Screenshots

<p align="center">
  <i><b>Live snapshots of Syntaktes.gr</b></i><br/>
  <img src="https://github.com/user-attachments/assets/32458b21-0342-4437-94b4-bcad859165ad" width="800"/>
  <img src="https://github.com/user-attachments/assets/dafd00f9-5b65-4b8b-9b07-d82a2d4abd70" width="800"/>
  <img src="https://github.com/user-attachments/assets/d3c703d9-8864-4bee-873e-8fd669da2022" width="800"/>
  <img src="https://github.com/user-attachments/assets/1a4a7c6c-9714-4067-9721-ff888160e31c" width="800"/>
  <img src="https://github.com/user-attachments/assets/f8605375-5fce-4591-a2b6-aa0ac7d201b3" width="800"/>
  <img src="https://github.com/user-attachments/assets/1e8b9fc5-d717-4b5d-bbea-3a9820258aeb" width="800"/>
  <img src="https://github.com/user-attachments/assets/42079a07-e182-4805-b5bd-edf55dd0c7bb" width="800"/>
</p>

## 🔧 Setup & Local Development

1. **Clone the repo**  
   ```
   git clone https://github.com/giannismparous/syntaktes.gr.git
   cd syntaktes.gr
   ```

2. Configure environment variables

Create a file named .env in the project root (it’s already in .gitignore).

Add your client-side Firebase keys, for example:


```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

For server-side scripts (sitemap generator, Netlify Functions), you need your Firebase Admin SDK JSON. You can either:

Env-var approach:

```
FIREBASE_SERVICE_ACCOUNT=$(cat path/to/serviceAccount.json)
```

File approach: place the JSON (e.g. serviceAccount.json) in your netlify/functions/ folder (and add it to .gitignore), then require() it directly in your function.

3. Install dependencies & run locally

```
npm install
npm start
```

Your app will be running at http://localhost:3000.

4. Build for production

```
npm run build
```

This will also regenerate public/sitemap.xml before creating the optimized build.

5. Deploy

Push your code to GitHub (or another remote) and your connected Netlify site will automatically deploy the build/ directory.

6. Enjoy!
