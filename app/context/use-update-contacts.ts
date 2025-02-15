import Contacts from 'react-native-contacts';
import { useEffect } from 'react';
import { usePostContactsMutation } from '@/api/post-contacts-mutation';
// eslint-disable-next-line react-native/split-platform-components
import { Permission, PermissionsAndroid, Platform } from 'react-native';

export const useUpdateContacts = ({
  phoneNumber,
}: {
  phoneNumber?: string;
}) => {
  const { mutate } = usePostContactsMutation();

  useEffect(() => {
    if (!phoneNumber) return;
    const getContacts = () => {
      console.log('Attempting to get contacts');
      Contacts.getAll()
        .then((contacts) => {
          console.log(`Got ${contacts.length} contacts`);
          mutate(
            {
              userPhoneNumber: phoneNumber,
              contacts: contacts
                .map((contact) => {
                  if (!contact.phoneNumbers.length) return null;
                  return contact.phoneNumbers[0]?.number || null;
                })
                .filter((contact) => contact) as string[],
            },
            {
              onError: (error) => {
                console.error(error);
              },
              onSuccess: () => {
                console.log('Contacts updated');
              },
            }
          );
        })
        .catch((e) => {
          console.log(e);
        });
    };

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS['READ_CONTACTS'] as Permission,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Please accept bare mortal',
        }
      )
        .then((res) => {
          console.log('Permission: ', res);
          getContacts();
        })
        .catch((error) => {
          console.error('Permission error: ', error);
        });
    } else {
      getContacts();
    }
  }, [mutate, phoneNumber]);

  // const updateContacts = useCallback(
  //   async (contacts: Contact[]) => {
  //     try {
  //       await mutate(contacts);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   },
  //   [mutate],
  // );
  //
  // return updateContacts;
};
