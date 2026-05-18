import random
import string
from datetime import datetime, timedelta, date
import pandas as pd



random.seed(42)

OUTPUT_DIR = "."   # <-- change this to your desired output folder

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────

def rand_date(start, end):
    delta = end - start
    return start + timedelta(days=random.randint(0, delta.days))

def rand_datetime(start, end):
    delta = end - start
    secs = int(delta.total_seconds())
    return start + timedelta(seconds=random.randint(0, secs))

def egyptian_phone():
    prefix = random.choice(['010', '011', '012', '015'])
    return prefix + ''.join([str(random.randint(0, 9)) for _ in range(8)])

def egyptian_national_id(dob: date, gender: str):
    century = '2' if dob.year >= 2000 else '1'
    yy = str(dob.year)[-2:].zfill(2)
    mm = str(dob.month).zfill(2)
    dd = str(dob.day).zfill(2)
    gov = str(random.randint(1, 27)).zfill(2)
    # BUG FIX #3: Egyptian NationalID is 14 digits total.
    # seq must be zfill(3) not zfill(4) — using zfill(4) produced 15-digit IDs.
    seq = str(random.randint(1, 999)).zfill(3)
    gender_digit = str(random.choice([1,3,5,7,9])) if gender == 'Male' else str(random.choice([2,4,6,8,0]))
    check = str(random.randint(0, 9))
    return f"{century}{yy}{mm}{dd}{gov}{seq}{gender_digit}{check}"

def license_number():
    return ''.join(random.choices(string.ascii_uppercase, k=3)) + str(random.randint(100000, 999999))

def license_plate():
    letters = ''.join(random.choices(string.ascii_uppercase, k=3))
    numbers = str(random.randint(1000, 9999))
    return f"{numbers} {letters}"

EG_MALE_FIRST = [
    "Ahmed","Mohamed","Omar","Ali","Youssef","Hussein","Mostafa","Abdullah","Ibrahim","Khaled",
    "Tarek","Karim","Sami","Walid","Maher","Ramy","Hany","Bassam","Nader","Fady",
    "Islam","Sherif","Amro","Yasser","Ziad","Hamdi","Ayman","Mansour","Hesham","Gamal"
]
EG_FEMALE_FIRST = [
    "Fatma","Sara","Mariam","Nour","Hana","Lamia","Rana","Dina","Mona","Reem",
    "Heba","Asmaa","Yasmine","Nadia","Salma","Ranim","Doaa","Shimaa","Iman","Noha",
    "Ghada","Amal","Rasha","Maha","Lina","Wafaa","Neveen","Hoda","Suzan","Abeer"
]
EG_LAST = [
    "Mohamed","Ahmed","Ali","Hassan","Hussein","Abdullah","Ibrahim","Ismail","Sayed","Omar",
    "Mostafa","El-Sheikh","El-Sayed","Abdel-Rahman","Gad","Farouk","Mansour","Soliman","Reda","Kamel",
    "Helmy","Ghanem","Bakr","Zeidan","Awad","Hafez","Nasr","Saleh","Darwish","Taha"
]

def eg_name(gender):
    if gender == 'Male':
        return random.choice(EG_MALE_FIRST), random.choice(EG_LAST)
    else:
        return random.choice(EG_FEMALE_FIRST), random.choice(EG_LAST)

def to_sql_insert(df, table_name, chunk_size=1000):
    lines = []
    cols = ', '.join(df.columns)
    for i in range(0, len(df), chunk_size):
        chunk = df.iloc[i:i+chunk_size]
        rows = []
        for _, row in chunk.iterrows():
            vals = []
            for v in row:
                if v is None or (isinstance(v, float) and pd.isna(v)):
                    vals.append('NULL')
                elif isinstance(v, bool):
                    vals.append('1' if v else '0')
                elif isinstance(v, (int, float)):
                    vals.append(str(v))
                elif isinstance(v, (datetime, date)):
                    vals.append(f"'{v}'")
                else:
                    escaped = str(v).replace("'", "''")
                    vals.append(f"'{escaped}'")
            rows.append(f"({', '.join(vals)})")
        lines.append(f"INSERT INTO {table_name} ({cols})\nVALUES\n" + ',\n'.join(rows) + ';\n')
    return '\n'.join(lines)

