const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [],
			publicEvents: [],
			auth: false,
			message: ""
		},
		actions: {
			onCreateEvent: () => {
				window.location.href = '/create-event';
			},
			passwordRecoverySubmit: async (email) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + '/api/recover-password', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ email, frontend_url: process.env.FRONTEND_URL }),
					});
					return resp.status === 200;
				} catch (error) {
					console.error('Error submitting password recovery:', error);
					return false;
				}
			},
			login: async (email, password) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ email, password })
					});
					const data = await response.json();
					if (response.status === 200) {
						localStorage.setItem("token", data.access_token);
						setStore({ auth: true });
						return true;
					} else {
						throw new Error('Login failed');
					}
				} catch (error) {
					console.error('Error logging in:', error);
					return false;
				}
			},
			validateToken: async () => {
				const accessToken = localStorage.getItem("token");
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/valid-token', {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							'Authorization': 'Bearer ' + accessToken
						}
					});
					const data = await response.json();
					setStore({ auth: response.status === 200 });
				} catch (error) {
					console.error('Error validating token:', error);
					throw new Error('Error validating token: ' + error.message);
				}
			},
			resetPassword: async (password, token) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/reset-password/' + token, {
						method: 'PUT',
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ password })
					});
					const status = response.status;
					if (status === 200) {
						setStore({ message: "Password successfully changed" });
					} else if (status === 401) {
						setStore({ message: "Unauthorized, Token is not valid" });
					} else {
						setStore({ message: "Something went wrong, try again" });
					}
				} catch (error) {
					console.error('Error resetting password:', error);
					setStore({ message: "Network error, please try again" });
				}
			},
			getPublicEvents: async (token) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/get-all-events", {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					if (response.ok) {
						const data = await response.json();
						setStore({ publicEvents: data });
					} else {
						throw new Error('Error getting public events');
					}
				} catch (error) {
					console.error('Error getting public events:', error);
					setStore({ message: "Network error, please try again" });
				}
			},
			createUserProfile: async (name, lastName, location, birthdate, description, image, accessToken) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/user-profile", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + accessToken
						},
						body: JSON.stringify({
							name,
							last_name: lastName,
							birthdate,
							location,
							description,
							profile_image: image
						})
					});
					const data = await response.json();
					if (response.status === 200) {
						setStore({ message: data.msg });
						return true;
					} else {
						throw new Error('Error creating user profile');
					}
				} catch (error) {
					console.error('Error creating user profile:', error);
					return false;
				}
			},
			createUser: async (userData) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + '/api/create-user', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(userData)
					});
					if (resp.ok) {
						const newUser = await resp.json();
						setStore({ users: [...getStore().users, newUser] });
						return true;
					} else {
						throw new Error('Error creating user');
					}
				} catch (error) {
					console.error('Error creating user:', error);
					return false;
				}
			},
			getEventTypes: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + '/api/get-event-types');
					if (resp.ok) {
						return await resp.json();
					} else {
						throw new Error('Error loading event types');
					}
				} catch (error) {
					console.error('Error loading event types:', error);
					return [];
				}
			},
			getMyLocation: async () => {
				try {
					const resp = await fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=' + process.env.GOOGLE_API, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						}
					});
					if (resp.ok) {
						const location = await resp.json();
						return {
							lat: location.location.lat,
							lng: location.location.lng
						};
					} else {
						throw new Error('Error loading user location');
					}
				} catch (error) {
					console.error('Error loading user location:', error);
					return {};
				}
			},
			coordinatesToAddress: async (coordinates) => {
				try {
					const resp = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coordinates.lat + ',' + coordinates.lng + '&key=' + process.env.GOOGLE_API);
					if (resp.ok) {
						const data = await resp.json();
						if (data.status === 'OK') {
							return data.results[0].formatted_address;
						} else {
							throw new Error('Error converting coordinates to address');
						}
					} else {
						throw new Error('Error converting coordinates to address');
					}
				} catch (error) {
					console.error('Error converting coordinates to address:', error);
					return null;
				}
			},
			createEvent: async (eventData) => {
				const actions = getActions();
				const startDate = eventData.startDate.split('T')[0];
				const startTime = eventData.startDate.split('T')[1]?.split('.')[0] + ':00';
				const endDate = eventData.endDate.split('T')[0];
				const endTime = eventData.endDate.split('T')[1]?.split('.')[0] + ':00';
				const location = await actions.coordinatesToAddress(eventData.location);
				const eventDataForBackend = {
					name: eventData.name,
					location,
					start_date: startDate,
					start_time: startTime,
					end_date: endDate,
					end_time: endTime,
					description: eventData.description,
					event_type_id: parseInt(eventData.event_type_id) + 1,
					budget_per_person: parseInt(eventData.budget),
				};
				try {
					const resp = await fetch(process.env.BACKEND_URL + '/api/create-event', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + localStorage.getItem('token')
						},
						body: JSON.stringify(eventDataForBackend)
					});
					if (resp.ok) {
						return true;
					} else {
						throw new Error('Error creating event');
					}
				} catch (error) {
					console.error('Error creating event:', error);
					return false;
				}
			},
		}
	};
};

export default getState;
