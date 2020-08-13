def sort_shifts_by_start_time(shifts):
    for shifts_by_day in shifts:
        shifts[shifts_by_day].sort(key=lambda x: x["start time"], reverse=False)
    return