# ─────────────────────────────────────────────
# 1. ZONE  (40 zones across Egypt)
# ─────────────────────────────────────────────
print("Generating Zones...")
zones_data = [
    # ── Greater Cairo / Cairo ──────────────────────────────────────────
    ( 1, "Nasr City",          "Greater Cairo", "Cairo",        "Cairo",           30.0626, 31.3361),
    ( 2, "Heliopolis",         "Greater Cairo", "Cairo",        "Cairo",           30.0879, 31.3280),
    ( 3, "Maadi",              "Greater Cairo", "Cairo",        "Cairo",           29.9602, 31.2569),
    ( 4, "Zamalek",            "Greater Cairo", "Cairo",        "Cairo",           30.0645, 31.2195),
    ( 5, "Downtown",           "Greater Cairo", "Cairo",        "Cairo",           30.0444, 31.2357),
    ( 6, "Shubra",             "Greater Cairo", "Cairo",        "Cairo",           30.0980, 31.2437),
    ( 7, "Fifth Settlement",   "Greater Cairo", "Cairo",        "New Cairo",       30.0264, 31.4804),
    ( 8, "New Cairo",          "Greater Cairo", "Cairo",        "New Cairo",       30.0131, 31.4961),
    ( 9, "Ain Shams",          "Greater Cairo", "Cairo",        "Cairo",           30.1195, 31.3220),
    (10, "Abbassia",           "Greater Cairo", "Cairo",        "Cairo",           30.0700, 31.2800),
    # ── Greater Cairo / Giza ──────────────────────────────────────────
    (11, "Dokki",              "Greater Cairo", "Giza",         "Giza",            30.0487, 31.2008),
    (12, "Mohandessin",        "Greater Cairo", "Giza",         "Giza",            30.0588, 31.2001),
    (13, "6th of October",     "Greater Cairo", "Giza",         "6th of October",  29.9600, 30.9276),
    (14, "Haram",              "Greater Cairo", "Giza",         "Giza",            29.9942, 31.1340),
    (15, "Sheikh Zayed",       "Greater Cairo", "Giza",         "Sheikh Zayed",    30.0239, 30.9411),
    # ── Alexandria ────────────────────────────────────────────────────
    (16, "Sidi Gaber",         "Alexandria",    "Alexandria",   "Alexandria",      31.2156, 29.9553),
    (17, "Smouha",             "Alexandria",    "Alexandria",   "Alexandria",      31.2001, 29.9350),
    (18, "Miami",              "Alexandria",    "Alexandria",   "Alexandria",      31.2654, 29.9827),
    (19, "Montazah",           "Alexandria",    "Alexandria",   "Alexandria",      31.2887, 30.0264),
    (20, "Camp Caesar",        "Alexandria",    "Alexandria",   "Alexandria",      31.2321, 29.9478),
    (21, "Agami",              "Alexandria",    "Alexandria",   "Alexandria",      31.1167, 29.8167),
    (22, "Mandara",            "Alexandria",    "Alexandria",   "Alexandria",      31.2993, 30.0436),
    # ── Dakahlia (Mansoura) ───────────────────────────────────────────
    (23, "Toreil",             "Delta",         "Dakahlia",     "Mansoura",        31.0424, 31.3819),
    (24, "Hay EL-Gamaa",       "Delta",         "Dakahlia",     "Mansoura",        31.0364, 31.3785),
    (25, "Talkha",             "Delta",         "Dakahlia",     "Talkha",          31.0589, 31.3722),
    (26, "El-Gomhoria St",     "Delta",         "Dakahlia",     "Mansoura",        31.0450, 31.3780),
    (27, "Mansoura Downtown",  "Delta",         "Dakahlia",     "Mansoura",        31.0364, 31.3807),
    (28, "El-Mohafza Sq",      "Delta",         "Dakahlia",     "Mansoura",        31.0413, 31.3756),
    (29, "Gehan St",           "Delta",         "Dakahlia",     "Mansoura",        31.0480, 31.3840),
    (30, "Ahmed Maher St",     "Delta",         "Dakahlia",     "Mansoura",        31.0410, 31.3795),
    (31, "Mit Ghamr",          "Delta",         "Dakahlia",     "Mit Ghamr",       30.7220, 31.2580),
    (32, "Aga",                "Delta",         "Dakahlia",     "Aga",             30.9250, 31.3000),
    # ── Sharqia ───────────────────────────────────────────────────────
    (33, "Zagazig Downtown",   "Delta",         "Sharqia",      "Zagazig",         30.5876, 31.5022),
    (34, "Zagazig University", "Delta",         "Sharqia",      "Zagazig",         30.5687, 31.5084),
    (35, "10th of Ramadan",    "Delta",         "Sharqia",      "10th of Ramadan", 30.3000, 31.7500),
    # ── Gharbia ───────────────────────────────────────────────────────
    (36, "Tanta Downtown",     "Delta",         "Gharbia",      "Tanta",           30.7879, 31.0011),
    (37, "Tanta University",   "Delta",         "Gharbia",      "Tanta",           30.7964, 31.0023),
    (38, "Mahalla El-Kubra",   "Delta",         "Gharbia",      "Mahalla El-Kubra",30.9728, 31.1625),
    # ── Monufia ───────────────────────────────────────────────────────
    (39, "Shebin El-Kom",      "Delta",         "Monufia",      "Shebin El-Kom",   30.5567, 30.9678),
    (40, "Sadat City",         "Delta",         "Monufia",      "Sadat City",      30.3667, 30.0833),
]

TOTAL_ZONES = len(zones_data)
df_zone = pd.DataFrame(zones_data, columns=['ZoneID','ZoneName','Region','Governorate','City','Latitude','Longitude'])
print(f"  ✓ {len(df_zone)} zones")

# ─────────────────────────────────────────────
# 2. DRIVER  (200 rows)
# ─────────────────────────────────────────────
print("Generating 200 Drivers...")
drivers = []
used_nationals = set()
used_licenses  = set()

