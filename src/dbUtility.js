import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot, 
  increment, 
  serverTimestamp 
} from "firebase/firestore";
import { db, auth } from "./firebase";

const COLLECTION_NAME = "userTrips";

const getCurrentUserId = () => auth.currentUser?.uid || "0";

export const createTripPlan = async (tripData) => {
  try {
    const payload = {
      userId: getCurrentUserId(),
      origin: tripData.origin || "",
      destination: tripData.destination || "",
      distance: Number(tripData.distance || 0),
      totalDuration: Number(tripData.totalDuration || 0),
      carbonOffset: Number(tripData.carbonOffset || 0),
      journeys: 0,
      lastUsed: serverTimestamp(),
      legs: tripData.legs || [],
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
    return docRef.id;
  } catch (error) {
    console.error("Error creating trip plan:", error);
    throw error;
  }
};

export const subscribeToUserTrips = (callback, onError) => {
  const userId = getCurrentUserId();
  
  // Single field query (no composite index required)
  const q = query(
    collection(db, COLLECTION_NAME),
    where("userId", "==", userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const trips = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // Sort chronologically in JS memory
      trips.sort((a, b) => {
        const timeA = a.lastUsed?.toMillis ? a.lastUsed.toMillis() : 0;
        const timeB = b.lastUsed?.toMillis ? b.lastUsed.toMillis() : 0;
        return timeB - timeA;
      });

      callback(trips);
    },
    (error) => {
      console.error("Error subscribing to user trips:", error);
      if (onError) onError(error);
    }
  );
};

export const getUserTripsOnce = async () => {
  try {
    const userId = getCurrentUserId();
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);
    const trips = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    // Sort chronologically in JS memory
    trips.sort((a, b) => {
      const timeA = a.lastUsed?.toMillis ? a.lastUsed.toMillis() : 0;
      const timeB = b.lastUsed?.toMillis ? b.lastUsed.toMillis() : 0;
      return timeB - timeA;
    });

    return trips;
  } catch (error) {
    console.error("Error fetching user trips:", error);
    throw error;
  }
};

export const getTripById = async (tripId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching trip ${tripId}:`, error);
    throw error;
  }
};

export const logJourneyTaken = async (tripId) => {
  try {
    const tripRef = doc(db, COLLECTION_NAME, tripId);
    await updateDoc(tripRef, {
      journeys: increment(1),
      lastUsed: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error logging journey for trip ${tripId}:`, error);
    throw error;
  }
};

export const updateTripPlan = async (tripId, updateData) => {
  try {
    const tripRef = doc(db, COLLECTION_NAME, tripId);
    await updateDoc(tripRef, updateData);
  } catch (error) {
    console.error(`Error updating trip ${tripId}:`, error);
    throw error;
  }
};

export const deleteTripPlan = async (tripId) => {
  try {
    const tripRef = doc(db, COLLECTION_NAME, tripId);
    await deleteDoc(tripRef);
  } catch (error) {
    console.error(`Error deleting trip ${tripId}:`, error);
    throw error;
  }
};