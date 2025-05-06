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
  max?: number;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  size = 'small',
  name,
  max,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState('');

  const startEdit = () => {
    setDraft(value);
    setError('');
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(value);
    setError('');
    setEditing(false);
  };

  const confirmEdit = () => {
    if (max && draft.length > max) {
      setError(`Maximum ${max} characters allowed`);
      return;
    }
    onSave(draft);
    setEditing(false);
    setError('');
  };

  const handleChangeText = (text: string) => {
    if (max && text.length > max) {
      setError(`Maximum ${max} characters allowed`);
      return;
    }

    if (error && text.length <= (max || Infinity)) {
      setError('');
    }

    setDraft(text);
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
            onChangeText={handleChangeText}
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
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 8,
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
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  iconBtn: {
    marginHorizontal: 4,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 2,
  },
});