for i in range(1, 201):
    gender = random.choice(['Male', 'Female']) if random.random() > 0.85 else 'Male'
    first, last = eg_name(gender)
    dob = rand_date(date(1975, 1, 1), date(2000, 12, 31))

    while True:
        nid = egyptian_national_id(dob, gender)
        if nid not in used_nationals:
            used_nationals.add(nid)
            break

    while True:
        lic = license_number()
        if lic not in used_licenses:
            used_licenses.add(lic)
            break

    join_date   = rand_date(date(2022, 1, 1), date(2025, 6, 1))
    lic_expiry  = rand_date(date(2025, 1, 1), date(2028, 12, 31))
    last_online = rand_datetime(datetime(2025, 10, 1), datetime(2026, 1, 31))

    drivers.append({
        'DriverID':          i,
        'FirstName':         first,
        'LastName':          last,
        'PhoneNumber':       egyptian_phone(),
        'NationalID':        nid,
        'DateOfBirth':       dob,
        'Gender':            gender,
        'LicenseNumber':     lic,
        'LicenseExpiryDate': lic_expiry,
        'CancellationRate':  round(random.uniform(0.02, 0.20), 2),
        'AverageRating':     round(random.uniform(3.5, 5.0), 2),
        'Status':            random.choices(['Active','Inactive','Suspended'], weights=[80,15,5])[0],
        'IsOnline':          random.choice([True, False]),
        'JoinDate':          join_date,
        'LastOnlineTime':    last_online,
        'BankAccountNumber': ''.join([str(random.randint(0,9)) for _ in range(16)]),
        'HomeZoneID':        random.randint(1, TOTAL_ZONES),
    })

df_driver = pd.DataFrame(drivers)
print(f"  ✓ {len(df_driver)} drivers")

# ─────────────────────────────────────────────
# 3. VEHICLE  (1:1 with Driver — 200 rows)
# ─────────────────────────────────────────────
print("Generating 200 Vehicles...")
vehicle_types = {
    'Economy': {
        'makes':  ['Toyota','Hyundai','Kia','Nissan'],
        'models': ['Corolla','Elantra','K3','Sentra','Optima','Vios'],
        'capacity': 4, 'fare_range': (3.5, 5.5),
    },
    'Comfort': {
        'makes':  ['Mercedes','BMW','Toyota'],
        'models': ['Camry','E200','Avalon','520i'],
        'capacity': 4, 'fare_range': (7.0, 10.0),
    },
    'XL': {
        'makes':  ['Toyota','Ford','Chevrolet'],
        'models': ['Hilux','Explorer','Tahoe','Fortuner'],
        'capacity': 6, 'fare_range': (6.0, 8.5),
    },
}
colors = ['White','Black','Gray','Silver','Blue','Red','Beige']
plates_used = set()
vehicles    = []

for i, driver_id in enumerate(range(1, 201), start=1):
    vtype = random.choices(['Economy','Comfort','XL'], weights=[60,30,10])[0]
    vinfo = vehicle_types[vtype]

    while True:
        plate = license_plate()
        if plate not in plates_used:
            plates_used.add(plate)
            break

    last_insp = rand_date(date(2023, 1, 1), date(2025, 6, 1))

    vehicles.append({
        'VehicleID':          i,
        'DriverID':           driver_id,
        'LicensePlate':       plate,
        'TypeName':           vtype,
        'ModelYear':          random.randint(2010, 2025),
        'Model':              random.choice(vinfo['models']),
        'Manufacturer':       random.choice(vinfo['makes']),
        'Color':              random.choice(colors),
        'SeatingCapacity':    vinfo['capacity'],
        'Mileage':            round(random.uniform(5000, 180000), 2),
        'IsActive':           random.choices([True, False], weights=[90,10])[0],
        'LastInspectionDate': last_insp,
        'NextInspectionDate': last_insp + timedelta(days=365),
        'InspectionStatus':   random.choices(['Passed','Pending','Failed'], weights=[75,20,5])[0],
        'InsuranceExpiryDate':rand_date(date(2025, 1, 1), date(2027, 12, 31)),
        'BaseFarePerKm':      round(random.uniform(*vinfo['fare_range']), 2),
    })

df_vehicle = pd.DataFrame(vehicles)
print(f"  ✓ {len(df_vehicle)} vehicles")

# ─────────────────────────────────────────────
# 4. RIDER  (2,000 rows)
# ─────────────────────────────────────────────
print("Generating 2,000 Riders...")
riders      = []
used_emails = set()

for i in range(1, 2001):
    gender = random.choice(['Male', 'Female'])
    first, last = eg_name(gender)
    dob = rand_date(date(1985, 1, 1), date(2005, 12, 31))

    while True:
        email = (f"{random.choice(['user','rider','client','member','acc']) + str(random.randint(100,9999))}{random.randint(1,999)}"
                 f"@{random.choice(['gmail.com','yahoo.com','hotmail.com','outlook.com'])}")
        if email not in used_emails:
            used_emails.add(email)
            break

    reg_date = rand_date(date(2023, 1, 1), date(2025, 12, 31))

    riders.append({
        'RiderID':          i,
        'FirstName':        first,
        'LastName':         last,
        'Email':            email,
        'PhoneNumber':      egyptian_phone(),
        'Gender':           gender,
        'DateOfBirth':      dob,
        'RegistrationDate': reg_date,
        'Status':           random.choices(['Active','Inactive','Banned'], weights=[85,13,2])[0],
        'AverageRating':    round(random.uniform(3.0, 5.0), 2),
        'LastTripDate':     rand_date(date(2024, 1, 1), date(2026, 1, 31)),
        'HomeZoneID':       random.randint(1, TOTAL_ZONES),
    })

