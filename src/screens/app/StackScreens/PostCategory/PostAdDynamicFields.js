import {Pressable, StyleSheet, Text, FlatList} from 'react-native';
import React, {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from '../../../../components/Inputs/Input.jsx';
import {
  COLORS,
  FONTSIZE,
  height,
  normalize,
  width,
} from '../../../../constant/index.js';

export const PostAdDynamicFields = ({
  dynamic_field,
  value,
  errors,
  onChange,
  handleSelectChange,
  selectedItems,
  show,
  onDateTimeFocus,
  onChangeDateTime,
  onChangeCountry,
  required,
}) => {
  const [viewHeight, setViewHeight] = useState();

  const handleContentSizeChange = event => {
    const {height} = event.nativeEvent.contentSize + 0.02;
    setViewHeight(height);
  };

  const renderSelectTypeItem = ({item, index}) => {
    const isSelected = selectedItems.includes(item);
    return (
      <Pressable
        key={index}
        onPress={() => handleSelectChange(item)}
        style={{
          backgroundColor: isSelected ? COLORS.primary : COLORS.white,
          margin: 5,
          padding: 10,
          borderRadius: 20,
          borderWidth: 1.5,
          borderColor: COLORS.primary,
        }}>
        <Text style={{color: isSelected ? COLORS.white : COLORS.primary}}>
          {item}
        </Text>
      </Pressable>
    );
  };
  const {field_type, field_name, options} = dynamic_field;
  switch (field_type) {
    case 'Text':
      return (
        <>
          <Text style={styles.inputFieldTitleTxt}>{field_name}</Text>
          <Input
            id={field_name}
            placeholder={field_name}
            errors={errors}
            value={value}
            onChangeText={text => onChange(text)}
            style={styles.input}
          />
        </>
      );
    case 'TextArea':
      return (
        <>
          <Text style={styles.inputFieldTitleTxt}>{field_name}</Text>
          <Input
            id={field_name}
            placeholder={field_name}
            errors={errors}
            value={value}
            onChangeText={text => onChange(text)}
            multiline
            style={[
              styles.input,
              {height: viewHeight, minHeight: height * 0.05},
            ]}
            maxLength={250}
            onContentSizeChange={handleContentSizeChange}
          />
        </>
      );
    case 'Price':
      return (
        <>
          <Text style={styles.inputFieldTitleTxt}>{field_name}</Text>
          <Input
            id={field_name}
            placeholder={field_name}
            errors={errors}
            value={value}
            onChangeText={text => onChange(text.replace(/[^0-9]/, ''))}
            style={styles.input}
            keyboardType="number"
          />
        </>
      );
    case 'Number':
      return (
        <>
          <Text style={styles.inputFieldTitleTxt}>{field_name}</Text>
          <Input
            id={field_name}
            placeholder={field_name}
            errors={errors}
            value={value}
            onChangeText={text => onChange(text.replace(/[^0-9]/, ''))}
            style={styles.input}
            keyboardType="number-pad"
          />
        </>
      );
    case 'PhoneNumber':
      return (
        <>
          <Text style={styles.inputFieldTitleTxt}>{field_name}</Text>
          <Input
            id={'phoneNumber'}
            errors={errors}
            placeholder={field_name}
            value={value}
            onChangeText={text => onChange(text.replace(/[^0-9]/, ''))}
            style={styles.input}
            maxLength={10}
            keyboardType={'phone-pad'}
            onChangeCountry={onChangeCountry}
          />
        </>
      );
    case 'Date':
      return (
        <>
          <Text style={styles.inputFieldTitleTxt}>{field_name}</Text>
          <Input
            id={field_name}
            placeholder={'YYYY/MM/DD'}
            errors={errors}
            value={value?.toString()}
            onChangeText={() => onDateTimeFocus('date')}
            style={styles.input}
            onFocus={() => onDateTimeFocus('date')}
            showSoftInputOnFocus={false}
          />
          {show?.date && (
            <DateTimePicker
              display="default"
              value={new Date()}
              mode={'date'}
              onChange={value => {
                onChangeDateTime(value?.nativeEvent?.timestamp, 'date');
              }}
              themeVariant="light"
              maximumDate={new Date()}
            />
          )}
        </>
      );
    case 'Time':
      return (
        <>
          <Text style={styles.inputFieldTitleTxt}>{field_name}</Text>
          <Input
            id={field_name}
            placeholder={field_name}
            errors={errors}
            value={value?.toString()}
            onChangeText={() => onDateTimeFocus('time')}
            style={styles.input}
            onFocus={() => onDateTimeFocus('time')}
            showSoftInputOnFocus={false}
          />
          {show?.time && (
            <DateTimePicker
              display="default"
              value={new Date()}
              mode={'time'}
              onChange={value => {
                onChangeDateTime(value?.nativeEvent?.timestamp, 'time');
              }}
              themeVariant="light"
              maximumDate={new Date()}
            />
          )}
        </>
      );

    case 'Select':
      return (
        <>
          <Text style={styles.inputFieldTitleTxt}>{field_name}</Text>
          <FlatList
            data={options}
            renderItem={renderSelectTypeItem}
            numColumns={4}
            scrollEnabled={false}
          />
        </>
      );

    default:
      return null;
  }
};

const styles = StyleSheet.create({
  inputFieldView: {flex: 1, alignItems: 'center'},
  inputFieldTitleTxt: {
    alignSelf: 'flex-start',
    marginHorizontal: width * 0.05,
    marginVertical: 5,
    fontSize: normalize(FONTSIZE.xxSmall),
    color: COLORS.black,
  },
  textInputView: {
    borderWidth: 0.9,
    borderRadius: 15,
    margin: 5,
  },
  input: {
    height: height * 0.05,
    marginVertical: 10,
  },
  inputStyle: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    margin: 0,
  },

  dropdown: {
    width: width * 0.9,
    margin: 5,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
