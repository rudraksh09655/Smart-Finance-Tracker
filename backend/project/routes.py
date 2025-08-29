# project/routes.py
from flask import request, jsonify, Blueprint
from . import db
from .models import Transaction
from .decorators import token_required

main_bp = Blueprint('main', __name__)

@main_bp.route('/transactions', methods=['POST'])
@token_required
def create_transaction(current_user):
    data = request.get_json()
    new_transaction = Transaction(
        amount=data['amount'], type=data['type'], category=data['category'],
        description=data.get('description', ""), owner=current_user
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction created!'}), 201

@main_bp.route('/transactions', methods=['GET'])
@token_required
def get_transactions(current_user):
    transactions = Transaction.query.filter_by(user_id=current_user.id).order_by(Transaction.date.desc()).all()
    output = [{'id': t.id, 'amount': t.amount, 'type': t.type, 'category': t.category, 'date': t.date.isoformat(), 'description': t.description} for t in transactions]
    return jsonify({'transactions': output})

@main_bp.route('/transactions/<int:transaction_id>', methods=['PUT'])
@token_required
def update_transaction(current_user, transaction_id):
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=current_user.id).first_or_404()
    data = request.get_json()
    transaction.amount = data.get('amount', transaction.amount)
    transaction.type = data.get('type', transaction.type)
    transaction.category = data.get('category', transaction.category)
    transaction.description = data.get('description', transaction.description)
    db.session.commit()
    return jsonify({'message': 'Transaction updated!'})

@main_bp.route('/transactions/<int:transaction_id>', methods=['DELETE'])
@token_required
def delete_transaction(current_user, transaction_id):
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=current_user.id).first_or_404()
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction deleted!'})
# project/routes.py

# ... (imports and existing transaction routes remain the same) ...
from .models import Transaction, Budget # Add Budget to the import

# ... (existing transaction routes) ...

# --- NEW ROUTES FOR BUDGETS ---

@main_bp.route('/budgets', methods=['POST'])
@token_required
def set_budget(current_user):
    data = request.get_json()
    category = data.get('category')
    amount = data.get('amount')

    if not category or amount is None:
        return jsonify({'message': 'Category and amount are required'}), 400

    # Check if a budget for this category already exists
    budget = Budget.query.filter_by(user_id=current_user.id, category=category).first()

    if budget:
        # Update existing budget
        budget.amount = amount
    else:
        # Create new budget
        budget = Budget(user_id=current_user.id, category=category, amount=amount)
        db.session.add(budget)

    db.session.commit()
    return jsonify({'message': 'Budget set successfully'}), 201

@main_bp.route('/budgets', methods=['GET'])
@token_required
def get_budgets(current_user):
    budgets = Budget.query.filter_by(user_id=current_user.id).all()
    output = [{'id': b.id, 'category': b.category, 'amount': b.amount} for b in budgets]
    return jsonify({'budgets': output})