

window.onload = ()=>{

	loadScripts();

}

loadScripts = ()=>{

	const mainBody = document.querySelector('body');
	const loginUserContainer = document.querySelector('.initial-screen');

	const personContainer = document.createElement('div');
	personContainer.className = 'load-person-container';

	const formElement = document.querySelector('form');

	const loginFailAlert = document.createElement('div');
	loginFailAlert.className = 'alert-box';
	loginFailAlert.innerHTML = `<p>El password no corresponde, intentalo denuevo</p>`;

	const nameStructure 		= document.querySelector('.name-structure');
	const totalAttemptsCont 	= document.querySelector('.total-attempts');
	const totalAttemptName 		= totalAttemptsCont.querySelectorAll('.storage-user');
	const totalAttemptPassword  = totalAttemptsCont.querySelectorAll('.storage-password');
	const totalErrorsElement 	= totalAttemptsCont.querySelector('.storage-errors');
	const totalSuccessElement 	= totalAttemptsCont.querySelector('.storage-success');
	const totalAttemptsElement	= totalAttemptsCont.querySelector('.storage-all-attempts');


	mainBody.appendChild(personContainer);

	//Total values for local storage
	let totalErrors, totalSuccess, totalSubmit, localStorageName;

	let dontUpdateInDom = false;

	getStorageValues = (dontUpdateInDom)=>{

		if(localStorage.getItem('nombre') === null){
			let names = [];
			localStorage.setItem('nombre', JSON.stringify(names));
			//console.log(localStorage.getItem('nombre'));
		}else{
			
			if(!dontUpdateInDom){
				JSON.parse(localStorage.getItem('nombre')).map((obj,i)=>{
					
					let newNameStructure = document.createElement('div');
					newNameStructure.innerHTML = `

						<span>Nombre:</span>
						<span class="storage-user">${obj}</span>
						<span> - </span>
						<span>Contraseña usada:</span>
						<span class="storage-password"></span>
					
					`;

					nameStructure.appendChild(newNameStructure);

				});
			}

		}	

		if(localStorage.getItem('password') === null){
			let passwords = [];
			localStorage.setItem('password', JSON.stringify(passwords));
		}else{
			
			if(!dontUpdateInDom){ //When SUCCESS event is active

				JSON.parse(localStorage.getItem('password')).map((obj,i)=>{
					let allPasswordStructures = document.querySelectorAll('.storage-password');
					allPasswordStructures[i].textContent = obj;

				});
			}

		}

		if(localStorage.getItem('total-error')){
			totalErrorsElement.textContent = localStorage.getItem('total-error');
		}
		if(localStorage.getItem('total-success')){
			totalSuccessElement.textContent = localStorage.getItem('total-success');
		}
		if(localStorage.getItem('total-submit')){
			totalAttemptsElement.textContent = localStorage.getItem('total-submit');
		}

	}

	getStorageValues();


	loginBehaviours = (e)=>{
		e.preventDefault();
		const userPasswordDom = document.querySelector('.user-password').firstElementChild.textContent;
		const userPassInput = document.querySelector('#password').value;
		const userName = document.querySelector('.user-name').textContent;

		//console.log(userPassInput);
		//console.log(userPasswordDom);


		////////////////////////////////////////////////////////////
		//Local storage behaviours

		if(localStorage.getItem('total-submit')){ //Set total submit number 
			
			totalSubmit = localStorage.getItem('total-submit');
			JSON.parse(totalSubmit);
			totalSubmit ++;
			JSON.stringify(totalSubmit);
			localStorage.setItem('total-submit', totalSubmit);

		}else{
			totalSubmit = 1;
			JSON.stringify(totalSubmit);
			localStorage.setItem('total-submit', totalSubmit);
		}

		//Local storage behaviours
		////////////////////////////////////////////////////////////


		//Compare password
		if(userPassInput == userPasswordDom){ //SUCCESS
			//console.log('match');
			loginUserContainer.style.display = 'none';

			////////////////////////////////////////////////////////////
			//Local storage behaviours

			if(localStorage.getItem('nombre')){

				const userName = document.querySelector('.user-name').textContent;
				
				const localeParse = JSON.parse(localStorage.getItem('nombre'));
				localeParse.push(userName);
				localStorage.setItem('nombre',JSON.stringify(localeParse));

			}

			if(localStorage.getItem('password')){
				
				const userPassword = document.querySelector('.user-password').firstElementChild.textContent;
				
				const localeParse = JSON.parse(localStorage.getItem('password'));
				localeParse.push(userPassword);
				localStorage.setItem('password',JSON.stringify(localeParse));

			}

			if(localStorage.getItem('total-success')){
				
				totalSuccess = localStorage.getItem('total-success');
				JSON.parse(totalSuccess);
				totalSuccess ++;
				JSON.stringify(totalSuccess);
				localStorage.setItem('total-success', totalSuccess);

			}else{
				totalSuccess = 1;
				JSON.stringify(totalSuccess);
				localStorage.setItem('total-success', totalSuccess);
			}

			//Local storage behaviours
			////////////////////////////////////////////////////////////

			dontUpdateInDom = true;
			
			getStorageValues(dontUpdateInDom);

		}else{	//Error case

			dontUpdateInDom = true;

			getStorageValues(dontUpdateInDom);

			//console.log('no match');
			loginUserContainer.insertBefore(loginFailAlert,formElement);
			setTimeout(()=>{
				loginFailAlert.remove();
			},2000)

			////////////////////////////////////////////////////////////
			//Local storage behaviours

			if(localStorage.getItem('total-error')){

				totalErrors = localStorage.getItem('total-error');

				//console.log('existe');
				JSON.parse(totalErrors);

				totalErrors ++;
				JSON.stringify(totalErrors);

				localStorage.setItem('total-error',totalErrors);

				totalErrorsElement.textContent = totalErrors;

			}else{
				totalErrors = 1;
				JSON.stringify(totalErrors);
				localStorage.setItem('total-error', totalErrors);
			}
			
			//Local storage behaviours
			////////////////////////////////////////////////////////////

		}
	}

	//localStorage.clear();

	document.addEventListener('submit',loginBehaviours);


	setLoginData = (name,password)=>{
		const userName = document.querySelector('.user-name');
		const userPassword = document.querySelector('.user-password').firstElementChild;
		userName.textContent = name;
		userPassword.textContent = password;
	}

	//Login values
	let loginUserName, loginUserPassword;

	renderPeopleOnDom = (data)=>{
		//console.log(data);

		if(data){
			data.results.map((obj,i)=>{

				//console.log(obj);

				let newContainer = document.createElement('div');
				newContainer.className = 'person-wrap';
				

				if(i === 0){
					loginUserName = obj.name.first;
					loginUserPassword = obj.login.password;
					//console.log(i);
					//console.log(loginUserName);
					setLoginData(loginUserName, loginUserPassword);
				}

				newContainer.innerHTML = `

					<div>
						<div>
							<img src="${obj.picture.thumbnail}" alt="Imagen de ${obj.name.first} ${obj.name.last}" /> 
						</div>
						<div>
							<span>Nombre: </span>
							<span>${obj.name.title}</span>
							<span>${obj.name.first}</span>
							<span>${obj.name.last}</span>
						</div>
					</div>
					<div>
						<span>Email: </span>
						<span>${obj.email}</span>
					</div>

					<div>
						<span>Teléfono: </span>
						<span>${obj.phone}</span>
					</div>

					<div>
						<span>Dirección: </span>
						<span>${obj.location.street.name}</span>
						<span>${obj.location.street.number}</span>
						<span>${obj.location.city}</span>
						<span>${obj.location.country}</span>
					</div>
				
				`

				personContainer.appendChild(newContainer);

			});
		}

	}

	fetch('https://randomuser.me/api/?results=10&nat=es').then((resolve)=>{
		return resolve.json();
	}).then((data)=>{

		renderPeopleOnDom(data);

	}).catch((error)=>{
		console.log('load fail:' + error);
	});

}