df_rider = pd.DataFrame(riders)
print(f"  ✓ {len(df_rider)} riders")

# ─────────────────────────────────────────────
# 5. PAYMENT  (5,000 rows — amounts synced after trips)
# ─────────────────────────────────────────────
print("Generating 5,000 Payments (placeholder amounts)...")
payments = []
method_choices = random.choices(['Cash','Card','Wallet'], weights=[55,30,15], k=5000)

for i in range(1, 5001):
    payments.append({
        'PaymentID':  i,
        'MethodName': method_choices[i-1],
        'Amount':     round(random.uniform(40, 400), 2),   # will be overwritten below
        'Status':     random.choices(['Completed','Pending','Failed','Refunded'], weights=[88,5,4,3])[0],
    })

df_payment = pd.DataFrame(payments)
print(f"  ✓ {len(df_payment)} payments")

# ─────────────────────────────────────────────
# NEW: SeasonalPatterns  (reference table)
# ─────────────────────────────────────────────
print("Generating SeasonalPatterns...")
seasonal_patterns_data = [
    (1,  'Ramadan',  date(2024, 3, 11), date(2024, 4, 9),  1.40),
    (2,  'Holiday',  date(2024, 4, 10), date(2024, 4, 14), 1.50),
    (3,  'Summer',   date(2024, 6, 1),  date(2024, 8, 31), 1.20),
    (4,  'Regular',  date(2024, 9, 1),  date(2024, 12, 31),1.00),
    (5,  'Ramadan',  date(2025, 3, 1),  date(2025, 3, 30), 1.40),
    (6,  'Holiday',  date(2025, 3, 31), date(2025, 4, 4),  1.50),
    (7,  'Summer',   date(2025, 6, 1),  date(2025, 8, 31), 1.20),
    (8,  'Regular',  date(2025, 9, 1),  date(2025, 12, 31),1.00),
    (9,  'Regular',  date(2024, 1, 1),  date(2024, 3, 10), 1.00),
    (10, 'Regular',  date(2025, 1, 1),  date(2025, 2, 28), 1.00),
    (11, 'Regular',  date(2026, 1, 1),  date(2026, 1, 31), 1.00),
]
df_seasonal = pd.DataFrame(seasonal_patterns_data,
    columns=['SeasonID','SeasonType','SeasonStartDate','SeasonEndDate','SeasonalSurgeMultiplier'])
print(f"  ✓ {len(df_seasonal)} seasonal patterns")

# ─────────────────────────────────────────────
# NEW: PeakHourSurgeRules  (reference table)
# ─────────────────────────────────────────────
print("Generating PeakHourSurgeRules...")

peak_rules_data = [
    (1, 'Morning Rush',      'Weekday', '08:00:00', '09:59:00', 1.50),
    (2, 'Midday Rush',       'Weekday', '13:00:00', '14:59:00', 1.30),
    (3, 'Evening Rush',      'Weekday', '18:00:00', '20:59:00', 1.60),
    (4, 'Weekend Peak',      'Weekend', '12:00:00', '19:59:00', 1.20),
    (5, 'Ramadan Iftar',     'Any',     '16:00:00', '17:59:00', 1.80),
    (6, 'Ramadan Late Night','Any',     '22:00:00', '23:59:00', 1.70),
    (7, 'Off-Peak',          'Any',     '00:00:00', '23:59:00', 1.00),
]
df_peak_rules = pd.DataFrame(peak_rules_data,
    columns=['SurgeRuleID','RuleName','DayType','StartHour','EndHour','TimeSurgeMultiplier'])
print(f"  ✓ {len(df_peak_rules)} peak hour surge rules")

# Build label-to-ID lookup dictionaries
season_label_to_id = {}
for _, row in df_seasonal.iterrows():
    season_label_to_id.setdefault(row['SeasonType'], row['SeasonID'])

surge_label_to_id = {row['RuleName']: row['SurgeRuleID'] for _, row in df_peak_rules.iterrows()}

# ─────────────────────────────────────────────
# NEW: PROMOTION  (20 unique promos)
# ─────────────────────────────────────────────
print("Generating 20 Promotions...")
promo_types = ['Referral', 'Re-engagement', 'Seasonal']
promos = []
used_codes = set()

promo_campaigns = [
    ("Welcome a Friend", "Referral"),
    ("Refer & Earn", "Referral"),
    ("Invite Bonus", "Referral"),
    ("Share the Ride", "Referral"),
    ("Friend Reward", "Referral"),
    ("Double Bonus Referral", "Referral"),
    ("Come Back Offer", "Re-engagement"),
    ("We Miss You", "Re-engagement"),
    ("Return Rider Deal", "Re-engagement"),
    ("Comeback Reward", "Re-engagement"),
    ("Re-activate Savings", "Re-engagement"),
    ("Loyalty Return", "Re-engagement"),
    ("Ramadan Kareem", "Seasonal"),
    ("Eid Mubarak Ride", "Seasonal"),
    ("Summer Saver", "Seasonal"),
    ("New Year Bonus", "Seasonal"),
    ("Back to School", "Seasonal"),
    ("Winter Warmth", "Seasonal"),
    ("Flash Friday Deal", "Seasonal"),
    ("Weekend Special", "Seasonal"),
]

