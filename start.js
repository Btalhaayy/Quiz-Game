function startQuiz() {
    const username = document.getElementById('username').value;
 
    localStorage.setItem('username', username);
    window.location.href = "index.html"; 
}
document.getElementById('username-display').textContent = `Username: ${username}`;