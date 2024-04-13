

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			login: async (email, password) => {
				console.log(email,password);
				try {
					const response = await fetch('https://congenial-capybara-69994949r9j429gr-3001.app.github.dev/api/login', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ 
							"email":email, 
						    "password":password })
					});
					const data = await response.json()
					
					if (response.status === 200) {
						return true;
					}
					console.log(data);
					
					
				} catch (error) {
					console.log(error);
					return false;
				}
			},

			validateToken: async () => {
				try {
					const response = await fetch('https://congenial-capybara-69994949r9j429gr-3001.app.github.dev/api/valid-token', {
						method: 'GET',
						headers: {
							'Authorization': 'Bearer ' + tuTokenDeAcceso
						}
					});
					const data = await response.json();
					if (response.ok) {
						
						return data.is_logged;
					} else {
						
						throw new Error(data.msg);
					}
				} catch (error) {
					
					throw new Error('Error al validar el token: ' + error.message);
				}
			},
			
			

		
			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
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
			}
		}
	};
};

export default getState;
