import React, { JSX, useState } from 'react';
import { Image, ImageProps } from 'tamagui';

interface FadeInImageProps extends ImageProps {
    // You can add any custom props here if needed
    title?: string;
}

export const FadeInImage = (props: FadeInImageProps): JSX.Element => {
    const [isLoaded, setIsLoaded] = useState(false);

    if (props.title === "Barfit") {
        console.log("aa");
    }

    return (
        <Image
            {...props}
            opacity={isLoaded ? 1 : 0}
            animation="slow"
            onLoad={() => {
                setIsLoaded(true);
            }}
        />
    );
};

