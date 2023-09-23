import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import {COLORS, FONTSIZE} from '../../constant/theme.js';
import {height, normalize, width} from '../../constant/index.js';
import {Dropdown} from 'react-native-element-dropdown';
import {axiosOpen} from '../../utils/axios.js';

const HalfScreenModal = ({
  setSearch,
  isVisible,
  onClose,
  category,
  setCategory,
  subCategory,
  setSubCategory,
  setApply,
}) => {
  const [select, setSelect] = useState(0);

  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);

  useEffect(() => {
    (async () => {
      const category = await axiosOpen('/ads/category');
      const subCategory = await axiosOpen('/ads/subcategory');
      setCategoryList(category?.data);
      setSubCategoryList(subCategory?.data);
    })();
  }, []);

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection={['up', 'down']}
      style={{justifyContent: 'flex-end', margin: 0}}>
      <View
        style={{
          backgroundColor: 'white',
          height: '55%',
          padding: 16,
          alignItems: 'center',
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
          paddingBottom: 40,
        }}>
        <View
          style={{
            width: 90,
            height: 4,
            borderRadius: 10,
            backgroundColor: COLORS.gray,
          }}
        />

        <View
          style={{
            width: '95%',
            height: '90%',
            marginTop: 15,
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '35%',
              height: '100%',
            }}>
            <View>
              <Text
                style={{
                  color: COLORS.black,
                  fontSize: normalize(FONTSIZE.large),
                  marginVertical: 10,
                  fontWeight: 'bold',
                }}>
                Filter
              </Text>
              <Text
                style={{
                  color: select == 0 ? COLORS.secondary : COLORS.black,
                  fontSize: normalize(FONTSIZE.medium),
                  marginVertical: 10,
                  fontWeight: select == 0 ? '700' : '500',
                }}
                onPress={() => setSelect(0)}>
                By Category
              </Text>
              <Text
                style={{
                  color: select == 1 ? COLORS.secondary : COLORS.black,
                  fontSize: normalize(FONTSIZE.medium),
                  marginVertical: 10,
                  fontWeight: select == 1 ? '700' : '500',
                }}
                onPress={() => setSelect(1)}>
                By Sub Category
              </Text>
            </View>
          </View>
          <View
            style={{
              height: '70%',
              width: 2,
              marginRight: 10,
              backgroundColor: COLORS.gray2,
              alignSelf: 'center',
            }}
          />
          <View
            style={{
              width: '60%',
              height: '100%',
            }}>
            <Text
              style={{
                fontSize: normalize(FONTSIZE.large),
                marginVertical: 10,
              }}></Text>

            {select == 0 && categoryList.length <= 0 ? (
              <ActivityIndicator size={'large'} color={COLORS.primary} />
            ) : (
              select == 0 &&
              categoryList
                ?.sort((a, b) => {
                  return a.id - b.id;
                })
                ?.map((item, indx) => {
                  return (
                    <View key={indx}>
                      <Text
                        style={{
                          color:
                            category === item?.id
                              ? COLORS.secondary
                              : COLORS.black,
                          fontSize: normalize(FONTSIZE.medium),
                          marginVertical: 10,
                        }}
                        onPress={() => {
                          setCategory(item?.id);
                          setSubCategory(null);
                        }}>
                        {item?.name}
                      </Text>
                    </View>
                  );
                })
            )}

            {select == 1 && subCategoryList.length <= 0 ? (
              <ActivityIndicator size={'large'} color={COLORS.primary} />
            ) : (
              select == 1 &&
              subCategoryList
                ?.filter(e => e?.category === (category || 1))
                .map((item, indx) => {
                  return (
                    <View key={indx}>
                      <Text
                        style={{
                          color:
                            subCategory === item?.id
                              ? COLORS.secondary
                              : COLORS.black,
                          fontSize: normalize(FONTSIZE.medium),
                          marginVertical: 10,
                        }}
                        onPress={() => setSubCategory(item?.id)}>
                        {item?.name}
                      </Text>
                    </View>
                  );
                })
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: COLORS.white,
              marginHorizontal: width * 0.2,
              backgroundColor: 'red',
              padding: 10,
              width: 100,
              textAlign: 'center',
              // marginBottom: 15,
            }}
            onPress={() => {
              select === 0
                ? setCategory(null) | setSubCategory(null)
                : setSubCategory(null);
              setSearch('');
              setApply(false);
            }}>
            CLEAR
          </Text>
          <Text
            style={{
              color: COLORS.white,
              marginHorizontal: width * 0.2,
              backgroundColor:
                category == null ? COLORS.gray2 : COLORS.secondary,
              padding: 10,
              width: 100,
              textAlign: 'center',
            }}
            disabled={category == null}
            onPress={() => {
              // setSearch(' ');
              setApply(true);
              onClose();
            }}>
            APPLY
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default HalfScreenModal;
