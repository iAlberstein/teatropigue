import landing from "./components/landing/landing";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBb_KZjqSGZzLcyba3wiFv0u4MSDWC3uc8",
  authDomain: "teatropigue-f27f8.firebaseapp.com",
  databaseURL: "https://teatropigue-f27f8-default-rtdb.firebaseio.com",
  projectId: "teatropigue-f27f8",
  storageBucket: "teatropigue-f27f8.appspot.com",
  messagingSenderId: "396880108469",
  appId: "1:396880108469:web:391c294e09d0944bc097fc",
  measurementId: "G-GG2E93Q747"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
    return (
        <div className="App">
            <landing />
        </div>
    )
}