promo_start_dates = [
    date(2024, 1, 1), date(2024, 2, 1), date(2024, 3, 11), date(2024, 4, 10),
    date(2024, 5, 1), date(2024, 6, 1),  date(2024, 7, 1),  date(2024, 9, 1),
    date(2024, 10, 1),date(2024, 11, 1), date(2025, 1, 1),  date(2025, 2, 1),
    date(2025, 3, 1), date(2025, 3, 31), date(2025, 5, 1),  date(2025, 6, 1),
    # Last 4 start late enough that end date will exceed Jan 1 2026 → Active
    date(2025, 11, 15), date(2025, 12, 1), date(2025, 12, 10), date(2025, 12, 20),
]

for i in range(1, 21):
    campaign, ptype = promo_campaigns[i-1]
    start = promo_start_dates[i-1]
    end   = start + timedelta(days=random.randint(30, 90))
    discount = round(random.uniform(10, 30), 2)
    while True:
        code = ptype[:3].upper() + str(random.randint(1000, 9999))
        if code not in used_codes:
            used_codes.add(code)
            break
    status = 'Expired' if end < date(2026, 1, 1) else 'Active'
    promos.append({
        'PromotionID':        i,
        'PromoCode':          code,
        'Campaign':           campaign,
        'DiscountPercentage': discount,
        'MaxUsageCount':      random.randint(100, 1000),
        'StartDate':          start,
        'EndDate':            end,
        'Status':             status,
    })

df_promo = pd.DataFrame(promos)
print(f"  ✓ {len(df_promo)} promotions")

PROMO_TRIP_COUNT = 1500

# ─────────────────────────────────────────────
# HELPERS for Trip generation
# ─────────────────────────────────────────────

def get_surge_info(dt: datetime):
    """Return (surge_label, surge_rule_id, multiplier) based on hour/weekday."""
    h   = dt.hour
    dow = dt.weekday()          # 0=Mon … 6=Sun
    if 22 <= h <= 23:
        return "Ramadan Late Night", surge_label_to_id["Ramadan Late Night"], 1.7
    if 16 <= h < 18:
        return "Ramadan Iftar", surge_label_to_id["Ramadan Iftar"], 1.8
    if 8 <= h < 10 and dow < 5:
        return "Morning Rush", surge_label_to_id["Morning Rush"], 1.5
    if 13 <= h < 15 and dow < 5:
        return "Midday Rush", surge_label_to_id["Midday Rush"], 1.3
    if 18 <= h < 21 and dow < 5:
        return "Evening Rush", surge_label_to_id["Evening Rush"], 1.6
    if dow >= 4 and 12 <= h < 20:
        return "Weekend Peak", surge_label_to_id["Weekend Peak"], 1.2
    return "Off-Peak", surge_label_to_id["Off-Peak"], 1.0

def get_season_info(dt: datetime):
    """Return (season_label, season_id, multiplier) based on date."""
    d = dt.date()
    if date(2024,3,11) <= d <= date(2024,4,9):   return "Ramadan", 1,  1.4
    if date(2024,4,10) <= d <= date(2024,4,14):  return "Holiday", 2,  1.5
    if date(2024,6,1)  <= d <= date(2024,8,31):  return "Summer",  3,  1.2
    if date(2024,9,1)  <= d <= date(2024,12,31): return "Regular", 4,  1.0
    if date(2025,3,1)  <= d <= date(2025,3,30):  return "Ramadan", 5,  1.4
    if date(2025,3,31) <= d <= date(2025,4,4):   return "Holiday", 6,  1.5
    if date(2025,6,1)  <= d <= date(2025,8,31):  return "Summer",  7,  1.2
    if date(2025,9,1)  <= d <= date(2025,12,31): return "Regular", 8,  1.0
    if date(2024,1,1)  <= d <= date(2024,3,10):  return "Regular", 9,  1.0
    if date(2025,1,1)  <= d <= date(2025,2,28):  return "Regular", 10, 1.0
    if date(2026,1,1)  <= d <= date(2026,1,31):  return "Regular", 11, 1.0
    return "Regular", 11, 1.0

# EGP pricing benchmarks per vehicle type
EGP_FARE_TARGETS = {
    'Economy': (50,  100),
    'Comfort': (150, 300),
    'XL':      (100, 200),
}

cancellation_reasons = [
    "Driver is too far away.",
    "I changed my mind.",
    "I waited too long.",
    "Booked by mistake.",
    "Driver never arrived.",
    "Emergency situation.",
    "Found another means of transportation.",
    "Acceptance took too long.",
]

# ─────────────────────────────────────────────
# 6. TRIP  (5,000 rows)
# ─────────────────────────────────────────────
print("Generating 5,000 Trips...")
start_dt = datetime(2024, 1, 1,  0,  0,  0)
end_dt   = datetime(2026, 1, 31, 23, 59, 59)

