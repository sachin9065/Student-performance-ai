# **App Name**: Risk Insights

## Core Features:

- User Authentication: Secure user authentication system with email/password login and admin role management.
- Student Data Entry Form: Form for manual entry of student data, including student ID, name, age, gender, attendance, study hours, previous marks, and scores.
- CSV Student Data Import: Import student records in bulk via CSV upload with data validation, preview, and batch write functionality to Firestore.
- Risk Score Calculation: Calculates and displays a risk score (0-1) for each student based on input data, using a client-side TensorFlow.js model.
- Predictive insights tool: The LLM evaluates all the fields including previous performance. Based on all that, and based on the TFJS model results, the tool gives insight on why a student may be flagged.
- Student Dashboard: Admin dashboard visualizing student data in a table format, including the calculated risk score. Charts (line/bar/pie) display relationships like attendance vs. performance.
- Student Details Page: Individual student profile page displaying all details, model inference results, and historical data (if available).

## Style Guidelines:

- Primary color: Slate blue (#778BDE) for a calm yet focused feel. It suggests reliability and intellect.
- Background color: Light gray (#F0F2F5), providing a clean and neutral backdrop.
- Accent color: Deep violet (#674DB7) for interactive elements and highlights. Offers a contrast with analogous hues.
- Body text: 'PT Sans', a modern, warm, readable sans-serif for comfortable on-screen reading.
- Headline font: 'Space Grotesk', for a contemporary scientific feel in headers.
- Use modern, outline-style icons to represent data points and navigation elements.
- Clean, card-based layout with ample spacing for data presentation. Prioritize readability and easy navigation.