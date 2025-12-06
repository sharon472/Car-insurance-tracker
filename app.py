# app.py
from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

DATABASE_URL = "sqlite:///./insurance.db"

# SQLAlchemy setup
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    insurances = relationship("Insurance", back_populates="user")

class Car(Base):
    __tablename__ = "cars"
    id = Column(Integer, primary_key=True, index=True)
    make = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    insurances = relationship("Insurance", back_populates="car")

class Insurance(Base):
    __tablename__ = "insurances"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    car_id = Column(Integer, ForeignKey("cars.id"))

    user = relationship("User", back_populates="insurances")
    car = relationship("Car", back_populates="insurances")

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI()

# Routes
@app.get("/")
def read_root():
    return {"message": "Hello, welcome to the Car Insurance Tracker API!"}

@app.get("/users")
def get_users():
    db = SessionLocal()
    users = db.query(User).all()
    db.close()
    return users

@app.get("/cars")
def get_cars():
    db = SessionLocal()
    cars = db.query(Car).all()
    db.close()
    return cars

@app.get("/insurances")
def get_insurances():
    db = SessionLocal()
    insurances = db.query(Insurance).all()
    db.close()
    return insurances
