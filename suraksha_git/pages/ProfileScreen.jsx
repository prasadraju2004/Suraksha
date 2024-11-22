import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "Jane Doe",
    address: "123 Main St, Cityville",
    phone: "123-456-7890",
    email: "jane.doe@example.com",
    primaryContacts: ["987-654-3210", "456-789-0123", "789-012-3456"],
    profileImage: "https://via.placeholder.com/150",
  });
  
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveEdit = () => {
    setIsEditing(false);
    alert("Profile Updated!");
  };

  const updatePrimaryContact = (index, text) => {
    const updatedContacts = [...user.primaryContacts];
    updatedContacts[index] = text;
    setUser({ ...user, primaryContacts: updatedContacts });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.profileImage }} style={styles.profileImage} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.labelText}>Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.valueText}
              defaultValue={user.name}
              onChangeText={(text) => setUser({ ...user, name: text })}
            />
          ) : (
            <Text style={styles.valueText}>{user.name}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.labelText}>Address:</Text>
          {isEditing ? (
            <TextInput
              style={styles.valueText}
              defaultValue={user.address}
              onChangeText={(text) => setUser({ ...user, address: text })}
            />
          ) : (
            <Text style={styles.valueText}>{user.address}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.labelText}>Phone:</Text>
          {isEditing ? (
            <TextInput
              style={styles.valueText}
              defaultValue={user.phone}
              onChangeText={(text) => setUser({ ...user, phone: text })}
            />
          ) : (
            <Text style={styles.valueText}>{user.phone}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.labelText}>Email:</Text>
          {isEditing ? (
            <TextInput
              style={styles.valueText}
              defaultValue={user.email}
              onChangeText={(text) => setUser({ ...user, email: text })}
            />
          ) : (
            <Text style={styles.valueText}>{user.email}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.labelText}>Primary Contacts:</Text>
          {isEditing ? (
            <View style={styles.contactInputs}>
              {user.primaryContacts.map((contact, index) => (
                <TextInput
                  key={index}
                  style={styles.contactInput}
                  defaultValue={contact}
                  onChangeText={(text) => updatePrimaryContact(index, text)}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.valueText}>{user.primaryContacts.join("   ")}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
        <Text style={styles.editButtonText}>{isEditing ? "Save Profile" : "Edit Profile"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#FFE5D9",
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 30, // Increased margin below the profile image
  },
  infoContainer: {
    width: '100%',
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  labelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    width: 120,
  },
  valueText: {
    fontSize: 18,
    color: '#555',
    flex: 1,
  },
  contactInputs: {
    flexDirection: 'column',
    flex: 1,
  },
  contactInput: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
