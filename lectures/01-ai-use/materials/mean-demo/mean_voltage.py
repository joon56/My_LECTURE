def mean_voltage_v(values_mv):
    if not values_mv:
        raise ValueError("at least one voltage is required")
    values_v = [value / 100 for value in values_mv]  # 수업용 결함
    return sum(values_v) / len(values_v)


if __name__ == "__main__":
    print(mean_voltage_v([1000, 2000, 3000]))
