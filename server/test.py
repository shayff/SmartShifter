import random
available = [[]]
prefer = [[]]
test = [1,2,3]
print(test.pop())


for day in range(1):
    array = [0, 1, 2]
    random.shuffle(array)
    print(array)
    for x in range(2):
        if (random.randint(1, 10) > 5):
            available[0].append(array.pop())
    for x in range(len(array)):
        if (random.randint(1, 10) > 7):
            prefer[0].append(array.pop())

print(available)
print(prefer)
