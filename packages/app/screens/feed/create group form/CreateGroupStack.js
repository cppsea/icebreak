import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GroupProvider } from '@app/utils/GroupContext';
import InitialCreateGroupScreen from './InitialCreateGroupScreen';
import CreateGroupFormScreen1 from './CreateGroupFormScreen1';
import CreateGroupFormScreen2 from './CreateGroupFormScreen2';
import CreateGroupFormScreen3 from './CreateGroupFormScreen3';

const Stack = createNativeStackNavigator();

function CreateGroupStack() {
  return (
    <GroupProvider>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={InitialCreateGroupScreen}>
        <Stack.Screen name="Initial Create Group" component={InitialCreateGroupScreen} />
        <Stack.Screen name="Create Group Form 1" component={CreateGroupFormScreen1} />
        <Stack.Screen name="Create Group Form 2" component={CreateGroupFormScreen2} />
        <Stack.Screen name="Create Group Form 3" component={CreateGroupFormScreen3} />
      </Stack.Navigator>
    </GroupProvider>
  );
}

export default CreateGroupStack;
