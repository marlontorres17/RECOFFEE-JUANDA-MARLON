document.addEventListener("DOMContentLoaded", function () {
    const citySelect = document.getElementById("city");
    const roleSelect = document.getElementById("role");
    const registrationForm = document.getElementById("registrationForm");
    const messageDiv = document.getElementById("message");

    // Crear el botón de iniciar sesión y agregarlo al DOM
    const loginButton = document.createElement("button");
    loginButton.id = "loginButton";
    loginButton.textContent = "Iniciar Sesión";
    loginButton.onclick = () => window.location.href = "/login"; // Cambia esta URL según tu ruta de login
    messageDiv.after(loginButton);

    // Cargar ciudades desde la API
    fetch("http://localhost:9191/api/City")
        .then(response => response.json())
        .then(cities => {
            cities.forEach(city => {
                const option = document.createElement("option");
                option.value = city.id;
                option.textContent = city.name;
                citySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar las ciudades:", error);
            messageDiv.textContent = "Error al cargar las ciudades.";
        });

    // Cargar roles desde la API
    fetch("http://localhost:9191/api/Role")
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                const option = document.createElement("option");
                option.value = role.id;
                option.textContent = role.name;
                roleSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar los roles:", error);
            messageDiv.textContent = "Error al cargar los roles.";
        });

    // Manejar el envío del formulario
    registrationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const user = {
            state: true,
            userName: document.getElementById("username").value,
            password: document.getElementById("password").value,
            personId: 0
        };

        const person = {
            state: true,
            firstName: document.getElementById("firstName").value,
            secondName: document.getElementById("secondName").value,
            firstLastName: document.getElementById("firstLastName").value,
            secondLastName: document.getElementById("secondLastName").value,
            email: document.getElementById("email").value,
            dateOfBirth: new Date(document.getElementById("dateOfBirth").value).toISOString(),
            gender: document.getElementById("gender").value,
            cityId: citySelect.value,
            typeDocument: document.getElementById("typeDocument").value,
            numberDocument: document.getElementById("numberDocument").value
        };

        const roleId = roleSelect.value;

        fetch("https://localhost:44328/api/User/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user, person, roleId }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en el registro.");
                }
                return response.json();
            })
            .then(data => {
                messageDiv.textContent = "¡Registro exitoso!";
                messageDiv.style.transform = "scale(1)";
                messageDiv.style.opacity = "1";
                loginButton.style.display = "inline-block"; // Mostrar el botón de iniciar sesión
                registrationForm.reset();
            })
            .catch(error => {
                console.error("Error al registrar:", error);
                messageDiv.textContent = "Error al registrar.";
                messageDiv.style.transform = "scale(1)";
                messageDiv.style.opacity = "1";
            });
    });
});
