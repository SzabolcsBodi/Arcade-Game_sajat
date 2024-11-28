let name, email, password;
function register(){
    name = document.getElementById("name").value;
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
            
    let user_records=new Array();
    user_records = JSON.parse(localStorage.getItem("user"))?JSON.parse(localStorage.getItem("user")):[]
        if(user_records.some((v)=>{
            return v.email==email 
        })){
            alert("Duplicate Data")
        }
        else{
            user_records.push({
                "name":name,
                "email":email,
                "password":password
            })
            localStorage.setItem("user",JSON.stringify(user_records));
            window.location.href="login.html"
        }

    }
    const button1 = document.getElementById('mybutton1');
    const button2 = document.getElementById('mybutton2'); 
    
    function login() {
        let email, password;
        email = document.getElementById('email').value;
        password = document.getElementById('password').value;
    
        let user_records = new Array();
        user_records = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : [];
    
        if (user_records.some((v) => {
            return v.email == email && v.password == password;
        })) {
            alert("Login Successful");
            let current_user = user_records.filter((v) => {
                return v.email == email && v.password == password;
            })[0];
            localStorage.setItem("name", current_user.name);
            localStorage.setItem("email", current_user.email);
            window.location.href = "main.html";
            button1.style.display = 'none';
            button2.style.display = 'none';
        } else {
            alert("Login Failed");
            button1.style.display = 'block';
            button1.style.display = 'block';
        }
    }
    

