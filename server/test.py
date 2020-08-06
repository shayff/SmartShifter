from faker import Faker

he_fake = Faker("he_IL")

print(he_fake.phone_number())
