 document.querySelectorAll('.faq-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const faqAnswer = button.parentElement.nextElementSibling;
                faqAnswer.style.display = faqAnswer.style.display === 'block' ? 'none' : 'block';
                button.textContent = button.textContent === '+' ? 'X' : '+';
            });
});
let step = 0;
let preferences = {
    diet: "",
    cuisine: "",
    allergies: [],
    spiceLevel: "",
    mealType: "",
    budget: "",
    otherQuestions: {}
};

const chatIcon = document.getElementById('chat-icon');
const closeBtn = document.getElementById('close-btn');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatContainer = document.getElementById('chat-container');
const chatMessages = document.getElementById('chat-messages');

function toggleChat() {
    chatContainer.classList.toggle('hidden');
    if (!chatContainer.classList.contains('hidden')) {
        setTimeout(() => appendMessage("Hi! I'm YumYoda. Let's find the perfect food for you!", 'bot-message', startOptions), 500);
    }
}

function closeChat() {
    chatContainer.classList.add('hidden');
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'chat-button';
    button.addEventListener('click', onClick);
    return button;
}

function createCheckbox(text, name) {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkbox-container';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = name;
    checkbox.value = text;
    const label = document.createElement('label');
    label.textContent = text;
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
    return checkboxContainer;
}

chatIcon.addEventListener('click', toggleChat);
closeBtn.addEventListener('click', closeChat);
sendBtn.addEventListener('click', () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        appendMessage(userMessage, 'user');
        userInput.value = '';
        handleBotResponse(userMessage);
    }
});

function appendMessage(message, className, callback) {
    chatMessages.innerHTML = ''; // Clear previous messages
    const messageDiv = document.createElement('div');
    messageDiv.className = className;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (callback) callback();
}

function startOptions() {
    appendMessage("Hi! I'm YumYoda. Let's find the perfect food for you!", 'bot-message', () => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(createButton('Start', () => handleBotResponse('start')));
        buttonContainer.appendChild(createButton('Exit', () => handleBotResponse('exit')));
        appendScrollContainer(buttonContainer);
    });
}

function handleBotResponse(input) {
    switch (step) {
        case 0:
            if (input === 'start') {
                step = 1;
                askDietPreference();
            } else if (input === 'exit') {
                appendMessage("Thank you for using YumYoda. Have a great day!", 'bot-message');
                step = 0;
            }
            break;
        case 1:
            preferences.diet = input.toLowerCase();
            step = 2;
            askCuisinePreference();
            break;
        case 2:
            preferences.cuisine = input.toLowerCase();
            step = 3;
            askSpiceLevel();
            break;
        case 3:
            preferences.spiceLevel = input.toLowerCase();
            step = 4;
            askMealType();
            break;
        case 4:
            preferences.mealType = input.toLowerCase();
            step = 5;
            askAllergies();
            break;
        case 5:
            const selectedAllergies = Array.from(document.querySelectorAll('input[name="allergies"]:checked')).map(checkbox => checkbox.value.toLowerCase());
            preferences.allergies = selectedAllergies;
            step = 6;
            askBudget();
            break;
        case 6:
            preferences.budget = input.toLowerCase();
            step = 7;
            askOtherQuestions();
            break;
        case 7:
            preferences.otherQuestions[input.question] = input.answer;
            if (Object.keys(preferences.otherQuestions).length < 4) {
                askOtherQuestions(); // Ask next other question
            } else {
                step = 8;
                giveRecommendation();
            }
            break;
        default:
            break;
    }
}

function askDietPreference() {
    appendMessage("What's your diet preference?", 'bot-message', () => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(createButton('Any', () => handleBotResponse('any')));
        buttonContainer.appendChild(createButton('Vegetarian', () => handleBotResponse('vegetarian')));
        buttonContainer.appendChild(createButton('Vegan', () => handleBotResponse('vegan')));
        buttonContainer.appendChild(createButton('Gluten-Free', () => handleBotResponse('gluten-free')));
        appendScrollContainer(buttonContainer);
    });
}

