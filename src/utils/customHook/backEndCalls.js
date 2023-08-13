import axios from 'axios';
import {baseURL} from '../Api.js';
import {storeUserSession} from '../AsyncStorage/userSession.js';
import {getRequest, request} from './request';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {indigo400} from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors.js';

export const signIN = async values => {
  try {
    const response = await request({
      url: `${baseURL}/user/token`,
      method: 'POST',
      data: values,
    });
    if (response) {
      await storeUserSession('userToken', {
        refresh: response?.data?.refresh,
        access: response?.data?.access,
      });
      return {res: response?.data, success: true};
    }
    return {res: 'Something went wrong', success: false};
  } catch (e) {
    console.log('error in login', JSON.stringify(e?.response?.data));
    if (!e?.response)
      return {
        success: false,
        res: e?.response?.data?.message || 'Something went wrong!',
      };
    return {res: e?.response?.message, success: false};
    // return {res: e?.response, success: false};
  }
};

export const signUP = async values => {
  try {
    const response = await request({
      url: `${baseURL}/user/user`,
      method: 'POST',
      data: values,
    });
    if (response) {
      return {res: response?.data, success: true};
    }
    return {res: (response.data = 'Something went wrong'), success: false};
  } catch (e) {
    console.log('error in login', JSON.stringify(e?.response?.data));
    if (!e?.response) return {success: false, res: 'Something went wrong!'};
    return {res: e?.response?.message, success: false};
  }
};

export const requestOtp = async values => {
  try {
    const response = await axios.get(`${baseURL}/user/otp`, {
      params: {
        phone: values.phone,
        register: true,
      },
    });
    if (response?.data?.Status === 'Success')
      return {res: 'Success', success: true};

    return {res: 'Failed to send OTP', success: false};
  } catch (e) {
    console.log('dasdasd', e?.response?.data);
    return {
      res: e?.response?.data?.error || 'Failed to send OTP',
      success: false,
    };
  }
};

export const verifyOtp = async (values, url) => {
  try {
    const response = await request({
      url: `${baseURL}/user/${url}`,
      method: 'POST',
      data: values,
    });
    if (response || url === 'token/withotp') {
      await storeUserSession('userToken', {
        refresh: response?.data?.refresh,
        access: response?.data?.access,
      });
      return {res: 'Success', success: true};
    }
    return {res: 'Failed to send OTP', success: false};
  } catch (e) {
    console.log('dasdasd', e?.response?.data);
    return {
      res: e?.response?.data?.error || 'OPT verification failed!',
      success: false,
    };
  }
};

// export const getCategory = async () => {
//   try {
//     const response = await getRequest({url: `${baseURL}/ads/category`});
//     return response.data;
//   } catch (e) {
//     Alert.alert('ALERT!', 'Something went wrong!');
//     return false;
//   }
// };

// export const getSubCategory = async () => {
//   try {
//     const response = await getRequest({url: `${baseURL}/ads/subcategory`});
//     return response.data;
//   } catch (e) {
//     console.log(e);
//     Alert.alert('ALERT!', 'Something went wrong!');
//     return false;
//   }
// };

// export const postAds = async data => {
//   try {
//     const response = await request({
//       url: `${baseURL}/ads/ads`,
//       method: 'POST',
//       data,
//     });
//     if (response?.data) {
//       return response;
//     } else {
//       return {success: false};
//     }
//   } catch (e) {
//     // console.log(JSON.stringify(e?.response));
//     Alert.alert('ALERT!', 'Something went wrong!');
//     return {error: true};
//   }
// };
// export const updateAds = async (data, id) => {
//   try {
//     const response = await request({
//       url: `${baseURL}/ads/ads/${id}`,
//       method: 'PATCH',
//       data,
//     });
//     if (response?.data) {
//       return response;
//     } else {
//       return {success: false};
//     }
//   } catch (e) {
//     // console.log(JSON.stringify(e?.response));
//     return e?.response?.data?.messages[0]?.message || 'Something went wrong!';
//   }
// };
// export const postAdsImage = async data => {
//   try {
//     const response = await request({
//       url: `${baseURL}/ads/ads_image`,
//       method: 'POST',
//       data,
//     });

//     return response;
//   } catch (e) {
//     console.log(JSON.stringify(e?.response));
//     Alert.alert('ALERT!', 'Something went wrong!');
//     return {error: true};
//   }
// };

// export const getAds = async url => {
//   try {
//     const response = await getRequest({url: `${baseURL}/${url}`});
//     return response.data;
//   } catch (e) {
//     // console.log(e?.response?.data?.messages[0]?.message);
//     // Alert.alert('ALERT!', 'Something went wrong!');
//     return e?.response?.data?.messages[0]?.message || 'Something went wrong!';
//   }
// };

// export const getMyAds = async ({currentPage, itemPerPage}) => {
//   try {
//     const response = await axios.get(
//       `${baseURL}/ads/ads/get_current_user_ads`,
//       {
//         params: {
//           page: currentPage,
//           page_size: itemPerPage,
//         },
//       },
//     );
//     // console.log('sadasdadasd', response);
//     return response?.data;
//   } catch (e) {
//     // console.log(e?.response?.data?.messages[0]?.message);
//     return {error: e?.response?.data?.messages[0]?.message};
//   }
// };
// export const deleteMyAds = async id => {
//   try {
//     const response = await axios.delete(`${baseURL}/ads/ads/${id}`);
//     return response;
//   } catch (e) {
//     console.log('dasdasd', e?.response?.data?.messages[0]?.message);
//     // Alert.alert('ALERT!', e?.response?.data?.messages[0]?.message);
//     return [];
//   }
// };
