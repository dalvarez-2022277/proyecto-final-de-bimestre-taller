const forms = document.querySelector(".forms"),
      pwShowHide = document.querySelectorAll(".eye-icon"),
      links = document.querySelectorAll(".link");

pwShowHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");
        
        pwFields.forEach(password => {
            if(password.type === "password"){
                password.type = "text";
                eyeIcon.classList.replace("bx-hide", "bx-show");
                return;
            }
            password.type = "password";
            eyeIcon.classList.replace("bx-show", "bx-hide");
        })
        
    })
})      

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("input[type='text']").value;
    const password = document.querySelector("input[type='password']").value;

    try {
        const response = await fetch("http://localhost:3000/Ventas_Online/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("successMessage").textContent = data.msg;
            document.getElementById("successMessage").style.color = "green"; // Cambia el color a verde
            console.log(data.msg);
            // Ocultar el mensaje después de 2 segundos (2000 milisegundos)
            setTimeout(() => {
                document.getElementById("successMessage").textContent = "";
            }, 2000);
        } else {
            document.getElementById("errorMessage").textContent = data.msg;
            document.getElementById("errorMessage").style.color = "red"; // Cambia el color a rojo
            console.log(data.msg);
            setTimeout(() => {
                document.getElementById("errorMessage").textContent = "";
            }, 2000);
        }
        
    } catch (error) {
        console.error(error);
    }
});
