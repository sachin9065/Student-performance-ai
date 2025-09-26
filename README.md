# Predictive Analytics for Student Performance

Predictive Analytics for Student Performance is a full-stack web application built with Next.js, Firebase, and TensorFlow.js. It's designed for educators to identify students who may be at risk of falling behind. The application provides a dashboard to visualize student data, calculate risk scores using a machine learning model, and generate predictive insights using GenAI.

## Features

- **Secure Authentication**: Email/password authentication and user management powered by Firebase.
- **Student Data Management**: Manually add individual student records or bulk-import students via CSV upload.
- **Risk Score Calculation**: A client-side TensorFlow.js model analyzes student data to generate a risk score from 0 to 1.
- **Predictive AI Insights**: Leverages a Large Language Model (LLM) to provide actionable insights into why a student might be flagged as high-risk.
- **Interactive Dashboard**: A central dashboard presents a comprehensive list of students, their risk scores, and visual charts to analyze trends like attendance vs. performance.
- **Detailed Student Profiles**: Drill down into individual student pages to view all their data, historical performance, and specific AI-generated insights.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn/ui](https://ui.shadcn.com/)
- **Machine Learning**: [TensorFlow.js](https://www.tensorflow.org/js)
- **Generative AI**: [Google AI](https://ai.google/) via Genkit
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/hosting)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Firebase account and a new Firebase project
- `firebase-tools` CLI installed and authenticated

### 1. Clone the repository

```bash
git clone <repository-url>
cd predictive-analytics-student-performance
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

1.  Navigate to your Firebase project console.
2.  Go to **Project settings** > **General**.
3.  Under "Your apps", create a new "Web" app.
4.  Copy the `firebaseConfig` object.
5.  Create a `.env.local` file in the root of your project and populate it with your Firebase config values:

    ```.env.local
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=...
    ```

6.  In the Firebase console, go to **Authentication** > **Sign-in method** and enable the "Email/Password" provider.
7.  Go to **Firestore Database** and create a new database. Start in "test mode" for easy development (you should configure security rules for production). Create a collection named `students`.

## Model Management & Versioning

The application loads a TensorFlow.js model from the `public/model/` directory. This allows you to update or switch models without changing the application code.

### Updating the Active Model

1.  **Convert Your Model**: Ensure your TensorFlow or Keras model is converted for web use. This typically results in a `model.json` file and one or more `groupX-shardXofX.bin` weight files.
2.  **Replace Files**: Delete any existing files inside the `public/model/` directory.
3.  **Copy New Files**: Copy your new `model.json` and all associated `.bin` weight files into the `public/model/` directory.
4.  **Redeploy**: Deploy the application to make the new model active.

The model loading and preprocessing logic is located in `src/lib/model.ts`. If your new model requires different input shapes or normalization, you may need to adjust the `preprocess` function in this file.

### Versioning Models

To maintain multiple versions of your model, we recommend a file-based versioning strategy within your project:

1.  **Create Versioned Folders**: In the root of your project, create a directory (e.g., `ml-models/`) to store different versions of your model. Inside, create a folder for each version (e.g., `v1`, `v2`).

    ```
    ml-models/
    ├── v1/
    │   ├── model.json
    │   └── group1-shard1of1.bin
    └── v2/
        ├── model.json
        └── group1-shard1of1.bin
    ```

2.  **Switching Versions**: When you want to switch the active model, copy the contents from the desired version folder (e.g., `ml-models/v2/`) into the `public/model/` directory.

This practice keeps your model artifacts organized and allows you to easily switch between versions by updating the files in the `public` directory and redeploying the application.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) to see the application.

## Deployment

This app is configured for one-click deployment to Firebase App Hosting.

1.  Make sure you have the Firebase CLI installed and are logged in (`firebase login`).
2.  Initialize App Hosting in your project: `firebase apphosting:backends:create`. Follow the prompts.
3.  Deploy the application:

    ```bash
    firebase deploy --only apphosting
    ```
