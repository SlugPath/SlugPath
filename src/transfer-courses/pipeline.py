import csv
import requests

from pydantic import ValidationError
from models import Institution, Course, InitialData

def get_initial_data() -> InitialData:
  '''
  Loads a `InitialData` object from the assist-data.json file

  Returns:
    `InitialData`: The initial assist data object containing USCS id, current year, and departments
  
  Raises:
    `ValidationError`: If the data in the file does not match the `InitialData` model
  '''
  with open("assist-data.json", "r") as f:
    data = f.read()
    try:
      return InitialData.model_validate_json(data)
    except ValidationError as e:
      print(f"Invalid data: {e}")
      return None


def get_institutions() -> list[Institution]:
  '''
  Get a list of all institutions from the assist.org API

  Returns:
    `list[Institution]`: A list of all institutions containing their name and id
  
  Raises:
    requests.exceptions.RequestException: If the request to the API fails
  '''
  try:
    res = requests.get('https://assist.org/api/institutions')
    res.raise_for_status()
  except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
    return []
  data = res.json()
  return list(map(lambda inst: Institution(name=inst['names'][0]['name'], id=inst['id']), data))

# Read in all official courses
def load_official_courses() -> list[Course]:
  '''
  Load all official courses from the UCSC official courses csv

  Returns:
    `list[Course]`: A list of all official courses
  '''
  courses = []
  with open('../../courses.csv') as file:
    reader = csv.reader(file)
    for row in reader:
      courses.append(Course(dept_code=row[1], number=row[2]))
  return courses



# For each course, get the transfer equivalents

# Insert into SQL database

def run_pipeline():
  initial_data = get_initial_data()
  institutions = get_institutions()
  official_courses = load_official_courses()
  print(initial_data)

if __name__ == "__main__":
  run_pipeline()
