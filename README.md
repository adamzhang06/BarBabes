
# BarBabes — Your Party's AI Safety Net

## Pitch

BarBabes is your party's AI safety net. Combining NFC tracking, Gemini sobriety tests, and more, the app assists in responsible drinking, combats hangxiety, and empowers women to enjoy college safely.

## Inspiration

Situational anxiety should not tamper with a night out. Young women should not have to battle thoughts like "can I get home safely" or "am I surrounded by safe people" on a regular college outing. These thoughts aren't just paranoia; they stem from heightened vulnerabilities which amplify the real and ongoing risk of sexual assault and misconduct that all women face today.

We realized that while emergency apps and protocols exist to prevent such, none actually directly address the risks before they escalate. This is personal for us; we’ve seen loved ones struggle with medically-induced alcohol intolerance and the trauma of assault. That's why we created BarBabes—it acts as a non-incriminating hand, automating safety checks and mental math so friend groups can look out for each other without the noise.

## What it does

BarBabes’ mobile app uses NFC-enabled alcohol consumption tracking, ideally implemented through tags embedded in drink coasters provided by bars. Each time a user scans a drink, the app instantly logs it and updates their cumulative alcohol intake. This FastAPI data feeds directly into BarBabes’ BAC estimation, which calculates the user’s current blood alcohol concentration based on their profile biometric data, including height, weight, age, and predicted tolerance.

The app notifies users when they are approaching unsafe limits and promotes group accountability through Gemini-powered sobriety checks, designated driver coordination, emergency contacts, and automated alerts if a friend may be at risk.

## How we built it

We began with a desk review of existing BAC tracking apps, smart breathalyzers, and standard drink measurements. Next, we examined edge cases and ethical concerns, including connectivity failures, inaccurate drink tracking, privacy and data sharing risks, and accessibility for diverse student populations.

With research compiled, we moved to ideation and iteration, sketching on whiteboards and creating wireframes in Figma. Once the framework was established, we set up a MongoDB database to store user profiles, including ID, age, sex, and weight. Front-end development followed using React Native and Expo, with Gemini and Claude assisting in generating code from our wireframes. Finally, we built the back end, connecting Python FastAPI and MongoDB to the app and integrating the Gemini API and Snowflake for additional functionality.

## Challenges we ran into

-   **CORS & Network Turmoil**: Connecting our Expo frontend to the local FastAPI backend created significant Cross-Origin Resource Sharing (CORS) issues. We eventually overcame this by configuring strict middleware policies and using ngrok to tunnel the backend for reliable mobile access.
    
-   **The "Simulator Gap"**: Mobile simulators generally do not support NFC hardware, which meant we had to constantly deploy builds to physical devices to debug the drink-scanning flow.
    
-   **Subjective Sobriety**: Teaching an AI to define "drunk" is complex. Tuning the Gemini system prompt to weigh biological behavior—like reaction time slowing by 40%—higher than theoretical math (the Widmark formula) without "hallucinating" risk took significant iteration.
    
-   **Latency vs. Safety**: In a bar setting, users won't wait for a loading screen. We had to optimize our API calls and background threads to ensure the "Safety Score" felt instantaneous.
    

## Accomplishments that we're proud of

-   **Creative Approach**: We tackled a highly relevant problem space through a creative approach, integrating hardware, AI manipulation, and full-stack development.
    
-   **Cohesive Teamwork**: We worked as a cohesive team, leveraging individual strengths to combine AI, back-end, front-end, UX/UI, and “vibe-coding” into a seamless experience.
    
-   **Functional Prototype**: We translated iterations of high-fidelity wireframes into a functional mobile app prototype, using AI efficiently to accelerate development.
    
-   **Real-Time Data**: We utilized FastAPI to predict, manage, and streamline data in real time, enabling smooth and responsive functionality.
    

## What we learned

Building BarBabes taught us how to bridge the gap between digital safety and physical social environments. We deepened our understanding of full-stack development by implementing physiological modeling through the Widmark formula to estimate Blood Alcohol Content (BAC). Integrating hardware like NFC tags for drink validation and utilizing Google Gemini 2.0 Flash for AI-powered sobriety assessments taught us about the process of real-time data handling and edge case management. We learned the importance of accessible UI/UX design for impaired users, using high-contrast color palettes and large touch areas to make sure the app remains functional in high-stress or low-visibility situations. Through the use of MongoDB for live data, we also gained experience in creating scalable, data-driven safety solutions.

## What's next for BarBabes

BarBabes aims to expand the hardware, potentially integrating smart breathalyzer technology for more accurate BAC tracking. We also aim to enhance the social experience with features such as sharable summaries of highlights throughout the night, fun group tasks, and a sobriety group leaderboard. Additionally, we plan to establish credible enterprise partnerships with college bars to integrate BarBabes into their responsible service initiatives.
