import random
from datetime import timedelta

minutes = [0, 15, 30, 45]
time_of_shift = random.randint(4, 5)
hour = random.randint(6, 18)
start= timedelta(hours=hour, minutes=minutes[random.randint(0, 3)])
end = start + timedelta(hours=time_of_shift)
daypart = set()
if(start < timedelta(hours=12)):
    daypart.add(0)
elif(start < timedelta(hours=18)):
    daypart.add(1)
else:
    daypart.add(2)
if (end > timedelta(hours=16)):
    daypart.add(2)
elif(end > timedelta(hours=12)):
    daypart.add(1)
else:
    daypart.add(0)
print(start)
print(end)
print(daypart)
