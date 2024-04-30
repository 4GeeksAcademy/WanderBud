import { id } from "date-fns/locale";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [],
			appliedPublicEvents: null,
			publicEvents: [],
			myPublicEvents: [],
			joinedPublicEvents: [],
			publicEventData: {},
			profileImages: [],
			userAccount: {
				email: "",
				password: "",
				id: ""
			},
			ownerRequest: null,
			groupChat: null,
			favorites: [],
			auth: false,
			authProfile: false,
			storeShow: false,
			alertTitle: "",
			alertBody: "",
			redirect: "",
			message: "",
			isAuthenticated: false,
			updateUser: false,
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

				} catch (error) {

				}
			},
			validateToken: async () => {
				const store = getStore();
				const actions = getActions()
				const auth = store.auth;
				const unloggedPaths = ['/login', '/password-recovery', '/password-reset/*', '/signup/user', '/', '/background'];
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
						if ((window.location.pathname).includes('/password-reset')) {
							return false;
						}
						else if (!unloggedPaths.includes(window.location.pathname)) {
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
			noMoreCoverImages: async (id) => {
				setStore({ storeShow: true, alertTitle: 'No more images', alertBody: 'No more images to show', redirect: "" });
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
					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(async (position) => {
							const { latitude, longitude } = position.coords;
							const location = encodeURIComponent(`{"lat": ${latitude},"lng": ${longitude}}`);
							const response = await fetch(process.env.BACKEND_URL + `/api/get-event-by-radius?radius=${radius}&coords=${location}`, {
								method: 'GET',
								headers: {
									'Authorization': `Bearer ${accessToken}`
								},
							});
							if (response.ok) {
								const data = await response.json();
								setStore({ publicEvents: data });
							} else {
								console.log("Error getting public events:", response);
								throw new Error('Error getting public events');
							}
							console.log(location);
						}, (error) => {
							console.error('Error al obtener la ubicación:', error.message);
						});
					}
					else {
						console.error('Geolocalización no soportada por este navegador.');
					}
				} catch (error) {
					console.error('Error getting public events:', error);
					setStore({ message: "Network error, please try again" });
				}
			},
			createUserProfile: async (name, lastName, location, birthdate, description, image, coverImage, accessToken) => {
				try {
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
							profile_image: image,
							cover_image: coverImage
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
				const actions = getActions();
				const startDate = eventData.startDate.split('T')[0];
				const startTime = eventData.startDate.split('T')[1]?.split('.')[0] + ':00';
				const endDate = eventData.endDate.split('T')[0];
				const endTime = eventData.endDate.split('T')[1]?.split('.')[0] + ':00';
				const location = eventData.address;
				const markerPosition = eventData.markerPosition;
				const eventDataForBackend = {
					name: eventData.title,
					location: location,
					coords: eventData.markerPosition,
					start_datetime: startDate + ' ' + startTime,
					end_datetime: endDate + ' ' + endTime,
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


			requestJoinEvent: async (event_id, message) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + `/api/join-event/${event_id}`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + localStorage.getItem('token')
						},
						body: JSON.stringify({
							"message": message
						})
					});

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

			getUserProfile: async (id) => {
				let token = localStorage.getItem("token");
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/user-profile/" + id, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					if (response.ok) {
						const data = await response.json();
						return data.results;
					} else {
						const data = await response.json();
						console.log("Error getting user profile:", data);
						throw new Error('Error getting public events');
					}
				} catch (error) {
					console.error('Error getting user profile:', error);
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
						return data;
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
						setStore({ joinedPublicEvents: data });
					} else {
						const data = await response.json();
						console.log("Error getting joined events:", data);
						throw new Error('Error getting public events');
					}
				} catch (error) {
					console.error('Error getting public events:', error);
					setStore({ message: "Network error, please try again" });
				}
			},

			updateEvent: async (eventData, event_id) => {
				console.log(eventData);
				console.log(event_id);
				const actions = getActions();
				const startDate = eventData.startDate
				const endDate = eventData.endDate
				const eventDataForBackend = {
					name: eventData.title,
					location: eventData.location,
					coords: eventData.markerPosition,
					start_datetime: startDate,
					end_datetime: endDate,
					description: eventData.description,
					event_type_id: parseInt(eventData.event_type_id) + 1,
					budget_per_person: parseInt(eventData.budget),
				};
				try {
					const resp = await fetch(process.env.BACKEND_URL + `/api/update-event/${event_id}`, {
						method: 'PUT',
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
						const data = await resp.json();
						console.log("Error updating event:", data);
						setStore({ storeShow: true, alertTitle: 'Error', alertBody: 'Error updating event', redirect: '/update-event/' + event_id });
						throw new Error('Error updating event');
					}
				} catch (error) {
					console.error('Error updating event:', error);
					return false;
				}
			},

			getUserAccount: async () => {
				const accesToken = localStorage.getItem("token");
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/user-account", {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${accesToken}`
						}
					});
					if (response.status === 200) {
						const data = await response.json();
						setStore({
							userAccount: {
								email: data.email,
								id: data.id
							}
						})
						return data
							;
					} else {
						throw new Error('Error getting user account');
					}
				} catch (error) {
					console.error('Error getting user account:', error);
					setStore({ message: "Network error, please try again" });
				}
			},
			updateUserAccount: async (userData) => {
				const accessToken = localStorage.getItem("token");
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/update-user", {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${accessToken}`
						},
						body: JSON.stringify(userData)
					});
					if (response.status === 200) {
						const data = await response.json();
						setStore({ message: data.msg });
						setStore({
							userAccount: {
								email: userData.email
							}
						});
						setStore({ storeShow: true, alertTitle: 'Success', alertBody: 'User updated successfully', redirect: '/feed' });
						return true;
					} else {
						setStore({ storeShow: true, alertTitle: 'Error', alertBody: 'Error updating user', redirect: '/settings/account' });
						throw new Error('Error updating user');
					}
				} catch (error) {
					console.error('Error updating user:', error);
					return false;
				}
			},
			deleteUserAccount: async () => {
				const accessToken = localStorage.getItem("token");
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/delete-user", {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (response.status === 200) {
						const data = await response.json();
						setStore({ message: data.msg });
						setStore({ auth: false, authProfile: false })
						localStorage.removeItem("token");
						window.location.href = '/';
						return true;
					} else {
						setStore({ storeShow: true, alertTitle: 'Error', alertBody: 'Error deleting user', redirect: '/settings/account' });
						throw new Error('Error deleting user');
					}
				} catch (error) {
					console.error('Error deleting user:', error);
					return false;
				}
			},
			updateUserProfile: async (
				name,
				lastName,
				location,
				birthdate,
				description,
				image,
				coverImage
			) => {
				const accessToken = localStorage.getItem("token");
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/update-profile", {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${accessToken}`
						},
						body: JSON.stringify({
							"name": name,
							"last_name": lastName,
							"location": location,
							"birthdate": birthdate,
							"description": description,
							"profile_image": image,
							"cover_image": coverImage

						})
					});
					if (response.status === 200) {
						const data = await response.json();
						setStore({ message: data.msg });
						return true;
					} else {
						throw new Error('Error updating user profile');
					}
				} catch (error) {
					console.error('Error updating user profile:', error);
					return false;
				}
			},
			getOwnerRequest: async () => {
				const accessToken = localStorage.getItem('token');
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/get-owner-request', {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (!response.ok) {
						throw new Error(`Error getting owner request: ${response.statusText}`);
					} else if (response.status === 200) {
						const data = await response.json();
						setStore({ ownerRequest: data });
					} else if (response.status === 202) {
						setStore({
							ownerRequest: {
								msg: "No owner request found"
							}
						});
					}
				} catch (error) {
					console.error('Error getting owner request:', error);
					return [];
				}
			},
			getAppliedEvents: async () => {
				const accessToken = localStorage.getItem('token')
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/get-user-request', {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (!response.ok) {
						throw new Error(`Error getting user request: ${response.statusText}`);
					} else if (response.status === 200) {
						const data = await response.json();
						//	setStore({ appliedPublicEvents: data });
						//} else {
						//	throw new Error('Error getting user request');
						setStore({ appliedPublicEvents: data });
					} else if (response.status === 202) {
						setStore({
							appliedPublicEvents: {
								msg: "No applied events found"
							}
						});
					}
				} catch (error) {
					console.error('Error getting user request:', error);
					return [];
				}
			},
			getGroupChat: async () => {
				const accessToken = localStorage.getItem('token');
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/get-my-groups-chat', {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (!response.ok) {
						const data = await response.json();
						console.error('Error getting group chat:', data);
						throw new Error(`Error getting group chat: ${response.statusText}`);
					} else if (response.status === 200) {
						const data = await response.json();
						setStore({ groupChat: data });
					} else if (response.status === 202) {
						setStore({
							groupChat: {
								msg: "No group chat found"
							}
						});
					}
				} catch (error) {
					console.error('Error getting group chat:', error);
					return [];
				}
			},
			acceptMember: async (event_id, member_id) => {
				const accessToken = localStorage.getItem('token');
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/accept-member/" + event_id, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${accessToken}`
						},
						body: JSON.stringify({ member_id: member_id })
					});
					if (!response.ok) {
						const error = await response.json();
						console.error('Error accepting user:', error);
						throw new Error(`Error accepting user: ${await response.json()}`);
					} else if (response.status === 200) {
						const store = getStore();
						const ownerRequest = store.ownerRequest.filter(request => request.member_id !== member_id);
						const data = await response.json();
						setStore({ ownerRequest: ownerRequest });
						return true;
					}
				} catch (error) {
					console.error('Error accepting user:', error);
					return false;
				}
			},
			rejectMember: async (event_id, user_id) => {
				const accessToken = localStorage.getItem('token');
				try {
					const response = await fetch(process.env.BACKEND_URL + `/api/reject-member/${event_id}`, {
						method: 'PUT',
						headers: {

							'Content-Type': 'application/json',
							'Authorization': `Bearer ${accessToken}`
						},
						body: JSON.stringify({ member_id: user_id })
					});
					if (!response.ok) {
						throw new Error(`Error rejecting user: ${response.statusText}`);
					} else if (response.status === 200) {
						const store = getStore();
						const ownerRequest = store.ownerRequest.filter(request => request.member_id !== user_id);
						const data = await response.json();
						setStore({ ownerRequest: ownerRequest });
						return true;
					}
				} catch (error) {
					console.error('Error rejecting user:', error);
					return false;
				}
			},
			leaveEvent: async (event_id) => {
				const accessToken = localStorage.getItem('token');
				try {
					const response = await fetch(process.env.BACKEND_URL + `/api/leave-event/${event_id}`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (!response.ok) {
						const data = await response.json();
						console.log("Error leaving event:", data);
						throw new Error(`Error leaving event: ${response.statusText}`);
					} else if (response.status === 200) {
						const store = getStore();
						const appliedPublicEvents = store.appliedPublicEvents.filter(request => request.id !== event_id);
						const data = await response.json();
						setStore({ appliedPublicEvents: appliedPublicEvents });
						return true;
					}
				} catch (error) {
					console.error('Error leaving event:', error);
					return false;
				}
			},
			getPrivateChat: async (id) => {
				const accessToken = localStorage.getItem('token');
				try {
					const response = await fetch(process.env.BACKEND_URL + `/api/get-private-chat/${id}`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (!response.ok) {
						if (response.status === 401) {
							const actions = getActions();
							await actions.validateToken();
						} else {
							const data = await response.json();
							setStore({ message: data.msg });
							throw new Error(`Error getting private chat: ${response.statusText}`);
						}
					} else if (response.status === 200) {
						const data = await response.json();
						return data;
					}
				} catch (error) {
					console.error('Error getting private chat:', error);
					return [];
				}
			},
			deleteEvent: async (event_id) => {
				const accessToken = localStorage.getItem("token");
				try {
					const response = await fetch(process.env.BACKEND_URL + `/api/delete-event/${event_id}`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (response.status === 200) {
						const data = await response.json();
						setStore({ message: data.msg });
						return true;
					} else {
						throw new Error('Error deleting event');
					}
				} catch (error) {
					console.error('Error deleting event:', error);
					return false;
				}
			},
			addProfileImage: async (image) => {
				console.log(image)
				const accessToken = localStorage.getItem("token")
				try {
					console.log(image)
					const response = await fetch(process.env.BACKEND_URL + "/api/user-profile-image", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + accessToken
						},
						body: JSON.stringify({

							"image_path": image
						})
					});
					const data = await response.json();
					if (response.status === 200) {
						setStore({ message: data.msg });
						return true;
					} else {
						throw new Error('Error uploading image');
					}
				} catch (error) {
					console.error('Error uploading image:', error);
					return false;
				}
			},

			getProfileImages: async (user_id) => {
				const accessToken = localStorage.getItem("token")
				console.log(user_id)
				try {
					
					const response = await fetch(process.env.BACKEND_URL + `/api/user-profile-images/${user_id}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + accessToken
						},
					});
					const data = await response.json();
					if (response.status === 200) {
						setStore({ message: data.msg });
						setStore({ profileImages: data.results});
						return true;}

					else if (response.status === 404) {
						setStore({ message: data.msg });
						setStore({ profileImages: []});
						return true;}
					else {
						throw new Error('Error updating image');
					}
				} catch (error) {
					console.error('Error updating image:', error);
					return false;
				}
			},

			deleteProfileImage: async (image_id) => {
				const accessToken = localStorage.getItem("token")
				try {

					const response = await fetch(process.env.BACKEND_URL + `/api/user-profile-image/${image_id}`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + accessToken
						},
					});
					const data = await response.json();
					if (response.status === 200) {
						setStore({ message: data.msg });
						return true;
					} else {
						throw new Error('Error deleting image');
					}
				} catch (error) {
					console.error('Error deleting image:', error);
					return false;
				}
			}, sendMessage: async (chat_id, message, type) => {
				if (message.trim() === "") {
					return;
				}
				const accessToken = localStorage.getItem('token');
				if (type === "private") {
					try {
						const response = await fetch(process.env.BACKEND_URL + `/api/send-private-message/${chat_id}`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'Authorization': `Bearer ${accessToken}`
							},
							body: JSON.stringify({ message })
						});
						if (!response.ok) {
							const data = await response.json();
							console.error('Error sending private message:', data);
							throw new Error(`Error sending private message: ${response.statusText}`);
						} else if (response.status === 200) {
							const data = await response.json();
							return data;
						}
					} catch (error) {
						console.error('Error sending private message:', error);
						return [];
					}
				} else if (type === "group") {
					try {
						const response = await fetch(process.env.BACKEND_URL + `/api/send-group-message/${chat_id}`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'Authorization': `Bearer ${accessToken}`
							},
							body: JSON.stringify({ message: message })
						});
						if (!response.ok) {
							const data = await response.json();
							console.error('Error sending group message:', data);
							throw new Error(`Error sending group message: ${response.statusText}`);
						} else if (response.status === 200) {
							const data = await response.json();
							return data;
						}
					} catch (error) {
						console.error('Error sending group message:', error);
						return [];
					}
				}
			},

			getFavorites: async () => {
				const store = getStore();
				const accessToken = localStorage.getItem("token");
				const userId = store.userAccount.id; // Asegúrate de que el ID del usuario está correctamente almacenado en el store
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user_favorites/${userId}`, {
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (response.ok) {
						const favorites = await response.json();
						setStore({ ...store, favorites });
					} else {
						throw new Error('Failed to fetch favorites');
					}
				} catch (error) {
					console.error('Error fetching favorites:', error);
				}
			},

			addFavoriteEvent: async (userId, eventId) => {
				const accessToken = localStorage.getItem("token");
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/add_favorite`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${accessToken}`
						},
						body: JSON.stringify({ user_id: userId, event_id: eventId })
					});
			
					if (response.ok) {
						const data = await response.json();
						setStore({ favorites: [...getStore().favorites, data] });
						return true;
					} else {
						const errorData = await response.json();
						throw new Error(`Failed to add favorite event: ${errorData.error}`);
					}
				} catch (error) {
					console.error('Error adding favorite event:', error);
					// Aquí puedes añadir lógica adicional para manejar el error de forma adecuada
					return false;
				}
			},

			getEventChat: async (id) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + `/api/get-group-chat/${id}`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`
						}
					});
					if (!response.ok) {
						if (response.status === 401) {
							const actions = getActions();
							await actions.validateToken();
						} else {
							const data = await response.json();
							setStore({ message: data.msg });
							throw new Error(`Error getting event chat: ${response.statusText}`);
						}
					} else if (response.status === 200) {
						const data = await response.json();
						return data;
					}
				} catch (error) {
					console.error('Error getting event chat:', error);
					return [];
				}

			}

		}

	}
};


export default getState;
