#!/bin/bash

# Configuration
API_URL="http://localhost:5000/api"

echo "=== Registering Users ==="
RES_A=$(curl -s -X POST $API_URL/auth/register -H "Content-Type: application/json" -d '{"name":"User A", "email":"a@example.com", "password":"password123"}')
echo $RES_A
TOKEN_A=$(echo $RES_A | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
if [ -z "$TOKEN_A" ]; then
    # Login if already registered
    RES_A=$(curl -s -X POST $API_URL/auth/login -H "Content-Type: application/json" -d '{"email":"a@example.com", "password":"password123"}')
    echo "Login A:" $RES_A
    TOKEN_A=$(echo $RES_A | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
fi
ID_A=$(echo $RES_A | grep -o '"id":"[^"]*' | grep -o '[^"]*$')

RES_B=$(curl -s -X POST $API_URL/auth/register -H "Content-Type: application/json" -d '{"name":"User B", "email":"b@example.com", "password":"password123"}')
echo $RES_B
if ! echo $RES_B | grep -q '"token"'; then
    RES_B=$(curl -s -X POST $API_URL/auth/login -H "Content-Type: application/json" -d '{"email":"b@example.com", "password":"password123"}')
    echo "Login B:" $RES_B
fi
ID_B=$(echo $RES_B | grep -o '"id":"[^"]*' | grep -o '[^"]*$')

RES_C=$(curl -s -X POST $API_URL/auth/register -H "Content-Type: application/json" -d '{"name":"User C", "email":"c@example.com", "password":"password123"}')
echo $RES_C
if ! echo $RES_C | grep -q '"token"'; then
    RES_C=$(curl -s -X POST $API_URL/auth/login -H "Content-Type: application/json" -d '{"email":"c@example.com", "password":"password123"}')
    echo "Login C:" $RES_C
fi
ID_C=$(echo $RES_C | grep -o '"id":"[^"]*' | grep -o '[^"]*$')

echo -e "\nIDs: A=$ID_A, B=$ID_B, C=$ID_C"
echo "Token A: $TOKEN_A"

echo -e "\n=== Creating Group ==="
GROUP_RES=$(curl -s -X POST $API_URL/groups -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN_A" -d '{"name":"Trip", "members":["'$ID_A'", "'$ID_B'", "'$ID_C'"]}')
echo $GROUP_RES
GROUP_ID=$(echo $GROUP_RES | grep -o '"_id":"[^"]*' | grep -o '[^"]*$')
echo "Group ID: $GROUP_ID"

echo -e "\n=== Adding Expense (A paid 300, split equally) ==="
EXPENSE_RES=$(curl -s -X POST $API_URL/groups/$GROUP_ID/expenses -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN_A" -d '{
  "paidBy": "'$ID_A'",
  "amount": 300,
  "description": "Dinner"
}')
echo $EXPENSE_RES

echo -e "\n=== Getting Summary ==="
curl -s -X GET $API_URL/groups/$GROUP_ID/summary -H "Authorization: Bearer $TOKEN_A" | jq .

echo -e "\n=== Getting Settlements ==="
curl -s -X GET $API_URL/groups/$GROUP_ID/settlements -H "Authorization: Bearer $TOKEN_A" | jq .