function askCuisinePreference() {
    appendMessage("Preferred cuisine?", 'bot-message', () => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(createButton('Any', () => handleBotResponse('any')));
        buttonContainer.appendChild(createButton('Italian', () => handleBotResponse('italian')));
        buttonContainer.appendChild(createButton('Chinese', () => handleBotResponse('chinese')));
        buttonContainer.appendChild(createButton('Indian', () => handleBotResponse('indian')));
        appendScrollContainer(buttonContainer);
    });
}

function askSpiceLevel() {
    appendMessage("Preferred spice level?", 'bot-message', () => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(createButton('Mild', () => handleBotResponse('mild')));
        buttonContainer.appendChild(createButton('Medium', () => handleBotResponse('medium')));
        buttonContainer.appendChild(createButton('Spicy', () => handleBotResponse('spicy')));
        appendScrollContainer(buttonContainer);
    });
}

function askMealType() {
    appendMessage("Preferred meal type?", 'bot-message', () => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(createButton('Breakfast', () => handleBotResponse('breakfast')));
        buttonContainer.appendChild(createButton('Lunch', () => handleBotResponse('lunch')));
        buttonContainer.appendChild(createButton('Dinner', () => handleBotResponse('dinner')));
        appendScrollContainer(buttonContainer);
    });
}

function askAllergies() {
    appendMessage("Any allergies?", 'bot-message', () => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(createCheckbox('Nuts', 'allergies'));
        buttonContainer.appendChild(createCheckbox('Dairy', 'allergies'));
        buttonContainer.appendChild(createCheckbox('Shellfish', 'allergies'));
        buttonContainer.appendChild(createCheckbox('Gluten', 'allergies'));
        buttonContainer.appendChild(createButton('Submit', () => handleBotResponse({ question: 'Allergies', answer: getSelectedOptions('Allergies') })));
        appendScrollContainer(buttonContainer);
    });
}

function askBudget() {
    appendMessage("What's your budget?", 'bot-message', () => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(createButton('$', () => handleBotResponse('$')));
        buttonContainer.appendChild(createButton('$$', () => handleBotResponse('$$')));
        buttonContainer.appendChild(createButton('$$$', () => handleBotResponse('$$$')));
        buttonContainer.appendChild(createButton('$$$$', () => handleBotResponse('$$$$')));
        appendScrollContainer(buttonContainer);
    });
}

function askOtherQuestions() {
    const questions = [
        { question: "Favorite cooking method?", options: ["Grilling", "Baking", "Frying", "Boiling"] },
        { question: "Preferred protein source?", options: ["Chicken", "Beef", "Pork", "Tofu"] },
        { question: "Any disliked ingredients?", options: ["Onions", "Garlic", "Peppers", "Mushrooms"] },
        { question: "Preferred beverage type?", options: ["Alcoholic", "Non-Alcoholic", "Both", "None"] }
    ];

    const currentQuestion = questions[Object.keys(preferences.otherQuestions).length];
    appendMessage(currentQuestion.question, 'bot-message', () => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(createButton('Submit', () => handleBotResponse({ question: currentQuestion.question, answer: getSelectedOptions(currentQuestion.question) })));
        appendScrollContainer(buttonContainer, currentQuestion);
    });
}

