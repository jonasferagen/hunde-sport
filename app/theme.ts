import { StyleSheet } from 'react-native';


export const Colors = {
  primary: 'rgb(101, 150, 161)',
  secondary: 'rgb(161, 138, 117)',
  accent: 'rgb(247, 177, 163)',
  bgPrimary: 'rgb(255, 255, 255)',
  lightGray: 'rgb(246, 246, 246)',
};

export const PADDING = 20;

export const AppStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    paddingTop: PADDING,
    paddingBottom: PADDING,
  }
});

export default Colors;
