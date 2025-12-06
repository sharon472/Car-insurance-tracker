from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    # One user can have many cars
    cars = relationship("Car", back_populates="admin")


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    model = Column(String, nullable=False)
    plate_number = Column(String, unique=True, nullable=False)
    owner_name = Column(String, nullable=False)

    admin_id = Column(Integer, ForeignKey("users.id"))
    admin = relationship("User", back_populates="cars")

    # One car can have many insurances
    insurances = relationship("Insurance", back_populates="car")



class Insurance(Base):
    __tablename__ = "insurances"

    id = Column(Integer, primary_key=True, index=True)
    insurance_company = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(String, nullable=False)  # active, expired, expiring soon

    car_id = Column(Integer, ForeignKey("cars.id"))
    car = relationship("Car", back_populates="insurances")


