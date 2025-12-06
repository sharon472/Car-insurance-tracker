
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
import schemas
from passlib.context import CryptContext

# -----------------------
# Setup
# -----------------------
Base.metadata.create_all(bind=engine)
app = FastAPI()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------
# USERS
# -----------------------
@app.get("/users", response_model=list[schemas.UserSchema])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users  # passwords are excluded in UserSchema

@app.post("/users", response_model=schemas.UserSchema)
def create_user(user: schemas.UserCreateSchema, db: Session = Depends(get_db)):
    # Check if username already exists
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = get_password_hash(user.password)
    db_user = models.User(username=user.username, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# -----------------------
# LOGIN
# -----------------------
@app.post("/login")
def login(data: schemas.UserCreateSchema, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == data.username).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"message": "Login successful"}


# -----------------------
# CARS
# -----------------------
@app.get("/cars", response_model=list[schemas.CarSchema])
def get_cars(db: Session = Depends(get_db)):
    return db.query(models.Car).all()


@app.post("/cars", response_model=schemas.CarSchema)
def create_car(car: schemas.CarCreateSchema, db: Session = Depends(get_db)):
    db_car = models.Car(**car.dict())
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car


# -----------------------
# INSURANCES
# -----------------------
@app.get("/insurances", response_model=list[schemas.InsuranceSchema])
def get_insurances(db: Session = Depends(get_db)):
    return db.query(models.Insurance).all()


@app.post("/insurances", response_model=schemas.InsuranceSchema)
def create_insurance(ins: schemas.InsuranceCreateSchema, db: Session = Depends(get_db)):
    db_ins = models.Insurance(**ins.dict())
    db.add(db_ins)
    db.commit()
    db.refresh(db_ins)
    return db_ins
