// Authentication functions
async function login(email, password) {
    try {
        showLoading();
        const response = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        // Store token and user info
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        currentUser = response.user;
        
        showToast('Login successful!');
        updateUserUI();
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function register(userData) {
    try {
        showLoading();
        const response = await apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        // Store token and user info
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        currentUser = response.user;
        
        showToast('Registration successful!');
        updateUserUI();
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateForm(formData) {
    const errors = [];
    
    if (!formData.email || !validateEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!formData.password || !validatePassword(formData.password)) {
        errors.push('Password must be at least 6 characters long');
    }
    
    return errors;
}

function validateRegistrationForm(formData) {
    const errors = validateForm(formData);
    
    if (!formData.firstName || formData.firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters long');
    }
    
    if (!formData.lastName || formData.lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters long');
    }
    
    if (!formData.username || formData.username.trim().length < 3) {
        errors.push('Username must be at least 3 characters long');
    }
    
    if (formData.password !== formData.confirmPassword) {
        errors.push('Passwords do not match');
    }
    
    return errors;
}

// Login form handler
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');
        
        const errors = validateForm({ email, password });
        
        if (errors.length > 0) {
            showToast(errors[0], 'error');
            return;
        }
        
        await login(email, password);
    });
}

// Registration form handler
function setupRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(registerForm);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };
        
        const errors = validateRegistrationForm(userData);
        
        if (errors.length > 0) {
            showToast(errors[0], 'error');
            return;
        }
        
        // Check if terms are agreed
        const agreeTerms = formData.get('agreeTerms');
        if (!agreeTerms) {
            showToast('Please agree to the terms and conditions', 'error');
            return;
        }
        
        // Remove confirmPassword before sending
        delete userData.confirmPassword;
        
        await register(userData);
    });
}

// Social login handlers (placeholder)
function setupSocialLogin() {
    const googleBtns = document.querySelectorAll('.btn-google');
    const facebookBtns = document.querySelectorAll('.btn-facebook');
    
    googleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Google login not implemented yet', 'error');
        });
    });
    
    facebookBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Facebook login not implemented yet', 'error');
        });
    });
}

// Password strength indicator
function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthUI(strength);
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 2;
    else if (password.length >= 6) score += 1;
    
    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    return score;
}

function updatePasswordStrengthUI(strength) {
    const existingIndicator = document.getElementById('passwordStrength');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    const passwordInput = document.getElementById('password');
    const indicator = document.createElement('div');
    indicator.id = 'passwordStrength';
    indicator.style.cssText = `
        margin-top: 0.5rem;
        padding: 0.25rem;
        border-radius: 4px;
        font-size: 0.8rem;
        text-align: center;
    `;
    
    if (strength < 3) {
        indicator.textContent = 'Weak';
        indicator.style.backgroundColor = '#dc3545';
        indicator.style.color = 'white';
    } else if (strength < 5) {
        indicator.textContent = 'Medium';
        indicator.style.backgroundColor = '#ffc107';
        indicator.style.color = 'black';
    } else {
        indicator.textContent = 'Strong';
        indicator.style.backgroundColor = '#28a745';
        indicator.style.color = 'white';
    }
    
    passwordInput.parentNode.appendChild(indicator);
}

// Form field validation feedback
function setupFieldValidation() {
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmailField);
    }
    
    if (usernameInput) {
        usernameInput.addEventListener('blur', validateUsernameField);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', validatePasswordField);
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', validateConfirmPasswordField);
    }
}

function validateEmailField(e) {
    const email = e.target.value;
    const isValid = validateEmail(email);
    
    updateFieldValidation(e.target, isValid, 'Please enter a valid email address');
}

function validateUsernameField(e) {
    const username = e.target.value;
    const isValid = username.length >= 3;
    
    updateFieldValidation(e.target, isValid, 'Username must be at least 3 characters long');
}

function validatePasswordField(e) {
    const password = e.target.value;
    const isValid = validatePassword(password);
    
    updateFieldValidation(e.target, isValid, 'Password must be at least 6 characters long');
}

function validateConfirmPasswordField(e) {
    const confirmPassword = e.target.value;
    const passwordInput = document.getElementById('password');
    const isValid = passwordInput && confirmPassword === passwordInput.value;
    
    updateFieldValidation(e.target, isValid, 'Passwords do not match');
}

function updateFieldValidation(field, isValid, errorMessage) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    if (!isValid && field.value) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = errorMessage;
        errorDiv.style.cssText = `
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        `;
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#dc3545';
    } else {
        field.style.borderColor = isValid ? '#28a745' : '#ddd';
    }
}

// Initialize auth page
function initAuthPage() {
    checkAuth();
    
    // If user is already logged in, redirect to home
    if (currentUser) {
        window.location.href = '/';
        return;
    }
    
    setupLoginForm();
    setupRegistrationForm();
    setupSocialLogin();
    setupPasswordStrength();
    setupFieldValidation();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuthPage);
