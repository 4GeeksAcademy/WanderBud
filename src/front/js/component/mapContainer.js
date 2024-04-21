import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { Form } from 'react-bootstrap';

const libraries = ["places"];

const MapContainer = ({ selectedLocation, onLocationSelect }) => {
    const [currentPosition, setCurrentPosition] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        setCurrentPosition({ lat: latitude, lng: longitude });
                    },
                    error => {
                        console.error('Error getting user location:', error);
                        setError('Error obteniendo la ubicación del usuario.');
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                setError('La geolocalización no es compatible con este navegador.');
            }
        };

        getCurrentLocation();
    }, []);

    const handleAutocompleteLoad = autocomplete => {
        setAutocomplete(autocomplete);
    };

    const handlePlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (!place.geometry) {
                setError('Lugar no encontrado.');
                return;
            }
            const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            setCurrentPosition(location);
            onLocationSelect(location);
        } else {
            setError('Autocompletado aún no cargado.');
        }
    };

    return (
        <LoadScript
            googleMapsApiKey={process.env.GOOGLE_API}
            libraries={libraries}
        >
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={13}
                center={selectedLocation || currentPosition || { lat: 0, lng: 0 }}
                options={mapOptions}
            >
                {selectedLocation && <Marker position={selectedLocation} />}
                <Autocomplete onLoad={handleAutocompleteLoad} onPlaceChanged={handlePlaceChanged}>
                    <Form.Control type="text" placeholder="Buscar lugares cerca..." style={searchStyles} />
                </Autocomplete>
            </GoogleMap>
            {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
        </LoadScript>
    );
};

const mapStyles = { height: "400px", width: "100%", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" };
const mapOptions = {
    styles: [
        { elementType: "geometry", stylers: [{ color: "#2C408A" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
        { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#2C408A" }] },
        { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#2C408A" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#ffffff" }] },
        { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2C408A" }] },
        { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#ffffff" }] },
        { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
        { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2C408A" }] },
        { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#2C408A" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
        { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#2C408A" }] }
    ],
    disableDefaultUI: true
};
const searchStyles = {
    position: "absolute",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "240px",
    borderRadius: "5px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
    backgroundColor: "#ffffff",
    color: "#000000"
};

export default MapContainer;
