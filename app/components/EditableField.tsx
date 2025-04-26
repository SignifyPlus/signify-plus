import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  size?: 'large' | 'small';
  name: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  size = 'small',
  name,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const startEdit = () => {
    setDraft(value);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(value);
    setEditing(false);
  };

  const confirmEdit = () => {
    onSave(draft);
    setEditing(false);
  };

  const sharedTextStyle = [
    size === 'large' ? styles.largeText : styles.smallText,
    styles.textBase,
  ];

  return (
    <View style={styles.fieldContainer}>
      {editing ? (
        <View style={styles.editRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            autoFocus
            onSubmitEditing={confirmEdit}
            blurOnSubmit
            style={[...sharedTextStyle, styles.input]}
            placeholder="Status"
          />
          <TouchableOpacity onPress={confirmEdit} style={styles.iconBtn}>
            <Ionicons name="checkmark" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={cancelEdit} style={styles.iconBtn}>
            <Ionicons name="close" size={20} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={startEdit}>
          <Text style={sharedTextStyle}>{value || `Set ${name}`}</Text>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 4,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBase: {
    fontWeight: '500',
    lineHeight: 24,
    paddingVertical: 2,
  },
  largeText: {
    fontSize: 20,
    color: '#111',
  },
  smallText: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginRight: 12,
    flex: 1,
    paddingVertical: 0, // tighter vertical space
    paddingHorizontal: 0, // remove default iOS padding
  },
  iconBtn: {
    marginHorizontal: 4,
  },
});
