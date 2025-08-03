# Minkedin 

A minimalist, LinkedIn-style web application where users can register, log in, create posts, and manage their profiles. This project was built to demonstrate a full-stack application using Next.js and Firebase.

---

##  Live Demo

[** Click here to try Minkedin**](https://minkedin-ebon.vercel.app/) 

---

##  Tech Stack

* **Framework**: [Next.js 14+](https://nextjs.org/) (with App Router)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Backend / Auth / DB**: [Firebase](https://firebase.google.com/)
    * Firebase Authentication (Email/Password)
    * Firestore Database
* **Deployment**: [Vercel](https://vercel.com/)

---

##  Core Features

*  **User Authentication**: Secure email & password signup and login.
*  **User Profiles**: View and edit your profile, including your name, email, and a personal bio.
*  **Simple Posts**: Create text-based posts that are linked to your profile.
*  **Protected Routes**: Key pages like the profile and post creation areas are only accessible after logging in.
*  **Real-time Updates**: Firestore's real-time capabilities ensure that new posts and profile changes appear instantly.

---

##  Project Structure

A clean and scalable project structure using the Next.js App Router.

```
/app
├── (auth)
│   ├── login/
│   └── signup/
├── (main)
│   ├── profile/
│   └── create-post/
├── page.tsx          # Homepage / Main Feed
└── layout.tsx        # Root Layout
/lib
└── firebase.ts       # Firebase configuration and initialization
/components
└── (ui components)   # Reusable components (e.g., Navbar, PostCard, Button)
/styles
└── globals.css       # Tailwind CSS setup and global styles
```

---

## 🔧 Getting Started

Follow these instructions to get a local copy up and running.

### 1. Clone the Repository

First, clone the project to your local machine.

```bash
git clone [https://github.com/vahiyaatproduct9/minkedin.git](https://github.com/vahiyaatproduct9/minkedin.git)
cd minkedin
```

### 2. Install Dependencies

Install the necessary project dependencies using npm.

```bash
npm install
```

### 3. Set up Firebase

* Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
* In your new project, go to the **Authentication** section and enable the **Email/Password** sign-in method.
* Navigate to the **Firestore Database** section and create a new database. You can start in **test mode** for development.
* In your project settings, find your Firebase web app configuration keys.

### 4. Configure Environment Variables

Create a file named `.env.local` in the root of your project and add your Firebase configuration keys.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Run the Development Server

Now you can start the local development server.

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.
I picked it because it sounded good.

---

##  License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

##  Author

Made with caffeine and code by [**@vahiyaatproduct9**](https://github.com/vahiyaatproduct9).
