import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const MapContainer = ({ selectedLocation, onLocationSelect }) => {
    const mapStyles = {
        height: "400px",
        width: "100%"
    };

    const [currentPosition, setCurrentPosition] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);

    useEffect(() => {
        // Función para obtener la ubicación actual del usuario
        const getCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        setCurrentPosition({ lat: latitude, lng: longitude });
                    },
                    error => {
                        console.error('Error getting user location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        // Llamamos a la función para obtener la ubicación actual
        getCurrentLocation();
    }, []);

    const handleAutocompleteLoad = autocomplete => {
        setAutocomplete(autocomplete);
    };

    const handlePlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (!place.geometry) {
                console.error("Place not found");
                return;
            }
            const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            setCurrentPosition(location);
            onLocationSelect(location); // Llama a la función proporcionada por el formulario para actualizar el estado con la ubicación seleccionada
        } else {
            console.error("Autocomplete is not loaded yet!");
        }
    };

    return (
        <LoadScript
            googleMapsApiKey={process.env.GOOGLE_API}
            libraries={["places"]}
        >
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={13}
                center={selectedLocation || currentPosition || { lat: 0, lng: 0 }} // Usa la ubicación seleccionada si está disponible, de lo contrario, la ubicación actual o (0,0)
            >
                {selectedLocation && (
                    <Marker
                        position={selectedLocation}
                        title="Ubicación seleccionada"
                    />
                )}
                <Autocomplete
                    onLoad={handleAutocompleteLoad}
                    onPlaceChanged={handlePlaceChanged}
                >
                    <input
                        type="text"
                        placeholder="Buscar lugares cerca..."
                        style={{
                            boxSizing: `border-box`,
                            border: `1px solid transparent`,
                            width: `240px`,
                            height: `32px`,
                            padding: `0 12px`,
                            borderRadius: `3px`,
                            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                            fontSize: `14px`,
                            outline: `none`,
                            textOverflow: `ellipses`,
                            position: "absolute",
                            left: "50%",
                            marginLeft: "-120px"
                        }}
                    />
                </Autocomplete>
            </GoogleMap>
        </LoadScript>
    );
};

export default MapContainer;