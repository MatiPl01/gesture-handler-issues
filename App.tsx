/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {
  cancelAnimation,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function App() {
  const dummy = useSharedValue(0);

  const gesture = Gesture.Manual()
    .onTouchesDown((_, manager) => {
      console.log('onTouchesDown', Date.now());

      dummy.value = withTiming(Math.random(), {duration: 1000}, finished => {
        if (finished) {
          manager.activate();
        }
      });
    })
    .onTouchesUp((_, manager) => {
      console.log('onTouchesUp', Date.now());
      manager.fail();
    })
    .onTouchesCancelled(() => console.log('onTouchesCancelled', Date.now()))
    .onFinalize(() => {
      console.log('onFinalize', Date.now());
      cancelAnimation(dummy);
    })
    .manualActivation(true);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <GestureDetector gesture={gesture}>
          <View style={[styles.box, {backgroundColor: 'red'}]} />
        </GestureDetector>

        <GestureDetector gesture={gesture}>
          <View style={[styles.box, {backgroundColor: 'blue'}]} />
        </GestureDetector>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  content: {
    minHeight: 2 * Dimensions.get('window').height,
    justifyContent: 'center',
    gap: 50,
    alignItems: 'center',
  },
});
