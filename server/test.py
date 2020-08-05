import random
available = [[],[],[],[],[],[],[]]
prefer = [[],[],[],[],[],[],[]]

for day in range(7):
    array = [0, 1, 2]
    random.shuffle(array)
    for _ in range(3):
        if (random.randint(1, 10) > 4):
            available[day].append(array.pop())
    for _ in range(len(array)):
        if (random.randint(1, 10) > 4):
            prefer[day].append(array.pop())

print(available)
print(prefer)
