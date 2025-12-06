from pydantic import BaseModel

class UserSchema(BaseModel):
    id: int
    username: str
    password: str
    class Config:
        orm_mode = True

class UserCreateSchema(BaseModel):
    username: str
    password: str

class CarSchema(BaseModel):
    id: int
    model: str
    plate_number: str
    owner_name: str
    class Config:
        orm_mode = True

class CarCreateSchema(BaseModel):
    model: str
    plate_number: str
    owner_name: str

class InsuranceSchema(BaseModel):
    id: int
    insurance_company: str
    policy_type: str
    start_date: str
    end_date: str
    status: str
    car_id: int
    class Config:
        orm_mode = True

class InsuranceCreateSchema(BaseModel):
    insurance_company: str
    policy_type: str
    start_date: str
    end_date: str
    status: str
    car_id: int
