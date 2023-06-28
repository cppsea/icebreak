import { 
  InitialCreateGroupScreen,
  CreateGroupFormScreen1,
  CreateGroupFormScreen2,
  CreateGroupFormScreen3
} from './CreateGroupForm';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function CreateGroupStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={InitialCreateGroupScreen}>
      <Stack.Screen name="Initial Create Group" component={InitialCreateGroupScreen} />
      <Stack.Screen name="Create Group Form 1" component={CreateGroupFormScreen1} />
      <Stack.Screen name="Create Group Form 2" component={CreateGroupFormScreen2} />
      <Stack.Screen name="Create Group Form 3" component={CreateGroupFormScreen3} />
    </Stack.Navigator>
  );
}

export default CreateGroupStack;
