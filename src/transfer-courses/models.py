from typing import Dict
from pydantic import BaseModel, Field

class Institution(BaseModel):
  name: str
  id: int

class Course(BaseModel):
  dept_code: str
  number: str
  institution_name: str = Field(default="University of California Santa Cruz")

class InitialData(BaseModel):
  ucsc_id: int
  current_year: int
  departments: Dict[str, int]