function appendScrollContainer(buttonContainer, questionData = null) {
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'scroll-container';

    if (questionData) {
        const scrollContent = document.createElement('div');
        scrollContent.className = 'scroll-content';
        questionData.options.forEach(option => {
            scrollContent.appendChild(createCheckbox(option, questionData.question.toLowerCase().replace(/\s/g, '-') + '-options'));
        });
        scrollContainer.appendChild(scrollContent);
    }

    scrollContainer.appendChild(buttonContainer);
    chatMessages.appendChild(scrollContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getSelectedOptions(name) {
    const selectedOptions = Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(checkbox => checkbox.value.toLowerCase());
    return selectedOptions;
}

async function giveRecommendation() {
    const cuisines = {
        italian: [
            { dish: 'Spaghetti Carbonara', restaurant: 'Ristorante Da Valentino', diet: 'any', allergies: [] },
            { dish: 'Margherita Pizza', restaurant: 'Trattoria Nonna Lina', diet: 'vegetarian', allergies: [] },
            { dish: 'Tiramisu', restaurant: 'Osteria Francescana', diet: 'any', allergies: ['dairy'] }
        ],
        chinese: [
            { dish: 'Kung Pao Chicken', restaurant: 'Duck de Chine', diet: 'any', allergies: ['soy'] },
            { dish: 'Spring Rolls', restaurant: 'Hakkasan', diet: 'vegan', allergies: ['soy'] },
            { dish: 'Hot and Sour Soup', restaurant: 'Da Dong Roast Duck', diet: 'any', allergies: [] }
        ],
        indian: [
            { dish: 'Butter Chicken', restaurant: 'Indian Accent', diet: 'any', allergies: ['dairy'] },
            { dish: 'Paneer Tikka Masala', restaurant: 'Bukhara', diet: 'vegetarian', allergies: ['dairy'] },
            { dish: 'Vegetable Biryani', restaurant: 'Gaggan', diet: 'vegan', allergies: [] }
        ]
    };

    const preferredCuisine = preferences.cuisine;
    const preferredDishes = cuisines[preferredCuisine] || [];

    // Filter dishes based on diet preference
    let filteredDishes = preferredDishes;
    if (preferences.diet === 'vegetarian') {
        filteredDishes = filteredDishes.filter(dish => !['chicken', 'beef', 'pork'].some(meat => dish.dish.toLowerCase().includes(meat)));
    } else if (preferences.diet === 'vegan') {
        filteredDishes = filteredDishes.filter(dish => !['chicken', 'beef', 'pork', 'dairy', 'egg'].some(item => dish.dish.toLowerCase().includes(item)));
    } else if (preferences.diet === 'gluten-free') {
        // Example gluten-free dishes
        const glutenFreeDishes = ['Margherita Pizza', 'Spring Rolls', 'Vegetable Biryani'];
        filteredDishes = filteredDishes.filter(dish => glutenFreeDishes.includes(dish.dish));
    }

    // Further filter based on allergies
    if (preferences.allergies.length > 0) {
        filteredDishes = filteredDishes.filter(dish => {
            return !preferences.allergies.some(allergy => dish.allergies.includes(allergy));
        });
    }

    // Recommend based on available dishes
    if (filteredDishes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredDishes.length);
        const recommendedDish = filteredDishes[randomIndex];

        // Assuming we have a predefined list of beverage pairings
        const beveragePairings = {
            'Spaghetti Carbonara': 'Red Wine',
            'Margherita Pizza': 'White Wine',
            'Tiramisu': 'Espresso',
            'Kung Pao Chicken': 'Beer',
            'Spring Rolls': 'Tea',
            'Hot and Sour Soup': 'Tea',
            'Butter Chicken': 'Lassi',
            'Paneer Tikka Masala': 'Lassi',
            'Vegetable Biryani': 'Water'
        };

        const recommendedBeverage = beveragePairings[recommendedDish.dish] || 'water';
        const recommendationMessage = `Based on your preferences, we recommend trying ${recommendedDish.dish} at ${recommendedDish.restaurant}. Enjoy it with a ${recommendedBeverage}!`;
        appendMessage(recommendationMessage, 'bot-message');
        appendMessage(recommendationMessage, 'bot-message', createNextButton);
    } else {
        appendMessage("Sorry, we couldn't find any recommendations based on your preferences.", 'bot-message');
    }
}

function createNextButton() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    const nextButton = createButton('Next', () => {
        window.location.href = 'final.html';
    });
    buttonContainer.appendChild(nextButton);
    chatMessages.appendChild(buttonContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

toggleChat();