import random
from datetime import datetime
from datetime import timedelta
from string import Formatter
def rand_hours_for_shift():
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
    start = strfdelta(start, '{H:02}:{M:02}')
    end = strfdelta(end, '{H:02}:{M:02}')
    print(start)
    print(end)
    return start, end, daypart

def strfdelta(tdelta, fmt='{D:02}d {H:02}h {M:02}m {S:02}s', inputtype='timedelta'):
    """Convert a datetime.timedelta object or a regular number to a custom-
    formatted string, just like the stftime() method does for datetime.datetime
    objects.

    The fmt argument allows custom formatting to be specified.  Fields can
    include seconds, minutes, hours, days, and weeks.  Each field is optional.

    Some examples:
        '{D:02}d {H:02}h {M:02}m {S:02}s' --> '05d 08h 04m 02s' (default)
        '{W}w {D}d {H}:{M:02}:{S:02}'     --> '4w 5d 8:04:02'
        '{D:2}d {H:2}:{M:02}:{S:02}'      --> ' 5d  8:04:02'
        '{H}h {S}s'                       --> '72h 800s'

    The inputtype argument allows tdelta to be a regular number instead of the
    default, which is a datetime.timedelta object.  Valid inputtype strings:
        's', 'seconds',
        'm', 'minutes',
        'h', 'hours',
        'd', 'days',
        'w', 'weeks'
    """

    # Convert tdelta to integer seconds.
    if inputtype == 'timedelta':
        remainder = int(tdelta.total_seconds())
    elif inputtype in ['s', 'seconds']:
        remainder = int(tdelta)
    elif inputtype in ['m', 'minutes']:
        remainder = int(tdelta)*60
    elif inputtype in ['h', 'hours']:
        remainder = int(tdelta)*3600
    elif inputtype in ['d', 'days']:
        remainder = int(tdelta)*86400
    elif inputtype in ['w', 'weeks']:
        remainder = int(tdelta)*604800

    f = Formatter()
    desired_fields = [field_tuple[1] for field_tuple in f.parse(fmt)]
    possible_fields = ('W', 'D', 'H', 'M', 'S')
    constants = {'W': 604800, 'D': 86400, 'H': 3600, 'M': 60, 'S': 1}
    values = {}
    for field in possible_fields:
        if field in desired_fields and field in constants:
            values[field], remainder = divmod(remainder, constants[field])
    return f.format(fmt, **values)



a,b,c= rand_hours_for_shift()