import {
  check,
  request,
  RESULTS,
  openSettings,
  requestMultiple,
} from 'react-native-permissions';
import CustomAlert from '../components/CustomAlert/CustomAlert.jsx';
import {Alert} from 'react-native';
// This function can be used anywhere as it supports multiple permissions.
// It checks for permissions and then requests for it.
// export async function checkMultiplePermissions(permissions) {
//   let isPermissionGranted = false;
//   const statuses = await requestMultiple(permissions);
//   for (let index in permissions) {
//     if (statuses[permissions[index]] === RESULTS.GRANTED) {
//       isPermissionGranted = true;
//     } else {
//       isPermissionGranted = false;
//       break;
//     }
//   }
//   return isPermissionGranted;
// }

// In case you want to check a single permission
export async function CheckPermission(permission) {
  let isPermissionGranted;
  const result = await check(permission);
  switch (result) {
    case RESULTS.GRANTED:
      isPermissionGranted = true;
      break;
    case RESULTS.DENIED:
      RequestPermission(permission);
      isPermissionGranted = false;
      break;
    case RESULTS.BLOCKED:
      showAlert();
      isPermissionGranted = false;
      break;
    case RESULTS.UNAVAILABLE:
      isPermissionGranted = false;
      break;
  }
  return isPermissionGranted;
}

async function RequestPermission(permission) {
  const result = await request(permission);
  if (result == 'blocked') {
    showAlert();
  }
}
const showAlert = () => {
  Alert.alert(
    'Permission Blocked',
    'The permission to access feature has been blocked. Please go to the app settings and enable the permission to use this feature.',
    [
      {
        text: 'Open Settings',
        onPress: () => openSettings(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
  );
};
