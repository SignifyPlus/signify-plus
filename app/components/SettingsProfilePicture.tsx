import { useAppContext } from '@/context/app-context';
import { View, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useUploadProfilePictureMutation } from '@/api/user/upload-profile-picture-mutation';
import { useUpdateUserMutation } from '@/api/user/update-user-mutation';

export const SettingsProfilePicture = () => {
  const { user, setUser } = useAppContext();

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

      console.log('Uploaded to:', publicUrl);

      if (user)
        setUser({
          ...user,
          profilePicture: publicUrl,
        });

      await mutateAsync(
        {
          phoneNumber: user!.phoneNumber,
          profilePicture: publicUrl,
        },
        {
          onSuccess: (data) => {
            console.log('data', JSON.stringify(data, null, 2));
            setUser({ ...user, ...data });
          },
        }
      );
    }
  };

  return (
    <Pressable onPress={pickAndUploadImage}>
      {user?.profilePicture ? (
        <Image
          source={{ uri: user.profilePicture }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#ddd',
            marginRight: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      ) : (
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#ddd',
            marginRight: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="person-outline" size={28} color="#555" />
        </View>
      )}
    </Pressable>
  );
};
