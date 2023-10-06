import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate.js';
import {useQuery} from '@tanstack/react-query';
import {COLORS, FONTSIZE} from '../../../../constant/theme.js';
import {normalize, width} from '../../../../constant/index.js';
import GobackHeader from '../../../../components/GobackHeader.jsx';
import Button from '../../../../components/Button/Button.jsx';

const Transaction = () => {
  const axiosPrivate = useAxiosPrivate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 10;
  const [totalData, setTotalData] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      console.log('asdasdasd');
      const transactionData = await axiosPrivate.get(
        '/user/user/get_current_user_credits_history',
        {
          params: {
            page: currentPage,
            page_size: itemPerPage,
          },
        },
      );
      setTotalData(transactionData?.data);
      setLoading(false);
    })();
  }, [itemPerPage, currentPage]);

  const renderTransactionData = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 15,
          marginTop: 2,
          paddingVertical: 15,
          paddingHorizontal: 7,
          backgroundColor: index % 2 == 0 ? COLORS.primary : COLORS.gray2,
        }}>
        <Text
          style={{
            color: index % 2 == 0 ? COLORS.white : COLORS.black,
            paddingHorizontal: 5,
            width: '30%',
            textAlign: 'center',
          }}>
          {item?.created_on
            ? new Date(item?.created_on).toLocaleString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '--'}
        </Text>
        <Text
          style={{
            color: index % 2 == 0 ? COLORS.white : COLORS.black,
            paddingHorizontal: 5,
            width: '50%',
          }}
          numberOfLines={2}>
          {item?.description}
        </Text>
        <Text
          style={{
            color: index % 2 == 0 ? COLORS.white : COLORS.black,
            paddingHorizontal: 5,
            textAlign: 'center',
            width: '25%',
          }}>
          {item?.no_of_credits > 0
            ? '+' + item?.no_of_credits
            : item?.no_of_credits}
        </Text>
      </View>
    );
  };

  const renderTransactionHeader = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 15,
          paddingVertical: 15,
          paddingHorizontal: 7,
          marginTop: 20,
          backgroundColor: COLORS.secondary,
        }}>
        <Text
          style={{
            color: 'white',
            paddingHorizontal: 5,
            fontSize: normalize(FONTSIZE.xxSmall),
            fontWeight: '700',
            textAlign: 'center',
            width: '30%',
          }}>
          Date
        </Text>
        <Text
          style={{
            color: 'white',
            paddingHorizontal: 5,
            fontSize: normalize(FONTSIZE.xxSmall),
            fontWeight: '700',
            textAlign: 'center',
            width: '50%',
          }}>
          Action
        </Text>
        <Text
          style={{
            color: 'white',
            paddingHorizontal: 5,
            fontSize: normalize(FONTSIZE.xxSmall),
            fontWeight: '700',
            textAlign: 'center',
            width: '25%',
          }}>
          Credits
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <GobackHeader bg title={'All Transanctions'} />
      <FlatList
        data={totalData?.results}
        renderItem={renderTransactionData}
        ListHeaderComponent={renderTransactionHeader}
        ListFooterComponent={() => {
          return (
            <>
              {totalData?.results?.length > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: 15,
                    marginTop: 10,
                  }}>
                  {totalData?.previous ? (
                    <Button
                      style={{width: width * 0.3, height: 40}}
                      text={'Prev'}
                      onPress={() => {
                        if (currentPage > 1) {
                          setCurrentPage(prev => prev - 1);
                        }
                      }}
                    />
                  ) : (
                    <View style={{width: width * 0.3, height: 40}} />
                  )}
                  <Text style={{color: 'black', textAlign: 'center'}}>
                    Showing{' '}
                    {totalData?.results && totalData?.results?.length > 0
                      ? currentPage * itemPerPage - itemPerPage + 1
                      : 0}{' '}
                    to {Math.min(currentPage * itemPerPage, totalData?.count)}
                    {'\n'} of {}
                    {totalData?.count} entries
                  </Text>
                  {totalData?.next ? (
                    <Button
                      style={{width: width * 0.3, height: 40}}
                      text={'Next'}
                      onPress={() => {
                        if (
                          !(
                            (currentPage + 1) * itemPerPage - itemPerPage >
                            totalData?.count - 1
                          )
                        ) {
                          setCurrentPage(prev => prev + 1);
                        }
                      }}
                    />
                  ) : (
                    <View style={{width: width * 0.3, height: 40}} />
                  )}
                </View>
              ) : null}
            </>
          );
        }}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                alignItems: 'center',
                marginHorizontal: 15,
                marginTop: 2,
                paddingVertical: 10,
                paddingHorizontal: 7,
                backgroundColor: COLORS.gray2,
              }}>
              {loading ? (
                <ActivityIndicator size={'large'} color={COLORS.primary} />
              ) : (
                <Text
                  style={{
                    color: COLORS.black,
                    fontSize: normalize(FONTSIZE.small),
                    fontWeight: '500',
                  }}>
                  No data available
                </Text>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Transaction;

const styles = StyleSheet.create({});
