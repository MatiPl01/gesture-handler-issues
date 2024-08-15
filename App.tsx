import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export default function App() {
  const startPosition = useSharedValue({x: 0, y: 0});
  const position = useSharedValue({x: 0, y: 0});
  const scale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onBegin(() => console.log('onBegin'))
    .onStart(() => console.log('onStart'))
    .onTouchesDown(() => {
      scale.value = withSpring(1.2);
      console.log('onTouchesDown');
    })
    .onTouchesMove(() => console.log('onTouchesMove'))
    .onUpdate(({translationX, translationY}) => {
      console.log('onUpdate');
      position.value = {
        x: startPosition.value.x + translationX,
        y: startPosition.value.y + translationY,
      };
    })
    .onTouchesCancelled(() => console.log('onTouchesCancelled'))
    .onTouchesUp(() => console.log('onTouchesUp'))
    .onEnd(() => {
      startPosition.value = position.value;
      scale.value = withSpring(1);
      console.log('onEnd');
    })
    .onFinalize(() => console.log('onFinalize'));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: position.value.x,
      },
      {
        translateY: position.value.y,
      },
      {
        scale: scale.value,
      },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={animatedStyle}>
          <GestureDetector gesture={panGesture}>
            <View style={styles.box} />
          </GestureDetector>
        </Animated.View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  content: {
    minHeight: Dimensions.get('window').height + 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
