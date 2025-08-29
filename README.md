# Smart Finance Tracker

A full-stack web application for personal finance management, featuring a dynamic dashboard, transaction tracking, and budgeting. This project was built from scratch with a Python/Flask backend and a vanilla HTML, CSS, and JavaScript frontend, designed to be both functional and visually impressive.

Key Features
Secure Authentication: Full registration and login system using a RESTful API with JSON Web Token (JWT) based authentication to ensure user data is private and secure.

Interactive Dashboard: A professional, data-rich UI built with Tailwind CSS. It features multiple interactive charts (using Chart.js) to visualize expense breakdowns and spending trends in real-time.

Full CRUD Functionality: Users have complete control to add, view, edit, and delete their income and expense transactions through a seamless and intuitive modal interface.

"Smart" Budgeting System: Allows users to set monthly budgets by category and visually track their spending progress with dynamic progress bars that update with each new transaction.

Permanent Data Storage: The backend uses a professional database migration workflow with Flask-Migrate, allowing for schema updates without any loss of user data.

Technology Stack
Backend
Python: The core language for server-side logic.

Flask: A micro web framework used to build the RESTful API.

SQLAlchemy: An Object-Relational Mapper (ORM) for interacting with the database.

Flask-Migrate: For handling database schema migrations.

SQLite: The database for storing user and transaction data.

JSON Web Tokens (JWT): For secure user authentication.

Frontend
HTML5: For the core structure and content.

CSS3: For custom styling.

JavaScript (ES6+): For user interactions, API communication, and dynamic DOM manipulation.

Tailwind CSS: For the entire professional design and responsive layout.

Chart.js: For creating interactive and visually appealing data charts.

Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Python 3.8+

pip

A web browser

Installation & Setup
Clone the repository:

git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
cd your-repository-name

Set up the Backend:

# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install the required packages
pip install -r requirements.txt

# Set the Flask application
# On Windows (PowerShell):
$env:FLASK_APP = "run.py"
# On Mac/Linux:
export FLASK_APP=run.py

# Initialize and upgrade the database
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Run the Flask server
python run.py

The backend will be running at http://127.0.0.1:5000.

Run the Frontend:

Navigate to the frontend-html directory.

Open the index.html file directly in your web browser.

You can now register a new account and start using the application!
