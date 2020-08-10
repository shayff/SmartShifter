import random
from datetime import datetime
from datetime import timedelta

def deltatime_format(myTimeDelta):
    hours, remainder = divmod(myTimeDelta.total_seconds(), 3600)
    minutes, seconds = divmod(remainder, 60)

    # Formatted only for hours and minutes as requested
    return '%s:%s' % (int(hours), int(minutes))


minutes = [0, 15, 30, 45]
time_of_shift = random.randint(5, 6)
hour = random.randint(7, 18)
start = timedelta(hours=hour, minutes=minutes[random.randint(0, 3)])
end = start + timedelta(hours=time_of_shift)
daypart = set()
if (start < timedelta(hours=12)):
    daypart.add(0)
elif (start < timedelta(hours=18)):
    daypart.add(1)
else:
    daypart.add(2)
if (end > timedelta(hours=16)):
    daypart.add(2)
elif (end > timedelta(hours=12)):
    daypart.add(1)
else:
    daypart.add(0)
daypart = list(daypart)

print(strfdelta(start, '{H}:{M}'))
end = str(end)
print(start)


