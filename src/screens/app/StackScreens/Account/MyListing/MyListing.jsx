import {SafeAreaView, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useQuery, useMutation} from '@tanstack/react-query';
import GobackHeader from '../../../../../components/GobackHeader.jsx';
import ListGridAds from '../../../../../components/Ads/ListGridAds.jsx';
import Loader from '../../../../../components/Loader/Loader.jsx';
import {useNavigation} from '@react-navigation/native';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate.js';
import CustomAlert from '../../../../../components/CustomAlert/CustomAlert.jsx';
import ToastManager, {Toast} from 'toastify-react-native';
import {height, width} from '../../../../../constant/index.js';

const MyListing = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigation = useNavigation();
  const [myAds, setMyAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [fetchedQueries, setFetchedQueries] = useState([false]);
  const [loading, setLoading] = useState(false);
  const [customAlert, setCustomAert] = useState(false);
  const [adId, setAdId] = useState(null);

  useEffect(() => {
    (async () => {
      fetchAds();
    })();
  }, [itemPerPage, currentPage]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const {data} = await axiosPrivate.get('/ads/ads/get_current_user_ads', {
        params: {
          page: currentPage,
          page_size: itemPerPage,
        },
      });

      setLoading(false);
      setTotalData(data?.count || 0);
      setFetchedQueries(prev => {
        setLoading(false);
        prev[0] = true;
        return [...prev];
      });
      setLoading(false);
      setMyAds(data || []);
    } catch (e) {
      setLoading(false);
      Toast.error('Session is invalid or expired!');
      console.log(e?.response?.data);
    }
  };

  // const {
  //   data: myAds,
  //   refetch,
  //   error,
  // } = useQuery({
  //   queryKey: ['my_ads'],
  //   queryFn: async () => {
  //     setLoading(true);
  //     const {data} = await axiosPrivate.get('/ads/ads/get_current_user_ads', {
  //       params: {
  //         page: currentPage,
  //         page_size: itemPerPage,
  //       },
  //     });

  //     setLoading(false);
  //     setTotalData(data?.count || 0);
  //     setFetchedQueries(prev => {
  //       setLoading(false);
  //       prev[0] = true;
  //       return [...prev];
  //     });
  //     setLoading(false);
  //     return data || [];
  //   },
  //   enabled: !fetchedQueries[0],
  // });

  // if (!myAds?.results && error) {
  //   Toast.error('Something went wrong!');
  //   // setTimeout(() => {
  //   console.log('sadasdas');
  //   // navigation.replace('SignIn');
  //   // }, 3000);
  // }

  const {mutate: deleteAd} = useMutation({
    mutationFn: id => axiosPrivate.delete(`/ads/ads/${id}`),
    onSuccess: () => {
      setLoading(false);
      Toast.success('Ad post deleted!');
      fetchAds();
    },
    onError: () => {
      setLoading(false);
      Toast.error('Something went wrong! Retry');
    },
  });

  const handleDelete = id => {
    setCustomAert(true);
    setAdId(id);
  };
  const onDeleteAd = () => {
    setCustomAert(false);
    deleteAd(adId);
  };

  return (
    <SafeAreaView>
      <Loader visible={loading} />
      <CustomAlert
        visible={customAlert}
        title={'Alert!'}
        message={'Are you sure to delete this ad?'}
        onOkPress={onDeleteAd}
        onCancel={() => {
          setCustomAert(false);
        }}
      />
      <ToastManager style={{width: width * 0.9, height: height * 0.1}} />
      <GobackHeader bg title="My Listing" resetBack />
      <ListGridAds
        data={myAds?.results}
        title={'My Ads'}
        changeLayoutStyle
        scrollEnabled={true}
        deleteAds={handleDelete}
        editDelete={true}
        pagination={totalData <= 10 ? false : true}
        prevPage={!(currentPage - 1 < 1)}
        nextPage={
          !((currentPage + 1) * itemPerPage - itemPerPage > totalData - 1)
        }
        onNextPress={() => setCurrentPage(prev => prev + 1)}
        onPrevPress={() => setCurrentPage(prev => prev - 1)}
      />
    </SafeAreaView>
  );
};

export default MyListing;

const styles = StyleSheet.create({});
