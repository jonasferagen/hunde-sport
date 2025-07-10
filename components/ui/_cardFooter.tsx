// app/home.tsx
import { StyleSheet, Text, View } from 'react-native';


const createStyles = () => {
    return StyleSheet.create({
        container: {
            padding: 0,
            backgroundColor: '#000',
            width: '100%',
            opacity: 0.8,
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
        },
        title: {

            color: '#fff',
            textAlign: 'center',
            marginTop: 10,
            height: 30,
            textOverflow: 'ellipsis',
        },
    });
};


const styles = createStyles();

export default function CardFooter({ title }: { title: string }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}