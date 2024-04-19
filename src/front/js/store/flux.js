const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [], // Aquí puedes mantener una lista de usuarios creados
			publicEvents: []
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			onCreateEvent: () => {
				console.log(sirve);
				// Redirige al usuario a la ruta '/create-event'
				// window.location.href = '/create-event';
			},

			PasswordRecoverySubmit: async (email) => {

				let frontendUrl = 'https://super-journey-9777j7j7qj67cwpp-3000.app.github.dev/password-reset';
				try {
					const resp = await fetch(process.env.BACKEND_URL + '/api/recover-password', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ email, frontend_url: frontendUrl }),

					});
					if (resp.status == 200) {
						return true;
					}

				} catch (error) {
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
						body: JSON.stringify({
							"email": email,
							"password": password
						})
					});
					const data = await response.json()

					if (response.status === 200) {
						localStorage.setItem("token", data.access_token)
						console.log(data)

						return true;
					}



				} catch (error) {
					return false;
				}
			},

			validateToken: async () => {
				let accessToken = localStorage.getItem("token")
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/valid-token', {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							'Authorization': 'Bearer ' + accessToken
						}
					});
					const data = await response.json();
					if (response.status == 200) {
						setStore({ auth: data.is_logged })

					} else {

						localStorage.removeItem("token");
						setStore({ auth: false }); // Opcional: actualiza el estado de autenticación en el store


					}


				} catch (error) {

					throw new Error('Error al validar el token: ' + error.message);
				}
			},

			resetPassword: async (password, token) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/reset-password', {
						method: 'PUT',
						headers: {
							"Content-Type": "application/json",
							'Authorization': 'Bearer ' + token
						},
						body: JSON.stringify({ "password": password })
					});

					if (response.status === 200) {
						setStore({ message: "Password successfully changed" })
						setStore({ auth2: true })
					} else {
						setStore({ message: "Something went wrong, try again" })
					}
				} catch (error) {
					console.error("Network error:", error);
					setStore({ message: "Network error, please try again" })
				}
			},

			getPublicEvents: async (token) => {
				console.log(token)
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/get-all-events", {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}

					const data = await response.json()
					setStore({ publicEvents: data })

				}
				catch (error) {
					console.error("Network error:", error);
					setStore({ message: "Network error, please try again" })
				}

			},
			createUserProfile: async (name, lastName, location, birthdate, description, image, accessToken) => {
				console.log(image);
				console.log(accessToken);


				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/user-profile", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + accessToken
						},
						body: JSON.stringify({
							"name": name,
							"last_name": lastName,
							"birthdate": birthdate,
							"location": location,
							"description": description,
							"profile_image": image
						})
					});
					const data = await response.json()

					if (response.status === 200) {
						setStore({ message: data.msg })
						console.log(data)

						return true;
					}



				} catch (error) {
					console.log(error)
					return false;
				}
			},


			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
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
						const store = getStore();
						const updatedUsers = [...store.users, newUser];
						setStore({ users: updatedUsers });
						return true; // Indicar éxito al crear el usuario
					} else {
						throw new Error('Error al crear el usuario');
					}
				} catch (error) {
					console.error('Error al crear el usuario:', error);
					return false; // Indicar fallo al crear el usuario
				}
			},
		},

	}
};

export default getState;
