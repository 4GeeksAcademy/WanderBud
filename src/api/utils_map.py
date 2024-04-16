# Description: This file contains the utility functions for the Google Maps API. It uses the googlemaps library to interact with the Google Maps API. The geocode_result function takes an address as input and returns the geocode result for that address. The geocode result contains information such as the latitude and longitude of the address. The Google Maps API key is loaded from the environment variable GOOGLE_MAPS_API_KEY using the dotenv library.
#
import googlemaps
from datetime import datetime
from dotenv import load_dotenv
import os
import random
import math
# Load environment variables from .env file
load_dotenv()

# Get the Google Maps API key from the environment variable
google_maps_api_key = os.getenv("GOOGLE_API")

gmaps = googlemaps.Client(key=google_maps_api_key)

def addres_to_coordinates(address):
    """
    Get the coordinates (latitude and longitude) of a given address.

    This function uses the Google Maps API to geocode the given address and
    return the coordinates (latitude and longitude) of the address.

    Args:
        address (str): The address to geocode.

    Returns:
        dict: A dictionary containing the latitude and longitude of the address.
    """
    geocode_result = gmaps.geocode(address)
    if geocode_result:
        location = geocode_result[0]["geometry"]["location"]
        return location
    else:
        return None
    
def coordinates_to_timezone(coordinates):
    
    timezone = gmaps.timezone(coordinates)
    timezone = {
        "timezone": timezone["timeZoneId"],
        "timezone_name": timezone["timeZoneName"],
        "offset": timezone["rawOffset"] / 3600
    }
    offset_hours = int(timezone["offset"])
    offset_minutes = int((timezone["offset"] - offset_hours) * 60)
    offset = f"GMT {offset_hours:02d}:{offset_minutes:02d}"
    timezone["offset"] = f"GMT {offset_hours:02d}:{offset_minutes:02d}"
    return timezone
    

def random_coordinates(coordinates, radius):
    """
    Generate random coordinates within a given radius of a given point.

    This function generates random coordinates within a given radius of a given
    point. The function takes the coordinates of the point and the radius as
    input and returns the random coordinates.

    Args:
        coordinates (dict): A dictionary containing the latitude and longitude of the point.
        radius (float): The radius within which to generate random coordinates in kilometers.

    Returns:
        dict: A dictionary containing the latitude and longitude of the random coordinates.
    """
    lat = coordinates["lat"]
    lon = coordinates["lng"]
    r = radius / 111.32
    u = random.random()
    v = random.random()
    w = r * math.sqrt(u)
    t = 2 * math.pi * v
    x = w * math.cos(t)
    y = w * math.sin(t)
    x = x / math.cos(lat)
    new_lat = x + lat
    new_lon = y + lon
    return {"lat": new_lat, "lng": new_lon}

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
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) * math.sin(dlat / 2) + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) * math.sin(dlon / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = 6378 * c
    return distance

def get_address_in_radius(ubication, radius_in_km, list_of_ubications):
    list_of_coordinates = {}
    for address in list_of_ubications:
        list_of_coordinates[address] = addres_to_coordinates(address)
    
    coordinates_in_radius = []
    ubication_in_radius = []
    counter = 0
    for address, coords in list_of_coordinates.items():
        distance = calculate_distance(addres_to_coordinates(ubication), coords)
        if distance <= radius_in_km:
            coordinates_in_radius.append(address)
            ubication_in_radius.append(list_of_ubications[counter])
        counter += 1        
    
        
    
    return ubication_in_radius

    