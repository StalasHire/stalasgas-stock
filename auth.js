// STALA'S GAS AUTHENTICATION

const supabase = window.supabase.createClient(
    "https://prgyyylrwxkzelydtaaw.supabase.co",
    "sb_publishable_FK3b49UnfyeMxKpcL0v92w_p0Lf5brf"
);

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } =
        await supabase.auth.signInWithPassword({
            email,
            password
        });

    if (error) {

        document.getElementById("message").innerHTML =
            error.message;

        return;
    }

    window.location.href = "index.html";

}
