// app/home.tsx
import { StyleSheet, Text } from 'react-native';


const createStyles = () => {
    return StyleSheet.create({
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
        },
    });
};

const styles = createStyles();

export default function PageTitle({ title }: { title: string }) {
    return (
        <Text style={styles.title}>{title}</Text>
    );
}