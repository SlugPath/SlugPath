import json
import requests

from typing import Dict, List
from pydantic import ValidationError
from models import Institution, Course, InitialData
from utils import transfer_url

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

def get_institutions(ucsc_id: int) -> list[Institution]:
  '''
  Get a list of all institutions from the assist.org API, excluding UCSC

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
  return list(filter(lambda inst: inst.id != ucsc_id, map(lambda inst: Institution(name=inst['names'][0]['name'], id=inst['id']), data)))

def get_transfer_equivalents(transfer_courses: Dict[str, List[Course]], department_id: int, institutions: list[Institution], initial_data: InitialData) -> list[Course]:
  '''
  Get the transfer equivalents for a course from all institutions

  Args:
    course (`Course`): The course to get transfer equivalents for
    institutions (`list[Institution]`): A list of all institutions
    initial_data (`InitialData`): The initial data object

  Returns:
    `list[Course]`: A map of all transfer equivalents for the courses in a department
  '''
  for inst in institutions:
    url = transfer_url(inst.id, initial_data.ucsc_id, department_id, initial_data.current_year)
    try:
      res = requests.get(url)
      res.raise_for_status()
    except requests.exceptions.RequestException as e:
      # print(f"Request failed: {e}")
      continue
    # Clean up the JSON response
    json_resp = res.text.strip('"').replace('\\"', '"').replace("\"{", "{").replace("}\"", "}").replace("\"[", "[").replace("]\"", "]")
    data = json.loads(json_resp)

    # Parse the articulations
    articulations = data["result"]["articulations"]
    for art in articulations:
      if art["type"] != 'Course':
        continue
      ucsc_course = f"{art["course"]["prefix"]} {art["course"]["courseNumber"]}"
      try:
        equivalents = art["sendingArticulation"]["items"][0]["items"]
        for equiv in equivalents:
          if equiv["type"] != "Course":
            continue
          courses = transfer_courses.get(ucsc_course, []) + [Course(dept_code=equiv["prefix"], number=equiv["courseNumber"], name=equiv["courseTitle"], institution_name=inst.name).dict()]
          transfer_courses[ucsc_course] = courses

      except Exception as e:
        #print(f"Couldn't get articulations: {e}")
        continue

# Insert into SQL database

def run_pipeline():
  initial_data = get_initial_data()
  institutions = get_institutions(initial_data.ucsc_id)
  transfers = {}
  for d in initial_data.departments:
    get_transfer_equivalents(transfers, initial_data.departments[d], institutions, initial_data)
    print(len(transfers))

  with open("transfers.json", "w") as f:
    f.write(json.dumps(transfers, indent=4) )

if __name__ == "__main__":
  run_pipeline()
