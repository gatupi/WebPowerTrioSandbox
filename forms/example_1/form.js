function runScript() {

    const data = {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: ''
    }

    const submitForm = document.querySelector('#submitForm');
    if (!submitForm) {
        console.warn('submit form button not found!');
        return;
    }

    const personForm = document.querySelector('#personForm');
    if (!personForm) {
        console.warn('person form not found!');
        return -1;
    }

    personForm.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(personForm);
        Object.keys(data).forEach(k => {
            data[k] = formData.get(k);
        });
        console.log(data);
    });

    return 0;
}

function enviarDadosParaBackend() {

    const url = "https://minha_api.com.br/cadastro/pessoa";
    
}
