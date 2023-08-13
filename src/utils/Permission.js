import {check, request, RESULTS, openSettings} from 'react-native-permissions';
import {Alert} from 'react-native';

// In case you want to check a single permission
export async function CheckPermission(permission) {
  let isPermissionGranted;
  const result = await check(permission);
  switch (result) {
    case RESULTS.GRANTED:
      isPermissionGranted = true;
      break;
    case RESULTS.DENIED:
      await RequestPermission(permission);
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
  isPermissionGranted;
  return isPermissionGranted;
}

export async function RequestPermission(permission) {
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
