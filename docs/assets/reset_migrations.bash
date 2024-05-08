#!/bin/bash

# Definir la cadena de conexión
DB_CONNECTION="postgres://postgresql_trapezoidal_42170_fhsx_user:TcId8gAfo75qxZcfdnb6gA7ejgYXWrRZ@dpg-cot98bfsc6pc73cfrbpg-a/postgresql_trapezoidal_42170_fhsx"

# Ejecutar las acciones necesarias
echo "Reinicio de migraciones"
rm -R -f ./migrations &&
echo "Eliminación de la base de datos existente" &&
pipenv run init &&
echo "Eliminación de la base de datos existente" &&
dropdb "$DB_CONNECTION" || true &&
echo "Creación de la base de datos" &&
createdb "$DB_CONNECTION" || true &&
echo "Creación de la extensión 'unaccent'" &&
psql "$DB_CONNECTION" -c 'CREATE EXTENSION IF NOT EXISTS unaccent;' || true &&
echo "Migración" &&
pipenv run migrate &&
echo "Actualización" &&
pipenv run upgrade &&
echo "Inserción de datos de prueba" &&
pipenv run insert-test-data
