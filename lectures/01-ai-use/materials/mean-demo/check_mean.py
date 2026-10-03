from math import isclose
from mean_voltage import mean_voltage_v

cases = [
    ([1000, 2000, 3000], 2.0),
    ([500], 0.5),
    ([0, 2000], 1.0),
]

for values_mv, expected in cases:
    actual = mean_voltage_v(values_mv)
    assert isclose(actual, expected, rel_tol=0.0, abs_tol=1e-12), (
        values_mv, expected, actual
    )

try:
    mean_voltage_v([])
except ValueError as error:
    assert str(error) == "at least one voltage is required"
else:
    raise AssertionError("empty input must raise ValueError")

print("4 checks passed")
