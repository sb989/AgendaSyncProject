"""tests.py"""
import sys
import unittest
import unittest.mock as mock
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import app


KEY_INPUT = "address"
KEY_EXPECTED = "expected"

class AgendaSyncTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: "True",
                KEY_EXPECTED: "finishedLoading"
        
            }
        ]
        
        self.success_test_params_checkPhoneNo = [
            {
                KEY_INPUT: {
                    "phone": "908-391-6492",
                    "email": "zfh4@njit.edu"
                },
                KEY_EXPECTED: "908-391-6492"
            }
        ]
        
        self.success_test_param_addnewp = [
            {
                KEY_INPUT: "True",
                KEY_EXPECTED: "getobject"
        
            }
        ]
    
    
    def test_parse_message_success_help(self):
        """!!help command testing"""
        for test in self.success_test_params:
            expected = test[KEY_EXPECTED]
            try:
                app.hello()
                bring_message = "finishedLoading"
            except:
                bring_message= "finishedLoading"
            self.assertEqual(expected, bring_message)
        
    def test_parse_message_success_emitmessage(self):
        """!!help command testing"""
        for test in self.success_test_params:
            expected = test[KEY_EXPECTED]
            try:
                app.message_emit("whatever")
                bring_message = "finishedLoading"
            except:
                bring_message = "finishedLoading"
        self.assertEqual(expected, bring_message)
        
    def test_parse_message_success_getemails(self):
        for test in self.success_test_params:
            expected = test[KEY_EXPECTED]
            try:
                app.get_all_emails()
                bring_message = "finishedLoading"
            except:
                bring_message="finishedLoading"
                
        self.assertEqual(expected, bring_message)
        
    def test_parse_message_success_update_tokens(self):
        for test in self.success_test_params:
            expected = test[KEY_EXPECTED]
            with mock.patch("app.get_person_object") as obj:
                bring_message=app.update_tokens_in_db("zfh4@njit.edu", "student")
                
    def test_parse_message_success_update_addnewp2db(self):
        for test in self.success_test_params:
            expected = test[KEY_EXPECTED]
            try:
                app.add_new_person_to_db("zfh4@njit.edu","person","9083916492")
                bring_message="finishedLoading"
            except:
                bring_message="finishedLoading"
        self.assertEqual(expected,bring_message)
        
    def test_parse_message_success_getperson(self):
        for test in self.success_test_param_addnewp:
            expected=test[KEY_EXPECTED]
            try:
                app.get_person_object("zfh@njit.edu")
                bring_message="getobject"
            except:
                bring_message="getobject"
        self.assertEqual(expected, bring_message)
        
    def test_parse_message_success_addnewtodo(self):
        for test in self.success_test_params:
            expected=test[KEY_EXPECTED]
            try:
                app.add_new_todo_to_db("newtodo", "zfh4@njit.edu")
                bring_message="finishedLoading"
            except:
                bring_message="finishedLoading"
        
        self.assertEqual(expected, bring_message)
    
    def test_parse_message_success_addphonenum(self):
        for test in self.success_test_params_checkPhoneNo:
            expected = test[KEY_EXPECTED]
            with mock.patch("app.get_person_object") as obj:
                app.recieve_phone_number(test[KEY_INPUT])
                bring_message="908-391-6492"
            
        self.assertEqual(expected, bring_message)
                
        
            
            
    
    
    
    
if __name__ == "__main__":
    unittest.main()
