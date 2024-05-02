import React from 'react';

const MapImage = ({ lat, lng }) => {
    const apiKey = process.env.GOOGLE_API;
    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';

    const imageUrl = `${baseUrl}?center=${lat},${lng}&zoom=10&size=${500}x${500}&key=${apiKey}`;

    return <img src={imageUrl} alt="Map" />;
}

export default MapImage;
