import { FontAwesome } from '@expo/vector-icons';
import React from 'react';

// Get the type of all props that FontAwesome accepts
type IconProps = React.ComponentProps<typeof FontAwesome>;

/**
 * A wrapper around the FontAwesome icon set.
 * This component forwards all props to the FontAwesome component.
 */
const Icon = (props: IconProps) => {
    return <FontAwesome {...props} />;
};

export default Icon;
