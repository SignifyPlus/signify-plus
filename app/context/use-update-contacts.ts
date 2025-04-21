import Contacts from "react-native-contacts";
import { type Contact } from "react-native-contacts/type";
import { useEffect, useState } from "react";
import { usePostContactsMutation } from "@/api/post-contacts-mutation";
// eslint-disable-next-line react-native/split-platform-components
import { Permission, PermissionsAndroid, Platform } from "react-native";
import { sanitizePhoneNumber } from "./app-context";

export const useUpdateContacts = ({
  phoneNumber,
}: {
  phoneNumber?: string;
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { mutate } = usePostContactsMutation();

  useEffect(() => {
    if (!phoneNumber) return;
    const getContacts = () => {
      Contacts.getAll().then((contacts) => {
        setContacts(
          contacts.map((contact) => {
            const sanitizedContact = contact.phoneNumbers.map((phone) => ({
              ...phone,
              number: sanitizePhoneNumber(phone.number),
            }));
            return {
              ...contact,
              phoneNumbers: sanitizedContact,
            };
          })
        );
        mutate(
          {
            userPhoneNumber: phoneNumber,
            contacts: (
              contacts
                .map((contact) => {
                  if (!contact.phoneNumbers.length) return null;
                  return contact.phoneNumbers[0]?.number || null;
                })
                .filter((contact) => contact) as string[]
            ).map(sanitizePhoneNumber),
          },
          {
            onSuccess: () => {},
          }
        );
      });
    };

    if (Platform.OS === "android") {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS["READ_CONTACTS"] as Permission,
        {
          title: "Contacts",
          message: "This app would like to view your contacts.",
          buttonPositive: "Please accept bare mortal",
        }
      )
        .then((_res) => {
          getContacts();
        })
        .catch((_error) => {});
    } else {
      getContacts();
    }
  }, [mutate, phoneNumber]);

  // const updateContacts = useCallback(
  //   async (contacts: Contact[]) => {
  //     try {
  //       await mutate(contacts);
  //     } catch (err) {
  //     }
  //   },
  //   [mutate],
  // );
  //
  // return updateContacts;

  return {
    contacts,
  } as const;
};
