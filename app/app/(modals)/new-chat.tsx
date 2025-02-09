import { Image, StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { AlphabetList } from 'react-native-section-alphabet-list';
import { defaultStyles } from '@/constants/Styles';
import { Fragment } from 'react';
import { useAppContext } from '@/context/app-context';
import { useContactsQuery } from '@/api/contacts-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api';

const Page = () => {
  const { phoneNumber } = useAppContext();
  const { data: _data = [] } = useContactsQuery({ phoneNumber });

  const data = _data.map((contact, index) => ({
    value: contact.name,
    name: contact.name,
    img: contact.profilePicture,
    desc: contact.status ?? '',
    key: `${contact.name}-${index}`,
  }));

  return (
    <View
      style={{ flex: 1, paddingTop: 110, backgroundColor: Colors.background }}
    >
      <AlphabetList
        data={data}
        stickySectionHeadersEnabled
        indexLetterStyle={{
          color: Colors.primary,
          fontSize: 12,
        }}
        indexContainerStyle={{
          width: 24,
          backgroundColor: Colors.background,
        }}
        renderCustomItem={(item: any) => (
          <Fragment>
            <View style={styles.listItemContainer}>
              <Image source={{ uri: item.img }} style={styles.listItemImage} />
              <View>
                <Text style={{ color: '#000', fontSize: 14 }}>
                  {item.value}
                </Text>
                <Text style={{ color: Colors.gray, fontSize: 12 }}>
                  {item.desc.length > 40
                    ? `${item.desc.substring(0, 40)}...`
                    : item.desc}
                </Text>
              </View>
            </View>
            <View style={[defaultStyles.separator, { marginLeft: 50 }]} />
          </Fragment>
        )}
        renderCustomSectionHeader={(section) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={{ color: Colors.gray }}>{section['title']}</Text>
          </View>
        )}
        style={{
          marginLeft: 14,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },

  listItemImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },

  sectionHeaderContainer: {
    height: 30,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
});

const WrappedPage = (props: any) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Page {...props} />
    </QueryClientProvider>
  );
};
export default WrappedPage;
