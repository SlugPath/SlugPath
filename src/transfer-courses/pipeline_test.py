import unittest
from pipeline import get_institutions, get_initial_data
from models import Institution, InitialData

class TestGetInitialData(unittest.TestCase):
    def test_get_initial_data(self):
      try:
        initial_data = get_initial_data()
      except Exception as e:
        self.fail(f"get_initial_data() raised an exception: {e}")

      self.assertIsInstance(initial_data, InitialData, "get_initial_data() did not return an InitialData object")
      self.assertGreater(len(initial_data.departments), 0, "get_initial_data() returned no departments")
      self.assertGreater(initial_data.current_year, 0, "get_initial_data() returned an invalid current year")
      self.assertGreater(initial_data.ucsc_id, 0, "get_initial_data() returned an invalid institution id")

class TestGetInstituions(unittest.TestCase):
    def test_get_institutions(self):
      try:
        institutions = get_institutions()
      except Exception as e:
        self.fail(f"get_institutions() raised an exception: {e}")

      self.assertGreater(len(institutions), 0, "get_institutions() returned no institutions")
      self.assertIsInstance(institutions[0], Institution, "get_institutions() did not return a list of Institution objects")

if __name__ == "__main__":
    unittest.main()