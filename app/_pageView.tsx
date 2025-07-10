
import { View } from 'react-native';
import { AppStyles } from "../config/theme";


export default function PageView({ children }: { children: React.ReactNode }) {
  return (
    <View style={AppStyles.pageContainer}>
      {children}
    </View>
  );
}