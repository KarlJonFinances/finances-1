import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../types/navigation';

export default function ScanScreen({ navigation }: MainTabScreenProps<'Scan'>) {
  const [scanning, setScanning] = useState(false);

  const handleCameraPress = () => {
    Alert.alert(
      'Camera',
      'Camera integration will be implemented here',
      [{ text: 'OK' }]
    );
  };

  const handleGalleryPress = () => {
    Alert.alert(
      'Gallery',
      'Image picker will be implemented here',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="scan" size={80} color="#4F46E5" />
        <Text style={styles.title}>Scan Receipt</Text>
        <Text style={styles.description}>
          Take a photo or upload an image of your receipt
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCameraPress}
          >
            <Ionicons name="camera" size={32} color="#fff" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleGalleryPress}
          >
            <Ionicons name="images" size={32} color="#4F46E5" />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Choose from Gallery
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#4F46E5',
  },
});
