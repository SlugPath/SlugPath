def transfer_url(from_id: int, to_id: int, dept_id: int, yr: int) -> str:
  '''
  Generate a URL for transfer courses from the assist.org API

  Args:
    from_id (int): The id of the institution to transfer from
    to_id (int): The id of the institution to transfer to
    dept_id (int): The id of the department to transfer from
    yr (int): The year to get transfer courses for

  Returns:
    str: A URL to the transfer courses
  '''
  return f"https://assist.org/api/articulation/Agreements?Key={yr}/{from_id}/to/{to_id}/Department/{dept_id}"