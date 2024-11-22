import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const LocRating = () => {
  const [region, setRegion] = useState({
    latitude: 16.5062,   // Vijayawada coordinates
    longitude: 80.6480,
  });

  const [tags, setTags] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputRating, setInputRating] = useState('');
  const [markerCoordinate, setMarkerCoordinate] = useState(null);

  const mapRef = useRef(null);

  // Fetch tags from Firestore on component mount
  useEffect(() => {
    const fetchTags = async () => {
      const tagsCollection = collection(db, 'locations');
      const tagsSnapshot = await getDocs(tagsCollection);
      const tagsData = tagsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setTags(tagsData);
    };
    fetchTags();
  }, []);

  const addTag = () => {
    setModalVisible(true);
  };

  const saveTag = async () => {
    if (!inputText.trim() || !inputRating.trim()) {
      alert('Please enter both a tag and a rating!');
      return;
    }

    const newTag = {
      latitude: markerCoordinate.latitude,
      longitude: markerCoordinate.longitude,
      tag: inputText,
      rating: parseFloat(inputRating),
    };

    // Adding new tag to Firestore
    try {
      const docRef = await addDoc(collection(db, 'locations'), newTag);
      console.log("Tag saved with ID: ", docRef.id);
      setTags([...tags, { ...newTag, id: docRef.id }]);
      setInputText('');
      setInputRating('');
      setMarkerCoordinate(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding tag: ", error);
    }
  };

  const handleMapPress = (e) => {
    const coordinate = e.nativeEvent.coordinate;
    setMarkerCoordinate(coordinate);
    addTag();
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        onPress={handleMapPress}
      >
        {tags.map((tag) => (
          <Marker
            key={tag.id || Math.random().toString()}  
            coordinate={{ latitude: tag.latitude, longitude: tag.longitude }}
          >
            <Callout>
              <Text>{tag.tag}</Text>
              <Text>Rating: {tag.rating}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Modal for adding custom text */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your tag and rating</Text>
            <TextInput
              style={styles.input}
              placeholder="Your tag here"
              value={inputText}
              onChangeText={setInputText}
            />
            <TextInput
              style={styles.input}
              placeholder="Rating (e.g., 5)"
              value={inputRating}
              onChangeText={setInputRating}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={saveTag}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,backgroundColor: "#FFE5D9", },
  map: { flex: 1 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 },
  modalTitle: { fontSize: 18, marginBottom: 15, fontWeight: 'bold' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 5 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  saveButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5 },
  saveButtonText: { color: 'white' },
  cancelButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 5 },
  cancelButtonText: { color: 'white' },
});

export default LocRating;