active_drivers     = df_driver[df_driver['Status'] == 'Active']['DriverID'].tolist()
active_riders      = df_rider [df_rider ['Status'] == 'Active']['RiderID' ].tolist()
driver_vehicle_map = df_vehicle.set_index('DriverID')[['TypeName','BaseFarePerKm']].to_dict('index')

# Pre-determine which 1,500 trips get promotions (by trip index 1..5000)
promo_trip_indices = set(random.sample(range(1, 5001), PROMO_TRIP_COUNT))

trips = []

for i in range(1, 5001):
    req_time = rand_datetime(start_dt, end_dt)

    season_label, season_id, seasonal_mult = get_season_info(req_time)
    surge_label,  surge_rule_id, time_mult = get_surge_info(req_time)

    status    = random.choices(['Completed','Cancelled'], weights=[85,15])[0]
    driver_id = random.choice(active_drivers)
    rider_id  = random.choice(active_riders)

    pickup_zone  = random.randint(1, TOTAL_ZONES)
    dropoff_zone = random.randint(1, TOTAL_ZONES)
    while dropoff_zone == pickup_zone:
        dropoff_zone = random.randint(1, TOTAL_ZONES)

    accept_time  = req_time   + timedelta(seconds=random.randint(30, 300))
    pickup_time  = accept_time + timedelta(seconds=random.randint(120, 600))

    vinfo        = driver_vehicle_map.get(driver_id, {'TypeName': 'Economy', 'BaseFarePerKm': 5.0})
    vtype        = vinfo['TypeName']
    base_fare_km = vinfo['BaseFarePerKm']

    dist_range   = {'Economy': (2, 20), 'Comfort': (3, 25), 'XL': (5, 30)}
    dist         = round(random.uniform(*dist_range.get(vtype, (2, 20))), 2)
    duration_min = int(dist * random.uniform(3, 6))
    dropoff_time = pickup_time + timedelta(minutes=duration_min)

    # EGP-aligned base fare: distance * per-km rate + flag fall
    flag_fall = {'Economy': 10.0, 'Comfort': 25.0, 'XL': 18.0}.get(vtype, 10.0)
    base_fare = round(dist * base_fare_km + flag_fall + random.uniform(0, 10), 2)

    # Clamp base fare to EGP benchmark range BEFORE surges
    egp_lo, egp_hi = EGP_FARE_TARGETS.get(vtype, (50, 150))
    base_fare = max(float(egp_lo), min(base_fare, float(egp_hi)))

    # Determine promotion for this trip
    if i in promo_trip_indices:
        promo_row      = df_promo.iloc[random.randint(0, len(df_promo) - 1)]
        promotion_id   = int(promo_row['PromotionID'])
        discount_pct   = float(promo_row['DiscountPercentage'])
    else:
        promotion_id   = None
        discount_pct   = 0.0

    # Final fare: base * seasonal_surge * time_surge * (1 - discount/100)
    discount_factor = 1.0 - (discount_pct / 100.0)
    final_fare = round(base_fare * seasonal_mult * time_mult * discount_factor, 2)

    cancel_reason = None
    cancelled_by  = None
    dropoff_out   = dropoff_time

    if status == 'Cancelled':
        cancel_reason = random.choice(cancellation_reasons)
        cancelled_by  = random.choice(['Rider', 'Driver'])
        dropoff_out   = None
        final_fare    = 0.0
        base_fare_stored = 0.0
        dist          = None
        duration_min  = None
    else:
        base_fare_stored = base_fare

    trips.append({
        'TripID':                  i,
        'RiderID':                 rider_id,
        'DriverID':                driver_id,
        'PickupZoneID':            pickup_zone,
        'DropOffZoneID':           dropoff_zone,
        'PaymentID':               i,
        'PromotionID':             promotion_id,
        'SeasonID':                season_id,
        'SurgeRuleID':             surge_rule_id,
        'RequestTime':             req_time,
        'AcceptanceTime':          accept_time,
        'PickupTime':              pickup_time,
        'DropOffTime':             dropoff_out,
        'Status':                  status,
        'DistanceKM':              dist,
        'DurationMinutes':         duration_min,
        'BaseFare':                base_fare_stored,
        'SeasonalSurgeMultiplier': seasonal_mult,
        'TimeSurgeMultiplier':     time_mult,
        'DiscountPercentage':      discount_pct if promotion_id else None,
        'FinalFare':               final_fare,
        'CancellationReason':      cancel_reason,
        'CancelledBy':             cancelled_by,
    })

    if i % 1000 == 0:
        print(f"  ... {i}/5000 trips done")

df_trip = pd.DataFrame(trips)

# Sync payment amounts to actual final fares
df_payment['Amount'] = (
    df_trip.set_index('PaymentID')['FinalFare']
    .reindex(df_payment['PaymentID'])
    .values
)

# BUG FIX #1 (CRITICAL): Cancelled trips have FinalFare = 0.
# Payments linked to cancelled trips must NOT be 'Completed'.
# Force their status to 'Refunded' or 'Failed' as appropriate.
cancelled_payment_ids = set(df_trip[df_trip['Status'] == 'Cancelled']['PaymentID'].tolist())
def fix_cancelled_payment_status(row):
    if row['PaymentID'] in cancelled_payment_ids:
        return random.choice(['Refunded', 'Failed'])
    return row['Status']

