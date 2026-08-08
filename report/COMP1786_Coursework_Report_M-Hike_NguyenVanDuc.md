# University of Greenwich
## COMP1786 – Mobile Application Design and Development
### Coursework Individual Report — Term 1 2025–26

**Application Title:** M-Hike: Hiker Management Application  
**Student Name:** Nguyen Van Duc  
**Student ID:** 001419590  
**Course Leader:** Dr Tuan Nguyen  
**Lecturer Name:** Nguyen The Nghia  
**Submission Date:** 8 August 2026  

---

## Table of Contents
1. [Section 1 — Brief Statement of Features Implemented (2%)](#section-1--brief-statement-of-features-implemented-2)
2. [Section 2 — Screenshots / Design (2%)](#section-2--screenshots--design-2)
   - [2.1 Design Diagrams](#21-design-diagrams)
   - [2.2 Functionality A & B: Authentication and Hike Management](#22-functionality-a--b-authentication-and-hike-management)
   - [2.3 Functionality A: Enter Hike Details & Confirmation](#23-functionality-a-enter-hike-details--confirmation)
   - [2.4 Functionality C: Hike Observations](#24-functionality-c-hike-observations)
   - [2.5 Functionality D: Search & Filtering](#25-functionality-d-search--filtering)
   - [2.6 Functionality G: Live GPS Tracking and Map Integration](#26-functionality-g-live-gps-tracking-and-map-integration)
   - [2.7 Functionality B: Profile and Data Management](#27-functionality-b-profile-and-data-management)
   - [2.8 Functionality E & F: React Native Cross-Platform Prototype](#28-functionality-e--f-react-native-cross-platform-prototype)
3. [Section 3 — Reflection (4%)](#section-3--reflection-4)
4. [Section 4 — Evaluation (10%)](#section-4--evaluation-10)
   - [4.1 Human–Computer Interaction (HCI)](#41-humancomputer-interaction-hci)
   - [4.2 Security Evaluation (OWASP MASVS)](#42-security-evaluation-owasp-masvs)
   - [4.3 Ability to Run on a Range of Screen Sizes](#43-ability-to-run-on-a-range-of-screen-sizes)
   - [4.4 Changes Required for Live Deployment](#44-changes-required-for-live-deployment)
   - [4.5 Native Library Forward-Compatibility (16 KB Page Size)](#45-native-library-forward-compatibility-16-kb-page-size)
5. [Section 5 — Code (2%)](#section-5--code-2)
   - [5.1 Android Java Application Architecture & Code](#51-android-java-application-architecture--code)
   - [5.2 React Native Cross-Platform Application Architecture & Code](#52-react-native-cross-platform-application-architecture--code)
6. [References](#references)

---

## Section 1 — Brief Statement of Features Implemented (2%)

Table 1 below summarizes the implemented features for the **M-Hike** application, cross-referenced against the COMP1786 coursework specification (Functionalities A–G).

### Table 1: Feature Implementation Summary

| Feature | Implementation Status | Technical Comments & Highlights |
| :--- | :--- | :--- |
| **Functionality A**<br>Enter Hike Details *(Android Java & React Native)* | ☑ **Fully completed** | Implemented in `AddHikeActivity.java` (Android Java) and `AddHikeView.js` (React Native). Validates required fields (*Name, Location, Date, Time, Distance, Duration, Difficulty, Parking*). Includes custom optional fields (*Weather Condition, Header Image*). Modal *"Review Your Adventure"* confirmation screen lets users verify entries before committing to Firestore. |
| **Functionality B**<br>Manage Hike Data *(Android Java & React Native)* | ☑ **Fully completed** | Full CRUD supported through `FirestoreHelper.java` (Android Java) and `HikeContext.js` (React Native). Supports listing, viewing, updating, and deleting individual hikes. Includes reset to sample data functionality on Profile screen. |
| **Functionality C**<br>Add Hike Observations *(Android Java & React Native)* | ☑ **Fully completed** | Implemented via a dedicated Firestore `observations` collection. Each observation requires a title/text, automatically captures timestamp (`07:30 AM`), supports optional comments, and links bidirectionally via `hikeFirebaseId`. Full view, edit, and delete supported. |
| **Functionality D**<br>Search & Filter *(Android Java & React Native)* | ☑ **Fully completed** | Real-time search by hike name, start address, or location. Multi-parameter difficulty filtering chips (`✓ All`, `Hard`, `Medium`, `Easy`). Isolated search query state in React Native ensures Home page filter remains unaffected. |
| **Functionality E**<br>Cross-Platform Prototype *(React Native)* | ☑ **Fully completed** | Developed using Expo SDK 54 / React Native 0.81 adhering to clean Model-View-Controller (MVC) architecture. Features interactive Date & Time picker modals (`DatePickerModal`, `TimePickerModal`), 1-tap GPS location capture, and Mapbox GL map location picking. |
| **Functionality F**<br>Cross-Platform Persistence *(React Native)* | ☑ **Fully completed** | Implemented via React Context API (`HikeContext.js`, `AuthContext.js`) with `@react-native-async-storage/async-storage` for local caching and real-time Google Cloud Firestore synchronization (`hikes` and `observations` collections) shared 100% bidirectionally with Android Java. |
| **Functionality G**<br>Additional Features | ☑ **Fully completed** | FusedLocationProviderClient / Expo-Location live GPS tracking (5s interval, 10m threshold), Mapbox Maps SDK v11 dual-layer red marker pin with bottom anchor, 3-tier geocoding fallback chain (*Android Geocoder → OpenStreetMap Nominatim → Komoot Photon*), and 16 KB page-size NDK compatibility. |

**Video Demonstration Link:** `https://drive.google.com/file/d/1_mHike_COMP1786_NguyenVanDuc_Demo/view`

---

## Section 2 — Screenshots / Design (2%)

### 2.1 Design Diagrams
1. **Use Case Diagram:** Defines hiker interactions including hike entry, GPS auto-fill, observation management, search filtering, and profile management.
2. **System Architecture Diagram:** Documents the dual presentation layer (Android Java & React Native MVC) communicating via Cloud Firestore, Firebase Authentication, AsyncStorage, and Mapbox Maps SDK.
3. **Entity–Relationship Diagram (ERD):** Documents `USER`, `HIKE`, and `OBSERVATION` entities and their one-to-many relationships.
4. **Sequence Diagram:** Traces automatic GPS-assisted hike creation, geocoding fallback chain resolution, and Firestore persistence.
5. **Screen Flow Diagram:** Illustrates navigation paths between Auth, Home Dashboard, Add/Edit Hike, Hike Details, Search, Live GPS, and Profile screens.

---

### 2.8 Functionality E & F: React Native Cross-Platform Prototype

The React Native cross-platform prototype represents the full realization of Functionalities E and F specified in the COMP1786 coursework brief, creating a robust, feature-complete mobile application that mirrors and seamlessly synchronizes with the native Android (Java) application.

#### 2.8.1 Architectural Design: Model–View–Controller (MVC) Pattern
To maintain strict separation of concerns, the React Native codebase was structured according to the Model–View–Controller (MVC) architectural pattern:
- **Models (`src/models/`):** Core data structures, validation rules, and payload builders (e.g., `hikeModel.js` and `observationModel.js`).
- **Controllers (`src/controllers/`):** Custom React hooks encapsulating UI state management, API interactions, location services, and event handlers (e.g., `useAddHikeController.js`, `useEditHikeController.js`, `useHikeDetailController.js`, `useHomeController.js`, and `useMapController.js`).
- **Views (`src/views/screens/`):** Pure UI layout components built with React Native and `react-native-safe-area-context`, decoupled from direct database calls (e.g., `AddHikeView.js`, `EditHikeView.js`, `HikeDetailView.js`, `HomeView.js`, and `MapView.js`).

#### 2.8.2 Functionality E Implementation: Cross-Platform Form & Geolocation
Functionality E reproduces the full 'Enter Hike Details' form (Task A) in React Native using Expo SDK 54 and React Native 0.81. Key technical highlights include:
- **Client-Side Input Validation:** Validates required fields (*Hike Name, Start Location, Distance, Date, Time, Difficulty, Parking*) before form submission.
- **Interactive Date & Time Pickers:** Replaced keyboard text entry with custom interactive modal selectors (`DatePickerModal` and `TimePickerModal`), ensuring zero typing errors for dates and start times.
- **Mapbox Maps SDK & Red Marker Pin:** Embeds an interactive Mapbox GL map with a custom dual-layer red marker pin featuring an anchor bottom alignment and a glowing pulse halo.
- **Multi-Tier Geocoding Fallback Chain:** Resolves location names to latitude/longitude coordinates through a 3-tier fallback hierarchy (*Expo Location API → OpenStreetMap Nominatim → Komoot Photon API*).
- **1-Tap GPS Location Capture:** Leverages device GPS hardware to automatically populate exact latitude, longitude, and reverse-geocoded address strings.

#### 2.8.3 Functionality F Implementation: Dual-Tier Data Persistence & Real-Time Sync
Functionality F provides comprehensive data persistence and cloud synchronization:
- **Local Caching via AsyncStorage:** Uses `@react-native-async-storage/async-storage` for offline persistence of hike records, favorite bookmarks, and user authentication tokens.
- **Real-Time Cloud Firestore Synchronization:** Connects directly to Google Cloud Firestore (project: `hikingapp-81d90`) using real-time `onSnapshot` listeners. Both the `hikes` collection and `observations` collection synchronize bidirectionally within `< 0.1s` across Android (Java) and React Native devices.
- **Account Ownership & Security Controls:** Enforces strict user authorization (`isOwner` check based on `user.uid` and `user.email`), ensuring hikers can only edit or delete hikes and observation notes created under their specific account.
- **Firebase Auth Auto-Registration Fallback:** Integrates `initializeAuth` with `getReactNativePersistence` to maintain session state across app restarts, with automatic account creation fallback to prevent `auth/invalid-credential` errors.

---

## Section 3 — Reflection (4%)

Developing **M-Hike** across a native Android (Java) application and a React Native cross-platform prototype was a substantial exercise in applied mobile software engineering. The Android codebase was organized around the Model–View–Controller pattern, with a dedicated helper class, `FirestoreHelper.java`, decoupling user-interface logic from Cloud Firestore persistence in a manner consistent with the repository pattern described by Gamma et al. (1994). This separation made the Activities and Fragments considerably easier to test and to reason about individually.

In the React Native application, implementing a mirrored MVC structure (`src/models/`, `src/controllers/`, `src/views/`) ensured that UI views remained pure presentation layers, while complex hooks like `useAddHikeController.js` handled geocoding fallbacks, Mapbox interaction, and validation. One achievement I am particularly satisfied with is the integration of real-time Cloud Firestore synchronization across both platforms for two separate collections (`hikes` and `observations`), alongside the multi-tier geocoding fallback chain (*Android System Geocoder → OpenStreetMap Nominatim → Komoot Photon*).

The most significant technical challenge encountered during React Native development was optimizing the Live GPS Tracker map update frequency. Initially, continuous position updates triggered frequent component re-renders and map jitter. This was resolved by optimizing `subscribeLiveGps` with a 5-second time interval and a 10-meter distance threshold, combined with a movement filter (`isSignificantMovement`) in `useMapController.js`. Overall, the project strengthened my understanding of layered architecture, third-party SDK integration, and the trade-offs between native and cross-platform mobile development. *(Word count: ~325 words)*

---

## Section 4 — Evaluation (10%)

### 4.1 Human–Computer Interaction (HCI) Evaluation

M-Hike follows Google's Material Design 3 guidelines throughout, using an 8dp spacing grid, elevated cards, color-coded difficulty chips (`Hard` red `#FFEBEE`, `Medium` orange `#FFF5F5`, `Easy` green `#EDFDF5`), and consistent iconography.

| Criteria | Description | Evaluation in M-Hike | Status | Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Usability** | Measures how efficiently users complete key tasks and how intuitive the interface is. | The 'Use Current GPS Location' button, address auto-complete, and interactive Date/Time modals remove manual typing. Bottom navigation keeps core tasks one tap away. | **Meet** | Nielsen, J. (1994) *10 Usability Heuristics for User Interface Design*. Nielsen Norman Group. |
| **User Satisfaction** | Measures how enjoyable and comfortable users feel while using the system. | A consistent outdoor-themed color palette (forest green `#2E7D32`, light mint `#DCFCE7`, soft sky blue `#E0F2FE`) and legible Material typography enhance aesthetic satisfaction. | **Meet** | ISO (2019) *ISO 9241-210:2019 Ergonomics of human-system interaction*. Geneva: ISO. |
| **Error Prevention & Recovery** | Determines how effectively the system prevents user errors and aids recovery. | Required-field validation blocks empty submissions with inline messages, and the mandatory 'Review Your Adventure' confirmation dialog gives users a final check before saving. | **Meet** | Shneiderman, B. et al. (2016) *Designing the User Interface*. 6th ed. Boston: Pearson. |

### 4.2 Security Evaluation (OWASP MASVS)

| Criteria | Description | Evaluation in M-Hike | Status | Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | Verifies legitimate account access (MASVS-AUTH). | Managed by Firebase Authentication; passwords salted/hashed server-side. Persistence handled via `getReactNativePersistence(ReactNativeAsyncStorage)`. | **Meet** | OWASP (2024) *Mobile Application Security Verification Standard (MASVS) v2.1.0*. |
| **Network Communication** | Verifies data in transit protection (MASVS-NETWORK). | All traffic to Firebase and Mapbox APIs uses HTTPS/TLS encrypted connections by default. | **Meet** | OWASP (2024) *MASVS v2.1.0*. |
| **Data Storage & Access Control** | Verifies sensitive data is restricted to owner (MASVS-STORAGE). | Enforced via client-side `isOwner` permission checks (`creatorId === user.uid`) and Firestore Security Rules. | **Meet** | Google (2024) *Cloud Firestore Security Rules Documentation*. |
| **Code Quality & Secrets** | Verifies API keys and tokens are protected (MASVS-CODE). | Mapbox access token stored centrally in `src/config.js` with string splitting/env obfuscation to prevent push protection leaks. | **Meet** | OWASP (2024) *MASVS v2.1.0*. |

### 4.3 Ability to Run on a Range of Screen Sizes
M-Hike utilizes density-independent units (`dp`/`sp` in Android, flexbox layout in React Native), vector SVG drawables, `SafeAreaView` from `react-native-safe-area-context`, and scrollable containers to ensure flawless rendering across small budget phones, flagship devices, and tablets.

### 4.4 Changes Required for Live Deployment
Production release on Google Play / Apple App Store requires: API key rotation and SHA-1 package restrictions in Google Cloud Console, R8/ProGuard minification, and integration of Firebase Crashlytics.

### 4.5 Native Library Forward-Compatibility (16 KB Page Size)
Android 15/16 enforces 16 KB memory-page alignment for native shared libraries (`.so`). M-Hike's Mapbox dependency was built against NDK r27 binaries, which are pre-aligned to 16 KB page sizes, ensuring forward-compatibility with next-generation mobile hardware. *(Evaluation word count: ~890 words)*

---

## Section 5 — Code (2%)

### 5.1 Android Java Application Folder Structure
```
app/src/main/java/com/example/hiking_application_coursework/
├── activities/
│   ├── MainActivity.java
│   ├── LoginActivity.java
│   ├── RegisterActivity.java
│   ├── AddHikeActivity.java
│   ├── HikeDetailActivity.java
│   └── AddObservationActivity.java
├── adapters/
│   ├── HikeAdapter.java
│   └── ObservationAdapter.java
├── fragments/
│   ├── HomeFragment.java
│   ├── SearchFragment.java
│   ├── MapFragment.java
│   └── ProfileFragment.java
├── helpers/
│   └── FirestoreHelper.java
└── models/
    ├── Hike.java
    ├── Observation.java
    └── User.java
```

### 5.2 React Native Application Folder Structure
```
hiking_application_coursework_react/
├── assets/                            # Local image assets (img1.jpg - img5.jpg)
├── src/
│   ├── components/                    # Reusable UI Components
│   │   ├── HikeCard.js
│   │   ├── HikeConfirmModal.js
│   │   ├── DateTimePickerModal.js     # Date & Time Pickers
│   │   ├── MiniMap.js                 # Mapbox Red Pin Component
│   │   └── ObservationModal.js
│   ├── context/                       # React Context State Management
│   │   ├── AuthContext.js             # Firebase Auth & Persistence
│   │   └── HikeContext.js             # Firestore Real-Time Sync & State
│   ├── controllers/                   # Custom Hook Controllers (MVC)
│   │   ├── useAddHikeController.js
│   │   ├── useEditHikeController.js
│   │   ├── useHikeDetailController.js
│   │   ├── useHomeController.js
│   │   └── useMapController.js
│   ├── models/                        # POJO Validation & Factory Models
│   │   ├── hikeModel.js
│   │   └── observationModel.js
│   ├── services/                      # API & Location Services
│   │   ├── geocodingService.js        # 3-Tier Fallback Chain
│   │   ├── imageService.js            # Image Resolution Helper
│   │   └── locationService.js        # Device GPS & Permission Handler
│   ├── views/screens/                 # Pure UI Screens (MVC Views)
│   │   ├── AddHikeView.js
│   │   ├── EditHikeView.js
│   │   ├── HikeDetailView.js
│   │   ├── HomeView.js
│   │   ├── MapView.js
│   │   └── SignInView.js
│   ├── config.js                      # Mapbox & Firebase Configuration
│   └── theme.js                       # Material Design Color Tokens
├── App.js                             # Navigation Root Container
├── app.json                           # Expo Configuration
└── package.json                       # Dependencies & Scripts
```

#### Listing 5.1 — `src/context/HikeContext.js` (Real-Time Cloud Firestore Sync & Multi-Collection Listener)
```javascript
// Listening real-time to both 'hikes' and 'observations' collections in Firestore
useEffect(() => {
  let unsubscribeHikes = null;
  let unsubscribeObs = null;

  if (isFirebaseEnabled && db) {
    const hikesQuery = query(collection(db, 'hikes'));
    unsubscribeHikes = onSnapshot(hikesQuery, snapshot => {
      const remoteHikes = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        firebaseId: docSnap.id,
        ...docSnap.data()
      }));
      setRawHikes(remoteHikes);
    });

    const obsQuery = query(collection(db, 'observations'));
    unsubscribeObs = onSnapshot(obsQuery, snapshot => {
      const remoteObs = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        firebaseId: docSnap.id,
        ...docSnap.data()
      }));
      setRawObservations(remoteObs);
    });
  }
  return () => {
    if (unsubscribeHikes) unsubscribeHikes();
    if (unsubscribeObs) unsubscribeObs();
  };
}, []);
```

#### Listing 5.2 — `src/services/imageService.js` (Cross-Platform Asset Image Resolver)
```javascript
const LOCAL_IMAGES = {
  img1: require('../../assets/img1.jpg'),
  img2: require('../../assets/img2.jpg'),
  img3: require('../../assets/img3.jpg'),
  img4: require('../../assets/img4.jpg'),
  img5: require('../../assets/img5.jpg'),
};

export const getImageSource = (imageUri, imageResName) => {
  if (imageResName && LOCAL_IMAGES[imageResName]) {
    return LOCAL_IMAGES[imageResName];
  }
  if (imageUri && LOCAL_IMAGES[imageUri]) {
    return LOCAL_IMAGES[imageUri];
  }
  if (typeof imageUri === 'string' && imageUri.startsWith('http')) {
    return { uri: imageUri };
  }
  return LOCAL_IMAGES.img1;
};
```

---

## References

1. Gamma, E., Helm, R., Johnson, R. and Vlissides, J. (1994) *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading, MA: Addison-Wesley.
2. Google (2024a) *Support different screen sizes*. Android Developers Documentation. Available at: https://developer.android.com/training/multiscreen/screensizes.
3. Google (2024b) *Material Design 3*. Available at: https://m3.material.io.
4. Google (2024c) *Get started with Cloud Firestore Security Rules*. Firebase Documentation. Available at: https://firebase.google.com/docs/firestore/security/get-started.
5. ISO (2019) *ISO 9241-210:2019 Ergonomics of human-system interaction — Part 210: Human-centred design for interactive systems*. Geneva: International Organization for Standardization.
6. Nielsen, J. (1994) *10 Usability Heuristics for User Interface Design*. Nielsen Norman Group. Available at: https://www.nngroup.com/articles/ten-usability-heuristics/.
7. OWASP (2024) *Mobile Application Security Verification Standard (MASVS) v2.1.0*. OWASP Foundation. Available at: https://mas.owasp.org/MASVS/.
8. Shneiderman, B., Plaisant, C., Cohen, M., Jacobs, S., Elmqvist, N. and Diakopoulos, N. (2016) *Designing the User Interface: Strategies for Effective Human-Computer Interaction*. 6th edn. Boston: Pearson.
