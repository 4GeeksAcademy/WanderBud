import { redirect } from "react-router-dom";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [],
			publicEvents: [],
			myPublicEvents: [],
			joinedPublicEvents: [],
			publicEventData: {},
			userProfileData: {},
			userProfile: [],
			favorites: [],
			auth: false,
			authProfile: false,
			storeShow: false,
			alertTitle: "",
			alertBody: "",
			redirect: "",
			message: "",
			isAuthenticated: false,
      		userData: {},
      		accessToken: null,
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
				const actions = getActions();
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
			hideAlert: () => {
				setStore({ storeShow: false });
				const store = getStore();
				store.redirect && window.location.replace(store.redirect);
			},
			loginWithGoogle: async (accessToken) => {
				try {
				  const response = await fetch(process.env.BACKEND_URL + '/api/valid-token', {
					method: 'POST',
					headers: {
					  'Content-Type': 'application/json',
					},
					body: JSON.stringify({ accessToken })
				  });
			  
				  if (!response.ok) {
					// Mejor manejo del estado de error, lanzar error con mensaje del servidor si es posible
					const errorData = await response.json();
					throw new Error(`Error en la validación del token: ${errorData.message}`);
				  }
			  
				  const userData = await response.json();
			  
				  // Almacenar datos del usuario y el token en el store
				  setStore({
					isAuthenticated: true,
					userData: userData,
					accessToken: accessToken
				  });
			  
				}catch (error) {
				  
				}
			  },
			validateToken: async () => {
				const store = getStore();
				const actions = getActions()
				const auth = store.auth;
				const unloggedPaths = ['/login', '/password-recovery', '/reset-password', '/signup/user', '/', '/background'];
				const accessToken = localStorage.getItem("token");
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/valid-token", {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (response.status === 200) {
						setStore({ auth: true });
						actions.validateUserProfile();
						return true;
					} else {
						setStore({ auth: false })
						if (!unloggedPaths.includes(window.location.pathname)) {
							setStore({ storeShow: true, alertTitle: 'Session Expired', alertBody: 'Your session has expired, please log in again', redirect: '/login' })
							throw new Error('Token is not valid');
						} else {
							return false;
						}
					}
				} catch (error) {
					console.error('Error validating token:', error);

					return false;
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
			getPublicEvents: async () => {
				const accessToken = localStorage.getItem("token")
				const radius = 1000;
				try {
					const locationResponse = await fetch('https://freeipapi.com/api/json');
					const locationData = await locationResponse.json();
					const location = encodeURIComponent(`${locationData.cityName}, ${locationData.countryName}`)
					console.log(location)
					const response = await fetch(process.env.BACKEND_URL + `/api/get-event-by-radius?radius=${radius}&location=${location}`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${accessToken}`
						},
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
					console.log(name)
					console.log(lastName)
					console.log(location)
					console.log(birthdate)
					console.log(description)
					console.log(image)
					console.log(accessToken)

					const response = await fetch(process.env.BACKEND_URL + "/api/user-profile", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + accessToken
						},
						body: JSON.stringify({
							name: name,
							last_name: lastName,
							birthdate: birthdate,
							location: location,
							description: description,
							profile_image: image
						})
					});
					const data = await response.json();
					if (response.status === 200) {
						setStore({ message: data.msg });
						setStore({ authProfile: true });
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
						const actions = getActions();
						actions.login(userData.email, userData.password);
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
					const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates["lat"]}&lon=${coordinates["lng"]}&zoom=18&addressdetails=1`;
					const resp = await fetch(url);
					if (resp.ok) {
						const data = await resp.json();
						if (data.error) {
							throw new Error('Error converting coordinates to address');
						} else {
							return data.display_name;
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
				console.log(eventData);
				const actions = getActions();
				const startDate = eventData.startDate.split('T')[0];
				const startTime = eventData.startDate.split('T')[1]?.split('.')[0] + ':00';
				const endDate = eventData.endDate.split('T')[0];
				const endTime = eventData.endDate.split('T')[1]?.split('.')[0] + ':00';
				const location = await actions.coordinatesToAddress(eventData.markerPosition);
				const eventDataForBackend = {
					name: eventData.title,
					location: location,
					start_datetime: startDate + ' ' + startTime,
					end_datetime: endDate + ' ' + endTime,
					description: eventData.description,
					event_type_id: parseInt(eventData.event_type_id) + 1,
					budget_per_person: parseInt(eventData.budget),
				};
				console.log(eventDataForBackend);
				try {
					const resp = await fetch(process.env.BACKEND_URL + '/api/create-event', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + localStorage.getItem('token')
						},
						body: JSON.stringify(eventDataForBackend)
					});

					if (resp.status === 200) {
						const data = await resp.json();
						setStore({ message: data.msg });
						window.location.href = '/feed';
						return true;
					} else {
						setStore({ storeShow: true, alertTitle: 'Error', alertBody: 'Error creating event', redirect: '/create-event' });
						throw new Error('Error creating event');
					}
				} catch (error) {
					console.error('Error creating event:', error);
					return false;
				}
			},


			requestJoinEvent: async (event_id) => {
				console.log(event_id);
				try {
					const response = await fetch(process.env.BACKEND_URL + `/api/join-event/${event_id}`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + localStorage.getItem('token')
						}
					});

					if (!response.ok) {
						throw new Error('Failed to join event');
					}

					const data = await response.json();
					if (response.status === 200) {
						setStore({ message: "Pending..." });
						return true;
					}

				} catch (error) {
					// Manejamos el error y lo mostramos en la consola
					console.error('Error joining event:', error);
					throw error; // Lanzamos el error para que el componente que llamó a esta función pueda manejarlo adecuadamente
				}
			},

			validateUserProfile: async () => {
				let accessToken = localStorage.getItem("token");
				const unloggedPaths = ['/login', '/password-recovery', '/reset-password', '/signup/user', '/', '/background'];
				try {

					const response = await fetch(process.env.BACKEND_URL + "/api/profile-view", {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (response.status !== 200 && window.location.pathname !== '/signup/profile') {
						setStore({ authProfile: false });
						setStore({ storeShow: true, alertTitle: 'Register not completed', alertBody: 'Please complete your profile', redirect: '/signup/profile' });
					}
					else if (response.status === 200 && unloggedPaths.includes(window.location.pathname)) {
						setStore({ authProfile: true });
						window.location.href = '/feed';
					} else if (response.status === 200 && !unloggedPaths.includes(window.location.pathname)) {
						setStore({ authProfile: true });
					}
					else if (response.status === 200 && window.location.pathname === '/signup/profile') {
						setStore({ authProfile: true });
						window.location.href = '/feed';
					} else if (response.status !== 200 && window.location.pathname === '/signup/profile') {
						return false;
					} else {
						throw new Error('Error getting user profile');
					}
				} catch (error) {
					console.error('Error validating user profile:', error);
					return false; // Return false if there's an error
				}

			},

			getUserProfile: async (token) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/profile-view", {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					if (response.ok) {
						const data = await response.json();
						setStore({ userProfile: data.results });
					} else {
						throw new Error('Error getting public events');
					}
				} catch (error) {
					console.error('Error getting public events:', error);
					setStore({ message: "Network error, please try again" });
				}
			},

			getOneEvent: async (id) => {
				let accessToken = localStorage.getItem("token")
				try {
					const response = await fetch(process.env.BACKEND_URL + `/api/get-event/${id}`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (response.ok) {
						const data = await response.json();
						setStore({ publicEventData: data });
					} else {
						throw new Error('Error getting public events');
					}
				} catch (error) {
					console.error('Error getting public events:', error);
					setStore({ message: "Network error, please try again" });
				}
			},

			getPublicUserProfile: async (id) => {
				let accessToken = localStorage.getItem("token")
				try {
					const response = await fetch(process.env.BACKEND_URL + `/api/public-user-profile/${id}`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (response.ok) {
						const data = await response.json();
						setStore({ userProfileData: data.results[0] });
					} else {
						throw new Error('Error getting public events');
					}
				} catch (error) {
					console.error('Error getting public events:', error);
					setStore({ message: "Network error, please try again" });
				}
			},

			getMyPublicEvents: async () => {
				const accessToken = localStorage.getItem("token")
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/get-my-events", {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (response.ok) {
						const data = await response.json();
						setStore({ myPublicEvents: data });
					} else {
						throw new Error('Error getting public events');
					}
				} catch (error) {
					console.error('Error getting public events:', error);
					setStore({ message: "Network error, please try again" });
				}
			},
			
			getJoinedPublicEvents: async () => {
				const accessToken = localStorage.getItem("token")
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/get-joined-events", {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (response.ok) {
						const data = await response.json();
						console.log(data)
						setStore({ joinedPublicEvents: data });
					} else {
						throw new Error('Error getting public events');
					}
				} catch (error) {
					console.error('Error getting public events:', error);
					setStore({ message: "Network error, please try again" });
				}
			},

			updateEvent: async (eventData, event_id) => {
				console.log(eventData);
				const actions = getActions();
				const startDate = eventData.startDate.split('T')[0];
				const startTime = eventData.startDate.split('T')[1]?.split('.')[0] + ':00';
				const endDate = eventData.endDate.split('T')[0];
				const endTime = eventData.endDate.split('T')[1]?.split('.')[0] + ':00';
				const location = await actions.coordinatesToAddress(eventData.markerPosition);
				const eventDataForBackend = {
					name: eventData.title,
					location: location,
					start_datetime: startDate + ' ' + startTime,
					end_datetime: endDate + ' ' + endTime,
					description: eventData.description,
					event_type_id: parseInt(eventData.event_type_id) + 1,
					budget_per_person: parseInt(eventData.budget),
				};
				console.log(eventDataForBackend);
				try {
					const resp = await fetch(process.env.BACKEND_URL + `/api/update-event/${event_id}`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + localStorage.getItem('token')
						},
						body: JSON.stringify(eventDataForBackend)
					});

					if (resp.status === 200) {
						const data = await resp.json();
						setStore({ message: data.msg });
						window.location.href = '/feed';
						return true;
					} else {
						setStore({ storeShow: true, alertTitle: 'Error', alertBody: 'Error creating event', redirect: '/create-event' });
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
