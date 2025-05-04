import { useAppContext } from '@/context/app-context';
import {
  View,
  Image,
  Pressable,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useUploadProfilePictureMutation } from '@/api/user/upload-profile-picture-mutation';
import { useUpdateUserMutation } from '@/api/user/update-user-mutation';
import { useState } from 'react';

export const SettingsProfilePicture = () => {
  const { user, setUser } = useAppContext();
  const [isModalVisible, setModalVisible] = useState(false);

  const { mutateAsync: uploadProfilePicture } =
    useUploadProfilePictureMutation();
  const { mutateAsync } = useUpdateUserMutation();

  const pickAndUploadImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission is required to access the gallery');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length) {
      const selectedAsset = result.assets[0]!;

      const { publicUrl } = await uploadProfilePicture({
        imageUri: selectedAsset.uri,
        phoneNumber: user!.phoneNumber,
      });

      if (user) {
        setUser({
          ...user,
          profilePicture: publicUrl,
        });
      }

      await mutateAsync(
        {
          phoneNumber: user!.phoneNumber,
          profilePicture: publicUrl,
        },
        {
          onSuccess: (data) => {
            setUser({ ...user, ...data });
          },
        }
      );
    }
  };

  const handleImagePress = () => {
    if (user?.profilePicture) {
      setModalVisible(true);
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Pressable onPress={handleImagePress}>
        {user?.profilePicture ? (
          <Image
            source={{ uri: user.profilePicture }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profileImage}>
            <Ionicons name="person-outline" size={28} color="#555" />
          </View>
        )}
      </Pressable>
      <Pressable onPress={pickAndUploadImage}>
        <Text style={{ color: '#007AFF', fontSize: 14 }}>Edit</Text>
      </Pressable>

      {user?.profilePicture && (
        <Modal visible={isModalVisible} transparent>
          <View style={styles.modalContainer}>
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ddd',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
  },
});