df_payment['Status'] = df_payment.apply(fix_cancelled_payment_status, axis=1)

print(f"  ✓ {len(df_trip)} trips")
print(f"  ✓ Payment statuses corrected for {len(cancelled_payment_ids)} cancelled trips")

# ─────────────────────────────────────────────
# NEW: RATING  (one per completed trip, ~80% coverage)
# ─────────────────────────────────────────────
print("Generating Ratings...")
completed_trips = df_trip[df_trip['Status'] == 'Completed']['TripID'].tolist()

driver_comments = [
    "Great driver, very professional!", "Smooth ride, thank you.",
    "Driver was polite and on time.", "Excellent service!",
    "Very clean car and friendly driver.", "Fast and safe driving.",
    "Would recommend this driver.", "Nice experience overall.",
    "Very respectful and friendly driver.", "Excellent trip and clean car.",
    "Driver was quick to respond.", "Amazing experience, thank you!",
    "Calm and professional driver.", "The ride was comfortable and clean.",
    "Outstanding driving skills.", "Arrived safely and right on time.",
]

rider_comments = [
    "Polite and well-behaved rider.", "Easy to communicate with.",
    "Rider was ready on time.", "Good passenger, no issues.",
    "Pleasant experience.", "Rider followed all guidelines.",
    "Very respectful and quiet rider.", "No issues at all, great experience.",
    "Rider was waiting at the exact pickup spot.", "Great communication, very easy.",
]

ratings = []
rating_id = 1

rated_trip_ids = set(random.sample(completed_trips, min(int(len(completed_trips) * 0.80), len(completed_trips))))

for trip_id in rated_trip_ids:
    trip_row   = df_trip[df_trip['TripID'] == trip_id].iloc[0]
    trip_date  = trip_row['DropOffTime']
    rating_date = trip_date.date() if trip_date else rand_date(date(2024, 1, 1), date(2026, 1, 31))

    # Driver rated by rider
    ratings.append({
        'RatingID':    rating_id,
        'TripID':      trip_id,
        'RatedBy':     'Rider',
        'RatingValue': round(random.choices(
            [5.0, 4.5, 4.0, 3.5, 3.0, 2.0],
            weights=[40, 30, 15, 8, 5, 2])[0], 2),
        'Comment':     random.choice(driver_comments),
        'RatingDate':  rating_date,
    })
    rating_id += 1

    # Rider rated by driver (70% chance)
    if random.random() < 0.70:
        ratings.append({
            'RatingID':    rating_id,
            'TripID':      trip_id,
            'RatedBy':     'Driver',
            'RatingValue': round(random.choices(
                [5.0, 4.5, 4.0, 3.5, 3.0],
                weights=[45, 30, 15, 7, 3])[0], 2),
            'Comment':     random.choice(rider_comments),
            'RatingDate':  rating_date,
        })
        rating_id += 1

df_rating = pd.DataFrame(ratings)
print(f"  ✓ {len(df_rating)} ratings")

# ─────────────────────────────────────────────
# NEW: COMPLAINT  (500 rows)
# ─────────────────────────────────────────────
print("Generating 500 Complaints...")
all_trip_ids = df_trip['TripID'].tolist()

complaint_categories = ['Safety', 'Driver', 'Overcharge', 'App', 'Route']
severity_levels      = ['Low', 'Medium', 'High', 'Critical']
complaint_statuses   = ['Open', 'In Review', 'Resolved', 'Closed']

complaints_desc = {
    'Safety': [
        "Driver was driving recklessly and at high speed.",
        "I felt unsafe during the entire trip.",
        "Driver was using his phone while driving.",
        "Driver was speeding dangerously and I feared for my life.",
        "I did not feel safe during the ride, driver ran multiple red lights.",
        "Driver ignored traffic signals multiple times.",
    ],
    'Driver': [
        "Driver was very rude and unprofessional.",
        "Driver refused to follow the app route.",
        "Driver was impolite and did not behave professionally.",
        "Driver arrived 20 minutes late with no apology.",
        "Driver took a different route without informing me.",
        "Driver was on a call the entire trip without hands-free.",
    ],
    'Overcharge': [
        "I was charged more than the estimated fare.",
        "The final fare was double what was shown initially.",
        "A higher amount than agreed was deducted from my account.",
        "Driver demanded extra cash payment beyond the app.",
        "The trip cost twice the price displayed in the app.",
        "Incorrect surge pricing applied outside peak hours.",
    ],
    'App': [
        "The app crashed during the trip and I couldn't track location.",
        "Payment was deducted but the trip was not registered.",
        "The app stopped working suddenly during the ride.",
        "Map navigation in app was completely wrong.",
        "Payment was not recorded correctly in the app.",
        "App showed wrong driver location for 10 minutes.",
    ],
    'Route': [
        "Driver took a much longer route to increase the fare.",
        "The route was completely different from what was shown.",
        "Driver took a much longer path than the correct route.",
        "Trip distance was nearly double due to wrong route.",
        "A completely different route was taken from what the app displayed.",
        "Driver made multiple unnecessary detours.",
    ],
}

