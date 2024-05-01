import requests
import math
import pytz
import pycountry
from timezonefinder import TimezoneFinder
from geopy.geocoders import Nominatim
import time
from geopy.geocoders import Nominatim

def address_to_coordinates(address):
    """
    Get the coordinates (latitude and longitude) of a given address.

    This function uses the Nominatim API to geocode the given address and
    return the coordinates (latitude and longitude) of the address.

    Args:
        address (str): The address to geocode.

    Returns:
        dict: A dictionary containing the latitude and longitude of the address.
    """
    geolocator = Nominatim(user_agent="wanderbud")
    location = geolocator.geocode(address)
    if location:
        return {"lat": location.latitude, "lng": location.longitude}
    return None

def calculate_distance(coords1, coords2):
    """
    Calculate the distance between two sets of coordinates.

    This function calculates the distance between two sets of coordinates using
    the haversine formula. The function takes the coordinates of the two points
    as input and returns the distance between the points in kilometers.

    Args:
        coords1 (dict): A dictionary containing the latitude and longitude of the first point.
        coords2 (dict): A dictionary containing the latitude and longitude of the second point.

    Returns:
        float: The distance between the two points in kilometers.
    """
    
    lat1 = math.radians(coords1["lat"])
    lon1 = math.radians(coords1["lng"])
    lat2 = math.radians(coords2["lat"])
    lon2 = math.radians(coords2["lng"])
    distance_latitude = lat2 - lat1
    distance_longitude = lon2 - lon1
    a = math.sin(distance_latitude / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(distance_longitude / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = 6371 * c  # Earth's radius in kilometers
    return distance

def get_address_in_radius(coords, radius_in_km, list_of_coords):
    location_coords = coords
    locations_in_radius = []
    for coords in list_of_coords:
        if coords is not None:
            distance = calculate_distance(location_coords, coords)
            if distance <= radius_in_km:
                locations_in_radius.append(coords)
    return locations_in_radius


def addres_to_timezone(coords):
    """
    Get the timezone of a given set of coordinates.

    This function uses the TimezoneFinder library to get the timezone of a given set
    of coordinates. The function takes the coordinates as input and returns
    the timezone of the coordinates.

    Args:
        coords (dict): A dictionary containing the latitude and longitude of the coordinates.

    Returns:
        str: The timezone of the coordinates.
    """
    start_time = time.time()
    tf = TimezoneFinder()
    timezone = tf.timezone_at(lng=coords["lng"], lat=coords["lat"])
    end_time = time.time()
    execution_time = end_time - start_time
    print("Tiempo de ejecución:", execution_time, "segundos")
    return timezone

def get_currency_symbol(address):
    geolocator = Nominatim(user_agent="my_geocoder")
    
    try:
        # Obtener la ubicación a partir de la dirección
        location = geolocator.geocode(address)
        
        if location:
            # Obtener el código ISO del país
            country_code = location.raw['address']['country_code'].upper()
            
            # Obtener información de la moneda a partir del código ISO del país
            country = pycountry.countries.get(alpha_2=country_code)
            
            if country:
                currency_code = country.alpha_3
                currency = pycountry.currencies.get(numeric=currency_code)
                
                if currency:
                    return currency.symbol
    except Exception as e:
        print("Error:", e)
    
    return None