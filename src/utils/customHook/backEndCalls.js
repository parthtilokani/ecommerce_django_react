import {request} from './request';

export const signIN = async values => {
  //   try {
  //     const response = await request({
  //       // header: {'Content-Type': 'application/json'},
  //       url: '/user/login',
  //       method: 'POST',
  //       data: values,
  //     });
  //   } catch (e) {
  //     console.log('error in login', JSON.stringify(e?.response));
  //     console.log('error in login backend', e);
  //   }
};

// export const signup = async values => {
//   try {
//     const response = await request({

//       url: '/user/register',
//       method: 'POST',
//       data: values,
//     });
//     if (response) {
//       const {email, password} = values;
//       const loginResponse = await login({email, password});
//       return loginResponse;
//     }
//   } catch (e) {
//     console.log('error in signup', JSON.stringify(e?.response));
//     console.log('error in signup backend', e);
//   }
// };