resolution_notes_pool = [
    "Issue investigated and refund issued to rider.",
    "Driver was warned and added to watchlist.",
    "Fare adjustment applied after review.",
    "Driver was contacted and an official warning was issued.",
    "Excess amount was refunded to the rider's wallet.",
    "No action required after investigation.",
    "Driver account temporarily suspended pending review.",
    "Complaint resolved in favor of the rider.",
    "Technical issue confirmed and fixed by engineering team.",
    "Complaint was settled in favor of the rider.",
]
complaints = []
complaint_trip_ids = random.sample(all_trip_ids, 500)

for idx, trip_id in enumerate(complaint_trip_ids, start=1):
    trip_row   = df_trip[df_trip['TripID'] == trip_id].iloc[0]
    req_time   = trip_row['RequestTime']
    filing_dt  = req_time.date() + timedelta(days=random.randint(0, 3))
    category   = random.choice(complaint_categories)
    severity   = random.choices(severity_levels, weights=[30, 40, 20, 10])[0]
    status     = random.choices(complaint_statuses, weights=[15, 20, 40, 25])[0]

    if status in ('Resolved', 'Closed'):
        resolution_dt   = filing_dt + timedelta(days=random.randint(1, 14))
        resolution_note = random.choice(resolution_notes_pool)
    else:
        resolution_dt   = None
        resolution_note = None

    complaints.append({
        'ComplaintID':       idx,
        'TripID':            trip_id,
        'ComplaintCategory': category,
        'SeverityLevel':     severity,
        'Description':       random.choice(complaints_desc[category]),
        'FilingDate':        filing_dt,
        'ResolutionDate':    resolution_dt,
        'ResolutionNotes':   resolution_note,
        'Status':            status,
    })

df_complaint = pd.DataFrame(complaints)
print(f"  ✓ {len(df_complaint)} complaints")

# ─────────────────────────────────────────────
# NEW: DRIVER EARNINGS  (one row per completed trip)
# ─────────────────────────────────────────────
print("Generating DriverEarnings...")
completed_df = df_trip[df_trip['Status'] == 'Completed'].copy()

earnings = []
for idx, (_, row) in enumerate(completed_df.iterrows(), start=1):
    gross = float(row['FinalFare'])

    # BUG FIX #4: Skip rows with zero or negative gross to avoid
    # nonsensical negative NetEarning values (gross - commission + bonus < 0).
    if gross <= 0:
        continue

    commission_rate = round(random.uniform(0.15, 0.20), 4)   # 15–20%
    commission  = round(gross * commission_rate, 2)
    # Bonus: ~20% of completed trips get a small bonus (5–30 EGP)
    bonus = round(random.uniform(5, 30), 2) if random.random() < 0.20 else 0.0
    net   = round(gross - commission + bonus, 2)

    dropoff_dt = row['DropOffTime']
    earning_date = dropoff_dt.date() if dropoff_dt and not pd.isna(dropoff_dt) else date(2024, 1, 1)

    earnings.append({
        'EarningsID':         idx,
        'DriverID':           int(row['DriverID']),
        'TripID':             int(row['TripID']),
        'GrossEarning':       gross,
        'PlatformCommission': commission,
        'BonusAmount':        bonus,
        'NetEarning':         net,
        'EarningDate':        earning_date,
    })

df_earnings = pd.DataFrame(earnings)
print(f"  ✓ {len(df_earnings)} driver earnings records")

# ─────────────────────────────────────────────
# WRITE SQL FILES
# ─────────────────────────────────────────────
print("\nWriting SQL files...")

# Insertion order respects foreign key dependencies
tables = {
    'Zone':                 df_zone,
    'Driver':               df_driver,
    'Vehicle':              df_vehicle,
    'Rider':                df_rider,
    'SeasonalPatterns':     df_seasonal,
    'PeakHourSurgeRules':   df_peak_rules,
    'Promotion':            df_promo,
    'Payment':              df_payment,
    'Trip':                 df_trip,
    'Rating':               df_rating,
    'Complaint':            df_complaint,
    'DriverEarnings':       df_earnings,
}

for tname, df in tables.items():
    sql  = to_sql_insert(df, tname, chunk_size=500)
    path = f"{OUTPUT_DIR}/ridelytics_{tname}.sql"
    with open(path, 'w', encoding='utf-8') as f:
        f.write(f"-- Ridelytics Sample Data: {tname}\n")
        f.write(f"-- Rows: {len(df)}\n")
        f.write(f"-- Generated: {datetime.now()}\n\n")
        f.write(sql)
    print(f"  ✓ {tname}: {len(df)} rows → ridelytics_{tname}.sql")

print("\nWriting master SQL file (ridelytics_ALL.sql)...")
with open(f"{OUTPUT_DIR}/ridelytics_ALL.sql", 'w', encoding='utf-8') as f:
    f.write("-- =====================================================\n")
    f.write("-- Ridelytics Full Dataset  |  Insert in this order\n")
    f.write(f"-- Generated: {datetime.now()}\n")
    f.write("-- =====================================================\n\n")
    f.write("SET NOCOUNT ON;\n\n")
    for tname, df in tables.items():
        f.write(f"-- ── {tname} ({len(df)} rows) ──\n")
        f.write(to_sql_insert(df, tname, chunk_size=500))
        f.write("\n\n")

print(f"\n✅ Done! Files written to: {OUTPUT_DIR}")
