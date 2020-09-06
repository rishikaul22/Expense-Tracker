import math
from itertools import combinations

# Removing the Frequent Item Sets

transactions = dict()
unique_items = set()
n = int(input("Enter number of transactions : "))

for i in range(n):
    
    trans_id = input("Enter transaction id : ")
    items = input("Enter all the items separated by a space : ")
    
    transactions[trans_id] = items.split(' ')
    unique_items.update(items.split(' '))
    
support = int(input("Enter support count : "))
print("\n")

support_values_keys = []
support_values = []
num = 1
unique_items_prev = set()
unique_items_sets = []
unique_items_sets_prev = []

while True:
    
    if len(unique_items) < num:
        break
    
    perm = list(combinations(list(unique_items), num))
    
    print("Table C"+str(num))
    if num == 1:
        print('-' * num * 15)
    else:
        print('-' * num * 10)
    
    for i in perm:
        count = 0
        for value in transactions.values():
            if set(i).intersection(set(value)) == set(i):
                count += 1
        
        support_values_keys.append(set(i))
        support_values.append(count)
        print(set(i), '  |  ', count)
        
    if num == 1:
        print('-' * num * 15)
    else:
        print('-' * num * 10)
    print("\n")    
    print("Table L" + str(num))
    if num == 1:
        print('-' * num * 15)
    else:
        print('-' * num * 10)
    
    unique_items_prev = unique_items.copy()
    unique_items_sets_prev = unique_items_sets.copy()
    unique_items_sets.clear()
    unique_items.clear()
    for i in range(len(support_values)):
        if support_values[i] >= support and len(support_values_keys[i]) == num:
            print(support_values_keys[i], '  |  ', support_values[i])
            unique_items.update(set(support_values_keys[i]))
            unique_items_sets.append(set(support_values_keys[i]))
    
    if len(unique_items) == 0 or len(unique_items_sets) == 0:
        unique_items = unique_items_prev.copy()
        unique_items_sets = unique_items_sets_prev.copy()
           
    if num == 1:
        print('-' * num * 15)
    else:
        print('-' * num * 10)
        
    num += 1
        
print("Frequent Item Set from Apriori Alogorithm is", unique_items_sets, "\n")

# Generating the Association Rules

confidence = int(input("Enter confidence value in % : "))

for item_set in unique_items_sets:
    print("\nGenerating Association Rules for the set", item_set, "\n")
    
    num = 1
    while True:
        if num == len(item_set):
            break
        
        perm = list(combinations(list(item_set), num))
        items = item_set.copy()
        
        for i in perm:
            items = item_set.copy()
            items.difference_update(list(i))
            
            print(set(i), " => ", items)
            
            left = support_values_keys.index(set(i))
            left = support_values[left]
            
            right = support_values_keys.index(item_set)
            right = support_values[right]
            
            confidence_item = (right / left) * 100
            print("Confidence  = ", right, "/", left, "=", str(confidence_item) + "%")
            
            if confidence_item > confidence:
                print("Since this confidence value is greater than threshold confidence, this rule is accepted\n")
            else:
                print("Since this confidence value is lesser than threshold confidence, this rule is rejected\n")
        
        num += 1